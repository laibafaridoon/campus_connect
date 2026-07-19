<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::create("admins", function (Blueprint $table) {
            $table->id(); $table->string("name"); $table->string("email")->unique(); $table->string("password"); $table->timestamps();
        });
        Schema::create("categories", function (Blueprint $table) {
            $table->id(); $table->string("name"); $table->string("type"); $table->timestamps();
        });
        Schema::table("users", function (Blueprint $table) {
            $table->string("reg_no")->unique()->after("name");
            $table->string("campus")->after("password");
            $table->string("department");
            $table->string("semester");
            $table->string("status")->default("pending");
        });
        Schema::create("lost_items", function (Blueprint $table) {
            $table->id(); $table->foreignId("user_id")->constrained()->onDelete("cascade"); $table->foreignId("category_id")->constrained()->onDelete("cascade");
            $table->string("name"); $table->text("description"); $table->string("location"); $table->date("date"); $table->string("image")->nullable(); $table->string("status")->default("pending"); $table->timestamps();
        });
        Schema::create("found_items", function (Blueprint $table) {
            $table->id(); $table->foreignId("user_id")->constrained()->onDelete("cascade"); $table->foreignId("category_id")->constrained()->onDelete("cascade");
            $table->string("name"); $table->text("description"); $table->string("location"); $table->date("date"); $table->string("image")->nullable(); $table->string("status")->default("pending"); $table->timestamps();
        });
        Schema::create("products", function (Blueprint $table) {
            $table->id(); $table->foreignId("user_id")->constrained()->onDelete("cascade"); $table->foreignId("category_id")->constrained()->onDelete("cascade");
            $table->string("name"); $table->text("description"); $table->decimal("price", 8, 2); $table->string("condition"); $table->string("contact_info"); $table->string("image")->nullable(); $table->string("status")->default("pending"); $table->timestamps();
        });
        Schema::create("notifications", function (Blueprint $table) {
            $table->id(); $table->foreignId("user_id")->constrained()->onDelete("cascade"); $table->string("title"); $table->text("message"); $table->boolean("is_read")->default(false); $table->timestamps();
        });
    }
    public function down() {
        Schema::dropIfExists("notifications"); Schema::dropIfExists("products"); Schema::dropIfExists("found_items"); Schema::dropIfExists("lost_items"); Schema::dropIfExists("categories"); Schema::dropIfExists("admins");
        Schema::table("users", function (Blueprint $table) { $table->dropColumn(["reg_no", "campus", "department", "semester", "status"]); });
    }
};
