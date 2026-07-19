<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Product;
use App\Models\LostItem;
use App\Models\FoundItem;
use App\Models\Category;
use Carbon\Carbon;

class AdminDashboardController extends Controller {

    // ─── DASHBOARD STATS ────────────────────────────────────────────────
    public function stats() {
        $totalStudents  = User::count();
        $totalProducts  = Product::count();
        $totalLost      = LostItem::count();
        $totalFound     = FoundItem::count();
        $totalReports   = $totalLost + $totalFound;

        $pendingStudents  = User::where("status", "pending")->count();
        $pendingReports   = LostItem::where("status", "pending")->count() + FoundItem::where("status", "pending")->count();
        $pendingProducts  = Product::where("status", "pending")->count();
        $approvedStudents = User::where("status", "approved")->count();
        $rejectedStudents = User::where("status", "rejected")->count();

        // ── Bar Chart: Real data per day (last 7 days) ──
        $barChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $dayLabel = $date->format('j M');
            $lostCount  = LostItem::whereDate('created_at', $date)->count();
            $foundCount = FoundItem::whereDate('created_at', $date)->count();
            $prodCount  = Product::whereDate('created_at', $date)->count();
            $barChart[] = [
                'name'        => $dayLabel,
                'lostFound'   => $lostCount + $foundCount,
                'marketplace' => $prodCount,
            ];
        }

        // ── Line Chart: Monthly trend (last 6 months) ──
        $lineChart = [];
        for ($i = 5; $i >= 0; $i--) {
            $monthStart = Carbon::today()->subMonths($i)->startOfMonth();
            $monthEnd   = Carbon::today()->subMonths($i)->endOfMonth();
            $monthLabel = $monthStart->format('M Y');
            $lineChart[] = [
                'name'     => $monthLabel,
                'students' => User::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
                'reports'  => LostItem::whereBetween('created_at', [$monthStart, $monthEnd])->count()
                            + FoundItem::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
                'products' => Product::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
            ];
        }

        // ── Donut Chart: Real category breakdown ──
        $categories = Category::all();
        $donutChart = [];
        foreach ($categories as $cat) {
            $count = Product::where('category_id', $cat->id)->count()
                   + LostItem::where('category_id', $cat->id)->count()
                   + FoundItem::where('category_id', $cat->id)->count();
            $donutChart[] = ['name' => $cat->name, 'value' => $count];
        }

        // ── Status Breakdown Pie ──
        $statusPie = [
            ['name' => 'Approved', 'value' => LostItem::where('status','approved')->count() + FoundItem::where('status','approved')->count() + Product::where('status','approved')->count()],
            ['name' => 'Pending',  'value' => LostItem::where('status','pending')->count()  + FoundItem::where('status','pending')->count()  + Product::where('status','pending')->count()],
            ['name' => 'Rejected', 'value' => LostItem::where('status','rejected')->count() + FoundItem::where('status','rejected')->count() + Product::where('status','rejected')->count()],
        ];

        // ── Recent Activities (real) ──
        $activities = [];
        $recentStudents = User::latest()->take(3)->get();
        foreach ($recentStudents as $s) {
            $activities[] = [
                'id'   => 'stu-'.$s->id,
                'text'  => "New student registered: {$s->name} ({$s->reg_no})",
                'time'  => Carbon::parse($s->created_at)->diffForHumans(),
                'type'  => $s->status === 'pending' ? 'warning' : 'success',
            ];
        }
        $recentLost = LostItem::with('user')->latest()->take(2)->get();
        foreach ($recentLost as $item) {
            $activities[] = [
                'id'   => 'lost-'.$item->id,
                'text'  => "Lost item reported: {$item->name}" . ($item->user ? " by {$item->user->name}" : ""),
                'time'  => Carbon::parse($item->created_at)->diffForHumans(),
                'type'  => 'primary',
            ];
        }
        $recentFound = FoundItem::with('user')->latest()->take(2)->get();
        foreach ($recentFound as $item) {
            $activities[] = [
                'id'   => 'found-'.$item->id,
                'text'  => "Found item reported: {$item->name}" . ($item->user ? " by {$item->user->name}" : ""),
                'time'  => Carbon::parse($item->created_at)->diffForHumans(),
                'type'  => 'success',
            ];
        }
        $recentProducts = Product::with('user')->latest()->take(2)->get();
        foreach ($recentProducts as $p) {
            $activities[] = [
                'id'   => 'prod-'.$p->id,
                'text'  => "Product listed: {$p->name} — Rs. {$p->price}" . ($p->user ? " by {$p->user->name}" : ""),
                'time'  => Carbon::parse($p->created_at)->diffForHumans(),
                'type'  => 'primary',
            ];
        }

        // Sort activities by recency
        usort($activities, function($a, $b) {
            return 0; // already ordered by latest
        });

