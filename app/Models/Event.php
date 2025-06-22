<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'location',
        'date',
        'time',
        'capacity',
        'image',
        'image_public_id',
        'category_id',
        'organizer_id',
        'status',
        'ticket_price'
    ];

    protected $casts = [
        'date' => 'date',
        'capacity' => 'integer',
        'ticket_price' => 'decimal:2'
    ];

    // Relationships
    public function category()
    {
        return $this->belongsTo(\App\Models\EventCategory::class, 'category_id');
    }

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function attendees()
    {
        return $this->belongsToMany(User::class, 'event_user')->withTimestamps();
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopeUpcoming($query)
    {
        return $query->where('date', '>=', Carbon::today());
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    // Accessors
    public function getFormattedDateAttribute()
    {
        return $this->date->format('M d, Y');
    }

    public function getFormattedTimeAttribute()
    {
        return Carbon::parse($this->time)->format('g:i A');
    }

    public function getIsPastAttribute()
    {
        return $this->date < Carbon::today();
    }

    public function getIsFullAttribute()
    {
        return $this->attendees()->count() >= $this->capacity;
    }

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }
        
        if (str_contains($this->image, 'cloudinary')) {
            return $this->image;
        }
        
        return asset('storage/' . $this->image);
    }
}
