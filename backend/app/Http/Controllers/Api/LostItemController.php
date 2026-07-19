<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LostItem;
class LostItemController extends Controller {
    // FR-11: search lost items by keyword, category, or location
    public function index(Request $request) {
        $query = LostItem::with(["user", "category"])->where("status", "approved");

        if ($request->filled("search")) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where("name", "like", "%$search%")
                  ->orWhere("description", "like", "%$search%")
                  ->orWhere("location", "like", "%$search%");
            });
        }
        if ($request->filled("category_id")) {
            $query->where("category_id", $request->category_id);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request) {
        $data = $request->all();
        $data["user_id"] = $request->auth_user->id;
        $data["status"] = "pending";
        return response()->json(LostItem::create($data));
    }
    public function show($id) { return response()->json(LostItem::with(["user", "category"])->find($id)); }
    public function update(Request $request, $id) {
        $item = LostItem::where("id", $id)->where("user_id", $request->auth_user->id)->first();
        if(!$item) return response()->json(["message"=>"Not found"], 404);
        $item->update($request->all()); return response()->json($item);
    }
    public function destroy(Request $request, $id) {
        $item = LostItem::where("id", $id)->where("user_id", $request->auth_user->id)->first();
        if($item) $item->delete(); return response()->json(["message"=>"Deleted"]);
    }
}