        return response()->json([
            "stats" => [
                "totalStudents"    => $totalStudents,
                "totalReports"     => $totalReports,
                "totalProducts"    => $totalProducts,
                "totalLost"        => $totalLost,
                "totalFound"       => $totalFound,
                "pendingStudents"  => $pendingStudents,
                "pendingReports"   => $pendingReports,
                "pendingProducts"  => $pendingProducts,
                "approvedStudents" => $approvedStudents,
                "rejectedStudents" => $rejectedStudents,
            ],
            "barChart"   => $barChart,
            "lineChart"  => $lineChart,
            "donutChart" => $donutChart,
            "statusPie"  => $statusPie,
            "activities" => array_slice($activities, 0, 8),
        ]);
    }

    // ─── STUDENT MANAGEMENT ─────────────────────────────────────────────
    public function allStudents() {
        return response()->json(User::orderBy('created_at', 'desc')->get());
    }
    public function approveStudent($id) {
        $student = User::find($id);
        if ($student) {
            $student->update(["status" => "approved"]);
            \App\Models\Notification::create([
                "user_id" => $student->id,
                "title" => "Account Approved",
                "message" => "Welcome! Your student account has been approved by the admin.",
                "is_read" => false
            ]);
        }
        return response()->json(["message" => "Student approved successfully."]);
    }
    public function rejectStudent($id) {
        $student = User::find($id);
        if ($student) {
            $student->update(["status" => "rejected"]);
        }
        return response()->json(["message" => "Student rejected."]);
    }
    public function deleteStudent($id) {
        User::where("id", $id)->delete();
        return response()->json(["message" => "Student deleted."]);
    }

    // ─── LOST ITEMS MANAGEMENT ──────────────────────────────────────────
    public function allLostItems() {
        return response()->json(LostItem::with(['user', 'category'])->orderBy('created_at', 'desc')->get());
    }
    public function pendingLostItems() {
        return response()->json(LostItem::with(['user', 'category'])->where('status', 'pending')->orderBy('created_at', 'desc')->get());
    }
    public function approveLostItem($id) {
        $item = LostItem::find($id);
        if ($item) {
            $item->update(["status" => "approved"]);
            \App\Models\Notification::create([
                "user_id" => $item->user_id,
                "title" => "Lost Item Approved",
                "message" => "Your report for lost '{$item->name}' has been approved by the admin.",
                "is_read" => false
            ]);
        }
        return response()->json(["message" => "Lost item approved."]);
    }
    public function rejectLostItem($id) {
        $item = LostItem::find($id);
        if ($item) {
            $item->update(["status" => "rejected"]);
            \App\Models\Notification::create([
                "user_id" => $item->user_id,
                "title" => "Lost Item Rejected",
                "message" => "Your report for lost '{$item->name}' was rejected by the admin.",
                "is_read" => false
            ]);
        }
        return response()->json(["message" => "Lost item rejected."]);
    }
    public function deleteLostItem($id) {
        LostItem::where("id", $id)->delete();
        return response()->json(["message" => "Lost item deleted."]);
    }

    // ─── FOUND ITEMS MANAGEMENT ─────────────────────────────────────────
    public function allFoundItems() {
        return response()->json(FoundItem::with(['user', 'category'])->orderBy('created_at', 'desc')->get());
    }
    public function pendingFoundItems() {
        return response()->json(FoundItem::with(['user', 'category'])->where('status', 'pending')->orderBy('created_at', 'desc')->get());
    }
    public function approveFoundItem($id) {
        $item = FoundItem::find($id);
        if ($item) {
            $item->update(["status" => "approved"]);
            \App\Models\Notification::create([
                "user_id" => $item->user_id,
                "title" => "Found Item Approved",
                "message" => "Your report for found '{$item->name}' has been approved by the admin.",
                "is_read" => false
            ]);
        }
        return response()->json(["message" => "Found item approved."]);
    }
    public function rejectFoundItem($id) {
        $item = FoundItem::find($id);
        if ($item) {
            $item->update(["status" => "rejected"]);
            \App\Models\Notification::create([
                "user_id" => $item->user_id,
                "title" => "Found Item Rejected",
                "message" => "Your report for found '{$item->name}' was rejected by the admin.",
                "is_read" => false
            ]);
        }
        return response()->json(["message" => "Found item rejected."]);
    }
    public function deleteFoundItem($id) {
        FoundItem::where("id", $id)->delete();
        return response()->json(["message" => "Found item deleted."]);
    }

    // ─── PRODUCT MANAGEMENT ─────────────────────────────────────────────
    public function allProducts() {
        return response()->json(Product::with(['user', 'category'])->orderBy('created_at', 'desc')->get());
    }
    public function approveProduct($id) {
        $item = Product::find($id);
        if ($item) {
            $item->update(["status" => "approved"]);
            \App\Models\Notification::create([
                "user_id" => $item->user_id,
                "title" => "Listing Approved",
                "message" => "Your product listing '{$item->name}' has been approved by the admin.",
                "is_read" => false
            ]);
        }
        return response()->json(["message" => "Product approved."]);
    }
    public function rejectProduct($id) {
        $item = Product::find($id);
        if ($item) {
            $item->update(["status" => "rejected"]);
            \App\Models\Notification::create([
                "user_id" => $item->user_id,
                "title" => "Listing Rejected",
                "message" => "Your product listing '{$item->name}' was rejected by the admin.",
                "is_read" => false
            ]);
        }
        return response()->json(["message" => "Product rejected."]);
    }
    public function deleteProduct($id) {
        Product::where("id", $id)->delete();
        return response()->json(["message" => "Product deleted."]);
    }
}
