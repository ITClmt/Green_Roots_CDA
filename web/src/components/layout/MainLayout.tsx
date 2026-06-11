import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-secondary font-sans flex flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:text-sm focus:font-medium focus:outline-none"
      >
        Passer au contenu principal
      </a>
      <div className="max-w-[1440px] mx-auto w-full">
        <Header />
      </div>
      <main id="main-content" className="flex-1 flex flex-col" tabIndex={-1}>
        <Outlet />
      </main>
      <div className="max-w-[1440px] mx-auto w-full">
        <Footer />
      </div>
    </div>
  );
}
