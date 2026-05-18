export function Hero() {
  return (
    <section className="relative w-full h-[80vh] min-h-[400px] max-h-[700px] flex items-end pb-12 sm:items-center sm:pb-0 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/hero-img.png)" }}
      ></div>
      {/* Dark overlay */}
      <div className="absolute inset-0 z-0 bg-black/40"></div>

      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-10 md:px-16">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight mb-4 sm:mb-6">
            Plantez pour
            <br />
            l'avenir
          </h1>
          <p className="text-base sm:text-lg text-gray-100 mb-6 sm:mb-8 max-w-sm sm:max-w-md">
            Rejoignez Green Roots. Plantez de vrais arbres, restaurez la
            biodiversité et laissez une empreinte durable sur la planète, arbre
            par arbre.
          </p>
          <button className="bg-[#0f5238] cursor-pointer hover:bg-[#0f3d2c] text-white px-6 sm:px-8 py-3 rounded-full font-medium transition-colors shadow-lg shadow-[#134d37]/20">
            Voir les arbres
          </button>
        </div>
      </div>
    </section>
  );
}
