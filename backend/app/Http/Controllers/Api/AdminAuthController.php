<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminAuthController extends Controller {
    private function generateToken($id) {
        $payload = base64_encode(json_encode(["id" => $id, "exp" => time() + 86400]));
        $signature = hash_hmac("sha256", $payload, env("APP_KEY"));
        return $payload . "." . $signature;
    }

    public function login(Request $request) {
        $request->validate(["email" => "required|email", "password" => "required"]);
        $admin = Admin::where("email", $request->email)->first();
        if (!$admin || !Hash::check($request->password, $admin->password)) return response()->json(["message" => "Invalid credentials"], 401);
        return response()->json(["token" => $this->generateToken($admin->id), "admin" => $admin]);
    }
    public function me(Request $request) { return response()->json($request->auth_admin); }
    public function logout() { return response()->json(["message" => "Logged out"]); }
}
