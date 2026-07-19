<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use App\Models\User;
class StudentAuthMiddleware {
    public function handle(Request $request, Closure $next) {
        $token = $request->header("Authorization");
        if (!$token || strpos($token, "Bearer ") !== 0) return response()->json(["message" => "Unauthorized"], 401);
        $tokenData = explode(".", substr($token, 7));
        if (count($tokenData) !== 2) return response()->json(["message" => "Invalid Token"], 401);
        
        $payload = json_decode(base64_decode($tokenData[0]), true);
        if (!$payload || !isset($payload["id"])) return response()->json(["message" => "Invalid Token"], 401);
        
        $user = User::find($payload["id"]);
        if (!$user) return response()->json(["message" => "User not found"], 404);
        if ($user->status !== "approved") return response()->json(["message" => "Account not approved yet"], 403);
        
        $request->merge(["auth_user" => $user]);
        return $next($request);
    }
}
