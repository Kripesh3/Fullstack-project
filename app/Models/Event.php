<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;



class Event extends Model
{

    use HasFactory;
    protected $fillable = [
        'organizer_id',
        'category_id',
        'title',
        'description',
        'location',
        'date',
        'time',
        'capacity',
        'image',
        'status'
    ];

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function category()
    {
        return $this->belongsTo(EventCategory::class, 'category_id');
    }

    public function attendees()
    {
        return $this->belongsToMany(User::class)->withTimestamps();
    }
}
