<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use App\Services\CloudinaryService;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'role' => 'in:user,organizer,admin'
            ]);

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'role' => $validatedData['role'] ?? 'user'
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'token' => $token
                ],
                'message' => 'User registered successfully'
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Registration error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        try {
            $credentials = $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ]);

            Log::info('Login attempt for email: ' . $credentials['email']);

            // Check if user exists
            $user = User::where('email', $credentials['email'])->first();
            
            if (!$user) {
                Log::warning('User not found: ' . $credentials['email']);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Check password
            if (!Hash::check($credentials['password'], $user->password)) {
                Log::warning('Invalid password for user: ' . $credentials['email']);
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Check if user is banned
            if (isset($user->banned) && $user->banned) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account has been banned'
                ], 403);
            }

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            Log::info('Login successful for user: ' . $user->email);

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'token' => $token
                ],
                'message' => 'Login successful'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Login failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed: ' . $e->getMessage()
            ], 500);
        }
    }

    public function user(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    }

    public function forgotPassword(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email|exists:users,email'
            ]);

            $user = User::where('email', $request->email)->first();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            // Generate a reset token
            $token = Str::random(60);
            
            // Clear any existing tokens for this email
            DB::table('password_resets')->where('email', $request->email)->delete();
            
            // Store the reset token
            DB::table('password_resets')->insert([
                'email' => $request->email,
                'token' => Hash::make($token),
                'created_at' => now()
            ]);

            // Send email with reset token (for API, we'll return the token for testing)
            // In production, you would send this via email
            try {
                $resetUrl = config('app.frontend_url', 'http://192.176.172.226:3000') . '/reset-password?token=' . $token . '&email=' . urlencode($request->email);
                
                Mail::send('emails.password-reset', [
                    'user' => $user,
                    'token' => $token,
                    'email' => $request->email,
                    'actionUrl' => $resetUrl,
                    'count' => 60 // Reset link expires in 60 minutes
                ], function ($message) use ($request) {
                    $message->to($request->email);
                    $message->subject('Reset Your Password - EventEase');
                });
                
                return response()->json([
                    'success' => true,
                    'message' => 'Password reset link sent to your email',
                    'debug_token' => $token // Remove this in production
                ]);
            } catch (\Exception $e) {
                Log::error('Email sending failed: ' . $e->getMessage());
                
                // Return token for testing when email fails
                return response()->json([
                    'success' => true,
                    'message' => 'Password reset token generated (email not sent)',
                    'token' => $token // For testing purposes
                ]);
            }

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Password reset error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to process password reset request'
            ], 500);
        }
    }

    public function resetPassword(Request $request)
    {
        try {
            $request->validate([
                'token' => 'required',
                'email' => 'required|email',
                'password' => 'required|min:8|confirmed',
            ]);

            Log::info('Password reset attempt', [
                'email' => $request->email,
                'token_length' => strlen($request->token)
            ]);

            // Find the password reset record
            $passwordReset = DB::table('password_resets')
                ->where('email', $request->email)
                ->first();

            if (!$passwordReset) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired reset token'
                ], 400);
            }

            // Check if token matches
            if (!Hash::check($request->token, $passwordReset->token)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid reset token'
                ], 400);
            }

            // Check if token is not expired (24 hours)
            $tokenAge = now()->diffInHours($passwordReset->created_at);
            if ($tokenAge > 24) {
                // Delete expired token
                DB::table('password_resets')->where('email', $request->email)->delete();
                
                return response()->json([
                    'success' => false,
                    'message' => 'Reset token has expired'
                ], 400);
            }

            // Find the user
            $user = User::where('email', $request->email)->first();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            // Update password
            $user->forceFill([
                'password' => Hash::make($request->password)
            ])->setRememberToken(Str::random(60));

            $user->save();

            // Delete the used token
            DB::table('password_resets')->where('email', $request->email)->delete();

            // Fire password reset event
            event(new PasswordReset($user));

            return response()->json([
                'success' => true,
                'message' => 'Password has been successfully reset'
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Password reset error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Password reset failed'
            ], 500);
        }
    }

    public function profile(Request $request)
    {
        try {
            return response()->json([
                'success' => true,
                'data' => $request->user()
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch profile: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();
            
            Log::info('Profile update request', [
                'user_id' => $user->id,
                'request_data' => $request->all(),
                'has_avatar_file' => $request->hasFile('avatar')
            ]);
            
            $validatedData = $request->validate([
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|string|max:20',
                'bio' => 'sometimes|string|max:500',
                'avatar' => 'sometimes|image|mimes:jpeg,jpg,png,gif|max:10240' // Increased to 10MB
            ]);

            Log::info('Profile update validation passed', [
                'validated_data' => $validatedData
            ]);

            // Handle avatar upload with Cloudinary
            if ($request->hasFile('avatar')) {
                $cloudinaryService = new CloudinaryService();
                
                Log::info('Starting avatar upload to Cloudinary');
                
                // Delete old avatar from Cloudinary if exists
                if ($user->avatar_public_id) {
                    $cloudinaryService->deleteImage($user->avatar_public_id);
                }

                // Upload new avatar to Cloudinary
                $uploadResult = $cloudinaryService->uploadAvatar($request->file('avatar'));
                
                Log::info('Avatar upload result', [
                    'result' => $uploadResult
                ]);
                
                if ($uploadResult['success']) {
                    $validatedData['avatar'] = $uploadResult['url'];
                    $validatedData['avatar_public_id'] = $uploadResult['public_id'];
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to upload avatar: ' . $uploadResult['error']
                    ], 500);
                }
            }

            $user->update($validatedData);

            return response()->json([
                'success' => true,
                'data' => $user->fresh(),
                'message' => 'Profile updated successfully'
            ]);
        } catch (ValidationException $e) {
            Log::error('Profile update validation failed', [
                'errors' => $e->errors(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to update profile: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->all()
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile'
            ], 500);
        }
    }

    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                'current_password' => 'required',
                'password' => 'required|min:8|confirmed'
            ]);

            $user = $request->user();

            // Check current password
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 422);
            }

            // Update password
            $user->update([
                'password' => Hash::make($request->password)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully'
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Failed to change password: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to change password',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}