import { Routes, Route } from "react-router";
import { usePageTitle } from "../hooks/usePageTitle";
import {
  Header,
  Hero,
  Commitment,
  FeaturedSpecies,
  Footer,
} from "../components";
import { CataloguePage } from "../pages/CataloguePage";
import { ProfilePage } from "../pages/ProfilePage";
import { CartPage } from "../pages/CartPage";
import { RegisterPage } from "../pages/RegisterPage";
import { LoginPage } from "../pages/LoginPage";
import { AdminTreesPage } from "../pages/AdminTreesPage";
import { TreeDetailPage } from "../pages/TreeDetailPage";
import { ScrollToTop } from "../components/shared/ScrollToTop";
import { NotFoundPage } from "../pages/NotFoundPage";
import { CheckoutPage } from "../pages/CheckoutPage";
import { OrderConfirmationPage } from "../pages/OrderConfirmationPage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { AdminRoute } from "../features/auth/AdminRoute";

function Home() {
  return (
    <div className="min-h-screen bg-[#f9faf7] font-sans">
      {/* Hero is full width */}
      <div className="max-w-360 mx-auto">
        <Header />
      </div>
      <Hero />
      {/* Rest of content is constrained */}
      <div className="max-w-360 mx-auto">
        <main>
          <Commitment />
          <FeaturedSpecies />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default function App() {
  usePageTitle();

  return (
    <>
      <ScrollToTop />
      <Routes>
      <Route index element={<Home />} />
      <Route path="/catalog" element={<CataloguePage />} />
      <Route path="/catalog/:id" element={<TreeDetailPage />} />
      <Route path="/profil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/order-confirmation" element={<ProtectedRoute><OrderConfirmationPage /></ProtectedRoute>} />
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
    </Routes>
    </>
  );
}
