<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\LostItemController;
use App\Http\Controllers\Api\FoundItemController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\StudentDashboardController;
use App\Http\Controllers\Api\AdminDashboardController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\WishlistController;
use App\Http\Controllers\Api\WantedPostController;
use App\Http\Controllers\Api\ClaimController;
use App\Http\Controllers\Api\NotificationController;

Route::post("/student/login", [AuthController::class, "login"]);
Route::post("/student/register", [AuthController::class, "register"]);
Route::post("/student/forgot-password", [AuthController::class, "forgotPassword"]);
Route::post("/student/reset-password", [AuthController::class, "resetPassword"]);
Route::post("/admin/login", [AdminAuthController::class, "login"]);
Route::get("/categories", [CategoryController::class, "index"]);

// Wanted posts can be browsed publicly (Home page shows "recent wanted requests")
Route::get("/wanted-posts/browse", [WantedPostController::class, "index"]);
Route::get("/products/public", [ProductController::class, "index"]);
Route::get("/lost-items/public", [LostItemController::class, "index"]);
Route::get("/found-items/public", [FoundItemController::class, "index"]);
Route::get("/public/stats", [StudentDashboardController::class, "publicStats"]);

Route::middleware(\App\Http\Middleware\StudentAuthMiddleware::class)->group(function () {
    Route::post("/logout", [AuthController::class, "logout"]);
    Route::get("/me", [AuthController::class, "me"]);
    Route::get("/student/stats", [StudentDashboardController::class, "stats"]);

    Route::apiResource("/lost-items", LostItemController::class);
    Route::apiResource("/found-items", FoundItemController::class);
    Route::apiResource("/products", ProductController::class);
    Route::post("/products/{id}/mark-sold", [ProductController::class, "markSold"]);
    Route::post("/found-items/{id}/mark-returned", [FoundItemController::class, "markReturned"]);

    // FR-3: Profile Management
    Route::get("/profile", [ProfileController::class, "show"]);
    Route::put("/profile", [ProfileController::class, "update"]);
    Route::post("/profile/picture", [ProfileController::class, "uploadPicture"]);

    // FR-7: Wishlist Management
    Route::get("/wishlist", [WishlistController::class, "index"]);
    Route::post("/wishlist", [WishlistController::class, "store"]);
    Route::delete("/wishlist/{productId}", [WishlistController::class, "destroy"]);

    // FR-14: Wanted Item Requests
    Route::get("/wanted-posts/mine", [WantedPostController::class, "mine"]);
    Route::apiResource("/wanted-posts", WantedPostController::class)->except(["index"]);
    Route::post("/wanted-posts/{id}/fulfilled", [WantedPostController::class, "markFulfilled"]);

    // FR-12 / FR-13: Ownership Claims
    Route::post("/claims", [ClaimController::class, "store"]);
    Route::get("/claims/mine", [ClaimController::class, "myClaims"]);
    Route::get("/claims/received", [ClaimController::class, "receivedClaims"]);
    Route::put("/claims/{id}/status", [ClaimController::class, "updateStatus"]);

    // FR-15: Notification Management
    Route::get("/notifications", [NotificationController::class, "index"]);
    Route::get("/notifications/unread-count", [NotificationController::class, "unreadCount"]);
    Route::put("/notifications/{id}/read", [NotificationController::class, "markRead"]);
    Route::put("/notifications/read-all", [NotificationController::class, "markAllRead"]);
    Route::delete("/notifications/{id}", [NotificationController::class, "destroy"]);
    // Dashboard aliases used by frontend
    Route::get("/student/me", [AuthController::class, "me"]);
    Route::get("/student/my-items", [StudentDashboardController::class, "myItems"]);
    Route::get("/student/notifications", [StudentDashboardController::class, "notifications"]);
    Route::put("/student/notifications/{id}/read", [StudentDashboardController::class, "readNotification"]);
});

Route::middleware(\App\Http\Middleware\AdminAuthMiddleware::class)->group(function () {
    Route::post("/admin/logout", [AdminAuthController::class, "logout"]);
    Route::get("/admin/me", [AdminAuthController::class, "me"]);
    Route::get("/admin/stats", [AdminDashboardController::class, "stats"]);
    
    Route::get("/admin/pending-students", [AdminDashboardController::class, "pendingStudents"]);
    Route::post("/admin/approve-student/{id}", [AdminDashboardController::class, "approveStudent"]);
    Route::post("/admin/reject-student/{id}", [AdminDashboardController::class, "rejectStudent"]);
    
    Route::get("/admin/pending-products", [AdminDashboardController::class, "pendingProducts"]);
    Route::post("/admin/approve-product/{id}", [AdminDashboardController::class, "approveProduct"]);
    Route::post("/admin/reject-product/{id}", [AdminDashboardController::class, "rejectProduct"]);
    
    Route::get("/admin/pending-lost-items", [AdminDashboardController::class, "pendingLostItems"]);
    Route::post("/admin/approve-lost-item/{id}", [AdminDashboardController::class, "approveLostItem"]);
    Route::post("/admin/reject-lost-item/{id}", [AdminDashboardController::class, "rejectLostItem"]);
    
    Route::get("/admin/pending-found-items", [AdminDashboardController::class, "pendingFoundItems"]);
    Route::post("/admin/approve-found-item/{id}", [AdminDashboardController::class, "approveFoundItem"]);
    Route::post("/admin/reject-found-item/{id}", [AdminDashboardController::class, "rejectFoundItem"]);

    // FR-19: full user management
    Route::get("/admin/users", [AdminDashboardController::class, "allUsers"]);
    Route::delete("/admin/users/{id}", [AdminDashboardController::class, "deleteUser"]);
    Route::post("/admin/users/{id}/suspend", [AdminDashboardController::class, "suspendUser"]);

    // FR-22: supervise wanted item requests
    Route::get("/admin/wanted-posts", [AdminDashboardController::class, "wantedPosts"]);
    Route::delete("/admin/wanted-posts/{id}", [AdminDashboardController::class, "removeWantedPost"]);

    // FR-20 / FR-21: remove inappropriate or fake content
    Route::delete("/admin/products/{id}", [AdminDashboardController::class, "removeProduct"]);
    Route::delete("/admin/lost-items/{id}", [AdminDashboardController::class, "removeLostItem"]);
    Route::delete("/admin/found-items/{id}", [AdminDashboardController::class, "removeFoundItem"]);

    Route::post("/categories", [CategoryController::class, "store"]);
    Route::put("/categories/{id}", [CategoryController::class, "update"]);
    Route::delete("/categories/{id}", [CategoryController::class, "destroy"]);
});
