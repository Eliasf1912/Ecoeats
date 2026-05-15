import { useMemo, useState } from 'react';
import { BrowserRouter, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../features/cart/useCart';
import { CartPage } from '../pages/CartPage';
import { DriverPage } from '../pages/DriverPage';
import { LoginPage } from '../pages/LoginPage';
import { MenuPage } from '../pages/MenuPage';
import { OwnerPage } from '../pages/OwnerPage';
import { Register } from '../pages/Register';
import { RestaurantsPage } from '../pages/RestaurantsPage';
import { Button } from '../components/ui';
import { clearSession, getSession } from '../features/auth/authSession';
import {
  canAccessClientViews,
  canAccessDriverViews,
  canAccessOwnerViews,
} from '../features/auth/roleGuards';

export function AppRouter() {
  return (
    <BrowserRouter>
      <AppRouterContent />
    </BrowserRouter>
  );
}

function AppRouterContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const cartApi = useCart();
  const [session, setSessionState] = useState(() => getSession());

  const isAuthenticated = useMemo(() => Boolean(session?.token), [session]);
  const route = location.pathname;

  if (route === '/register') {
    return <Register navigate={navigate} onLogin={onLogin} />;
  }

  function onLogin(nextSession) {
    setSessionState(nextSession);
  }

  function onLogout() {
    clearSession();
    setSessionState(null);
    navigate('/');
  }

  if (route === '/') {
    return <LoginPage navigate={navigate} onLogin={onLogin} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (route === '/restaurants') {
    if (!canAccessClientViews(session)) {
      return <Navigate to="/" replace />;
    }

    return <RestaurantsPage navigate={navigate} cartCount={cartApi.cartCount} onLogout={onLogout} />;
  }

  const menuMatch = route.match(/^\/restaurant\/([\w-]+)$/);
  if (menuMatch) {
    if (!canAccessClientViews(session)) {
      return <Navigate to="/" replace />;
    }

    return <MenuPage navigate={navigate} restaurantId={menuMatch[1]} onLogout={onLogout} {...cartApi} />;
  }

  if (route === '/cart') {
    if (!canAccessClientViews(session)) {
      return <Navigate to="/" replace />;
    }

    return <CartPage navigate={navigate} onLogout={onLogout} {...cartApi} />;
  }

  if (route === '/driver') {
    if (!canAccessDriverViews(session)) {
      return <Navigate to="/" replace />;
    }

    return <DriverPage navigate={navigate} onLogout={onLogout} />;
  }

  if (route === '/owner') {
    if (!canAccessOwnerViews(session)) {
      return <Navigate to="/" replace />;
    }

    return <OwnerPage navigate={navigate} onLogout={onLogout} />;
  }

  return (
    <div className="min-h-full flex items-center justify-center p-8 text-center">
      <div>
        <p className="text-2xl font-semibold mb-2">Page introuvable</p>
        <p className="text-sm text-gray-500 mb-4">La route {route} n'existe pas.</p>
        <Button onClick={() => navigate('/restaurants')}>Retour a l'accueil</Button>
      </div>
    </div>
  );
}
