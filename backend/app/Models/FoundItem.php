<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class FoundItem extends Model {
    protected $fillable = ["user_id", "category_id", "name", "description", "location", "date", "image", "status"];
    protected $appends = ['image_url'];

    public function getImageUrlAttribute() {
        if ($this->image) {
            return asset('storage/' . $this->image);
        }
        return null;
    }

    public function user() { return $this->belongsTo(User::class); }
    public function category() { return $this->belongsTo(Category::class); }
}
