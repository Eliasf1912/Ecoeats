# 🌿 EcoEats — Backend Documentation

> Alternative éthique à UberEats/Deliveroo — Clean Architecture + DDD en TypeScript

---

## 📋 Table des matières

- [Contexte](#contexte)
- [Architecture](#architecture)
- [Entités du domaine](#entités-du-domaine)
- [Workflow complet](#workflow-complet)
- [Use Cases](#use-cases)
- [Règles métier importantes](#règles-métier-importantes)
- [Structure des fichiers](#structure-des-fichiers)

---

## Contexte

EcoEats est une plateforme de livraison de repas qui se différencie par :

- Une **transparence totale des revenus** — aucune commission prélevée sur les livreurs
- Une **optimisation écologique des trajets** — calcul de distance à vol d'oiseau (formule Haversine)
- Une **éthique** au cœur du modèle

**Trois acteurs :**
- **Client** — parcourt les menus, commande, paie
- **Restaurateur** — gère son menu et ses commandes
- **Livreur** — reçoit et effectue les livraisons

---

## Architecture

Le projet suit la **Clean Architecture** de Robert C. Martin avec le **DDD (Domain Driven Design)**.

```
src/
├── domain/                  ← Cœur métier (ne dépend de rien)
│   ├── entities/            ← Cart, Order, Delivery, DeliveryMan, MenuItem, Restaurant
│   ├── enums/               ← orderStatus, deliveryStatus, deliveryManExperience...
│   ├── value-objects/       ← address
│   ├── services/            ← DistanceService
│   └── constants/           ← SERVICE_FEE, DELIVERY_BASE_FEE, DELIVERY_PRICE_PER_KM
│
├── application/             ← Use cases + DTOs (dépend uniquement du domain)
│   ├── use-cases/
│   │   ├── cart/
│   │   ├── order/
│   │   ├── delivery/
│   │   ├── deliveryMan/
│   │   └── menuItem/
│   ├── ports/               ← Interfaces des repositories
│   └── dto/                 ← CreateMenuItemDTO, UpdateMenuItemDTO, OrderPreviewDTO...
│
├── infrastructure/          ← Implémentations concrètes (DB, frameworks)
│   ├── repositories/
│   │   ├── in-memory/
│   │   └── sql/
│   └── http/
│       ├── express/
│       └── nestjs/
│
└── interface/               ← Controllers, Routes
```

### Règle de dépendance

```
Domain ← Application ← Interface ← Infrastructure
```

Le Domain ne dépend de **rien**. Chaque couche ne dépend que de la couche intérieure.

---

## Entités du domaine

### 🛒 Cart (classe)

Panier d'un client. Règle critique : **un seul restaurant par panier**.

| Propriété | Type | Description |
|---|---|---|
| id | string (readonly) | Identifiant unique |
| clientId | string (readonly) | Client propriétaire |
| restaurantId | string \| null | Restaurant associé |
| items | cartItem[] | Produits dans le panier |

**Méthodes :** `addItem()`, `removeItem()`, `clear()`, `isEmpty()`, `isItemIn()`

---

### 📦 Order (classe)

Snapshot d'une commande dans le temps. Une fois créée, elle ne dépend plus de MenuItem.

| Propriété | Type | Description |
|---|---|---|
| id | string (readonly) | Identifiant unique |
| clientId | string (readonly) | Client |
| restaurantId | string (readonly) | Restaurant |
| status | orderStatus | Statut courant |
| items | orderItem[] (readonly) | Snapshot des produits |
| totalPrice | number (readonly) | Prix des plats |
| deliveryFee | number (readonly) | Frais de livraison |
| serviceFee | number (readonly) | Frais de service (5%) |
| paidAt | Date \| null | Date de paiement |

**Méthodes :** `acceptOrder()`, `refuseOrder()`, `cancelOrder()`, `prepareOrder()`, `markOrderAsReady()`, `markAsDelivered()`

---

### 🚚 Delivery (classe)

Représente une livraison entre un restaurant et un client.

| Propriété | Type | Description |
|---|---|---|
| id | string (readonly) | Identifiant unique |
| orderId | string (readonly) | Commande associée |
| distance | number (readonly) | Distance en km |
| deliveryStatus | deliveryStatus | Statut courant |
| deliveryManId | string \| null | Livreur assigné |
| earnings | number \| null | Gains du livreur |

**Méthodes :** `markAsPickedUp()`, `markAsDelivered()`, `markAsProposed()`, `assignDeliveryMan()`, `refuseDelivery()`, `calculateEarnings()`

---

### 🧑‍🦺 DeliveryMan (classe)

Livreur avec ses règles de capacité.

**Méthodes :** `isAvailable()`, `isExpert()`, `canTakeDelivery()`, `addDelivery()`, `removeDelivery()`, `hasDelivery()`, `addEarnings()`, `toggleState()`

**Règle :** livreur normal → 1 livraison max / livreur EXPERT → 2 livraisons max (même restaurant)

---

### 🍔 MenuItem (classe)

Plat d'un restaurant.

**Méthodes :** `update()`, `getName()`, `getPrice()`, `getStock()`, `getRestaurantId()`

---

### 🏪 Restaurant (classe)

Restaurant partenaire.

**Méthodes :** `isOpen()`, `getAddress()`, `getRestaurantId()`, `getRestaurantName()`

---

## Workflow complet

```
1.  AddItemToCart          → Client ajoute des produits au panier
        ↓
2.  PreviewOrder           → Client voit le récapitulatif (prix, frais, distance)
        ↓
3.  CreateOrder            → Client confirme + paie → commande créée (paidAt = now)
        ↓
4.  AcceptOrder            → Restaurateur accepte + définit le temps de préparation
        ↓
5.  StartPreparingOrder    → Restaurateur commence la préparation
        ↓
6.  MarkOrderAsReady       → Commande prête
        ↓
7.  AssignDelivery         → Système crée une livraison (statut PENDING)
        ↓
8.  ProposeDelivery        → Livraison proposée à un livreur (statut PROPOSED)
        ↓
9.  AcceptDelivery         → Livreur accepte (statut ASSIGNED)
     ou RefuseDelivery     → Livreur refuse (retour à PENDING)
        ↓
10. PickupDelivery         → Livreur récupère la commande (statut PICKED_UP)
        ↓
11. CompleteDelivery       → Livraison terminée + calcul des earnings (avec tip optionnel)
        ↓
12. PayDeliveryMan         → Earnings versés au wallet du livreur
        ↓
13. GenerateInvoice        → Facture générée pour le client
```

---

## Use Cases

### 🛒 Cart

| Use Case | Description |
|---|---|
| `AddItemToCart` | Ajoute un produit au panier (crée le panier si inexistant) |
| `RemoveItemFromCart` | Retire un produit du panier |
| `ClearCart` | Vide le panier |

### 📦 Order

| Use Case | Description |
|---|---|
| `PreviewOrder` | Calcule les prix sans créer la commande |
| `CreateOrder` | Crée la commande + paiement simulé |
| `AcceptOrder` | Restaurateur accepte la commande |
| `RefuseOrder` | Restaurateur refuse la commande |
| `CancelOrder` | Client annule la commande (si CREATED ou ACCEPTED) |
| `StartPreparingOrder` | Restaurateur commence la préparation |
| `MarkOrderAsReady` | Commande prête à être récupérée |
| `GenerateInvoice` | Génère la facture client |

### 🚚 Delivery

| Use Case | Description |
|---|---|
| `AssignDelivery` | Crée une livraison en PENDING |
| `ProposeDelivery` | Propose la livraison à un livreur |
| `AcceptDelivery` | Livreur accepte la livraison |
| `RefuseDelivery` | Livreur refuse (retour à PENDING) |
| `PickupDelivery` | Livreur récupère la commande |
| `CompleteDelivery` | Livraison complétée + calcul earnings |
| `PayDeliveryMan` | Virement au wallet du livreur |

### 🧑‍🦺 DeliveryMan

| Use Case | Description |
|---|---|
| `UpdateDeliveryManState` | Bascule AVAILABLE / UNAVAILABLE |

### 🍔 MenuItem

| Use Case | Description |
|---|---|
| `CreateMenuItem` | Crée un plat (nom unique par restaurant) |
| `UpdateMenuItem` | Modifie un plat |
| `DeleteMenuItem` | Supprime un plat |
| `GetMenuItem` | Récupère un plat |

---

## Règles métier importantes

### Cart
- Un panier ne peut contenir que des produits **d'un seul restaurant**
- Si un produit d'un autre restaurant est ajouté → erreur

### Order
- Une commande est un **snapshot dans le temps** — elle ne dépend plus de MenuItem après création
- Le prix est figé au moment de la commande via `unitPrice`
- Un client ne peut annuler que si la commande est `CREATED` ou `ACCEPTED`

### Delivery
- Statuts dans l'ordre : `PENDING` → `PROPOSED` → `ASSIGNED` → `PICKED_UP` → `DELIVERED`
- Une livraison `PROPOSED` est réservée à un livreur spécifique
- Si refusée → retour à `PENDING` et proposée à quelqu'un d'autre

### DeliveryMan
- Livreur normal → **1 livraison max** simultanée
- Livreur EXPERT → **2 livraisons max** simultanées
- Impossible de passer `UNAVAILABLE` avec des livraisons en cours
- **Aucune commission** prélevée sur les earnings

### Earnings
```
earnings = prise en charge (fixe) + (distance km × prix/km) + tip (optionnel)
```

### Distance
Calculée à vol d'oiseau avec la **formule Haversine** via `DistanceService`.

---

## Structure des fichiers

### Ports (interfaces des repositories)

```typescript
cartRepository        → findByClientId, findById, save
orderRepository       → findById, save
menuItemRepository    → findById, findByIds, findByRestaurantId, save, delete
restaurantRepository  → findById
deliveryRepository    → findById, save
deliveryManRepository → findById, save
```

### DTOs (Application layer)

```typescript
CreateMenuItemDTO   → restaurantId, name, description, price, stock, allergens
UpdateMenuItemDTO   → name?, description?, price?, stock?, allergens? (tous optionnels)
OrderPreviewDTO     → totalPrice, deliveryFee, serviceFee, finalPrice, items[], estimatedDeliveryDistance
InvoiceDTO          → orderId, clientId, restaurantName, items[], totalPrice, deliveryFee, serviceFee, finalPrice, paidAt
```

### Constantes

```typescript
SERVICE_FEE           → taux des frais de service (%)
DELIVERY_BASE_FEE     → montant fixe de prise en charge livreur (€)
DELIVERY_PRICE_PER_KM → prix par km pour le livreur (€/km)
```

---

> **Note pour le classmate** : La prochaine étape est l'implémentation des repositories in-memory, puis SQL, puis l'exposition via Express et NestJS. Le domain et les use cases sont complets et ne changeront pas — seule l'infrastructure évolue.
