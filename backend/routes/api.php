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

Route::post("/student/login", [AuthController::class, "login"]);
Route::post("/student/register", [AuthController::class, "register"]);
Route::post("/admin/login", [AdminAuthController::class, "login"]);
Route::get("/categories", [CategoryController::class, "index"]);

Route::middleware(\App\Http\Middleware\StudentAuthMiddleware::class)->group(function () {
    Route::post("/logout", [AuthController::class, "logout"]);
    Route::get("/me", [AuthController::class, "me"]);
    Route::get("/student/me", [AuthController::class, "me"]);
    Route::get("/student/stats", [StudentDashboardController::class, "stats"]);
    Route::get("/student/my-items", [StudentDashboardController::class, "myItems"]);
    Route::get("/student/notifications", [StudentDashboardController::class, "notifications"]);
    Route::put("/student/notifications/{id}/read", [StudentDashboardController::class, "readNotification"]);
    
    Route::apiResource("/lost-items", LostItemController::class);
    Route::apiResource("/found-items", FoundItemController::class);
    Route::apiResource("/products", ProductController::class);
});

Route::middleware(\App\Http\Middleware\AdminAuthMiddleware::class)->group(function () {
    Route::post("/admin/logout", [AdminAuthController::class, "logout"]);
    Route::get("/admin/me", [AdminAuthController::class, "me"]);
    Route::get("/admin/stats", [AdminDashboardController::class, "stats"]);
    Route::get("/admin/students", [AdminDashboardController::class, "allStudents"]);
    
    Route::post("/admin/approve-student/{id}", [AdminDashboardController::class, "approveStudent"]);
    Route::post("/admin/reject-student/{id}", [AdminDashboardController::class, "rejectStudent"]);
    
    Route::get("/admin/pending-lost-items", [AdminDashboardController::class, "pendingLostItems"]);
    Route::post("/admin/approve-lost-item/{id}", [AdminDashboardController::class, "approveLostItem"]);
    Route::post("/admin/reject-lost-item/{id}", [AdminDashboardController::class, "rejectLostItem"]);
    Route::delete("/admin/lost-items/{id}", [AdminDashboardController::class, "deleteLostItem"]);
    
    Route::get("/admin/pending-found-items", [AdminDashboardController::class, "pendingFoundItems"]);
    Route::post("/admin/approve-found-item/{id}", [AdminDashboardController::class, "approveFoundItem"]);
    Route::post("/admin/reject-found-item/{id}", [AdminDashboardController::class, "rejectFoundItem"]);
    Route::delete("/admin/found-items/{id}", [AdminDashboardController::class, "deleteFoundItem"]);
    
    Route::get("/admin/products", [AdminDashboardController::class, "allProducts"]);
    Route::post("/admin/approve-product/{id}", [AdminDashboardController::class, "approveProduct"]);
    Route::post("/admin/reject-product/{id}", [AdminDashboardController::class, "rejectProduct"]);
    Route::delete("/admin/products/{id}", [AdminDashboardController::class, "deleteProduct"]);
    
    Route::post("/categories", [CategoryController::class, "store"]);
    Route::put("/categories/{id}", [CategoryController::class, "update"]);
    Route::delete("/categories/{id}", [CategoryController::class, "destroy"]);
});
