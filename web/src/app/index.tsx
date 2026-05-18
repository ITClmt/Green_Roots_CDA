import { Routes, Route } from 'react-router'
import { Header, Hero, Commitment, FeaturedSpecies, Footer } from '../components'
import { CataloguePage } from '../pages/CataloguePage'
import { ProfilePage } from '../pages/ProfilePage'
import { CartPage } from '../pages/CartPage'

function Home() {
  return (
    <div className="min-h-screen bg-[#f9faf7] font-sans">
      {/* Hero is full width */}
      <div className="max-w-[1440px] mx-auto">
        <Header />
      </div>
      <Hero />
      {/* Rest of content is constrained */}
      <div className="max-w-[1440px] mx-auto">
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
      <Route path="/profil" element={<ProfilePage />} />
      <Route path="/cart" element={<CartPage />} />
    </Routes>
  )
}
