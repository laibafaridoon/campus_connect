<?php
namespace App\Models;
use Illuminate\Foundation\Auth\User as Authenticatable;
class User extends Authenticatable {
    protected $fillable = ["name", "reg_no", "email", "password", "campus", "department", "semester", "status"];
    protected $hidden = ["password"];
}
