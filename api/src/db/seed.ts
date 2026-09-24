import { db } from "./client";
import { badges, trees } from "./schema";

/*
 * Données des arbres
 * ------------------
 * co2    : kg de CO2 stockés par an et par arbre (estimation, voir docs/donnees-arbres.md)
 *          = (P / 400) x FEB x infradensité x (1 + R) x 0,475 x 44/12
 * oxygen : kg d'O2 libérés par an = co2 x 32/44 (stœchiométrie de la photosynthèse)
 * imageUrl : photos Wikimedia Commons converties en WebP (web/public/trees),
 *            crédits dans web/public/trees/CREDITS.md
 * price / stock : valeurs fictives (site de démonstration)
 */
const treesData = [
  {
    name: "Chêne pédonculé",
    species: "Quercus robur",
    description:
      "Grand arbre des plaines et des vallées, le chêne pédonculé se reconnaît à ses glands portés par un long pédoncule. Il vit plusieurs siècles et héberge plus d'espèces d'insectes que presque tout autre arbre d'Europe.",
    location: "Europe, jusqu'au Caucase",
    co2: 24,
    oxygen: 17,
    price: 29.99,
    imageUrl: "/trees/chene-pedoncule.webp",
    stock: 50,
  },
  {
    name: "Érable sycomore",
    species: "Acer pseudoplatanus",
    description:
      "Arbre de montagne vigoureux, l'érable sycomore supporte bien le vent et le froid. Ses graines ailées, les samares, tournoient en tombant et se dispersent loin de l'arbre.",
    location: "Montagnes d'Europe centrale et du Sud",
    co2: 30,
    oxygen: 22,
    price: 24.99,
    imageUrl: "/trees/erable-sycomore.webp",
    stock: 35,
  },
  {
    name: "Hêtre commun",
    species: "Fagus sylvatica",
    description:
      "Essence majeure des forêts françaises, le hêtre a une écorce lisse et grise et un feuillage qui laisse passer très peu de lumière. Ses fruits, les faînes, nourrissent de nombreux oiseaux et mammifères.",
    location: "Europe tempérée",
    co2: 32,
    oxygen: 23,
    price: 34.99,
    imageUrl: "/trees/hetre-commun.webp",
    stock: 20,
  },
  {
    name: "Châtaignier",
    species: "Castanea sativa",
    description:
      "Cultivé depuis l'Antiquité pour ses châtaignes, le châtaignier pousse vite sur les sols acides. Son bois riche en tanins résiste naturellement à l'humidité et sert en charpente comme en piquets.",
    location: "Europe du Sud et Asie Mineure",
    co2: 32,
    oxygen: 23,
    price: 27.5,
    imageUrl: "/trees/chataignier.webp",
    stock: 40,
  },
  {
    name: "Tilleul à grandes feuilles",
    species: "Tilia platyphyllos",
    description:
      "Le tilleul à grandes feuilles fleurit en juin. Ses fleurs très parfumées attirent les abeilles et servent à préparer des infusions. Il est souvent planté sur les places et le long des allées pour son ombre.",
    location: "Europe centrale et du Sud",
    co2: 22,
    oxygen: 16,
    price: 22.0,
    imageUrl: "/trees/tilleul-grandes-feuilles.webp",
    stock: 60,
  },
  {
    name: "Bouleau verruqueux",
    species: "Betula pendula",
    description:
      "Appelé aussi bouleau blanc, il se reconnaît à son écorce blanche et à ses rameaux retombants. Espèce pionnière, il colonise rapidement les terrains nus et prépare le sol pour les autres arbres.",
    location: "Europe et Asie tempérée",
    co2: 22,
    oxygen: 16,
    price: 19.99,
    imageUrl: "/trees/bouleau-verruqueux.webp",
    stock: 75,
  },
  {
    name: "Frêne commun",
    species: "Fraxinus excelsior",
    description:
      "Grand arbre des sols frais et des bords de rivière, le frêne donne un bois à la fois dur et souple, utilisé pour les manches d'outils. Il est aujourd'hui menacé par la chalarose, une maladie causée par un champignon.",
    location: "Europe",
    co2: 33,
    oxygen: 24,
    price: 26.0,
    imageUrl: "/trees/frene-commun.webp",
    stock: 30,
  },
  {
    name: "Orme de montagne",
    species: "Ulmus glabra",
    description:
      "L'orme de montagne a de grandes feuilles rugueuses à la base asymétrique. Il pousse dans les forêts fraîches de moyenne montagne et dans les ravins, et se fait rare depuis l'épidémie de graphiose.",
    location: "Europe, surtout en montagne",
    co2: 26,
    oxygen: 19,
    price: 31.0,
    imageUrl: "/trees/orme-de-montagne.webp",
    stock: 15,
  },
  {
    name: "Pin sylvestre",
    species: "Pinus sylvestris",
    description:
      "Le pin sylvestre se reconnaît au haut de son tronc, de couleur orangée. Très rustique, il supporte le froid, la sécheresse et les sols pauvres. C'est le pin le plus répandu en Europe.",
    location: "Eurasie",
    co2: 19,
    oxygen: 14,
    price: 18.5,
    imageUrl: "/trees/pin-sylvestre.webp",
    stock: 80,
  },
  {
    name: "Sapin pectiné",
    species: "Abies alba",
    description:
      "Le sapin pectiné peut dépasser 50 mètres de haut. On le distingue de l'épicéa par ses aiguilles plates, marquées de deux bandes blanches en dessous, et par ses cônes dressés qui se désagrègent sur la branche.",
    location: "Montagnes d'Europe (Alpes, Jura, Vosges, Pyrénées)",
    co2: 28,
    oxygen: 20,
    price: 23.0,
    imageUrl: "/trees/sapin-pectine.webp",
    stock: 25,
  },
  {
    name: "Merisier",
    species: "Prunus avium",
    description:
      "Ancêtre sauvage des cerisiers cultivés, le merisier se couvre de fleurs blanches au printemps. Ses petites cerises nourrissent les oiseaux et son bois rougeâtre est recherché en ébénisterie.",
    location: "Europe et Asie occidentale",
    co2: 25,
    oxygen: 18,
    price: 32.0,
    imageUrl: "/trees/merisier.webp",
    stock: 28,
  },
  {
    name: "Noyer commun",
    species: "Juglans regia",
    description:
      "Le noyer commun est cultivé pour ses noix et pour son bois, l'un des plus précieux d'Europe. Il a besoin de lumière et d'un sol profond, et pousse souvent isolé en bordure de champ.",
    location: "Des Balkans à l'Asie centrale",
    co2: 22,
    oxygen: 16,
    price: 38.0,
    imageUrl: "/trees/noyer-commun.webp",
    stock: 18,
  },
  {
    name: "Épicéa commun",
    species: "Picea abies",
    description:
      "Le sapin de Noël traditionnel est en réalité un épicéa. Ses aiguilles sont piquantes et ses cônes pendent sous les branches. Il pousse vite en montagne et son bois clair est très utilisé en construction.",
    location: "Europe du Nord et montagnes d'Europe",
    co2: 32,
    oxygen: 23,
    price: 16.99,
    imageUrl: "/trees/epicea-commun.webp",
    stock: 90,
  },
  {
    name: "Aubépine monogyne",
    species: "Crataegus monogyna",
    description:
      "Petit arbre épineux des haies, l'aubépine fleurit en blanc au printemps et porte des baies rouges en automne. Elle offre nourriture et abri à de nombreux oiseaux et insectes pollinisateurs.",
    location: "Europe, Afrique du Nord et Asie occidentale",
    co2: 9,
    oxygen: 7,
    price: 14.5,
    imageUrl: "/trees/aubepine-monogyne.webp",
    stock: 100,
  },
  {
    name: "Charme commun",
    species: "Carpinus betulus",
    description:
      "Le charme a un tronc cannelé et un bois très dur. Taillé, il garde ses feuilles sèches une partie de l'hiver, ce qui en fait une haie champêtre appréciée. En forêt, il accompagne souvent le chêne.",
    location: "Europe tempérée",
    co2: 26,
    oxygen: 19,
    price: 21.0,
    imageUrl: "/trees/charme-commun.webp",
    stock: 55,
  },
];

