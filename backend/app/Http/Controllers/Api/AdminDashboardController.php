<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\LostItem;
use App\Models\FoundItem;
class AdminDashboardController extends Controller {
    public function stats() {
        $totalStudents = User::count();
        $totalProducts = Product::count();
        $totalReports = LostItem::count() + FoundItem::count();

        $barChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $dateStart = date('Y-m-d 00:00:00', strtotime("-$i days"));
            $dateEnd = date('Y-m-d 23:59:59', strtotime("-$i days"));
            $dateLabel = date('j M', strtotime("-$i days"));

            $lostFoundCount = LostItem::whereBetween('created_at', [$dateStart, $dateEnd])->count()
                            + FoundItem::whereBetween('created_at', [$dateStart, $dateEnd])->count();
            
            $marketCount = Product::whereBetween('created_at', [$dateStart, $dateEnd])->count();

            $barChart[] = [
                'name' => $dateLabel,
                'lostFound' => $lostFoundCount,
                'marketplace' => $marketCount
            ];
        }

        $categories = \App\Models\Category::all();
        $donutChart = [];
        foreach ($categories as $cat) {
            $count = Product::where('category_id', $cat->id)->count() + 
                     LostItem::where('category_id', $cat->id)->count() + 
                     FoundItem::where('category_id', $cat->id)->count();
            if ($count > 0) {
                $donutChart[] = ['name' => $cat->name, 'value' => $count];
            }
        }
        
        if (empty($donutChart)) {
            $donutChart = [
                ['name' => 'No Data', 'value' => 1]
            ];
        }

        $activities = [];
        $recentUsers = User::latest()->limit(2)->get();
        foreach ($recentUsers as $u) {
            $activities[] = [
                "id" => "u_" . $u->id,
                "text" => "New student registered: " . $u->name,
                "time" => $u->created_at ? $u->created_at->diffForHumans() : "Just now",
                "type" => "primary"
            ];
        }
        $recentProducts = Product::latest()->limit(2)->get();
        foreach ($recentProducts as $p) {
            $activities[] = [
                "id" => "p_" . $p->id,
                "text" => "Product listing submitted: " . $p->name,
                "time" => $p->created_at ? $p->created_at->diffForHumans() : "Just now",
                "type" => "success"
            ];
        }
        $recentLost = LostItem::latest()->limit(1)->get();
        foreach ($recentLost as $l) {
            $activities[] = [
                "id" => "l_" . $l->id,
                "text" => "Lost item reported: " . $l->name,
                "time" => $l->created_at ? $l->created_at->diffForHumans() : "Just now",
                "type" => "warning"
            ];
        }
        if (empty($activities)) {
            $activities = [
                ["id" => 1, "text" => "System running normally.", "time" => "Just now", "type" => "success"]
            ];
        }

