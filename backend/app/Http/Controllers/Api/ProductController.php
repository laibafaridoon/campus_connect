<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
class ProductController extends Controller {
    // FR-5 / FR-6: browse, search and filter marketplace products
    public function index(Request $request) {
        $query = Product::with(["user", "category"])->where("status", "approved");

        if ($request->filled("search")) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where("name", "like", "%$search%")->orWhere("description", "like", "%$search%");
            });
        }
        if ($request->filled("category_id")) {
            $query->where("category_id", $request->category_id);
        }
        if ($request->filled("condition")) {
            $query->where("condition", $request->condition);
        }
        if ($request->filled("min_price")) {
            $query->where("price", ">=", $request->min_price);
        }
        if ($request->filled("max_price")) {
            $query->where("price", "<=", $request->max_price);
        }

        return response()->json($query->latest()->get());
    }

    public function store(Request $request) {
        $data = $request->all();
        $data["user_id"] = $request->auth_user->id;
        $data["status"] = "pending";
        return response()->json(Product::create($data));
    }
    public function show($id) { return response()->json(Product::with(["user", "category"])->find($id)); }
    public function update(Request $request, $id) {
        $item = Product::where("id", $id)->where("user_id", $request->auth_user->id)->first();
        if(!$item) return response()->json(["message"=>"Not found"], 404);
        $item->update($request->all()); return response()->json($item);
    }
    public function destroy(Request $request, $id) {
        $item = Product::where("id", $id)->where("user_id", $request->auth_user->id)->first();
        if($item) $item->delete(); return response()->json(["message"=>"Deleted"]);
    }

    // FR-4: mark a listing as sold
    public function markSold(Request $request, $id) {
        $item = Product::where("id", $id)->where("user_id", $request->auth_user->id)->first();
        if (!$item) return response()->json(["message" => "Not found"], 404);
        $item->update(["status" => "sold"]);
        return response()->json($item);
    }
}
