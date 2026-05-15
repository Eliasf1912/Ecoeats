import { useState } from 'react';
import { ClientHeader } from '../components/layout/ClientHeader';
import { Button, Card, Icon } from '../components/ui';
import { createOrder } from '../features/cart/cartApi';
import { getSession } from '../features/auth/authSession';

function QuantityStepper({ value, onInc, onDec }) {
  return (
    <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white">
      <button onClick={onDec} className="p-2 hover:bg-surface transition-colors" aria-label="Diminuer">
        <Icon name="minus" className="w-4 h-4" />
      </button>
      <span className="w-8 text-center text-sm font-medium">{value}</span>
      <button onClick={onInc} className="p-2 hover:bg-surface transition-colors" aria-label="Augmenter">
        <Icon name="plus" className="w-4 h-4" />
      </button>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div className={`flex items-center justify-between ${bold ? 'font-semibold text-base' : 'text-sm text-gray-600'}`}>
      <span>{label}</span>
      <span className={bold ? 'text-ink' : ''}>{value}</span>
    </div>
  );
}

export function CartPage({ navigate, cart, updateQty, removeItem, clearCart, cartCount, cartTotal, onLogout }) {
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState('');
  const fee = cart.length > 0 ? 2.5 : 0;
  const total = cartTotal + fee;

  async function handleOrder() {
    setPlaced(true);
    setError('');

    try {
      const session = getSession();
      if (session?.backendRole === 'client') {
        await createOrder({
          deliveryAddress: {
            number: 1,
            street: 'Rue de la Paix',
            city: 'Paris',
            postalCode: '75000',
            country: 'France',
          },
          tip: 0,
        });
      }

      clearCart();
      navigate('/restaurants');
    } catch (apiError) {
      setError(apiError.message || 'Impossible de creer la commande.');
    } finally {
      setPlaced(false);
    }
  }

  return (
    <div className="min-h-full">
      <ClientHeader navigate={navigate} cartCount={cartCount} onLogout={onLogout} />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-gray-500 hover:text-ink mb-4"
        >
          <Icon name="back" className="w-4 h-4 mr-1" /> Retour
        </button>

        <h1 className="text-2xl font-semibold mb-5">Mon panier</h1>

        {cart.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-sm text-gray-500">Votre panier est vide.</p>
            <Button className="mt-4" onClick={() => navigate('/restaurants')}>
              Decouvrir les restaurants
            </Button>
          </Card>
        ) : (
          <>
            <Card className="divide-y divide-gray-100">
              {cart.map((line) => (
                <div key={line.id} className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{line.name}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{line.restaurantName}</p>
                    <p className="text-sm font-semibold mt-1">{(line.price * line.qty).toFixed(2)} EUR</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <QuantityStepper
                      value={line.qty}
                      onInc={() => updateQty(line.id, line.qty + 1)}
                      onDec={() => updateQty(line.id, line.qty - 1)}
                    />
                    <button onClick={() => removeItem(line.id)} className="text-xs text-danger hover:underline">
                      Retirer
                    </button>
                  </div>
                </div>
              ))}
            </Card>

            <Card className="mt-4 p-4 space-y-2">
              <Row label="Sous-total" value={`${cartTotal.toFixed(2)} EUR`} />
              <Row label="Frais de livraison" value={`${fee.toFixed(2)} EUR`} />
              <div className="border-t border-gray-100 pt-2 mt-2">
                <Row label="Total" value={`${total.toFixed(2)} EUR`} bold />
              </div>
            </Card>

            {error && <p className="text-sm text-danger mt-4">{error}</p>}

            <Button size="lg" className="w-full mt-5" onClick={handleOrder} disabled={placed}>
              {placed ? (
                <>
                  <Icon name="check" className="w-5 h-5 mr-2" /> Commande en cours...
                </>
              ) : (
                `Commander - ${total.toFixed(2)} EUR`
              )}
            </Button>
          </>
        )}
      </main>
    </div>
  );
}
