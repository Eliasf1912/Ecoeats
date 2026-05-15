import { useEffect, useMemo, useState } from 'react';
import { MOCK } from '../components/data/mockData';
import { ClientHeader } from '../components/layout/ClientHeader';
import { Badge, Button, Card, Icon } from '../components/ui';
import { fetchRestaurantMenu, fetchRestaurants } from '../features/restaurant/restaurantApi';

function MenuItemRow({ item, onAdd }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-base">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
        <p className="text-sm font-semibold mt-2">{item.price.toFixed(2)} EUR</p>
      </div>
      <Button variant="secondary" size="sm" onClick={onAdd}>
        <Icon name="plus" className="w-4 h-4 mr-1" /> Ajouter
      </Button>
    </div>
  );
}

function StickyCartBar({ count, total, onClick }) {
  if (count === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-[calc(100%-2rem)] max-w-md">
      <button
        onClick={onClick}
        className="w-full bg-brand text-white rounded-lg shadow-lg px-4 py-3 flex items-center justify-between hover:bg-brand-dark transition-colors"
      >
        <span className="flex items-center gap-2 font-medium">
          <span className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
            {count}
          </span>
          Voir le panier
        </span>
        <span className="font-semibold">{total.toFixed(2)} EUR</span>
      </button>
    </div>
  );
}

export function MenuPage({ navigate, restaurantId, addToCart, cartCount, cartTotal, onLogout }) {
  const [restaurants, setRestaurants] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadMenu() {
      try {
        setLoading(true);
        setError('');
        const [restaurantList, menuList] = await Promise.all([
          fetchRestaurants(),
          fetchRestaurantMenu(restaurantId),
        ]);

        if (!isMounted) {
          return;
        }

        setRestaurants(restaurantList);
        setMenuItems(menuList);
      } catch {
        if (!isMounted) {
          return;
        }

        setError('Backend indisponible, affichage du menu mock.');
        setRestaurants(MOCK.RESTAURANTS);
        setMenuItems(MOCK.MENUS[restaurantId] || []);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadMenu();

    return () => {
      isMounted = false;
    };
  }, [restaurantId]);

  const restaurant = useMemo(
    () => restaurants.find((item) => item.id === restaurantId),
    [restaurants, restaurantId],
  );

  if (loading) {
    return (
      <div className="min-h-full pb-24">
        <ClientHeader navigate={navigate} cartCount={cartCount} onLogout={onLogout} />
        <main className="max-w-3xl mx-auto px-4 py-6">
          <Card className="p-8 text-center text-sm text-gray-500">Chargement du menu...</Card>
        </main>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-gray-500">Restaurant introuvable.</p>
        <Button className="mt-4" onClick={() => navigate('/restaurants')}>
          Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-full pb-24">
      <ClientHeader navigate={navigate} cartCount={cartCount} onLogout={onLogout} />

      <main className="max-w-3xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate('/restaurants')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-ink mb-4"
        >
          <Icon name="back" className="w-4 h-4 mr-1" /> Restaurants
        </button>

        <div
          className="h-40 w-full rounded-lg mb-5"
          style={{
            background: 'repeating-linear-gradient(135deg, #E8EDE4 0 12px, #DDE4D8 12px 24px)',
          }}
          aria-hidden="true"
        />

        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{restaurant.name}</h1>
            <p className="text-sm text-gray-500 mt-1">{restaurant.type}</p>
          </div>
          <Badge variant="soft">★ {restaurant.rating}</Badge>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
          <span>{restaurant.distance}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300" />
          <span>Livraison en {restaurant.eta}</span>
        </div>

        {error && <p className="text-sm text-amber-700 bg-amber-100 rounded-lg px-3 py-2 mb-4">{error}</p>}

        <Card className="mt-6 p-2 px-4">
          {menuItems.map((item) => (
            <MenuItemRow key={item.id} item={item} onAdd={() => addToCart(restaurant, item)} />
          ))}
        </Card>
      </main>

      <StickyCartBar count={cartCount} total={cartTotal} onClick={() => navigate('/cart')} />
    </div>
  );
}
