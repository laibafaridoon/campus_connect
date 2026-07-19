<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller {
    private function generateToken($id) {
        $payload = base64_encode(json_encode(["id" => $id, "exp" => time() + 86400]));
        $signature = hash_hmac("sha256", $payload, env("APP_KEY"));
        return $payload . "." . $signature;
    }

    public function register(Request $request) {
        $request->validate([
            "name" => "required", "registration_number" => "required|unique:users,reg_no", 
            "email" => "required|email|unique:users", "password" => "required|confirmed",
            "campus" => "required", "department" => "required", "semester" => "required"
        ]);
        $data = $request->all();
        $data['reg_no'] = $data['registration_number'];
        $user = User::create(array_merge($data, ["password" => Hash::make($request->password), "status" => "pending"]));
        return response()->json(["message" => "Registered successfully, waiting for approval"]);
    }

    public function login(Request $request) {
        $request->validate(["registration_number" => "required", "password" => "required"]);
        $user = User::where("reg_no", $request->registration_number)->first();
        if (!$user || !Hash::check($request->password, $user->password)) return response()->json(["message" => "Invalid credentials"], 401);
        if ($user->status !== "approved") return response()->json(["message" => "Account is pending admin approval."], 403);
        return response()->json(["token" => $this->generateToken($user->id), "user" => $user]);
    }

    public function me(Request $request) { return response()->json($request->auth_user); }
    public function logout() { return response()->json(["message" => "Logged out"]); }
}
