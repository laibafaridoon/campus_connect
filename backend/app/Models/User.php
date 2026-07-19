<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
class User extends Authenticatable {
    protected $fillable = ["name", "reg_no", "email", "password", "phone", "profile_image", "campus", "department", "semester", "status"];
    protected $hidden = ["password"];

    public function wishlist() { return $this->hasMany(Wishlist::class); }
    public function wantedPosts() { return $this->hasMany(WantedPost::class); }
    public function claims() { return $this->hasMany(Claim::class); }
    public function notifications() { return $this->hasMany(Notification::class); }
}
