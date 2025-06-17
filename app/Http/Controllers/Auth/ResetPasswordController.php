<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Carbon\Carbon;

class ResetPasswordController extends Controller
{
    // Handle the reset password form submission
    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        // Find the password reset token
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord) {
            return response()->json(['message' => 'Invalid reset token.'], 400);
        }

        // Check if token is valid (not expired - 60 minutes)
        $tokenAge = Carbon::parse($resetRecord->created_at)->diffInMinutes(now());
        if ($tokenAge > 60) {
            return response()->json(['message' => 'Reset token has expired.'], 400);
        }

        // Verify the token
        if (!Hash::check($request->token, $resetRecord->token)) {
            return response()->json(['message' => 'Invalid reset token.'], 400);
        }

        // Find the user
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 400);
        }

        // Update the user's password
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // Delete the used token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password reset successful!'], 200);
    }
}
