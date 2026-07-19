<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;
class NotificationController extends Controller {
    public function index(Request $request) {
        return response()->json(
            Notification::where("user_id", $request->auth_user->id)->latest()->get()
        );
    }

    public function unreadCount(Request $request) {
        return response()->json([
            "count" => Notification::where("user_id", $request->auth_user->id)->where("is_read", false)->count(),
        ]);
    }

    public function markRead(Request $request, $id) {
        $notification = Notification::where("id", $id)->where("user_id", $request->auth_user->id)->first();
        if (!$notification) return response()->json(["message" => "Not found"], 404);
        $notification->update(["is_read" => true]);
        return response()->json($notification);
    }

    public function markAllRead(Request $request) {
        Notification::where("user_id", $request->auth_user->id)->update(["is_read" => true]);
        return response()->json(["message" => "All notifications marked as read"]);
    }

    public function destroy(Request $request, $id) {
        Notification::where("id", $id)->where("user_id", $request->auth_user->id)->delete();
        return response()->json(["message" => "Deleted"]);
    }
}
