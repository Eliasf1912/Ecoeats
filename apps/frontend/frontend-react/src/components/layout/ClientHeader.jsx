import { Icon } from '../ui';

export function ClientHeader({ navigate, cartCount, onLogout }) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#/restaurants" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center">
            <Icon name="leaf" className="w-4 h-4" />
          </span>
          <span className="font-semibold tracking-tight">EcoEats</span>
        </a>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate('/cart')}
            className="relative p-2 rounded-lg hover:bg-surface transition-colors"
            aria-label="Panier"
          >
            <Icon name="cart" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-brand text-white text-[11px] font-semibold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              if (onLogout) {
                onLogout();
                return;
              }
              navigate('/');
            }}
            className="p-2 rounded-lg hover:bg-surface transition-colors"
            aria-label="Deconnexion"
          >
            <Icon name="logout" />
          </button>
        </div>
      </div>
    </header>
  );
}
