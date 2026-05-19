/**
 * Données retournées par GET /api/users/:id
 * `treesPlanted` est un agrégat calculé côté back (SUM order_item.quantity pour les commandes payées)
 */
export interface UserProfile {
  id: string;
  firstName: string; // User.first_name
  lastName: string;  // User.last_name
  treesPlanted: number;
}

/**
 * Table Badge à créer en BDD (gamification — non encore définie dans le dictionnaire).
 * `variant` est un indicateur UI ; la future table devra exposer un champ équivalent
 * (ex: `color` ou `type`) pour que le front puisse choisir le style de la carte.
 */
export interface BadgeData {
  id: string;
  name: string;
  description: string;
  variant: 'green' | 'brown'; // UI only — à mapper depuis un futur champ BDD
}

/**
 * Données retournées par GET /api/users/:id/orders
 * Résultat d'une jointure Order → Order_item → Tree
 * `iconVariant` est un choix purement UI, non persisté en BDD.
 */
export interface OrderData {
  id: string;          // Order.id
  name: string;        // Tree.name (via Order_item)
  quantity: number;    // Order_item.quantity
  createdAt: string;   // Order.created_at
  location: string;    // Tree.location
  iconVariant: 'pine' | 'sprout' | 'leaf'; // UI only
}