const badgesData = [
  {
    key: "trees_1",
    name: "Premier Bourgeon",
    description: "Vous avez planté votre premier arbre.",
    variant: "green" as const,
    requirementType: "trees_planted" as const,
    requirementValue: 1,
  },
  {
    key: "trees_5",
    name: "Petit Jardinier",
    description: "5 arbres plantés, la forêt commence à pousser.",
    variant: "green" as const,
    requirementType: "trees_planted" as const,
    requirementValue: 5,
  },
  {
    key: "trees_10",
    name: "Ami de la Forêt",
    description: "10 arbres plantés, vous faites la différence.",
    variant: "green" as const,
    requirementType: "trees_planted" as const,
    requirementValue: 10,
  },
  {
    key: "trees_25",
    name: "Gardien des Arbres",
    description: "25 arbres plantés, un engagement sérieux.",
    variant: "brown" as const,
    requirementType: "trees_planted" as const,
    requirementValue: 25,
  },
  {
    key: "trees_50",
    name: "Défenseur de la Nature",
    description: "50 arbres plantés, la nature vous le rendra.",
    variant: "brown" as const,
    requirementType: "trees_planted" as const,
    requirementValue: 50,
  },
  {
    key: "trees_100",
    name: "Légende Verte",
    description: "100 arbres plantés, un véritable héros du reboisement.",
    variant: "green" as const,
    requirementType: "trees_planted" as const,
    requirementValue: 100,
  },
  {
    key: "co2_100",
    name: "Souffleur Propre",
    description: "100 kg de CO₂ compensés grâce à vos plantations.",
    variant: "green" as const,
    requirementType: "co2_total" as const,
    requirementValue: 100,
  },
  {
    key: "co2_500",
    name: "Champion Climatique",
    description: "500 kg de CO₂ compensés, un impact réel sur le climat.",
    variant: "brown" as const,
    requirementType: "co2_total" as const,
    requirementValue: 500,
  },
  {
    key: "species_3",
    name: "Ami de la Biodiversité",
    description: "3 espèces différentes plantées.",
    variant: "green" as const,
    requirementType: "species_count" as const,
    requirementValue: 3,
  },
  {
    key: "species_5",
    name: "Collectionneur",
    description: "5 espèces différentes plantées, vive la diversité.",
    variant: "brown" as const,
    requirementType: "species_count" as const,
    requirementValue: 5,
  },
];

async function seed() {
  await db.delete(trees);
  await db.insert(trees).values(treesData);
  console.log(`✅ Inserted ${treesData.length} trees!`);

  await db.delete(badges);
  await db.insert(badges).values(badgesData);
  console.log(`✅ Inserted ${badgesData.length} badges!`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
