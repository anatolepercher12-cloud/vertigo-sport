/* Données de démonstration : en production, ce fichier est remplacé par la copie
   en lecture seule de GESTOCK, mise à jour toutes les 5 à 15 minutes. */
window.VS_DATA = {
  magasins: [
    { id: "nantes", ville: "Nantes", adresse: "12 boulevard des Sports, 44000 Nantes", tel: "02 40 00 00 01", horaires: "Lun–Sam 9h30–19h30", dimanche: "Fermé" },
    { id: "angers", ville: "Angers", adresse: "8 rue du Grand Air, 49000 Angers", tel: "02 41 00 00 02", horaires: "Lun–Sam 9h30–19h", dimanche: "Fermé" },
    { id: "le-mans", ville: "Le Mans", adresse: "25 avenue des Cimes, 72000 Le Mans", tel: "02 43 00 00 03", horaires: "Lun–Sam 9h30–19h", dimanche: "Fermé" },
    { id: "saint-nazaire", ville: "Saint-Nazaire", adresse: "4 quai de la Glisse, 44600 Saint-Nazaire", tel: "02 40 00 00 04", horaires: "Lun–Sam 10h–19h", dimanche: "10h–13h (juil.–août)" },
    { id: "la-roche-sur-yon", ville: "La Roche-sur-Yon", adresse: "17 rue des Randonneurs, 85000 La Roche-sur-Yon", tel: "02 51 00 00 05", horaires: "Lun–Sam 9h30–19h", dimanche: "Fermé" },
    { id: "laval", ville: "Laval", adresse: "3 place du Sommet, 53000 Laval", tel: "02 43 00 00 06", horaires: "Mar–Sam 9h30–19h", dimanche: "Fermé" }
  ],
  categories: ["Vélo", "Randonnée", "Running", "Glisse", "Escalade"],
  articles: [
    { id: "vtt-trail-29", nom: "VTT Trail 29\" alu", cat: "Vélo", prix: 899, stock: [3, 2, 0, 1, 4, 1] },
    { id: "casque-vtt", nom: "Casque VTT ventilé", cat: "Vélo", prix: 59.9, stock: [14, 9, 6, 3, 7, 5] },
    { id: "gants-velo", nom: "Gants vélo longs", cat: "Vélo", prix: 24.9, stock: [22, 15, 0, 8, 11, 2] },
    { id: "chaussures-rando", nom: "Chaussures de randonnée imperméables", cat: "Randonnée", prix: 129, stock: [11, 6, 4, 0, 5, 3] },
    { id: "sac-rando-30l", nom: "Sac à dos randonnée 30 L", cat: "Randonnée", prix: 79.9, stock: [8, 4, 2, 6, 0, 1] },
    { id: "batons-rando", nom: "Bâtons de marche télescopiques (paire)", cat: "Randonnée", prix: 44.9, stock: [17, 10, 5, 9, 6, 4] },
    { id: "chaussures-running", nom: "Chaussures running route amorti", cat: "Running", prix: 109, stock: [19, 12, 8, 7, 9, 0] },
    { id: "montre-gps", nom: "Montre GPS cardio", cat: "Running", prix: 199, stock: [4, 0, 2, 1, 1, 0] },
    { id: "veste-running", nom: "Veste running coupe-vent", cat: "Running", prix: 64.9, stock: [9, 7, 3, 5, 2, 2] },
    { id: "combinaison-surf", nom: "Combinaison surf 4/3 mm", cat: "Glisse", prix: 189, stock: [5, 1, 0, 12, 3, 0] },
    { id: "masque-ski", nom: "Masque de ski écran sphérique", cat: "Glisse", prix: 69.9, stock: [6, 5, 4, 2, 3, 3] },
    { id: "chaussons-escalade", nom: "Chaussons d'escalade", cat: "Escalade", prix: 89, stock: [7, 9, 3, 0, 2, 4] },
    { id: "baudrier", nom: "Baudrier escalade réglable", cat: "Escalade", prix: 59, stock: [5, 6, 2, 1, 0, 3] }
  ],
  location: [
    { id: "loc-vtt", nom: "VTT tout suspendu", prixJour: 35, caution: 800, stock: [6, 4, 3, 2, 4, 2] },
    { id: "loc-vae", nom: "Vélo à assistance électrique", prixJour: 45, caution: 1200, stock: [4, 3, 2, 3, 2, 1] },
    { id: "loc-paddle", nom: "Stand-up paddle gonflable", prixJour: 30, caution: 400, stock: [2, 1, 0, 6, 3, 0] },
    { id: "loc-ski", nom: "Pack ski (skis + chaussures + bâtons)", prixJour: 28, caution: 500, stock: [10, 8, 6, 2, 3, 5] },
    { id: "loc-raquettes", nom: "Raquettes à neige", prixJour: 12, caution: 150, stock: [8, 6, 5, 0, 2, 4] },
    { id: "loc-tente", nom: "Tente de randonnée 2 places", prixJour: 15, caution: 250, stock: [5, 3, 4, 2, 6, 2] }
  ],
  articlesBlog: [
    { id: "choisir-vtt", titre: "Bien choisir son VTT : semi-rigide ou tout suspendu ?", cat: "Conseils", date: "2026-10-22", resume: "Terrain, budget, pratique : nos vendeurs vous aident à trouver le vélo qui vous correspond, sans vous ruiner." },
    { id: "loire-a-velo", titre: "La Loire à Vélo : 5 étapes à faire depuis nos magasins", cat: "Sorties", date: "2026-10-08", resume: "De Saint-Nazaire à Angers, nos idées d'itinéraires à la journée, avec location de vélo et retrait en magasin." },
    { id: "reprise-running", titre: "Reprendre la course à pied après l'été", cat: "Conseils", date: "2026-09-24", resume: "Progressivité, chaussures adaptées, échauffement : le programme de 4 semaines de l'équipe de Nantes." },
    { id: "atelier-angers", titre: "Nouvel atelier vélo au magasin d'Angers", cat: "Actualités", date: "2026-09-10", resume: "Révision, réglage des freins, changement de pneus : l'atelier est ouvert du mardi au samedi." }
  ]
};
