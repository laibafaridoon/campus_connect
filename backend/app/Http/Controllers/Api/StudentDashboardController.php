<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LostItem;
use App\Models\FoundItem;
use App\Models\Product;
class StudentDashboardController extends Controller {
    public function stats(Request $request) {
        $userId = $request->auth_user->id;
        
        $totalLost = LostItem::where("user_id", $userId)->count();
        $totalFound = FoundItem::where("user_id", $userId)->count();
        $totalProducts = Product::where("user_id", $userId)->count();
        
        $pendingLost = LostItem::where("user_id", $userId)->where("status", "pending")->count();
        $pendingFound = FoundItem::where("user_id", $userId)->where("status", "pending")->count();
        $pendingProducts = Product::where("user_id", $userId)->where("status", "pending")->count();
        $pendingApprovals = $pendingLost + $pendingFound + $pendingProducts;

        $trends = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = date('j M', strtotime("-$i days"));
            $trends[] = [
                "name" => $date,
                "lostFound" => rand(1, 10),
                "marketplace" => rand(2, 15)
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
                ['name' => 'Electronics', 'value' => 45],
                ['name' => 'Books', 'value' => 25],
                ['name' => 'Keys & Cards', 'value' => 20],
                ['name' => 'Others', 'value' => 10],
            ];
        }

        $campuses = [
            ['name' => 'Islamabad', 'value' => 42],
            ['name' => 'Lahore', 'value' => 28],
            ['name' => 'Abbottabad', 'value' => 18],
            ['name' => 'Wah', 'value' => 7],
            ['name' => 'Sahiwal', 'value' => 5],
        ];

        $announcements = [
            [
                "id" => 1,
                "title" => "Mid-Term Exams Lost & Found",
                "content" => "Students are advised to check the lost & found counter in blocks C & D for items misplaced during midterm week.",
                "date" => date('d M Y', strtotime("-2 days"))
            ],
            [
                "id" => 2,
                "title" => "Campus Connect Launch",
                "content" => "Welcome to the new Campus Connect portal for lost items and marketplace listings.",
                "date" => date('d M Y', strtotime("-7 days"))
            ],
        ];

        $activities = [
            ["id" => 1, "text" => "You reported a lost HP Laptop", "time" => "2 hours ago", "type" => "primary"],
            ["id" => 2, "text" => "Admin approved your Dell Charger listing", "time" => "1 day ago", "type" => "success"],
        ];

        return response()->json([
            "stats" => [
                "totalLost" => $totalLost,
                "totalFound" => $totalFound,
                "totalProducts" => $totalProducts,
                "pendingApprovals" => $pendingApprovals,
            ],
            "trends" => $trends,
            "donutChart" => $donutChart,
            "campuses" => $campuses,
            "announcements" => $announcements,
            "activities" => $activities
        ]);
    }

    public function myItems(Request $request) {
        $userId = $request->auth_user->id;
        $lost = LostItem::with(['user', 'category'])->where('user_id', $userId)->orderBy('created_at', 'desc')->get();
        $found = FoundItem::with(['user', 'category'])->where('user_id', $userId)->orderBy('created_at', 'desc')->get();
        $products = Product::with(['user', 'category'])->where('user_id', $userId)->orderBy('created_at', 'desc')->get();
        return response()->json([
            "reports" => [
                "lost" => $lost,
                "found" => $found
            ],
            "listings" => $products
        ]);
    }

    public function notifications(Request $request) {
        $userId = $request->auth_user->id;
        $notifs = \App\Models\Notification::where('user_id', $userId)->orderBy('created_at', 'desc')->get();
        $unread = \App\Models\Notification::where('user_id', $userId)->where('is_read', false)->count();
        return response()->json([
            "data" => $notifs,
            "unread_count" => $unread
        ]);
    }

    public function readNotification(Request $request, $id) {
        $userId = $request->auth_user->id;
        \App\Models\Notification::where('id', $id)->where('user_id', $userId)->update(['is_read' => true]);
        return response()->json(["message" => "Marked as read"]);
    }
}
