import { useState } from 'react';
import { MOCK } from '../components/data/mockData';
import { Badge, Button, Card, Icon, Input } from '../components/ui';

const STATUS_META = {
  CREATED: { label: 'Nouvelle', classes: 'bg-orange-100 text-orange-700' },
  ACCEPTED: { label: 'Acceptee', classes: 'bg-amber-100 text-amber-700' },
  PREPARING: { label: 'En preparation', classes: 'bg-blue-100 text-blue-700' },
  READY: { label: 'Prete', classes: 'bg-green-100 text-green-700' },
  REFUSED: { label: 'Refusee', classes: 'bg-gray-200 text-gray-600' },
};

function OwnerHeader({ navigate, onLogout }) {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#/owner" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center">
            <Icon name="leaf" className="w-4 h-4" />
          </span>
          <span className="font-semibold tracking-tight">
            EcoEats <span className="text-gray-400 font-normal">- Restaurateur</span>
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

function Tabs({ value, onChange, items }) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex gap-1">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`relative px-4 py-3 text-sm font-medium transition-colors ${
              value === item.id ? 'text-brand-dark' : 'text-gray-500 hover:text-ink'
            }`}
          >
            {item.label}
            {item.count != null && <span className="ml-1.5 text-xs text-gray-400">({item.count})</span>}
            {value === item.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand" />}
          </button>
        ))}
      </div>
    </div>
  );
}

function DishRow({ dish, onEdit, onDelete }) {
  const outOfStock = dish.stock === 0;

  return (
    <div className="p-4 flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-medium truncate">{dish.name}</h3>
          {outOfStock && <Badge variant="danger">Rupture</Badge>}
        </div>
        <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{dish.description}</p>
        {dish.allergens.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {dish.allergens.map((allergen) => (
              <span key={allergen} className="text-xs bg-surface text-gray-600 rounded-full px-2 py-0.5">
                {allergen}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="hidden sm:block text-right">
        <p className="text-sm text-gray-500">Prix</p>
        <p className="font-semibold">{dish.price.toFixed(2)} EUR</p>
      </div>
      <div className="hidden sm:block text-right">
        <p className="text-sm text-gray-500">Stock</p>
        <p className={`font-semibold ${outOfStock ? 'text-danger' : ''}`}>{dish.stock}</p>
      </div>

      <div className="flex items-center gap-1">
        <button onClick={onEdit} className="p-2 rounded-lg hover:bg-surface transition-colors text-gray-600" aria-label="Editer">
          <Icon name="edit" className="w-4 h-4" />
        </button>
        <button onClick={onDelete} className="p-2 rounded-lg hover:bg-surface transition-colors text-danger" aria-label="Supprimer">
          <Icon name="trash" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function DishModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    price: initial?.price?.toString() || '',
    stock: initial?.stock?.toString() || '',
    allergens: initial?.allergens?.join(', ') || '',
  });
  const [errors, setErrors] = useState({});

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = 'Le nom est requis.';
    }
    if (!form.price || Number.isNaN(parseFloat(form.price))) {
      nextErrors.price = 'Prix invalide.';
    }
    if (form.stock === '' || Number.isNaN(parseInt(form.stock, 10))) {
      nextErrors.stock = 'Stock invalide.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSave({
      id: initial?.id,
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      allergens: form.allergens
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
    });
  }

  return (
    <div className="fixed inset-0 z-30 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40">
      <div className="bg-white rounded-t-2xl sm:rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="font-semibold text-lg">{isEdit ? 'Modifier le plat' : 'Ajouter un plat'}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface transition-colors" aria-label="Fermer">
            <Icon name="close" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          <Input
            label="Nom"
            value={form.name}
            onChange={(event) => setField('name', event.target.value)}
            placeholder="Ex: Buddha Bowl"
            error={errors.name}
          />

          <label className="block">
            <span className="block text-sm font-medium text-ink mb-1.5">Description</span>
            <textarea
              value={form.description}
              onChange={(event) => setField('description', event.target.value)}
              rows={3}
              placeholder="Decrivez les ingredients principaux"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Prix (EUR)"
              type="number"
              step="0.10"
              min="0"
              value={form.price}
              onChange={(event) => setField('price', event.target.value)}
              placeholder="9.50"
              error={errors.price}
            />
            <Input
              label="Stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={(event) => setField('stock', event.target.value)}
              placeholder="20"
              error={errors.stock}
            />
          </div>

          <Input
            label="Allergenes"
            value={form.allergens}
            onChange={(event) => setField('allergens', event.target.value)}
            placeholder="gluten, lactose"
          />

          <div className="flex gap-2 pt-2">
            <Button variant="secondary" type="button" onClick={onClose} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Enregistrer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.CREATED;
  return <span className={`inline-flex items-center text-xs font-semibold rounded-full px-2.5 py-1 ${meta.classes}`}>{meta.label}</span>;
}

function OrderActions({ order, onUpdateStatus }) {
  switch (order.status) {
    case 'CREATED':
      return (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="danger" onClick={() => onUpdateStatus(order.id, 'REFUSED')}>Refuser</Button>
          <Button onClick={() => onUpdateStatus(order.id, 'ACCEPTED')}>Accepter</Button>
        </div>
      );
    case 'ACCEPTED':
      return <Button className="w-full" onClick={() => onUpdateStatus(order.id, 'PREPARING')}>Commencer la preparation</Button>;
    case 'PREPARING':
      return <Button className="w-full" onClick={() => onUpdateStatus(order.id, 'READY')}>Marquer prete</Button>;
    case 'READY':
      return <p className="text-sm text-gray-500 text-center">En attente du livreur</p>;
    case 'REFUSED':
      return <p className="text-sm text-gray-500 text-center">Commande refusee</p>;
    default:
      return null;
  }
}

function OrdersPanel({ orders, onUpdateStatus }) {
  return (
    <div className="mt-5">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Commandes</h2>
        <p className="text-sm text-gray-500">{orders.filter((order) => order.status !== 'REFUSED').length} commande(s) en cours</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {orders.map((order) => (
          <Card key={order.id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{order.id}</h3>
                  <span className="text-xs text-gray-400">- {order.time}</span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{order.customer}</p>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <ul className="text-sm text-gray-700 space-y-0.5">
              {order.items.map((item, index) => (
                <li key={`${order.id}-${index}`}>{item.qty} x {item.name}</li>
              ))}
            </ul>

            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-500">Total</span>
              <span className="font-semibold">{order.total.toFixed(2)} EUR</span>
            </div>

            <OrderActions order={order} onUpdateStatus={onUpdateStatus} />
          </Card>
        ))}
      </div>
    </div>
  );
}

function DishesPanel({ dishes, onAdd, onEdit, onDelete }) {
  return (
    <div className="mt-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Mes plats</h2>
          <p className="text-sm text-gray-500">{dishes.length} plat(s) au menu</p>
        </div>
        <Button onClick={onAdd}>
          <Icon name="plus" className="w-4 h-4 mr-1" /> Ajouter un plat
        </Button>
      </div>

      {dishes.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-gray-500">Aucun plat. Ajoutez votre premier plat.</p>
        </Card>
      ) : (
        <Card className="divide-y divide-gray-100">
          {dishes.map((dish) => (
            <DishRow key={dish.id} dish={dish} onEdit={() => onEdit(dish)} onDelete={() => onDelete(dish.id)} />
          ))}
        </Card>
      )}
    </div>
  );
}

export function OwnerPage({ navigate, onLogout }) {
  const [tab, setTab] = useState('dishes');
  const [dishes, setDishes] = useState(MOCK.OWNER_DISHES);
  const [orders, setOrders] = useState(MOCK.OWNER_ORDERS);
  const [modal, setModal] = useState(null);

  function handleSaveDish(payload) {
    setDishes((current) => {
      if (payload.id) {
        return current.map((dish) => (dish.id === payload.id ? { ...dish, ...payload } : dish));
      }
      return [...current, { ...payload, id: `p${Date.now()}` }];
    });

    setModal(null);
  }

  function handleDeleteDish(id) {
    setDishes((current) => current.filter((dish) => dish.id !== id));
  }

  function handleUpdateStatus(id, status) {
    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)));
  }

  const activeOrdersCount = orders.filter((order) => order.status !== 'REFUSED').length;

  return (
    <div className="min-h-full">
      <OwnerHeader navigate={navigate} onLogout={onLogout} />

      <main className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-semibold mb-1">Le Jardin Vert</h1>
        <p className="text-sm text-gray-500 mb-5">Tableau de bord restaurateur</p>

        <Tabs
          value={tab}
          onChange={setTab}
          items={[
            { id: 'dishes', label: 'Mes plats', count: dishes.length },
            { id: 'orders', label: 'Commandes', count: activeOrdersCount },
          ]}
        />

        {tab === 'dishes' && (
          <DishesPanel
            dishes={dishes}
            onAdd={() => setModal({ dish: null })}
            onEdit={(dish) => setModal({ dish })}
            onDelete={handleDeleteDish}
          />
        )}

        {tab === 'orders' && <OrdersPanel orders={orders} onUpdateStatus={handleUpdateStatus} />}
      </main>

      {modal && <DishModal initial={modal.dish} onClose={() => setModal(null)} onSave={handleSaveDish} />}
    </div>
  );
}
