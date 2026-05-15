import { apiRequest } from '../../components/api/httpClient';

export async function addCartItem(menuItemId, quantity = 1) {
  return apiRequest(`/cart/add/${menuItemId}`, {
    method: 'POST',
    body: JSON.stringify({ quantity }),
  });
}

export async function clearRemoteCart() {
  return apiRequest('/cart/clear', {
    method: 'DELETE',
  });
}

export async function createOrder(payload) {
  return apiRequest('/order', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
