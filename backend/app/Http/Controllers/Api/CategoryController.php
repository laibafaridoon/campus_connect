<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Category;
class CategoryController extends Controller {
    public function index() { return response()->json(Category::all()); }
    public function store(Request $request) { return response()->json(Category::create($request->all())); }
    public function update(Request $request, $id) {
        $cat = Category::find($id); if($cat) $cat->update($request->all()); return response()->json($cat);
    }
    public function destroy($id) { Category::destroy($id); return response()->json(["message"=>"Deleted"]); }
}
