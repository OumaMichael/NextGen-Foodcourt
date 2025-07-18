export interface Dish {
  id: number;
  name: string;
  outletName: string;
  price: number;
  rating: number;
  cuisine: string;
  description?: string;
}

export function getPopularDishes(): Dish[] {
  return [
    {
      id: 1,
      name: "Doro Wat",
      outletName: "Mama Africa Ethiopian",
      price: 18.99,
      rating: 4.8,
      cuisine: "Ethiopian",
      description: "Traditional spicy chicken stew with injera"
    },
    {
      id: 2,
      name: "Jollof Rice",
      outletName: "Jollof Palace",
      price: 15.50,
      rating: 4.7,
      cuisine: "Nigerian",
      description: "Aromatic rice dish with vegetables and spices"
    },
    {
      id: 3,
      name: "Nyama Choma",
      outletName: "Safari Kitchen",
      price: 22.00,
      rating: 4.9,
      cuisine: "Kenyan",
      description: "Grilled meat with traditional seasonings"
    },
    {
      id: 4,
      name: "Fufu with Soup",
      outletName: "Spice Garden",
      price: 16.75,
      rating: 4.6,
      cuisine: "Congolese",
      description: "Traditional cassava dish with rich stew"
    },
    {
      id: 5,
      name: "Kitfo",
      outletName: "Heritage",
      price: 19.99,
      rating: 4.8,
      cuisine: "Ethiopian",
      description: "Ethiopian steak tartare with mitmita spice"
    }
  ];
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  outlet: string;
}

export function getCustomerReviews(): Review[] {
  return [
    {
      id: 1,
      name: "Vera M.",
      rating: 5,
      comment: "Amazing Ethiopian food! The Doro Wat was absolutely delicious.",
      outlet: "Mama Africa Ethiopian",
    },
    {
      id: 2,
      name: "Brendah E.",
      rating: 4,
      comment: "Great variety of African cuisines. Fast service and reasonable prices.",
      outlet: "Safari Kitchen",
    },
    {
      id: 3,
      name: "Chibude L.",
      rating: 5,
      comment: "Best Jollof rice I've had outside Nigeria. Highly recommend!",
      outlet: "Jollof Palace",
    },
  ];
}