<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Claim;
use App\Models\FoundItem;
use App\Models\Notification;
class ClaimController extends Controller {
    // Submit an ownership claim for a found item
    public function store(Request $request) {
        $request->validate([
            "found_item_id" => "required|exists:found_items,id",
            "message" => "required|string",
        ]);

        $foundItem = FoundItem::find($request->found_item_id);

        $claim = Claim::create([
            "user_id" => $request->auth_user->id,
            "found_item_id" => $request->found_item_id,
            "message" => $request->message,
            "status" => "pending",
        ]);

        if ($foundItem) {
            Notification::create([
                "user_id" => $foundItem->user_id,
                "title" => "New Ownership Claim",
                "message" => $request->auth_user->name . " submitted a claim for \"" . $foundItem->name . "\".",
            ]);
        }

        return response()->json($claim);
    }

    // Claims made by the current student
    public function myClaims(Request $request) {
        return response()->json(
            Claim::with(["foundItem"])->where("user_id", $request->auth_user->id)->latest()->get()
        );
    }

    // Claims received on items the current student found
    public function receivedClaims(Request $request) {
        $foundItemIds = FoundItem::where("user_id", $request->auth_user->id)->pluck("id");
        return response()->json(
            Claim::with(["user", "foundItem"])->whereIn("found_item_id", $foundItemIds)->latest()->get()
        );
    }

    // The finder (owner of the found-item post) accepts or rejects a claim
    public function updateStatus(Request $request, $id) {
        $request->validate(["status" => "required|in:approved,rejected"]);
        $claim = Claim::with("foundItem")->find($id);
        if (!$claim || !$claim->foundItem || $claim->foundItem->user_id !== $request->auth_user->id) {
            return response()->json(["message" => "Not found"], 404);
        }

        $claim->update(["status" => $request->status]);

        if ($request->status === "approved") {
            $claim->foundItem->update(["status" => "returned"]);
            Claim::where("found_item_id", $claim->found_item_id)
                ->where("id", "!=", $claim->id)
                ->update(["status" => "rejected"]);
        }

        Notification::create([
            "user_id" => $claim->user_id,
            "title" => "Claim " . ucfirst($request->status),
            "message" => "Your ownership claim for \"" . $claim->foundItem->name . "\" was " . $request->status . ".",
        ]);

        return response()->json($claim);
    }
}
