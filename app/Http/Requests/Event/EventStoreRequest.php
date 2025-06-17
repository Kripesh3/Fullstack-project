<?php

namespace App\Http\Requests\Event;

use Illuminate\Foundation\Http\FormRequest;

class EventStoreRequest extends FormRequest
{
    public function rules()
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:event_categories,id',
            'location' => 'required|string|max:255',
            'date' => 'required|date|after:today',
            'time' => 'required',
            'capacity' => 'required|integer|min:1',
            'image' => 'nullable|image|max:2048',
        ];
    }
}
