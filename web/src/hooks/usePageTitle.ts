import { useEffect } from "react";
import { useLocation } from "react-router";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Accueil",
  "/catalog": "Catalogue",
  "/profil": "Mon Profil",
  "/cart": "Mon Panier",
  "/checkout": "Validation de la commande",
  "/order-confirmation": "Commande confirmée",
  "/login": "Connexion",
  "/register": "Inscription",
};

const APP_NAME = "GreenRoots";

export function usePageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const staticTitle = ROUTE_TITLES[pathname];
    // Handle dynamic routes like /catalog/:id
    const dynamicTitle = !staticTitle && pathname.startsWith('/catalog/')
      ? 'Détail de l\'arbre'
      : null;
    const pageTitle = staticTitle ?? dynamicTitle ?? 'Page';
    document.title = `${pageTitle} — ${APP_NAME}`;
  }, [pathname]);
}
