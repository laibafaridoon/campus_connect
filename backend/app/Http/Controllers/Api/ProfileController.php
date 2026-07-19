<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
class ProfileController extends Controller {
    public function show(Request $request) {
        return response()->json($request->auth_user);
    }

    public function update(Request $request) {
        $user = $request->auth_user;
        $request->validate([
            "name" => "sometimes|required|string|max:255",
            "phone" => "sometimes|nullable|string|max:20",
            "email" => "sometimes|required|email|unique:users,email," . $user->id,
            "department" => "sometimes|required|string",
            "semester" => "sometimes|required|string",
            "password" => "sometimes|nullable|confirmed|min:6",
        ]);

        $data = $request->only(["name", "phone", "email", "department", "semester"]);
        if ($request->filled("password")) {
            $data["password"] = Hash::make($request->password);
        }

        $user->update($data);
        return response()->json($user->fresh());
    }

    public function uploadPicture(Request $request) {
        $request->validate([
            "profile_image" => "required|image|mimes:jpeg,png,jpg|max:2048",
        ]);

        $user = $request->auth_user;
        $path = $request->file("profile_image")->store("profile_pictures", "public");
        $user->update(["profile_image" => "/storage/" . $path]);

        return response()->json($user->fresh());
    }
}
