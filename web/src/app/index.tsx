import { Routes, Route } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";
import { MainLayout } from "../components";
import { HomePage } from "../pages/HomePage";
import { CataloguePage } from "../pages/CataloguePage";
import { ProfilePage } from "../pages/ProfilePage";
import { CartPage } from "../pages/CartPage";
import { RegisterPage } from "../pages/RegisterPage";
import { LoginPage } from "../pages/LoginPage";
import { AdminTreesPage } from "../pages/AdminTreesPage";
import { TreeDetailPage } from "../pages/TreeDetailPage";
import { ScrollToTop } from "../components/shared/ScrollToTop";
import { RouteAnnouncer } from "../components/shared/RouteAnnouncer";
import { NotFoundPage } from "../pages/NotFoundPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderConfirmationPage } from "../pages/OrderConfirmationPage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { AdminRoute } from "../features/auth/AdminRoute";

export default function App() {
  usePageTitle();

  return (
    <>
      <ScrollToTop />
      <RouteAnnouncer />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/catalog" element={<CataloguePage />} />
          <Route path="/catalog/:id" element={<TreeDetailPage />} />
          <Route
            path="/profil"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <ProtectedRoute>
                <OrderConfirmationPage />
              </ProtectedRoute>
            }
          />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin/trees"
            element={
              <AdminRoute>
                <AdminTreesPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </>
  );
}
