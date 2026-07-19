<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use App\Models\Admin;
class AdminAuthMiddleware {
    public function handle(Request $request, Closure $next) {
        $token = $request->header("Authorization");
        if (!$token || strpos($token, "Bearer ") !== 0) return response()->json(["message" => "Unauthorized"], 401);
        $tokenData = explode(".", substr($token, 7));
        if (count($tokenData) !== 2) return response()->json(["message" => "Invalid Token"], 401);
        
        $payload = json_decode(base64_decode($tokenData[0]), true);
        if (!$payload || !isset($payload["id"])) return response()->json(["message" => "Invalid Token"], 401);
        
        $admin = Admin::find($payload["id"]);
        if (!$admin) return response()->json(["message" => "Admin not found"], 404);
        
        $request->merge(["auth_admin" => $admin]);
        return $next($request);
    }
}
