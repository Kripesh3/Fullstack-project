<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Mail;


Route::get('/', function () {
    return view('welcome');
});

Route::get("/testing", function () {
    return response()->json([
        'message' => 'Welcome to the Event Management API',
        'documentation' => 'https://example.com/docs',
    ]);
});

Route::get('/send-test-mail', function () {
    Mail::raw('This is a test email from EventEase', function ($message) {
        $message->to('test@example.com') // use your Mailtrap inbox address here
            ->subject('Test Mail from Laravel');
    });

    return 'Test mail sent!';
});
