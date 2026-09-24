/**
 * Télécharge les photos des arbres depuis Wikimedia Commons,
 * les redimensionne (1200 px de large max) et les convertit en WebP
 * dans web/public/trees/. Génère aussi web/public/trees/CREDITS.md.
 *
 * Usage (depuis le dossier api/) :
 *   bun add -d sharp
 *   bun run scripts/fetch-tree-images.ts
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = join(import.meta.dir, "..", "..", "web", "public", "trees");
const MAX_WIDTH = 1200;
const QUALITY = 80;

// Wikimedia limite le débit : pause entre deux images et nouvelles tentatives sur HTTP 429
const DELAY_MS = 3000;
const MAX_RETRIES = 5;

// Wikimedia demande un User-Agent identifiable avec un moyen de contact
const USER_AGENT =
  "GreenRootsSeed/1.0 (https://github.com/ITClmt/Green_Roots_CDA) bun";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Demande une miniature de 1280 px à Wikimedia (déjà en cache chez eux, bien plus
// léger que l'original). Special:FilePath renvoie l'original si l'image est plus petite.
function thumbUrl(originalUrl: string) {
  const fileName = originalUrl.split("/").pop()!;
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${fileName}?width=1280`;
}

async function download(url: string): Promise<Buffer> {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
    if (res.ok) return Buffer.from(await res.arrayBuffer());

    if (res.status === 429 || res.status >= 500) {
      const retryAfter = Number(res.headers.get("retry-after"));
      const wait = retryAfter > 0 ? retryAfter * 1000 : 5000 * attempt;
      console.warn(`   ⏳ HTTP ${res.status}, nouvelle tentative dans ${wait / 1000} s`);
      await sleep(wait);
      continue;
    }
    throw new Error(`HTTP ${res.status}`);
  }
  throw new Error(`échec après ${MAX_RETRIES} tentatives`);
}

type TreeImage = {
  slug: string;
  name: string;
  url: string;
  page: string;
  author: string;
  license: string;
};

const images: TreeImage[] = [
  {
    slug: "chene-pedoncule",
    name: "Chêne pédonculé",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c0/Aleksander_I_ja_Napoleoni_s%C3%B5dade_m%C3%A4lestusm%C3%A4rk1_%28M%C3%B5driku%29.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Aleksander_I_ja_Napoleoni_s%C3%B5dade_m%C3%A4lestusm%C3%A4rk1_(M%C3%B5driku).jpg",
    author: "Ivar Leidus",
    license: "CC BY-SA 3.0 EE",
  },
  {
    slug: "erable-sycomore",
    name: "Érable sycomore",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/62/Wasdale_Tree_under_Kirk_Fell_Lake_District_2025_01.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Wasdale_Tree_under_Kirk_Fell_Lake_District_2025_01.jpg",
    author: "Julian Herzog",
    license: "CC BY-SA 4.0",
  },
  {
    slug: "hetre-commun",
    name: "Hêtre commun",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/76/Rotbuche_Fagus_sylvatica_Rotbuchenstr._55_Muenchen-2.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Rotbuche_Fagus_sylvatica_Rotbuchenstr._55_Muenchen-2.jpg",
    author: "Rufus46",
    license: "CC BY-SA 3.0",
  },
  {
    slug: "chataignier",
    name: "Châtaignier",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Saleich%2C_Arbre.JPG",
    page: "https://commons.wikimedia.org/wiki/File:Saleich,_Arbre.JPG",
    author: "KINOUK",
    license: "CC BY-SA 3.0",
  },
  {
    slug: "tilleul-grandes-feuilles",
    name: "Tilleul à grandes feuilles",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/32/NDO%C3%96_143_Gsanglinde_Viechtwang_Scharnstein_05_2015.jpg",
    page: "https://commons.wikimedia.org/wiki/File:NDO%C3%96_143_Gsanglinde_Viechtwang_Scharnstein_05_2015.jpg",
    author: "Isiwal",
    license: "CC BY-SA 3.0 AT",
  },
  {
    slug: "bouleau-verruqueux",
    name: "Bouleau verruqueux",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Betula_Pendula_at_Stockholm_University_2005-07-01.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Betula_Pendula_at_Stockholm_University_2005-07-01.jpg",
    author: "Jordgubbe",
    license: "CC BY-SA 2.0",
  },
  {
    slug: "frene-commun",
    name: "Frêne commun",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/46/Ash_Tree-1011719%2C_Dingle_Peninsula%2C_Co._Kerry%2C_Ireland.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Ash_Tree-1011719,_Dingle_Peninsula,_Co._Kerry,_Ireland.jpg",
    author: "Maoileann",
    license: "CC BY-SA 4.0",
  },
  {
    slug: "orme-de-montagne",
    name: "Orme de montagne",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/bf/Ulmus_glabra_in_Golden_Valley_Tree_Park%2C_May_2022.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Ulmus_glabra_in_Golden_Valley_Tree_Park,_May_2022.jpg",
    author: "Calistemon",
    license: "CC BY-SA 4.0",
  },
  {
    slug: "pin-sylvestre",
    name: "Pin sylvestre",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Seebruecke_Prerow_002.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Seebruecke_Prerow_002.jpg",
    author: "Simon Koopmann",
    license: "CC BY-SA 2.0 DE",
  },
  {
    slug: "sapin-pectine",
    name: "Sapin pectiné",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Abies_alba_Wis%C5%82a_1.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Abies_alba_Wis%C5%82a_1.jpg",
    author: "Crusier",
    license: "CC BY-SA 3.0",
  },
  {
    slug: "merisier",
    name: "Merisier",
    url: "https://upload.wikimedia.org/wikipedia/commons/5/57/Fr%C3%BChling_bl%C3%BChender_Kirschenbaum.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Fr%C3%BChling_bl%C3%BChender_Kirschenbaum.jpg",
    author: "Benjamin Gimmel (BenHur)",
    license: "CC BY-SA 3.0",
  },
  {
    slug: "noyer-commun",
    name: "Noyer commun",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/74/Noyer_centenaire_en_automne.JPG",
    page: "https://commons.wikimedia.org/wiki/File:Noyer_centenaire_en_automne.JPG",
    author: "Thesupermat",
    license: "CC BY-SA 3.0",
  },
  {
    slug: "epicea-commun",
    name: "Épicéa commun",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/9d/Kuusk_Keila-Paldiski_rdt_%C3%A4%C3%A4res.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Kuusk_Keila-Paldiski_rdt_%C3%A4%C3%A4res.jpg",
    author: "Ivar Leidus",
    license: "CC BY-SA 3.0 EE",
  },
  {
    slug: "aubepine-monogyne",
    name: "Aubépine monogyne",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b8/Crataegus_monogyna_in_flower_on_Smeardon_Down.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Crataegus_monogyna_in_flower_on_Smeardon_Down.jpg",
    author: "Nilfanion",
    license: "CC BY-SA 3.0",
  },
  {
    slug: "charme-commun",
    name: "Charme commun",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/2c/Carpinus_betulus_-_Hunsr%C3%BCck_001.jpg",
    page: "https://commons.wikimedia.org/wiki/File:Carpinus_betulus_-_Hunsr%C3%BCck_001.jpg",
    author: "Willow",
    license: "CC BY 2.5",
  },
];

async function processImage(img: TreeImage): Promise<boolean> {
  const outPath = join(OUT_DIR, `${img.slug}.webp`);
  if (existsSync(outPath)) {
    console.log(`⏭️  ${img.slug}.webp existe déjà`);
    return false;
  }

  const input = await download(thumbUrl(img.url));
  const info = await sharp(input)
    .rotate() // applique l'orientation EXIF
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: QUALITY })
    .toFile(outPath);

  console.log(`✅ ${img.slug}.webp  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} Ko`);
  return true;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  // Séquentiel avec une pause entre chaque téléchargement pour respecter Wikimedia.
  // Les images déjà présentes sont ignorées : on peut relancer le script sans risque.
  const failed: string[] = [];
  for (const img of images) {
    try {
      const downloaded = await processImage(img);
      if (downloaded) await sleep(DELAY_MS);
    } catch (err) {
      failed.push(img.slug);
      console.error(`❌ ${img.slug} : ${(err as Error).message}`);
    }
  }
  if (failed.length) {
    console.log(`\n⚠️  ${failed.length} image(s) en échec : ${failed.join(", ")}. Relance le script.`);
  }

  const credits = [
    "# Crédits photos",
    "",
    "Photos issues de Wikimedia Commons, redimensionnées et converties en WebP.",
    "Chaque image reste sous la licence indiquée.",
    "",
    "| Fichier | Arbre | Auteur | Licence | Source |",
    "|---|---|---|---|---|",
    ...images.map(
      (i) => `| ${i.slug}.webp | ${i.name} | ${i.author} | ${i.license} | [Commons](${i.page}) |`,
    ),
    "",
  ].join("\n");
  await writeFile(join(OUT_DIR, "CREDITS.md"), credits, "utf8");
  console.log("📝 CREDITS.md écrit");
}

main();
