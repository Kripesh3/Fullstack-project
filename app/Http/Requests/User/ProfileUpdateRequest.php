<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;


class ProfileUpdateRequest extends FormRequest
{
    public function rules()
    {
        return [
            'name' => 'string|max:255',
            'bio' => 'nullable|string|max:500',
            'avatar' => 'nullable|image|max:2048',
        ];
    }
}
