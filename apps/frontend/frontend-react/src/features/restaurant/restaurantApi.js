import { apiRequest } from '../../components/api/httpClient';

function normalizeRestaurant(item, index) {
  return {
    id: item.id || item.restaurantId || `r-${index}`,
    name: item.name || item.restaurantName || 'Restaurant',
    type: item.description || item.type || 'Cuisine',
    rating: item.rating || 4.5,
    distance: item.distance || 'N/A',
    eta: item.eta || '20-30 min',
  };
}

function normalizeMenuItem(item, index) {
  return {
    id: item.id || item.menuItemId || `m-${index}`,
    name: item.name || 'Plat',
    description: item.description || 'Description indisponible',
    price: Number(item.price || item.unitPrice || 0),
  };
}

export async function fetchRestaurants() {
  const response = await apiRequest('/restaurant');
  const list = Array.isArray(response.restaurants) ? response.restaurants : [];
  return list.map(normalizeRestaurant);
}

export async function fetchRestaurantMenu(restaurantId) {
  const response = await apiRequest(`/restaurant/${restaurantId}/menu`);
  const list = Array.isArray(response.menuItems) ? response.menuItems : [];
  return list.map(normalizeMenuItem);
}
