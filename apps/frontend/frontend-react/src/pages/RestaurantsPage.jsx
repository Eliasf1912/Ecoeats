import { useEffect, useMemo, useState } from 'react';
import { MOCK } from '../components/data/mockData';
import { Badge, Card, Input } from '../components/ui';
import { ClientHeader } from '../components/layout/ClientHeader';
import { fetchRestaurants } from '../features/restaurant/restaurantApi';

function RestaurantCard({ restaurant, onClick }) {
  return (
    <Card onClick={onClick} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
      <div
        className="h-32 w-full"
        style={{
          background: 'repeating-linear-gradient(135deg, #E8EDE4 0 12px, #DDE4D8 12px 24px)',
        }}
        aria-hidden="true"
      />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-base leading-tight">{restaurant.name}</h3>
          <Badge variant="soft">★ {restaurant.rating}</Badge>
        </div>
        <p className="text-sm text-gray-500 mt-1">{restaurant.type}</p>
        <div className="flex items-center gap-3 text-sm text-gray-500 mt-3">
          <span>{restaurant.distance}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>{restaurant.eta}</span>
        </div>
      </div>
    </Card>
  );
}

export function RestaurantsPage({ navigate, cartCount, onLogout }) {
  const [query, setQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadRestaurants() {
      try {
        setError('');
        setLoading(true);
        const items = await fetchRestaurants();
        if (!isMounted) {
          return;
        }
        setRestaurants(items);
      } catch {
        if (!isMounted) {
          return;
        }
        setError('Backend indisponible, affichage des donnees mock.');
        setRestaurants(MOCK.RESTAURANTS);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadRestaurants();

    return () => {
      isMounted = false;
    };
  }, []);

  const list = useMemo(
    () =>
      restaurants.filter((restaurant) =>
        `${restaurant.name}${restaurant.type}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [restaurants, query],
  );

  return (
    <div className="min-h-full">
      <ClientHeader navigate={navigate} cartCount={cartCount} onLogout={onLogout} />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Restaurants pres de vous</h1>
          <p className="text-sm text-gray-500 mt-1">Livraison en moins de 30 minutes.</p>
        </div>

        <Input
          placeholder="Rechercher un restaurant ou un type de cuisine"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />

        {error && <p className="text-sm text-amber-700 bg-amber-100 rounded-lg px-3 py-2">{error}</p>}

        {loading ? (
          <Card className="p-8 text-center text-sm text-gray-500">Chargement des restaurants...</Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {list.map((restaurant) => (
                <RestaurantCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                />
              ))}
            </div>

            {list.length === 0 && (
              <p className="text-center text-gray-500 py-8 text-sm">Aucun restaurant trouve.</p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
