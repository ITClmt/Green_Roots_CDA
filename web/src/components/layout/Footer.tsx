export function Footer() {
  return (
    <footer className="py-12 px-8 md:px-16 bg-[#f9faf7] text-center border-t border-gray-100">
      <div className="text-xl font-bold text-[#0f5238] mb-6">GreenRoots</div>
      <div className="flex justify-center gap-8 mb-8 text-sm text-[#1a1c19]/50 font-medium">
        <a href="#" className="hover:underline">
          Privacy Policy
        </a>
        <a href="#" className="hover:underline">
          Sustainability Report
        </a>
        <a href="#" className="hover:underline">
          Contact Us
        </a>
      </div>
      <div className="text-xs text-gray-400">
        © 2024 GreenRoots. All rights reserved.
      </div>
    </footer>
  );
}
