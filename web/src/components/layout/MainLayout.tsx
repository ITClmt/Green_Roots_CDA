import { Outlet } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function MainLayout() {
  return (
    <div className="min-h-screen bg-surface-secondary font-sans flex flex-col">
      <div className="max-w-[1440px] mx-auto w-full">
        <Header />
      </div>
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <div className="max-w-[1440px] mx-auto w-full">
        <Footer />
      </div>
    </div>
  );
}
