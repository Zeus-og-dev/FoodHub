import { RestaurantList } from "./features/restaurants/RestaurantList";

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="/" className="text-2xl font-extrabold text-orange-600">
            FoodHub<span className="text-gray-900">.</span>
          </a>

          <nav aria-label="Main navigation">
            <a
              href="#restaurants"
              className="font-medium text-gray-700 hover:text-orange-600"
            >
              Restaurants
            </a>
          </nav>
        </div>
      </header>

      <RestaurantList />
    </div>
  );
}