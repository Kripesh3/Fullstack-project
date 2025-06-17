<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Models\User;

class ForgotPasswordController extends Controller
{
    // Send password reset link
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        // Generate a random token
        $token = Str::random(64);

        // Delete any existing tokens for this email
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        // Insert the new token
        DB::table('password_reset_tokens')->insert([
            'email' => $request->email,
            'token' => Hash::make($token),
            'created_at' => now(),
        ]);

        // For API-only backend, we'll just return success
        // In a real application, you would send an email here with the token
        // The frontend can handle the reset form with the token
        
        return response()->json([
            'message' => 'Password reset link sent to your email!',
            'token' => $token, // Only for development - remove in production
            'reset_url' => config('app.frontend_url') . '/reset-password?token=' . $token . '&email=' . $request->email
        ], 200);
    }
}
