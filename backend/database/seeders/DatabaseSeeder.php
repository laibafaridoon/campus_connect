<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Admin;
use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Categories
        $categories = [
            'Books',
            'Electronics',
            'Calculators',
            'Stationery',
            'Bags',
            'Mobile Phones',
            'Laptops',
            'Bicycles',
            'ID Cards',
            'Keys',
            'Accessories',
            'Others'
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['name' => $cat],
                ['type' => 'general']
            );
        }

        // 2. Seed Default Admin
        Admin::firstOrCreate(
            ['email' => 'admin@campusconnect.com'],
            [
                'name' => 'Admin Moderator',
                'password' => Hash::make('password')
            ]
        );

        // 3. Seed Default Student User
        User::firstOrCreate(
            ['email' => 'student@campusconnect.com'],
            [
                'name' => 'John Doe',
                'reg_no' => 'FA21-BCS-001',
                'password' => Hash::make('password'),
                'campus' => 'Islamabad',
                'department' => 'Computer Science',
                'semester' => '6',
                'status' => 'approved'
            ]
        );
    }
}
