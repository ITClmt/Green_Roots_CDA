import { useState } from 'react';
import { CatalogueCard, type TreeItem } from './CatalogueCard';
import treeMahogany from '../../assets/tree_mahogany.png';
import treeBaobab from '../../assets/tree_baobab.png';
import treeMangrove from '../../assets/tree_mangrove.png';

/* ── static data ── */
const ALL_TREES: TreeItem[] = [
  {
    id: 'mahogany-1',
    name: 'Swietenia Macrophylla',
    commonName: 'Big-leaf Mahogany',
    region: 'amazonia',
    country: 'Amazon Basin, Brésil',
    co2PerYear: 25,
    price: 12.5,
    image: treeMahogany,
    tag: 'amazonia',
  },
  {
    id: 'baobab-1',
    name: 'Adansonia Digitata',
    commonName: 'African Baobab',
    region: 'sahel',
    country: 'Sahel Region, Sénégal',
    co2PerYear: 40,
    price: 18.0,
    image: treeBaobab,
    tag: 'sahel',
  },
  {
    id: 'mangrove-1',
    name: 'Rhizophora Mangle',
    commonName: 'Red Mangrove',
    region: 'madagascar',
    country: 'Coastal Madagascar',
    co2PerYear: 12,
    price: 8.5,
    image: treeMangrove,
    tag: 'madagascar',
    isBigImpact: true,
  },
  {
    id: 'mahogany-2',
    name: 'Swietenia Macrophylla',
    commonName: 'Big-leaf Mahogany',
    region: 'amazonia',
    country: 'Amazon Basin, Brésil',
    co2PerYear: 25,
    price: 12.5,
    image: treeMahogany,
    tag: 'amazonia',
  },
  {
    id: 'baobab-2',
    name: 'Adansonia Digitata',
    commonName: 'African Baobab',
    region: 'sahel',
    country: 'Sahel Region, Sénégal',
    co2PerYear: 40,
    price: 18.0,
    image: treeBaobab,
    tag: 'sahel',
  },
  {
    id: 'mangrove-2',
    name: 'Rhizophora Mangle',
    commonName: 'Red Mangrove',
    region: 'madagascar',
    country: 'Coastal Madagascar',
    co2PerYear: 12,
    price: 8.5,
    image: treeMangrove,
    tag: 'madagascar',
    isBigImpact: true,
  },
  {
    id: 'mahogany-3',
    name: 'Swietenia Macrophylla',
    commonName: 'Big-leaf Mahogany',
    region: 'amazonia',
    country: 'Amazon Basin, Brésil',
    co2PerYear: 25,
    price: 12.5,
    image: treeMahogany,
    tag: 'amazonia',
  },
  {
    id: 'baobab-3',
    name: 'Adansonia Digitata',
    commonName: 'African Baobab',
    region: 'sahel',
    country: 'Sahel Region, Sénégal',
    co2PerYear: 40,
    price: 18.0,
    image: treeBaobab,
    tag: 'sahel',
  },
  {
    id: 'mangrove-3',
    name: 'Rhizophora Mangle',
    commonName: 'Red Mangrove',
    region: 'madagascar',
    country: 'Coastal Madagascar',
    co2PerYear: 12,
    price: 8.5,
    image: treeMangrove,
    tag: 'madagascar',
    isBigImpact: true,
  },
  {
    id: 'mangrove-3',
    name: 'Rhizophora Mangle',
    commonName: 'Red Mangrove',
    region: 'madagascar',
    country: 'Coastal Madagascar',
    co2PerYear: 12,
    price: 8.5,
    image: treeMangrove,
    tag: 'madagascar',
    isBigImpact: true,
  },
];

const PAGE_SIZE = 9;

interface CatalogueGridProps {
  searchQuery: string;
  activeTag: string;
}

export function CatalogueGrid({ searchQuery, activeTag }: CatalogueGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  /* Filter trees */
  const filtered = ALL_TREES.filter((tree) => {
    const matchesTag = activeTag === 'all' || tree.tag === activeTag;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      tree.name.toLowerCase().includes(q) ||
      tree.commonName.toLowerCase().includes(q) ||
      tree.country.toLowerCase().includes(q);
    return matchesTag && matchesSearch;
  });

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <section id="catalogue-grid">
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          Aucun arbre ne correspond à votre recherche.
        </div>
      ) : (
        <>
          <div
            className="
              grid gap-5
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {visible.map((tree) => (
              <CatalogueCard key={tree.id} tree={tree} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-10 flex justify-center">
              <button
                id="load-more-btn"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="
                  px-8 py-3.5
                  bg-[#134d37] hover:bg-[#0f3d2b]
                  text-white text-sm font-semibold
                  rounded-full shadow-md
                  transition-all duration-200
                  hover:shadow-lg hover:-translate-y-0.5
                  cursor-pointer
                "
              >
                Charger plus d'arbres
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
