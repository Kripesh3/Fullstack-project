<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\EventRegistrationController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventCategoryController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;

Route::get('/', function () {
    return response()->json(['message' => 'Welcome to the API!']);
});


Route::post('password/email', [ForgotPasswordController::class, 'sendResetLinkEmail']);
Route::post('password/reset', [ResetPasswordController::class, 'reset']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

// Public routes for events (so users can browse without logging in)
Route::get('/events', [EventController::class, 'index']);
Route::get('events/{id}', [EventController::class, 'show']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('logout', [AuthController::class, 'logout']);

    Route::get('/me', [ProfileController::class, 'show']);
    Route::put('me', [ProfileController::class, 'update']);
    Route::put('me/password', [ProfileController::class, 'changePassword']);

    Route::post('events', [EventController::class, 'store'])->middleware('can:create,App\Models\Event');
    Route::put('events/{event}', [EventController::class, 'update'])->middleware('can:update,event');
    Route::delete('events/{event}', [EventController::class, 'destroy'])->middleware('can:delete,event');

    Route::post('events/{id}/register', [EventRegistrationController::class, 'register']);
    Route::delete('events/{id}/register', [EventRegistrationController::class, 'unregister']);

    Route::get('categories', [EventCategoryController::class, 'index']);

    // Admin routes
    Route::middleware('can:admin')->group(function () {
        Route::post('admin/events/{id}/approve', [AdminController::class, 'approveEvent']);
        Route::post('admin/events/{id}/reject', [AdminController::class, 'rejectEvent']);
        Route::get('admin/users', [AdminController::class, 'users']);
        Route::get('admin/events', [AdminController::class, 'events']);
        Route::post('admin/users/{id}/ban', [AdminController::class, 'banUser']);
        Route::post('admin/users/{id}/warn', [AdminController::class, 'warnUser']);

        Route::post('categories', [EventCategoryController::class, 'store']);
        Route::put('categories/{id}', [EventCategoryController::class, 'update']);
        Route::delete('categories/{id}', [EventCategoryController::class, 'destroy']);
    });
});
