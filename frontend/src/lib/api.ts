// Mock data - in a real app, this would fetch from your API
import mockData from "@/db.json"

export async function getCuisines() {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500)) // Increased delay for visible loading state
  return mockData.cuisines
}

export async function getOutlets() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockData.outlets
}

export async function getDishes() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockData.dishes
}

export async function getReviews() {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockData.reviews
}
