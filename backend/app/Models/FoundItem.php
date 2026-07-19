<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class FoundItem extends Model {
    protected $fillable = ["user_id", "category_id", "name", "description", "location", "date", "image", "status"];
    public function user() { return $this->belongsTo(User::class); }
    public function category() { return $this->belongsTo(Category::class); }
    public function claims() { return $this->hasMany(Claim::class, "found_item_id"); }
}
