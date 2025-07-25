'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';



export default function Login() {
const router = useRouter();

  
const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const { email, password } = formData;

  if (!email || !password) {
    return toast.error("Please enter both email and password.");
  }

  try {
    const res = await fetch("http://localhost:5555/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    console.log(data)

    if (res.ok) {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!");

      setTimeout(() => {
        if (data.user.role === 'owner') {
          router.push('/owner-dashboard');
        } else {
          router.push('/');
        }
      }, 1500);
    } else {
      toast.error(data.message || "Login failed. Please try again.");
    }
  } catch (error) {
    toast.error("Server error. Please try again later.");
  }
};


  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        
        <form onSubmit={handleSubmit} className="space-y-6">
        
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <button type="button" className="text-sm text-amber-600 hover:text-amber-500">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 text-white py-2 px-4 rounded-md hover:bg-amber-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
          >
            Sign In
          </button>
        </form>   

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-amber-600 hover:text-amber-500 font-medium">
              Sign up here
            </Link>
          </p>
        </div>

     
      </div>
        <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}