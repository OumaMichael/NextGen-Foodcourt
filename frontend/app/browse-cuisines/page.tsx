'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { fetchCuisines, fetchOutlets, fetchMenuItems } from '@/lib/api';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  outlet_id: number;
}

interface Restaurant {
  id: number;
  name: string;
  img_url: string;
  cuisine: { 
    id: number;
    name: string;
    img_url: string;
  };
  description: string;
  cuisine_id: number;
  menuItems?: MenuItem[];
}

interface Cuisine {
  id: number;
  name: string;
  img_url: string;
}

export default function BrowseCuisines() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const cuisineParam = searchParams.get('cuisine') || '';

  const [selectedCuisine, setSelectedCuisine] = useState<string>(cuisineParam);
  const [selectedRestaurant, setSelectedRestaurant] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [cuisinesData, restaurantsData, menuItemsData] = await Promise.all([
          fetchCuisines(),
          fetchOutlets(),
          fetchMenuItems(),
        ]);

        setCuisines(cuisinesData);
        setRestaurants(restaurantsData);
        setMenuItems(menuItemsData);

        const restaurantsWithMenus = restaurantsData.map((restaurant: any) => ({
          ...restaurant,
          menuItems: menuItemsData.filter((item: MenuItem) => item.outlet_id === restaurant.id)
        }));

        setRestaurants(restaurantsWithMenus);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen space-y-4">
        <div className="w-12 h-12 border-4 border-orange-500 border-solid rounded-full border-t-transparent animate-spin"></div>
        <p className="text-orange-600 text-lg">Loading cuisines...</p>
      </div>
    );
  }

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
              <option key={cuisine.id} value={cuisine.name}>
                {cuisine.name}
              </option>
            ))}
          </select>
        </div>

        {!selectedCuisine && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">Popular Cuisines</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine.id}
                  onClick={() => setSelectedCuisine(cuisine.name)}
                  className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <div className="aspect-w-16 aspect-h-9 h-48">
                    <img
                      src={cuisine.img_url || '/api/placeholder/400/300'}
                      alt={cuisine.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-bold text-white mb-1">{cuisine.name}</h3>
                    <p className="text-sm text-gray-200">
                      {restaurants.filter(r => r.cuisine?.name === cuisine.name).length} restaurants
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
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
                  {restaurant.menuItems?.length || 0} dishes available
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedRestaurantData && (
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Menu - {selectedRestaurantData.name}
            </h2>
            <button
              onClick={() => setSelectedRestaurant(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300"
            >
              ← Back to Restaurants
            </button>
          </div>
          
          {selectedRestaurantData.menuItems && selectedRestaurantData.menuItems.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {selectedRestaurantData.menuItems.map((menuItem) => (
                <div
                  key={menuItem.id}
                  className="border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6 bg-white dark:bg-gray-700 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="text-xl font-bold text-gray-800 dark:text-white">{menuItem.name}</h4>
                    <span className="text-sm bg-gradient-to-r from-blue-400 to-purple-400 text-white px-3 py-1 rounded-full font-semibold">
                      {menuItem.category}
                    </span>
                  </div>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{menuItem.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                      KSh {menuItem.price.toLocaleString()}
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
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500 dark:text-gray-400">
                No menu items available for this restaurant yet.
              </p>
            </div>
          )}
        </div>
      )}

      {selectedCuisine && filteredRestaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No restaurants found for {selectedCuisine} cuisine.
          </p>
        </div>
      )}

      {selectedCuisine && (
        <div className="mb-6">
          <button
            onClick={() => {
              setSelectedCuisine('');
              setSelectedRestaurant(null);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl text-lg font-semibold transition-all duration-300"
          >
            ← Back to All Cuisines
          </button>
        </div>
      )}

      {selectedCuisine && filteredRestaurants.length > 0 && (
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
            {selectedCuisine} Restaurants
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={restaurant.img_url }
                    alt={restaurant.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {restaurant.name}
                  </h3>
                  <p className="text-lg text-orange-600 dark:text-orange-400 font-semibold mb-3">
                    {restaurant.cuisine?.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-4 line-clamp-3">
                    {restaurant.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {restaurant.menuItems?.length || 0} menu items available
                  </p>
                  <button
                    onClick={() => setSelectedRestaurant(restaurant.id)}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    View Menu
                  </button>
                </div>
              </div>
            ))}
          </div>
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