        return response()->json([
            "stats" => [
                "totalStudents" => $totalStudents,
                "totalReports" => $totalReports,
                "totalProducts" => $totalProducts,
                "pendingStudents" => User::where("status", "pending")->count(),
                "pendingReports" => LostItem::where("status", "pending")->count() + FoundItem::where("status", "pending")->count(),
                "pendingProducts" => Product::where("status", "pending")->count(),
            ],
            "barChart" => $barChart,
            "donutChart" => $donutChart,
            "activities" => $activities
        ]);
    }
    public function pendingStudents() { return response()->json(User::where("status", "pending")->get()); }
    public function approveStudent($id) {
        $user = User::find($id);
        if ($user) {
            $user->update(["status" => "approved"]);
            \App\Models\Notification::create(["user_id" => $id, "title" => "Account Approved", "message" => "Your CampusConnect account has been approved by the admin. You can now log in."]);
        }
        return response()->json(["message" => "Approved"]);
    }
    public function rejectStudent($id) {
        $user = User::find($id);
        if ($user) {
            $user->update(["status" => "rejected"]);
            \App\Models\Notification::create(["user_id" => $id, "title" => "Account Rejected", "message" => "Your CampusConnect account registration was not approved by the admin."]);
        }
        return response()->json(["message" => "Rejected"]);
    }
    
    public function pendingProducts() { return response()->json(Product::with(["user", "category"])->where("status", "pending")->get()); }
    public function approveProduct($id) {
        $product = Product::find($id);
        if ($product) {
            $product->update(["status" => "approved"]);
            \App\Models\Notification::create(["user_id" => $product->user_id, "title" => "Product Approved", "message" => "Your product listing \"" . $product->name . "\" has been approved and is now live on the marketplace."]);
        }
        return response()->json(["message" => "Approved"]);
    }
    public function rejectProduct($id) {
        $product = Product::find($id);
        if ($product) {
            $product->update(["status" => "rejected"]);
            \App\Models\Notification::create(["user_id" => $product->user_id, "title" => "Product Rejected", "message" => "Your product listing \"" . $product->name . "\" was not approved by admin."]);
        }
        return response()->json(["message" => "Rejected"]);
    }
    
    public function pendingLostItems() { return response()->json(LostItem::with(["user", "category"])->where("status", "pending")->get()); }
    public function approveLostItem($id) {
        $item = LostItem::find($id);
        if ($item) {
            $item->update(["status" => "approved"]);
            \App\Models\Notification::create(["user_id" => $item->user_id, "title" => "Lost Report Approved", "message" => "Your lost item report for \"" . $item->name . "\" is now publicly visible."]);
        }
        return response()->json(["message" => "Approved"]);
    }
    public function rejectLostItem($id) {
        $item = LostItem::find($id);
        if ($item) {
            $item->update(["status" => "rejected"]);
            \App\Models\Notification::create(["user_id" => $item->user_id, "title" => "Lost Report Rejected", "message" => "Your lost item report for \"" . $item->name . "\" was rejected by admin."]);
        }
        return response()->json(["message" => "Rejected"]);
    }
    
    public function pendingFoundItems() { return response()->json(FoundItem::with(["user", "category"])->where("status", "pending")->get()); }
    public function approveFoundItem($id) {
        $item = FoundItem::find($id);
        if ($item) {
            $item->update(["status" => "approved"]);
            \App\Models\Notification::create(["user_id" => $item->user_id, "title" => "Found Report Approved", "message" => "Your found item report for \"" . $item->name . "\" is now publicly visible."]);
        }
        return response()->json(["message" => "Approved"]);
    }
    public function rejectFoundItem($id) {
        $item = FoundItem::find($id);
        if ($item) {
            $item->update(["status" => "rejected"]);
            \App\Models\Notification::create(["user_id" => $item->user_id, "title" => "Found Report Rejected", "message" => "Your found item report for \"" . $item->name . "\" was rejected by admin."]);
        }
        return response()->json(["message" => "Rejected"]);
    }

    // FR-19: full user management (beyond just pending approvals)
    public function allUsers() { return response()->json(User::latest()->get()); }
    public function deleteUser($id) { User::where("id", $id)->delete(); return response()->json(["message" => "User removed"]); }
    public function suspendUser($id) { User::where("id", $id)->update(["status" => "rejected"]); return response()->json(["message" => "User suspended"]); }

    // FR-22: supervise wanted item requests
    public function wantedPosts() { return response()->json(\App\Models\WantedPost::with(["user", "category"])->latest()->get()); }
    public function removeWantedPost($id) { \App\Models\WantedPost::where("id", $id)->delete(); return response()->json(["message" => "Removed"]); }

    // FR-20 / FR-21: remove inappropriate / fake content directly (in addition to reject-before-publish)
    public function removeProduct($id) { Product::where("id", $id)->delete(); return response()->json(["message" => "Removed"]); }
    public function removeLostItem($id) { LostItem::where("id", $id)->delete(); return response()->json(["message" => "Removed"]); }
    public function removeFoundItem($id) { FoundItem::where("id", $id)->delete(); return response()->json(["message" => "Removed"]); }
}
