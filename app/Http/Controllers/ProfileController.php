<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\User\ProfileUpdateRequest;
use App\Services\CloudinaryService;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        dd("hlo");
        dd($request->user());
        return response()->json($request->user());
    }

    public function update(ProfileUpdateRequest $request, CloudinaryService $cloudinary)
    {
        $user = $request->user();
        $data = $request->validated();

        if ($request->hasFile('avatar')) {
            $data['avatar'] = $cloudinary->upload($request->file('avatar'), 'avatars');
        }

        $user->update($data);
        return response()->json($user);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password' => 'required|string|min:8|confirmed',
        ]);
        if (!Hash::check($request->current_password, $request->user()->password)) {
            return response()->json(['message' => 'Current password incorrect'], 400);
        }
        $request->user()->update(['password' => bcrypt($request->password)]);
        return response()->json(['message' => 'Password updated']);
    }
}

