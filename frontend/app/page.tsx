'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [cuisines, setCuisines] = useState<any[]>([]);

  const getValidImageUrl = (rawUrl: string): string => {
    try {
      const urlObj = new URL(rawUrl);
      const actualUrl = urlObj.searchParams.get("imgurl");
      return actualUrl ? decodeURIComponent(actualUrl) : rawUrl;
    } catch {
      return rawUrl;
    }
  };

  const handleOrderNowClick = () => {
    if (isLoggedIn) {
      router.push('/order');
    } else {
      router.push('/login');
    }
  };

  const handleReserveClick = () => {
    if (isLoggedIn) {
      router.push('/reservations');
    } else {
      router.push('/login');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const outletsRes = await fetch('http://localhost:5555/outlets');
        const cuisinesRes = await fetch('http://localhost:5555/cuisines');

        const outletsData = await outletsRes.json();
        const cuisinesData = await cuisinesRes.json();

        setRestaurants(outletsData);
        setCuisines(cuisinesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  const displayRestaurants = restaurants.slice(0, 4);
  const displayCuisines = cuisines.slice(0, 4);

  return (
    <div>
      <div className="relative h-96 md:h-[500px] mb-16 rounded-lg overflow-hidden -mx-4 md:-mx-8 lg:-mx-16 xl:-mx-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1200)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-purple-900/60 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 md:mb-8 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Welcome to NextGen FoodCourt
            </h1>
            <p className="text-lg md:text-2xl max-w-4xl mx-auto leading-relaxed">
              Discover amazing cuisines from multiple restaurants all in one place.
              Reserve your table in advance and order from your favorite outlets
              while enjoying our comfortable shared seating experience.
            </p>
            <div className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleOrderNowClick}
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 md:px-12 md:py-4 rounded-xl text-xl md:text-2xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                Order Now
              </button>
              
              <button
                onClick={handleReserveClick}
                className="hidden sm:block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 md:px-12 md:py-4 rounded-xl text-xl md:text-2xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                Reserve Table
              </button>
            </div>
            
          
          </div>
        </div>
      </div>

       <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
            Discover Your Next Favorite Spot
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore all our restaurant partners and discover what each outlet has to offer
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {displayRestaurants.map((restaurant: any) => (
            <Link
              key={restaurant.id}
              href={`/order?outlet=${restaurant.id}`}
              onClick={(e) => {
                if (!isLoggedIn) {
                  e.preventDefault();
                  router.push('/login');
                }
              }}
              className="no-underline bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer flex flex-col h-22"
            >
              <div
                className="h-48 w-full bg-cover bg-center flex-shrink-0"
                style={{ backgroundImage: `url(${getValidImageUrl(restaurant.img_url)})` }}
              />
              <div className="p-6 text-center flex flex-col justify-between flex-grow">
                <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                  {restaurant.name}
                </h3>
                <p className="text-lg text-orange-600 dark:text-orange-400 font-semibold">
                  {restaurant.cuisine.name} Cuisine
                </p>
                </div>
                <button className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2">
                  {isLoggedIn ? 'Order Now' : 'Login to Order'}
                </button>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/browse-outlets"
            className="no-underline inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-xl text-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            View All Restaurants
          </Link>
        </div>
      </div>

      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
            Crave It, Find It
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Discover restaurants by your favorite cuisine type and find exactly what you're craving
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {displayCuisines.map((cuisine: any) => (
            <Link
              key={cuisine.id}
              href={`/browse-cuisines?cuisine=${cuisine.name}`}
              className="no-underline bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              <div
                className="h-32 w-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${getValidImageUrl(cuisine.img_url)})`,
                }}
              />
              <div className="p-4">
                <p className="text-lg font-semibold text-gray-800 dark:text-white text-center">
                  {cuisine.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/browse-cuisines"
            className="no-underline inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-xl text-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Explore All Cuisines
          </Link>
        </div>
      </div>

 <div className="grid md:grid-cols-3 gap-8">
        <Link
          href="/popular-dishes"
          className="no-underline bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center flex flex-col justify-between h-48"
        >
          <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Popular Dishes</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300">See what everyone's ordering today</p>
          </div>
          <button className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300">
            View Dishes
          </button>
        </Link>

        <Link
          href="/reservations"
          onClick={(e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              router.push('/login');
            }
          }}
          className="no-underline bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center flex flex-col justify-between h-48"
        >
          <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Reserve Table</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300">Book your spot in advance</p>
          </div>
          <button className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2">
            {isLoggedIn ? 'Reserve Now' : 'Login to Reserve'}
          </button>
        </Link>

        <Link
          href="/reviews"
          className="no-underline bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-center flex flex-col justify-between h-48"
        >
          <div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Customer Reviews</h3>
          <p className="text-lg text-gray-600 dark:text-gray-300">Read what others are saying</p>
          </div>
          <button className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300">
            Read Reviews
          </button>
        </Link>
      </div>
    </div>
  );
}
