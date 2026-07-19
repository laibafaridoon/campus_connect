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
            $dateStart = date('Y-m-d 00:00:00', strtotime("-$i days"));
            $dateEnd = date('Y-m-d 23:59:59', strtotime("-$i days"));
            $dateLabel = date('j M', strtotime("-$i days"));

            $lostFoundCount = LostItem::whereBetween('created_at', [$dateStart, $dateEnd])->count()
                            + FoundItem::whereBetween('created_at', [$dateStart, $dateEnd])->count();
            
            $marketCount = Product::whereBetween('created_at', [$dateStart, $dateEnd])->count();

            $trends[] = [
                "name" => $dateLabel,
                "lostFound" => $lostFoundCount,
                "marketplace" => $marketCount
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

        $campusesData = \App\Models\User::groupBy('campus')
            ->selectRaw('campus as name, count(*) as value')
            ->get();
        $campuses = [];
        foreach ($campusesData as $c) {
            if ($c->name) {
                $campuses[] = ['name' => $c->name, 'value' => $c->value];
            }
        }
        if (empty($campuses)) {
            $campuses = [
                ['name' => 'Abbottabad', 'value' => 1]
            ];
        }

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

        $activities = [];
        $notifs = \App\Models\Notification::where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        foreach ($notifs as $n) {
            $activities[] = [
                "id" => $n->id,
                "text" => $n->message,
                "time" => $n->created_at ? $n->created_at->diffForHumans() : "Just now",
                "type" => str_contains($n->title, 'Approve') ? 'success' : (str_contains($n->title, 'Reject') ? 'danger' : 'primary')
            ];
        }
        if (empty($activities)) {
            $activities = [
                ["id" => 1, "text" => "Welcome to CampusConnect!", "time" => "Just now", "type" => "primary"]
            ];
        }

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

    public function publicStats() {
        return response()->json([
            "students" => \App\Models\User::count(),
            "products" => \App\Models\Product::where('status', 'approved')->count(),
            "lost_recovered" => \App\Models\FoundItem::where('status', 'returned')->count() + \App\Models\LostItem::where('status', 'returned')->count(),
            "claims" => \App\Models\Claim::where('status', 'approved')->count()
        ]);
    }
}
