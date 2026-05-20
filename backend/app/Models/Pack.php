<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pack extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'monthly_fee',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'monthly_fee' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function products()
    {
        return $this->belongsToMany(Product::class, 'pack_product')->withTimestamps();
    }

    public function accounts()
    {
        return $this->hasMany(Account::class);
    }
}
