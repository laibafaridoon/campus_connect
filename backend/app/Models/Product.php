<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Product extends Model {
    protected $fillable = ["user_id", "category_id", "name", "description", "price", "condition", "contact_info", "image", "status"];
    public function user() { return $this->belongsTo(User::class); }
    public function category() { return $this->belongsTo(Category::class); }
    public function wishlistedBy() { return $this->hasMany(Wishlist::class); }
}
