'use client';
            
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Restaurant {
  id: number;
  name: string;
  img_url: string;
  cuisine: { name: string };
  description: string;
}

export default function BrowseOutlets() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const getValidImageUrl = (rawUrl: string): string => {
    try {
      const urlObj = new URL(rawUrl);
      const actualUrl = urlObj.searchParams.get("imgurl");
      return actualUrl ? decodeURIComponent(actualUrl) : rawUrl;
    } catch {
      return rawUrl;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const outletsRes = await fetch('http://localhost:5555/outlets');

        const outletsData = await outletsRes.json();

        setRestaurants(outletsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, []);

  const displayRestaurants = restaurants;


  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Restaurant Outlets</h1>
        <p className="text-gray-600">
          Choose from our selection of restaurant partners in the food court
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayRestaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-96">
            <div className="relative h-48 w-full">
              <Image
                src={getValidImageUrl(restaurant.img_url)}
                alt={restaurant.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4 flex flex-col justify-between flex-grow">
              <h3 className="text-lg font-semibold text-gray-800 mb-1">
                {restaurant.name}
              </h3>
              <p className="text-sm text-amber-600 font-medium mb-2">
                {restaurant.cuisine.name}
              </p>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {restaurant.description}
              </p>
              <Link 
                href={`/order?outlet=${restaurant.id}`}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:from-orange-600 hover:to-red-600 transition-colors block text-center"
              >
                Order Now
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}