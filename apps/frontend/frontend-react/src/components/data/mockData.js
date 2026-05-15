export const MOCK = {
  RESTAURANTS: [
    { id: 'r1', name: 'Le Jardin Vert', type: 'Cuisine vegetale', rating: 4.8, distance: '1.2 km', eta: '20-25 min' },
    { id: 'r2', name: 'Green Noodles', type: 'Asiatique', rating: 4.6, distance: '2.1 km', eta: '25-30 min' },
    { id: 'r3', name: 'Pita & Co', type: 'Mediterraneen', rating: 4.7, distance: '0.9 km', eta: '15-20 min' },
  ],
  MENUS: {
    r1: [
      { id: 'm1', name: 'Buddha Bowl', description: 'Quinoa, pois chiches, avocat, legumes rotis.', price: 11.9 },
      { id: 'm2', name: 'Curry Doux', description: 'Lait de coco, legumes de saison, riz basmati.', price: 12.5 },
      { id: 'm3', name: 'Salade Proteinee', description: 'Lentilles, grenade, feta, herbes fraiches.', price: 10.9 },
    ],
    r2: [
      { id: 'm1', name: 'Ramen Miso Veggie', description: 'Bouillon miso, tofu grille, nouilles, champignons.', price: 13.4 },
      { id: 'm2', name: 'Gyozas Legumes', description: '6 pieces, sauce soja sesame.', price: 6.8 },
      { id: 'm3', name: 'Wok Udon', description: 'Nouilles udon sautees et legumes croquants.', price: 12.2 },
    ],
    r3: [
      { id: 'm1', name: 'Falafel Bowl', description: 'Falafels, houmous, crudites, boulgour.', price: 10.5 },
      { id: 'm2', name: 'Pita Halloumi', description: 'Pain pita, halloumi grille, sauce yaourt menthe.', price: 9.9 },
      { id: 'm3', name: 'Taboule Maison', description: 'Persil frais, menthe, citron, semoule fine.', price: 7.4 },
    ],
  },
  DELIVERIES: [
    {
      id: 'd1',
      restaurant: 'Le Jardin Vert',
      pickup: '12 rue Saint-Denis',
      drop: '5 avenue de la Gare',
      distance: '2.4 km',
      earnings: 6.5,
    },
    {
      id: 'd2',
      restaurant: 'Green Noodles',
      pickup: '21 quai du Port',
      drop: '48 rue Victor Hugo',
      distance: '3.1 km',
      earnings: 8.2,
    },
  ],
  OWNER_DISHES: [
    {
      id: 'p1',
      name: 'Buddha Bowl',
      description: 'Bowl complet, legumes rôtis, houmous, graines.',
      price: 11.9,
      stock: 12,
      allergens: ['sesame'],
    },
    {
      id: 'p2',
      name: 'Poke Tofu',
      description: 'Riz vinaigre, tofu marine, concombre, avocat.',
      price: 12.8,
      stock: 0,
      allergens: ['soja'],
    },
  ],
  OWNER_ORDERS: [
    {
      id: '#1042',
      time: '12:14',
      customer: 'Marie L.',
      items: [
        { qty: 1, name: 'Buddha Bowl' },
        { qty: 1, name: 'Taboule Maison' },
      ],
      total: 19.3,
      status: 'CREATED',
    },
    {
      id: '#1041',
      time: '12:02',
      customer: 'Karim A.',
      items: [{ qty: 2, name: 'Curry Doux' }],
      total: 25,
      status: 'PREPARING',
    },
  ],
};
