import { Hero, Commitment, FeaturedSpecies } from "../components";

export function HomePage() {
  return (
    <>
      <Hero />
      <div className="max-w-360 mx-auto w-full">
        <main>
          <Commitment />
          <FeaturedSpecies />
        </main>
      </div>
    </>
  );
}
