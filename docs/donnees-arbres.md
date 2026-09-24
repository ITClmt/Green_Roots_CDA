# Données des arbres : méthode et sources

Ce fichier explique d'où viennent les valeurs de la table `trees` insérées par `api/src/db/seed.ts`.

## Ce qui est réel et ce qui est fictif

| Champ | Statut |
|---|---|
| `name`, `species` | Réel. Les 15 espèces sont des essences présentes en France. |
| `description`, `location` | Réel (informations botaniques générales, aire naturelle de l'espèce). |
| `co2`, `oxygen` | Estimation calculée (méthode ci-dessous). |
| `imageUrl` | Vraies photos de chaque espèce, Wikimedia Commons (voir `web/public/trees/CREDITS.md`). |
| `price`, `stock` | Fictifs (site de démonstration). |

## CO₂ stocké par an et par arbre

Il n'existe pas de chiffre officiel « par arbre et par espèce » : le stockage dépend de l'âge, du sol, du climat et de la gestion. On a donc choisi une convention unique appliquée aux 15 espèces, en reprenant la formule de conversion volume → CO₂ de la **méthode Boisement du Label Bas-Carbone** (ministère de la Transition écologique) :

```
CO2 (kg/an) = (P / N) × FEB × di × (1 + R) × 0,475 × 44/12 × 1000
```

| Terme | Signification | Valeur | Source |
|---|---|---|---|
| P | Accroissement en volume de tronc du peuplement (m³/ha/an) | selon l'essence, voir tableau | **Hypothèse** (ordre de grandeur pour une forêt gérée en France) |
| N | Nombre d'arbres par hectare dans un peuplement adulte éclairci | 400 | **Hypothèse** (même valeur pour toutes les essences) |
| FEB | Facteur d'expansion des branches (tronc → partie aérienne) | 1,56 feuillus / 1,3 résineux | Label Bas-Carbone, méthode Boisement |
| di | Infradensité du bois (tonne de matière sèche par m³) | selon l'essence | Label Bas-Carbone, méthode Boisement, annexe « infradensités » |
| R | Part des racines par rapport à la partie aérienne | 0,30 chêne / 0,24 autres feuillus / 0,29 résineux | GIEC 2006, vol. 4, chap. 4, tableau 4.4 (valeurs par défaut forêts tempérées) |
| 0,475 | Taux de carbone de la matière sèche (tC/tMS) | 0,475 | Label Bas-Carbone |
| 44/12 | Conversion carbone → CO₂ | 3,667 | Masses molaires |

### Résultats

| Espèce | P (m³/ha/an) | di | CO₂ (kg/an) | O₂ (kg/an) |
|---|---|---|---|---|
| Chêne pédonculé | 5 | 0,54 | 24 | 17 |
| Érable sycomore | 7 | 0,51 | 30 | 22 |
| Hêtre commun | 7 | 0,55 | 32 | 23 |
| Châtaignier | 8 | 0,47 | 32 | 23 |
| Tilleul à grandes feuilles | 6 | 0,43 | 22 | 16 |
| Bouleau verruqueux | 5 | 0,52 | 22 | 16 |
| Frêne commun | 7 | 0,56 | 33 | 24 |
| Orme de montagne | 6 | 0,52 | 26 | 19 |
| Pin sylvestre | 6 | 0,44 | 19 | 14 |
| Sapin pectiné | 10 | 0,38 | 28 | 20 |
| Merisier | 6 | 0,50 | 25 | 18 |
| Noyer commun | 5 | 0,52 | 22 | 16 |
| Épicéa commun | 12 | 0,37 | 32 | 23 |
| Aubépine monogyne | 2 | 0,55* | 9 | 7 |
| Charme commun | 5 | 0,61 | 26 | 19 |

\* L'aubépine est un arbuste de haie, elle n'apparaît pas dans les tables forestières. Son infradensité et son accroissement sont des hypothèses.

**Contrôle de cohérence** : les valeurs obtenues (9 à 33 kg/an) sont dans la fourchette de 10 à 40 kg de CO₂ par an et par arbre qu'annonce EcoTree, pour une moyenne d'environ 25 kg.

**Limites** : P et N sont des hypothèses, pas des mesures. Pour affiner, on peut remplacer P par la production par essence publiée par l'IGN (Inventaire forestier national, fascicule « La production annuelle en volume ») et N par le nombre de tiges par essence.

## Oxygène

La photosynthèse (6 CO₂ + 6 H₂O → C₆H₁₂O₆ + 6 O₂) libère une molécule d'O₂ par molécule de CO₂ fixée, donc :

```
O2 (kg) = CO2 (kg) × 32/44 ≈ CO2 × 0,73
```

## Sources

- Label Bas-Carbone, méthode Boisement : https://label-bas-carbone.ecologie.gouv.fr/sites/default/files/2025-07/M%C3%A9thode%20boisement.pdf
- GIEC 2006, Lignes directrices pour les inventaires nationaux de GES, vol. 4 (AFOLU), chap. 4, tableau 4.4
- EcoTree, « How much CO2 does a tree absorb? » : https://ecotree.green/en/how-much-co2-does-a-tree-absorb
- IGN, La production annuelle en volume : https://inventaire-forestier.ign.fr/IMG/pdf/flux2023.pdf
- Photos : Wikimedia Commons (détail dans `web/public/trees/CREDITS.md`)
