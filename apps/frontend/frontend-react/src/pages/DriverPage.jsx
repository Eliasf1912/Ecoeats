import { useState } from 'react';
import { MOCK } from '../components/data/mockData';
import { Badge, Button, Card, Icon } from '../components/ui';

function DriverHeader({ navigate, onLogout }) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#/driver" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center">
            <Icon name="leaf" className="w-4 h-4" />
          </span>
          <span className="font-semibold tracking-tight">
            EcoEats <span className="text-gray-400 font-normal">- Livreur</span>
          </span>
        </a>

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
    </header>
  );
}

function AvailabilityToggle({ available, setAvailable }) {
  return (
    <Card className="p-4 flex items-center justify-between">
      <div>
        <p className="font-medium">{available ? 'Vous etes disponible' : 'Vous etes indisponible'}</p>
        <p className="text-sm text-gray-500 mt-0.5">
          {available
            ? 'Vous recevez les propositions de livraison.'
            : 'Activez pour commencer a livrer.'}
        </p>
      </div>
      <button
        role="switch"
        aria-checked={available}
        onClick={() => setAvailable(!available)}
        className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
          available ? 'bg-brand' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow transition-transform ${
            available ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </Card>
  );
}

function DeliveryCard({ delivery, onAccept, onRefuse }) {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">{delivery.restaurant}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {delivery.pickup} - {delivery.drop}
          </p>
        </div>
        <Badge variant="soft">{delivery.distance}</Badge>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div>
          <p className="text-gray-500">Gains</p>
          <p className="font-semibold text-base mt-0.5">{delivery.earnings.toFixed(2)} EUR</p>
        </div>
        <div>
          <p className="text-gray-500">Trajet</p>
          <p className="font-semibold text-base mt-0.5">{delivery.distance}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 pt-1">
        <Button variant="danger" onClick={onRefuse}>
          Refuser
        </Button>
        <Button onClick={onAccept}>Accepter</Button>
      </div>
    </Card>
  );
}

export function DriverPage({ navigate, onLogout }) {
  const [available, setAvailable] = useState(true);
  const [proposals, setProposals] = useState(MOCK.DELIVERIES);
  const [accepted, setAccepted] = useState(0);
  const [earnings, setEarnings] = useState(0);

  function handleAccept(id) {
    const current = proposals.find((proposal) => proposal.id === id);
    if (!current) {
      return;
    }

    setAccepted((value) => value + 1);
    setEarnings((value) => value + current.earnings);
    setProposals((list) => list.filter((proposal) => proposal.id !== id));
  }

  function handleRefuse(id) {
    setProposals((list) => list.filter((proposal) => proposal.id !== id));
  }

  return (
    <div className="min-h-full">
      <DriverHeader navigate={navigate} onLogout={onLogout} />

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        <AvailabilityToggle available={available} setAvailable={setAvailable} />

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <p className="text-sm text-gray-500">Livraisons acceptees</p>
            <p className="text-2xl font-semibold mt-1">{accepted}</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-500">Gains aujourd'hui</p>
            <p className="text-2xl font-semibold mt-1">{earnings.toFixed(2)} EUR</p>
          </Card>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3">Propositions de livraison</h2>

          {!available ? (
            <Card className="p-8 text-center">
              <p className="text-sm text-gray-500">
                Activez votre disponibilite pour recevoir des propositions.
              </p>
            </Card>
          ) : proposals.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-sm text-gray-500">Aucune proposition pour le moment.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {proposals.map((delivery) => (
                <DeliveryCard
                  key={delivery.id}
                  delivery={delivery}
                  onAccept={() => handleAccept(delivery.id)}
                  onRefuse={() => handleRefuse(delivery.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
