import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type {
  ApiResponse,
  Restaurant,
} from "./restaurant.types";

export function RestaurantList() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadRestaurants() {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get<ApiResponse<Restaurant[]>>(
          "/restaurants",
          {
            params: search.trim()
              ? { search: search.trim() }
              : {},
            signal: controller.signal,
          },
        );

        setRestaurants(response.data.data);
      } catch {
        if (!controller.signal.aborted) {
          setError("Unable to load restaurants. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    void loadRestaurants();

    return () => controller.abort();
  }, [search, retryKey]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section className="mb-8">
        <p className="mb-2 font-semibold text-orange-600">
          GOOD FOOD, GOOD MOOD
        </p>

        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Find your next favourite meal.
        </h1>

        <p className="mt-3 max-w-xl text-gray-600">
          Discover restaurants and get your favourite food delivered.
        </p>

        <label className="mt-6 block max-w-xl">
          <span className="sr-only">Search restaurants or cuisines</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search restaurants or cuisines..."
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </label>
      </section>

      {loading && (
        <p role="status" className="py-10 text-gray-600">
          Loading restaurants...
        </p>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p role="alert" className="text-red-700">
            {error}
          </p>
          <button
            className="mt-3 font-semibold text-red-800 underline"
            onClick={() => setRetryKey((key) => key + 1)}
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && restaurants.length === 0 && (
        <p className="py-10 text-gray-600">
          No restaurants found. Try another search.
        </p>
      )}

      {!loading && !error && restaurants.length > 0 && (
        <section>
          <h2 className="mb-5 text-xl font-bold">
            Restaurants near you
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {restaurants.map((restaurant) => (
              <article
                key={restaurant.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
              >
                {restaurant.imageUrl ? (
                  <img
                    src={restaurant.imageUrl}
                    alt={restaurant.name}
                    loading="lazy"
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-orange-50 text-orange-600">
                    FoodHub
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold">{restaurant.name}</h3>
                    <span className="shrink-0 rounded-lg bg-green-50 px-2 py-1 text-sm font-semibold text-green-700">
                      ★ {Number(restaurant.rating).toFixed(1)}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-gray-600">
                    {restaurant.cuisine}
                  </p>

                  <p className="mt-3 text-sm text-gray-500">
                    {restaurant.deliveryTimeMinutes} min · Delivery ₹
                    {(restaurant.deliveryFeePaise / 100).toFixed(0)}
                  </p>

                  <p
                    className={`mt-3 text-sm font-medium ${
                      restaurant.isOpen
                        ? "text-green-700"
                        : "text-red-600"
                    }`}
                  >
                    {restaurant.isOpen ? "Accepting orders" : "Currently closed"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}