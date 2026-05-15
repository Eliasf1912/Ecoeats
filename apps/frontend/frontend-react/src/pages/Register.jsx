import React, { useState } from 'react';
import { Button, Card, Icon, Input } from '../components/ui';
import { register } from '../features/auth/authApi';
import { setSession } from '../features/auth/authSession';

const ROLES = [
  { id: 'client', label: 'Client' },
  { id: 'owner', label: 'Restaurateur' },
  { id: 'driver', label: 'Livreur' },
];

const TRANSPORT_OPTIONS = [
  { id: 'bike', label: 'Vélo' },
  { id: 'scooter', label: 'Scooter' },
  { id: 'car', label: 'Voiture' },

];

function initialFormFor(role) {
  if (role === 'client') {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
    };
  }
  if (role === 'owner') {
    return {
      restaurantName: '',
      description: '',
      email: '',
      password: '',
      ownerName: '',
      phone: '',
      street: '',
      city: '',
      postalCode: '',
      country: 'France',
    };
  }
  return {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    transport: 'bike',
  };
}

function validate(role, form) {
  const errs = {};
  const requireEmail = (v) => v.includes('@') && v.includes('.');

  if (!form.email || !requireEmail(form.email)) errs.email = 'Email invalide.';
  if (!form.password || form.password.length < 6) errs.password = 'Au moins 6 caractères.';

  if (role === 'client') {
    if (!form.firstName.trim()) errs.firstName = 'Requis.';
    if (!form.lastName.trim()) errs.lastName = 'Requis.';
    if (form.password !== form.confirm) errs.confirm = 'Les mots de passe ne correspondent pas.';
    if (!form.street.trim()) errs.street = 'Requis.';
    if (!form.city.trim()) errs.city = 'Requis.';
    if (!form.postalCode.trim()) errs.postalCode = 'Requis.';
  }
  if (role === 'owner') {
    if (!form.restaurantName.trim()) errs.restaurantName = 'Requis.';
    if (!form.ownerName.trim()) errs.ownerName = 'Requis.';
    if (!form.phone.trim()) errs.phone = 'Requis.';
    if (!form.street.trim()) errs.street = 'Requis.';
    if (!form.city.trim()) errs.city = 'Requis.';
    if (!form.postalCode.trim()) errs.postalCode = 'Requis.';
  }
  if (role === 'driver') {
    if (!form.firstName.trim()) errs.firstName = 'Requis.';
    if (!form.lastName.trim()) errs.lastName = 'Requis.';
    if (!form.phone.trim()) errs.phone = 'Requis.';
  }
  return errs;
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base text-ink focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function AddressFields({ form, errors, set }) {
  return (
    <div className="space-y-3">
      <span className="block text-sm font-semibold text-ink">Adresse</span>
      <Input
        label="Rue"
        value={form.street}
        onChange={(e) => set('street', e.target.value)}
        placeholder="12 rue Saint-Antoine"
        error={errors.street}
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Code postal"
          value={form.postalCode}
          onChange={(e) => set('postalCode', e.target.value)}
          placeholder="69001"
          error={errors.postalCode}
        />
        <Input
          label="Ville"
          value={form.city}
          onChange={(e) => set('city', e.target.value)}
          placeholder="Lyon"
          error={errors.city}
        />
      </div>
      <Input label="Pays" value={form.country} onChange={(e) => set('country', e.target.value)} />
    </div>
  );
}

function ClientFields({ form, errors, set }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Prénom" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} error={errors.firstName} placeholder="Marie" />
        <Input label="Nom" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} error={errors.lastName} placeholder="Lefèvre" />
      </div>
      <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} placeholder="vous@exemple.fr" />
      <Input label="Mot de passe" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} error={errors.password} placeholder="••••••••" />
      <Input label="Confirmer le mot de passe" type="password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} error={errors.confirm} placeholder="••••••••" />
      <AddressFields form={form} errors={errors} set={set} />
    </>
  );
}

