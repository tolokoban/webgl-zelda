/**
 * Ce module est responsable de la définition des cartes.
 * Les cartes sont découpées en  parcelles. Ces dernières possèdent un
 * terrain,  des objects,  etc...   Le découpage  en parcelles  permet
 * d'avoir des cartes gigantesques que l'on charge par morceaux.
 *
 * map: {
 *   name: "Nom de la carte",
 *   parcels: {
 *     "0,0": { ... },
 *     "0,1": { ... },
 *     "1,2": { ... },
 *     ...
 *   }
 * }
 *
 * parcel: {
 *   terrain: {
 *     geo: [...],
 *     mat: [...]
 *   }
 * }
 */

"use strict";
