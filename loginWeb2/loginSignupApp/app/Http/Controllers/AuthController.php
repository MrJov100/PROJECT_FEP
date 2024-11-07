<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function showLoginForm()
    {
        return view('login');
    }

    public function showSignupForm()
    {
        return view('signup');
    }

    public function register(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|unique:users',
        'password' => 'required|confirmed|min:6',
    ]);

    // Create the user
    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => bcrypt($request->password),
    ]);

    if ($user) {
        // Return JSON response to trigger success in JavaScript
        return response()->json([
            'status' => 'success',
            'message' => 'Registration successful!',
            'redirect_url' => route('login'),
        ]);
    } else {
        // Handle failure (optional)
        return response()->json([
            'status' => 'error',
            'message' => 'Registration failed. Please try again.',
        ]);
    }
}

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            return redirect()->route('welcome');
        }

        return redirect()->back()->with('error', 'Invalid login credentials.');
    }

    public function logout(Request $request)
    {
        Auth::logout(); // Log the user out
        return redirect()->route('login')->with('success', 'You have been logged out successfully.'); // Redirect to login with a success message
    }
}

