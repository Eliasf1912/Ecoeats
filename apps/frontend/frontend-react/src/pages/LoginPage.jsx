import { useState } from 'react';
import { Button, Card, Icon, Input } from '../components/ui';
import { login } from '../features/auth/authApi';
import { setSession } from '../features/auth/authSession';

export function LoginPage({ navigate, onLogin }) {
  const [email, setEmail] = useState('marie@ecoeats.fr');
  const [password, setPassword] = useState('demo1234');
  const [role, setRole] = useState('client');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!email.includes('@') || password.length < 4) {
      setError('Email ou mot de passe invalide.');
      return;
    }

    try {
      setError('');
      setIsLoading(true);
      const session = await login({ email, password, role });
      setSession(session);
      onLogin(session);

      const destination = { client: '/restaurants', driver: '/driver', owner: '/owner' }[role];
      navigate(destination);
    } catch (apiError) {
      setError(apiError.message || 'Connexion impossible.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-full flex items-center justify-center px-4 py-10 bg-surface">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="w-9 h-9 rounded-lg bg-brand text-white flex items-center justify-center">
            <Icon name="leaf" className="w-5 h-5" />
          </span>
          <span className="text-xl font-semibold tracking-tight">EcoEats</span>
        </div>

        <Card className="p-6">
          <h1 className="text-xl font-semibold mb-1">Bon retour</h1>
          <p className="text-sm text-gray-500 mb-6">Connectez-vous pour commander ou livrer.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="vous@exemple.fr"
            />
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="********"
              error={error}
            />

            <div>
              <span className="block text-sm font-medium text-ink mb-1.5">Je suis</span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'client', label: 'Client' },
                  { id: 'driver', label: 'Livreur' },
                  { id: 'owner', label: 'Restaurateur' },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setRole(option.id)}
                    className={`text-sm py-2 rounded-lg border transition-colors ${
                      role === option.id
                        ? 'border-brand bg-brand-light text-brand-dark font-medium'
                        : 'border-gray-200 bg-white text-ink hover:bg-surface'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Pas de compte ?{' '}
            <button type="button" onClick={() => navigate('/register')} className="text-brand-dark font-medium hover:underline">
              S'inscrire
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}
