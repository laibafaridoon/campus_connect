<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Wishlist;
class WishlistController extends Controller {
    public function index(Request $request) {
        return response()->json(
            Wishlist::with(["product.category", "product.user"])
                ->where("user_id", $request->auth_user->id)
                ->get()
        );
    }

    public function store(Request $request) {
        $request->validate(["product_id" => "required|exists:products,id"]);
        $wishlist = Wishlist::firstOrCreate([
            "user_id" => $request->auth_user->id,
            "product_id" => $request->product_id,
        ]);
        return response()->json($wishlist);
    }

    public function destroy(Request $request, $productId) {
        Wishlist::where("user_id", $request->auth_user->id)
            ->where("product_id", $productId)
            ->delete();
        return response()->json(["message" => "Removed from wishlist"]);
    }
}
