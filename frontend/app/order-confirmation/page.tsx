'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Clock, MapPin, Phone } from 'lucide-react';

export default function OrderConfirmation() {
  const router = useRouter();
  const [orderNumber] = useState(() => Math.floor(Math.random() * 10000) + 1000);
  const [estimatedTime] = useState(() => Math.floor(Math.random() * 10) + 15);

  useEffect(() => {
    // Redirect to home after 10 seconds
    const timer = setTimeout(() => {
      router.push('/');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Thank you for your order. We're preparing your delicious meal.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Order Number:</span>
              <span className="font-bold text-gray-800 dark:text-white">#{orderNumber}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300">Status:</span>
              <span className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full text-sm font-medium">
                Preparing
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Estimated Time:
              </span>
              <span className="font-bold text-green-600 dark:text-green-400">{estimatedTime} minutes</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <MapPin className="w-5 h-5 text-orange-500" />
            <span>NextGen FoodCourt, Level 2</span>
          </div>
          
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <Phone className="w-5 h-5 text-orange-500" />
            <span>+254 700 123 456</span>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => router.push('/order-tracking')}
            className="w-full bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors"
          >
            Track Your Order
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Back to Home
          </button>
        </div>

        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          You will be redirected to the home page in 10 seconds
        </div>
      </div>
    </div>
  );
}