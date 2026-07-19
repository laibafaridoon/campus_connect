<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WantedPost;
class WantedPostController extends Controller {
    // Browse all open wanted posts (any authenticated student)
    public function index(Request $request) {
        $query = WantedPost::with(["user", "category"])->where("status", "open");

        if ($request->filled("search")) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where("title", "like", "%$search%")->orWhere("description", "like", "%$search%");
            });
        }
        if ($request->filled("category_id")) {
            $query->where("category_id", $request->category_id);
        }

        return response()->json($query->latest()->get());
    }

    // A student's own wanted posts (for the dashboard)
    public function mine(Request $request) {
        return response()->json(
            WantedPost::with(["category"])->where("user_id", $request->auth_user->id)->latest()->get()
        );
    }

    public function store(Request $request) {
        $request->validate([
            "title" => "required|string|max:255",
            "description" => "required|string",
            "budget" => "nullable|numeric",
            "condition" => "nullable|string",
            "category_id" => "nullable|exists:categories,id",
        ]);
        $data = $request->only(["title", "description", "budget", "condition", "category_id"]);
        $data["user_id"] = $request->auth_user->id;
        $data["status"] = "open";
        return response()->json(WantedPost::create($data));
    }

    public function show($id) {
        return response()->json(WantedPost::with(["user", "category"])->find($id));
    }

    public function update(Request $request, $id) {
        $post = WantedPost::where("id", $id)->where("user_id", $request->auth_user->id)->first();
        if (!$post) return response()->json(["message" => "Not found"], 404);
        $post->update($request->only(["title", "description", "budget", "condition", "category_id", "status"]));
        return response()->json($post);
    }

    // Remove a fulfilled / no-longer-needed request
    public function destroy(Request $request, $id) {
        $post = WantedPost::where("id", $id)->where("user_id", $request->auth_user->id)->first();
        if ($post) $post->delete();
        return response()->json(["message" => "Deleted"]);
    }

    public function markFulfilled(Request $request, $id) {
        $post = WantedPost::where("id", $id)->where("user_id", $request->auth_user->id)->first();
        if (!$post) return response()->json(["message" => "Not found"], 404);
        $post->update(["status" => "fulfilled"]);
        return response()->json($post);
    }
}
