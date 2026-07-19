<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        // FR-4: allow marking a product as sold explicitly
        // (status column already exists and reused as: pending, approved, rejected, sold)

        // FR-7: Wishlist Management
        Schema::create("wishlists", function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained()->onDelete("cascade");
            $table->foreignId("product_id")->constrained()->onDelete("cascade");
            $table->timestamps();
            $table->unique(["user_id", "product_id"]);
        });

        // FR-12 / FR-13: Ownership Claims for Found Items + recovery tracking
        Schema::create("claims", function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained()->onDelete("cascade");
            $table->foreignId("found_item_id")->constrained()->onDelete("cascade");
            $table->text("message");
            $table->string("status")->default("pending"); // pending, approved, rejected
            $table->timestamps();
        });

        // FR-14: Wanted Item Requests
        Schema::create("wanted_posts", function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained()->onDelete("cascade");
            $table->foreignId("category_id")->nullable()->constrained()->onDelete("set null");
            $table->string("title");
            $table->text("description");
            $table->decimal("budget", 8, 2)->nullable();
            $table->string("condition")->nullable();
            $table->string("status")->default("open"); // open, fulfilled
            $table->timestamps();
        });
    }

    public function down() {
        Schema::dropIfExists("wanted_posts");
        Schema::dropIfExists("claims");
        Schema::dropIfExists("wishlists");
    }
};