function OwnerFields({ form, errors, set }) {
  return (
    <>
      <Input label="Nom du restaurant" value={form.restaurantName} onChange={(e) => set('restaurantName', e.target.value)} error={errors.restaurantName} placeholder="Le Jardin Vert" />

      <label className="block">
        <span className="block text-sm font-medium text-ink mb-1.5">Description</span>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={3}
          placeholder="Cuisine végétarienne locale et de saison…"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-base text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent resize-none"
        />
      </label>

      <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} placeholder="contact@restaurant.fr" />
      <Input label="Mot de passe" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} error={errors.password} placeholder="••••••••" />

      <div className="grid grid-cols-2 gap-3">
        <Input label="Propriétaire" value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)} error={errors.ownerName} placeholder="Anne Martin" />
        <Input label="Téléphone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} placeholder="06 12 34 56 78" />
      </div>

      <AddressFields form={form} errors={errors} set={set} />
    </>
  );
}

function DriverFields({ form, errors, set }) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Prénom" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} error={errors.firstName} placeholder="Karim" />
        <Input label="Nom" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} error={errors.lastName} placeholder="Bensalem" />
      </div>
      <Input label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} error={errors.email} placeholder="vous@exemple.fr" />
      <Input label="Mot de passe" type="password" value={form.password} onChange={(e) => set('password', e.target.value)} error={errors.password} placeholder="••••••••" />
      <Input label="Téléphone" type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} error={errors.phone} placeholder="06 12 34 56 78" />
      <Select label="Type de transport" value={form.transport} onChange={(e) => set('transport', e.target.value)} options={TRANSPORT_OPTIONS} />
    </>
  );
}

export function Register({ navigate }) {
  const [role, setRole] = useState('client');
  const [form, setFormState] = useState(() => initialFormFor('client'));
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function changeRole(next) {
    setRole(next);
    setFormState(initialFormFor(next));
    setErrors({});
  }

  function set(key, value) {
    setFormState((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate(role, form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitted(true);
    setTimeout(() => {
      const dest = { client: '/restaurants', driver: '/driver', owner: '/owner' }[role];
      navigate(dest);
    }, 1200);
  }

  return (
    <div className="min-h-full flex items-center justify-center px-4 py-10 bg-surface">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="w-9 h-9 rounded-lg bg-brand text-white flex items-center justify-center">
            <Icon name="leaf" className="w-5 h-5" />
          </span>
          <span className="text-xl font-semibold tracking-tight">EcoEats</span>
        </div>

        <Card className="p-6">
          <h1 className="text-xl font-semibold mb-1">Créer un compte</h1>
          <p className="text-sm text-gray-500 mb-5">Rejoignez EcoEats en quelques secondes.</p>

          <div className="mb-5">
            <span className="block text-sm font-medium text-ink mb-1.5">Je m'inscris en tant que</span>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => changeRole(opt.id)}
                  className={`text-sm py-2 rounded-lg border transition-colors whitespace-nowrap ${
                    role === opt.id
                      ? 'border-brand bg-brand-light text-brand-dark font-medium'
                      : 'border-gray-200 bg-white text-ink hover:bg-surface'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {role === 'client' && <ClientFields form={form} errors={errors} set={set} />}
            {role === 'owner' && <OwnerFields form={form} errors={errors} set={set} />}
            {role === 'driver' && <DriverFields form={form} errors={errors} set={set} />}

            <Button type="submit" size="lg" className="w-full" disabled={submitted}>
              {submitted ? (
                <>
                  <Icon name="check" className="w-5 h-5 mr-2" /> Compte créé
                </>
              ) : (
                "S'inscrire"
              )}
            </Button>
          </form>

          <p className="text-sm text-gray-500 text-center mt-6">
            Déjà inscrit ?{' '}
            <button type="button" onClick={() => navigate('/')} className="text-brand-dark font-medium hover:underline">
              Se connecter
            </button>
          </p>
        </Card>
      </div>
    </div>
  );
}

export default Register;
