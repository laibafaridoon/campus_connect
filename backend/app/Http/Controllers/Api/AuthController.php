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

    // FR-2 / Module 1: Forgot Password
    public function forgotPassword(Request $request) {
        $request->validate(["email" => "required|email|exists:users,email"]);

        $token = bin2hex(random_bytes(32));
        \Illuminate\Support\Facades\DB::table("password_reset_tokens")->updateOrInsert(
            ["email" => $request->email],
            ["token" => Hash::make($token), "created_at" => now()]
        );

        // NOTE: outgoing mail is not configured for this project yet (see NFR-15 / future
        // enhancements: email notifications). The reset token is returned directly so the
        // reset-password flow can be completed and tested end-to-end.
        return response()->json([
            "message" => "Password reset token generated.",
            "reset_token" => $token,
        ]);
    }

    public function resetPassword(Request $request) {
        $request->validate([
            "email" => "required|email|exists:users,email",
            "token" => "required",
            "password" => "required|confirmed|min:6",
        ]);

        $record = \Illuminate\Support\Facades\DB::table("password_reset_tokens")
            ->where("email", $request->email)->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json(["message" => "Invalid or expired reset token"], 400);
        }
        if (now()->diffInMinutes($record->created_at) > 60) {
            return response()->json(["message" => "Reset token has expired"], 400);
        }

        User::where("email", $request->email)->update(["password" => Hash::make($request->password)]);
        \Illuminate\Support\Facades\DB::table("password_reset_tokens")->where("email", $request->email)->delete();

        return response()->json(["message" => "Password has been reset successfully"]);
    }
}
