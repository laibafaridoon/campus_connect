<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
class ProductController extends Controller {
    public function index() { return response()->json(Product::with(["user", "category"])->where("status", "approved")->get()); }
    public function store(Request $request) {
        $data = $request->all();
        $data["user_id"] = $request->auth_user->id;
        $data["status"] = "pending";
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads', 'public');
            $data['image'] = $path;
        }
        return response()->json(Product::create($data));
    }
    public function show($id) { return response()->json(Product::with(["user", "category"])->find($id)); }
    public function update(Request $request, $id) {
        $item = Product::where("id", $id)->where("user_id", $request->auth_user->id)->first();
        if(!$item) return response()->json(["message"=>"Not found"], 404);
        $data = $request->all();
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('uploads', 'public');
            $data['image'] = $path;
        }
        $item->update($data); return response()->json($item);
    }
    public function destroy(Request $request, $id) {
        $item = Product::where("id", $id)->where("user_id", $request->auth_user->id)->first();
        if($item) $item->delete(); return response()->json(["message"=>"Deleted"]);
    }
}
