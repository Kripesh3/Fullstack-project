<?php

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\EventController;
use App\Http\Controllers\API\EventCategoryController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Password reset routes (API versions)
Route::post('/password/email', [AuthController::class, 'forgotPassword']);
Route::post('/password/reset', [AuthController::class, 'resetPassword']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']); 
Route::post('/reset-password', [AuthController::class, 'resetPassword']); 

// Public event and category routes
Route::get('/events', [EventController::class, 'index']);
Route::get('/events/{event}', [EventController::class, 'show']);
Route::get('/categories', [EventCategoryController::class, 'index']);
Route::get('/categories/{category}', [EventCategoryController::class, 'show']);
Route::get('/categories/{category}/events', [EventCategoryController::class, 'events']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // User routes (temporarily using AuthController)
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/profile', [AuthController::class, 'updateProfile']); // For file uploads
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    // Event management
    Route::post('/events', [EventController::class, 'store']);
    Route::put('/events/{event}', [EventController::class, 'update']);
    Route::post('/events/{event}', [EventController::class, 'update']); // For file uploads
    Route::delete('/events/{event}', [EventController::class, 'destroy']);
    Route::post('/events/{event}/attend', [EventController::class, 'attend']);
    Route::delete('/events/{event}/unattend', [EventController::class, 'unattend']);
    Route::post('/verify-ticket', [EventController::class, 'verifyTicket']); // QR ticket verification
    
    // User events
    Route::get('/my-events', [EventController::class, 'myEvents']);
    Route::get('/attended-events', [EventController::class, 'attendedEvents']);
    
    // Admin routes
    Route::middleware('role:admin')->group(function () {
        Route::get('/admin/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/admin/users', [AdminController::class, 'users']);
        Route::get('/admin/events', [AdminController::class, 'events']);
        Route::put('/admin/events/{event}/approve', [AdminController::class, 'approveEvent']);
        Route::put('/admin/events/{event}/reject', [AdminController::class, 'rejectEvent']);
        Route::delete('/admin/users/{user}', [AdminController::class, 'deleteUser']);
        Route::put('/admin/users/{user}/ban', [AdminController::class, 'banUser']);
        Route::put('/admin/users/{user}/unban', [AdminController::class, 'unbanUser']);
        
        // Category management
        Route::post('/categories', [EventCategoryController::class, 'store']);
        Route::put('/categories/{category}', [EventCategoryController::class, 'update']);
        Route::delete('/categories/{category}', [EventCategoryController::class, 'destroy']);
    });
});
