'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  isPopular?: boolean;
}

interface Restaurant {
  id: number;
  name: string;
  img_url: string;
  cuisine: { name: string };
  description: string;
  dishes?: Dish[];
}

interface Cuisine {
  name: string;
  image: string;
}

export default function BrowseCuisines() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);

  const searchParams = useSearchParams();
  const cuisineParam = searchParams.get('cuisine') || '';

  const [selectedCuisine, setSelectedCuisine] = useState<string>(cuisineParam);
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restaurantsRes, cuisinesRes] = await Promise.all([
          fetch('http://localhost:5555/outlets'),
          fetch('http://localhost:5555/cuisines'),
        ]);

        const restaurantsData = await restaurantsRes.json();
        const cuisinesData = await cuisinesRes.json();

        setRestaurants(restaurantsData);
        setCuisines(cuisinesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredRestaurants = restaurants.filter((restaurant) => {
    const cuisineName = restaurant.cuisine?.name || '';
    const matchesCuisine = selectedCuisine === '' || cuisineName === selectedCuisine;
    const matchesSearch =
      searchTerm === '' ||
      restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cuisineName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCuisine && matchesSearch;
  });

  const restaurantsForCuisine = selectedCuisine
    ? restaurants.filter((r) => r.cuisine?.name === selectedCuisine)
    : [];

  const selectedRestaurantData = restaurants.find((r) => r.id === selectedRestaurant) ||
    (restaurantsForCuisine.length === 1 ? restaurantsForCuisine[0] : null);

  return (
    <div className="relative">
      <div className="mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
          Browse by Cuisine
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Find restaurants by cuisine type or search by name
        </p>

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />

          <select
            value={selectedCuisine}
            onChange={(e) => {
              setSelectedCuisine(e.target.value);
              setSelectedRestaurant(null);
            }}
            className="px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">All Cuisines</option>
            {cuisines.map((cuisine) => (
              <option key={cuisine.name} value={cuisine.name}>
                {cuisine.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCuisine && restaurantsForCuisine.length > 1 && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Choose {selectedCuisine} Restaurant
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurantsForCuisine.map((restaurant) => (
              <button
                key={restaurant.id}
                onClick={() => setSelectedRestaurant(restaurant.id)}
                className={`p-6 border-2 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                  selectedRestaurant === restaurant.id
                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-400 bg-white dark:bg-gray-700'
                }`}
              >
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">{restaurant.name}</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{restaurant.description}</p>
                <p className="text-lg text-orange-600 dark:text-orange-400 mt-3 font-semibold">
                  {restaurant.dishes?.length || 0} dishes available
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedRestaurantData && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
            Menu - {selectedRestaurantData.name}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {(selectedRestaurantData.dishes || []).map((dish) => (
              <div
                key={dish.id}
                className="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-white dark:bg-gray-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white">{dish.name}</h4>
                  {dish.isPopular && (
                    <span className="text-sm bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 py-1 rounded-full font-semibold">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{dish.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                    KSh {dish.price.toLocaleString()}
                  </span>
                  <a
                    href={`/order?outlet=${selectedRestaurantData.id}`}
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Order Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedCuisine && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex flex-col h-80"
            >
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  {restaurant.name}
                </h3>
                <p className="text-lg text-orange-600 dark:text-orange-400 font-semibold mb-3">
                  {restaurant.cuisine?.name}
                </p>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6 line-clamp-3">
                  {restaurant.description}
                </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCuisine(restaurant.cuisine?.name || '');
                    setSelectedRestaurant(restaurant.id);
                  }}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  View Menu
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredRestaurants.length === 0 && !selectedCuisine && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-2xl">
            No restaurants found matching your criteria.
          </p>
        </div>
      )}
    </div>
  );
}