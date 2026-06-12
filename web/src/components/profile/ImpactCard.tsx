import { Leaf } from "lucide-react";

interface ImpactCardProps {
  treesPlanted: number;
  isLoading: boolean;
}

export function ImpactCard({ treesPlanted, isLoading }: ImpactCardProps) {
  return (
    <div className="rounded-2xl bg-primary text-white p-6">
      <div className="flex items-center gap-1.5 mb-5">
        <Leaf size={13} className="text-white/70" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/70">
          Impact dans le monde
        </span>
      </div>
      <p className="text-5xl font-bold leading-none text-white">
        {isLoading ? "..." : treesPlanted} arbres
      </p>
      <p className="text-sm text-white/65 leading-relaxed mt-3">
        plantés dans le cadre de projets mondiaux de reboisement.
      </p>
    </div>
  );
}
