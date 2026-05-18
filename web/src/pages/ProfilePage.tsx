import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#f9faf7] font-sans">
      <div className="max-w-[1440px] mx-auto">
        <Header />
        <main className="px-5 sm:px-10 md:px-16 py-16">
          <h1 className="text-4xl font-bold text-[#1a2f24] mb-4">Profil</h1>
          <p className="text-gray-500">Gérez votre compte et suivez vos arbres plantés.</p>
        </main>
        <Footer />
      </div>
    </div>
  );
}
