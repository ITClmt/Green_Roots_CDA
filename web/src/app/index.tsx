import { Routes, Route } from "react-router";
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
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";

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
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/catalog" element={<CataloguePage />} />
      <Route path="/profil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
