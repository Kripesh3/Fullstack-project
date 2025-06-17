<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\EventCategory;

// app/Http/Controllers/EventCategoryController.php
class EventCategoryController extends Controller
{
    public function index()
    {
        return response()->json(EventCategory::all());
    }

    public function store(Request $request)
    {
        $request->validate(['name' => 'required|unique:event_categories']);
        $category = EventCategory::create(['name' => $request->name]);
        return response()->json($category, 201);
    }

    public function update(Request $request, $id)
    {
        $category = EventCategory::findOrFail($id);
        $request->validate(['name' => 'required|unique:event_categories,name,' . $id]);
        $category->update(['name' => $request->name]);
        return response()->json($category);
    }

    public function destroy($id)
    {
        $category = EventCategory::findOrFail($id);
        $category->delete();
        return response()->json(['message' => 'Category deleted']);
    }
}

