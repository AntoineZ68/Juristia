"""Contenu du dossier pénal fictif de démonstration.

Procédure de flagrance, Lyon 7ème, 17-18 septembre 2026 : vol avec
violences et détention de stupéfiants, défèrement en vue d'une comparution
immédiate. Toutes les personnes, adresses, numéros et références sont
inventés. Les numéros de téléphone sont pris dans la tranche 06 39 98 xx xx.

Chaque pièce est une liste de blocs :
  ("p", texte)               paragraphe
  ("qr", question, reponse)  paire Question / Réponse (jamais coupée entre deux pages)
  ("h", texte)               intertitre (casse mixte)
  ("liste", [items])         liste à tirets
  ("sig", [(gauche, droite), ...])  bloc de signatures sur deux colonnes
  ("sp",)                    ligne vide

Contraintes d'écriture, déduites du moteur d'analyse (voir docs/AUDIT_APP.md) :
apostrophes droites ('), réponses terminées par un point, aucune ligne
entièrement en capitales en tête de page de continuation, pas de chaîne
"arriv" dans les paires Question/Réponse.
"""

PROCEDURE = "2026/00517"
NOM_FICHIER = "Procedure_2026-00517_CI_Lyon.pdf"

# --- En-têtes de service -------------------------------------------------

_POLICE = ["RÉPUBLIQUE FRANÇAISE", "MINISTÈRE DE L'INTÉRIEUR",
           "DIRECTION INTERDÉPARTEMENTALE DE LA POLICE NATIONALE DU RHÔNE"]

ENTETES = {
    "bac": _POLICE + ["COMMISSARIAT DE LYON 7ÈME - BRIGADE ANTICRIMINALITÉ DE JOUR"],
    "ps": _POLICE + ["COMMISSARIAT DE LYON 7ÈME - POLICE SECOURS"],
    "quart": _POLICE + ["COMMISSARIAT DE LYON 7ÈME - SERVICE DE QUART"],
    "utj": _POLICE + ["COMMISSARIAT DE LYON 7ÈME - UNITÉ DE TRAITEMENT JUDICIAIRE"],
    "umj": ["INSTITUT DE MÉDECINE LÉGALE DE LYON", "UNITÉ MÉDICO-JUDICIAIRE"],
    "cjn": ["RÉPUBLIQUE FRANÇAISE", "MINISTÈRE DE LA JUSTICE", "CASIER JUDICIAIRE NATIONAL"],
    "esr": ["ASSOCIATION RHODANIENNE D'ENQUÊTES ET DE MÉDIATION PÉNALE",
            "PERMANENCE DU TRIBUNAL JUDICIAIRE DE LYON"],
}

# Service rédacteur rappelé en tête des feuillets de continuation (casse mixte).
SERVICE_COURT = {
    "bac": "Commissariat de Lyon 7ème - BAC de jour",
    "ps": "Commissariat de Lyon 7ème - Police secours",
    "quart": "Commissariat de Lyon 7ème - Service de quart",
    "utj": "Commissariat de Lyon 7ème - Unité de traitement judiciaire",
    "umj": "Unité médico-judiciaire de Lyon",
    "cjn": "Casier judiciaire national",
    "esr": "Enquête sociale rapide",
}

META = [
    "Procédure n° 2026/00517",
    "Parquet : tribunal judiciaire de Lyon",
    "Affaire : VERGNE Anthony - vol avec violences, stupéfiants.",
]

OUV = "L'an deux mille vingt-six, le {j} septembre, à {h} heures {m} minutes."


def ouverture(jour, heure, minute):
    return OUV.format(j=jour, h=heure, m=f"{minute:02d}")


# --- Pièces --------------------------------------------------------------

PIECES = []


def piece(cote, entete, titre, suite, blocs, meta=True):
    PIECES.append({"cote": cote, "entete": entete, "titre": titre, "suite": suite,
                   "blocs": blocs, "meta": meta})


# D1 ---------------------------------------------------------------------
piece(1, "bac", ["PROCÈS-VERBAL D'INTERPELLATION"],
      "Suite du procès-verbal d'interpellation",
      [
          ("p", ouverture(17, 18, 11)),
          ("p", "Nous, Olivier MANSART, Brigadier-chef de police, agent de police judiciaire en "
                "résidence à Lyon, en fonction à la brigade anticriminalité de jour du commissariat "
                "de Lyon 7ème, assisté des gardiens de la paix Inès LEROY et Paul SERRE, agents de "
                "police judiciaire, en tenue civile et porteurs de nos brassards, en patrouille à bord "
                "d'un véhicule sérigraphié, agissant en flagrant délit, conformément aux articles 53 et "
                "suivants et 73 du code de procédure pénale,"),
          ("p", "Rapportons les faits suivants :"),
          ("p", "À 18h02, alors que nous circulons cours Gambetta, sommes avisés par la salle "
                "d'information et de commandement qu'un vol de sac à main avec violences vient d'être "
                "commis avenue Berthelot à Lyon 7ème, à hauteur de l'arrêt de tramway Centre Berthelot. "
                "Signalement diffusé : individu de sexe masculin, de corpulence mince, taille "
                "estimée 1,80 mètre, porteur d'une casquette de couleur rouge ou sombre selon les "
                "premiers témoignages, d'un haut sombre et d'un pantalon de survêtement gris, en fuite "
                "à pied en direction de la rue de Marseille."),
          ("p", "Nous rendons immédiatement dans le secteur. À 18h08, rue Sébastien-Gryphe, "
                "remarquons un individu correspondant au signalement, marchant à vive allure, qui "
                "regarde à plusieurs reprises dans notre direction puis prend la fuite en courant en "
                "direction de la rue de l'Université."),
          ("p", "Après une course poursuite d'environ 150 mètres, parvenons à rattraper l'individu à "
                "l'angle de la rue Sébastien-Gryphe et de la rue de l'Université. L'individu tente de "
                "se dégager en repoussant le gardien de la paix SERRE des deux mains. Il est maîtrisé "
                "au sol à l'aide des gestes techniques professionnels d'intervention et menotté, "
                "l'usage des menottes étant rendu nécessaire par sa tentative de fuite, conformément "
                "à l'article 803 du code de procédure pénale."),
          ("p", "L'individu déclare se nommer : VERGNE Anthony, né le 11/06/2002 à Saint-Étienne "
                "(Loire). Il ne présente aucun document d'identité."),
          ("p", "Procédons à une palpation de sécurité. Découvrons dans la poche droite de son blouson "
                "un téléphone portable de marque Samsung, de couleur bleu marine, muni d'une coque "
                "transparente, et dans la poche intérieure un sachet plastique contenant plusieurs "
                "barrettes d'une substance brunâtre dégageant une odeur caractéristique de résine de "
                "cannabis, ainsi qu'une somme d'argent en billets et en pièces. L'intéressé porte "
                "également sur lui un second téléphone portable de marque Xiaomi, de couleur noire, "
                "qu'il déclare être le sien."),
          ("p", "La victime, Mme Sophie DELCOURT, prise en charge sur les lieux par un équipage de police "
                "secours, communique par l'intermédiaire de la salle de commandement le numéro de sa "
                "ligne : 06 39 98 41 27. À 18h14, composons ce numéro depuis le téléphone de service : "
                "le téléphone Samsung découvert sur l'intéressé sonne et affiche l'appel entrant."),
          ("p", "Informons l'intéressé qu'il est interpellé pour des faits de vol avec violences et de "
                "détention de produits stupéfiants. Il ne fait aucune déclaration."),
          ("p", "Mentionnons que l'intéressé est vêtu d'une casquette de couleur noire, d'un blouson "
                "de type bombers de couleur noire, d'un pantalon de survêtement gris clair et de "
                "chaussures de sport blanches. Il ne porte pas de sweat à capuche."),
          ("p", "Conduisons l'intéressé au commissariat de Lyon 7ème, où nous nous présentons à 18h34 "
                "devant le Lieutenant de police Damien COSTE, officier de police judiciaire de quart, "
                "auquel nous le présentons ainsi que les objets découverts lors de la palpation."),
          ("p", "Mentionnons que le gardien de la paix SERRE ne présente aucune blessure et ne "
                "souhaite pas déposer plainte."),
          ("p", "Dont procès-verbal que nous clôturons à 19h00 et que signent avec nous les fonctionnaires "
                "interpellateurs."),
          ("sig", [("Les agents interpellateurs :", "L'agent de police judiciaire :"),
                   ("GPX I. LEROY - GPX P. SERRE", "BC O. MANSART")]),
      ])

# D2 ---------------------------------------------------------------------
piece(2, "ps", ["PROCÈS-VERBAL DE RECHERCHES ET DE DÉCOUVERTE D'OBJET"],
      "Suite du procès-verbal de découverte",
      [
          ("p", ouverture(17, 18, 25)),
          ("p", "Nous, Marc TISSOT, Gardien de la paix, agent de police judiciaire en résidence à Lyon, "
                "en fonction au commissariat de Lyon 7ème, équipage police secours, assisté du gardien "
                "de la paix stagiaire Léa BONNEFOY, agissant en flagrant délit,"),
          ("p", "Rapportons que, requis par la salle d'information et de commandement à 18h03 pour un "
                "vol avec violences commis avenue Berthelot, nous nous sommes transportés sur les lieux "
                "où nous avons pris en charge la victime, Mme Sophie DELCOURT, assise sur un banc de "
                "l'arrêt de tramway Centre Berthelot. Elle se plaint du poignet droit et des genoux et "
                "refuse d'être transportée par les sapeurs-pompiers."),
          ("p", "M. Yacine BOUZID, employé du tabac-presse Le Carillon situé avenue Berthelot, se présente "
                "spontanément à nous comme témoin des faits. Il nous indique avoir vu l'auteur jeter un "
                "objet dans un conteneur à ordures au coin de la rue de Marseille et de la rue de "
                "l'Université."),
          ("p", "Nous transportons à cet endroit. À 18h25, dans le conteneur à ordures ménagères de couleur "
                "grise situé à l'angle de la rue de Marseille et de la rue de l'Université, découvrons "
                "posé sur les sacs poubelles un sac à main en cuir noir dont la bandoulière est "
                "arrachée au niveau de l'anneau de fixation."),
          ("p", "Le sac contient : un portefeuille en cuir bordeaux contenant une carte nationale "
                "d'identité et une carte bancaire au nom de Sophie DELCOURT, une carte vitale, un "
                "trousseau de trois clés, un badge d'accès professionnel et un agenda. Le portefeuille "
                "ne contient aucune somme en numéraire. Aucun téléphone portable ne se trouve dans le "
                "sac."),
          ("p", "Mentionnons que le conteneur est situé à environ 250 mètres de l'arrêt Centre Berthelot. "
                "Relevons les coordonnées du témoin, que nous invitons à se présenter au commissariat "
                "de Lyon 7ème pour y être entendu, ce qu'il accepte."),
          ("p", "Transportons le sac et son contenu au service, où ils sont remis à l'officier de police "
                "judiciaire de quart à 18h55."),
          ("sig", [("Le GPX stagiaire :", "L'agent de police judiciaire :"),
                   ("GPXS L. BONNEFOY", "GPX M. TISSOT")]),
      ])

# D3 ---------------------------------------------------------------------
piece(3, "quart", ["PROCÈS-VERBAL DE FOUILLE ET DE SAISIE"],
      "Suite du procès-verbal de fouille et de saisie",
      [
          ("p", ouverture(17, 18, 50)),
          ("p", "Nous, Damien COSTE, Lieutenant de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction au commissariat de Lyon 7ème, agissant en flagrant délit,"),
          ("p", "En présence de la personne dénommée : VERGNE Anthony, qui nous a été présentée à 18h34 "
                "par les fonctionnaires de la brigade anticriminalité de jour,"),
          ("p", "Procédons à la fouille de sécurité de l'intéressé et à l'inventaire des objets "
                "découverts lors de sa palpation. Constatons et saisissons :"),
          ("liste", [
              "Neuf barrettes d'une substance brunâtre compacte, emballées individuellement dans du "
              "film plastique transparent et contenues dans un sachet de congélation, que nous "
              "plaçons sous scellé numéro UN.",
              "La somme de 185 euros, soit trois billets de 50 euros, un billet de 20 euros, un billet "
              "de 10 euros et 5 euros en pièces, que nous plaçons sous scellé numéro DEUX.",
              "Un téléphone portable de marque Samsung, modèle Galaxy A55, de couleur bleu marine, "
              "muni d'une coque transparente, que nous plaçons sous scellé numéro TROIS en vue de "
              "sa restitution à sa propriétaire après exploitation.",
              "Un téléphone portable de marque Xiaomi, de couleur noire, appartenant à l'intéressé, "
              "que nous plaçons sous scellé numéro QUATRE.",
          ]),
          ("p", "Laissons à l'intéressé, au titre de ses effets personnels déposés à la fouille : une "
                "ceinture, un briquet, un paquet de feuilles à rouler et une paire de lacets."),
          ("p", "Mentionnons que le sac à main découvert par l'équipage police secours nous est remis à "
                "18h55 ; il n'est pas placé sous scellé et sera restitué à sa propriétaire."),
          ("p", "Lecture faite par lui-même, l'intéressé refuse de signer."),
          ("sig", [("La personne concernée :", "L'officier de police judiciaire :"),
                   ("Refus de signer", "Lieutenant D. COSTE")]),
      ])

# D4 ---------------------------------------------------------------------
piece(4, "quart", ["PROCÈS-VERBAL DE PLAINTE ET D'AUDITION DE VICTIME"],
      "Suite du procès-verbal de plainte de Sophie DELCOURT",
      [
          ("p", ouverture(17, 19, 20)),
          ("p", "Devant nous, Karine VIDAL, Brigadier de police, agent de police judiciaire en fonction au "
                "commissariat de Lyon 7ème, agissant en flagrant délit, se présente la personne ci-après "
                "désignée, qui nous déclare vouloir déposer plainte :"),
          ("liste", [
              "Nom : DELCOURT",
              "Prénoms : Sophie, Hélène",
              "Née le 04/03/1985 à Roanne (Loire)",
              "Profession : comptable",
              "Adresse : 27 rue Pasteur à Lyon (69007)",
              "Téléphone : 06 39 98 41 27",
          ]),
          ("p", "Mentionnons que Mme Sophie DELCOURT a été informée des droits reconnus aux victimes par "
                "l'article 10-2 du code de procédure pénale et qu'un document récapitulatif lui a été "
                "remis."),
          ("p", "Mme Sophie DELCOURT déclare :"),
          ("p", "Je viens déposer plainte contre l'individu qui m'a arraché mon sac à main ce soir. Je "
                "sortais de mon travail et je marchais sur l'avenue Berthelot pour rentrer chez moi. "
                "Juste avant l'arrêt du tramway, j'ai senti qu'on tirait très fort sur mon sac par "
                "derrière. J'ai tenu la bandoulière, je ne voulais pas lâcher. L'homme m'a frappée et "
                "je me suis retrouvée par terre. Il est parti en courant avec mon sac vers la rue de "
                "Marseille. Un monsieur du tabac est venu m'aider et a appelé la police avec son "
                "téléphone parce que le mien était dans le sac."),
          ("qr", "À quelle heure les faits se sont-ils produits ?",
           "Il était environ 18h20. Je quitte le bureau vers 18h et je marche un quart d'heure environ."),
          ("qr", "Pouvez-vous décrire la tenue vestimentaire de l'auteur ?",
           "Il portait une casquette rouge et un sweat à capuche gris. Il était assez grand et mince, "
           "je n'ai pas bien vu son visage."),
          ("qr", "Pouvez-vous décrire les gestes de l'auteur lors du vol du sac ?",
           "Il a tiré d'un coup sur mon sac. Comme je ne lâchais pas, il m'a donné un coup de poing au "
           "visage, sur la joue gauche, puis il m'a poussée et je suis tombée sur les genoux."),
          ("qr", "Que contenait votre sac ?",
           "Mon portefeuille avec mes papiers, ma carte bancaire et environ 60 euros en espèces, deux "
           "billets de 20 euros et deux billets de 10 euros. Il y avait aussi mes clés, mon badge de "
           "travail et mon téléphone, un Samsung Galaxy A55 bleu marine."),
          ("qr", "Êtes-vous blessée ?",
           "J'ai très mal au poignet droit et aux genoux. J'ai aussi mal à la joue."),
          ("p", "Mentionnons que nous présentons à Mme Sophie DELCOURT le téléphone portable placé sous "
                "scellé numéro TROIS ainsi que le sac à main découvert par l'équipage police secours."),
          ("qr", "Reconnaissez-vous les objets qui vous sont présentés ?",
           "Oui, c'est mon téléphone, je reconnais la coque transparente et le fond d'écran avec la "
           "photo de mes enfants. C'est aussi mon sac, mais il manque l'argent de mon portefeuille."),
          ("qr", "Pourriez-vous reconnaître l'auteur ?",
           "Je ne sais pas. Je l'ai surtout vu de dos quand il est parti en courant."),
          ("qr", "Souhaitez-vous vous constituer partie civile ?",
           "Oui, je me constitue partie civile. Je réserve mes demandes en attendant de connaître mon "
           "incapacité de travail."),
          ("p", "Mentionnons que Mme Sophie DELCOURT est avisée qu'une réquisition lui sera remise afin "
                "d'être examinée par l'unité médico-judiciaire."),
          ("p", "Lecture faite par elle-même, Mme Sophie DELCOURT persiste et signe avec nous le présent "
                "procès-verbal, clos à 20h05."),
          ("sig", [("La plaignante :", "L'agent de police judiciaire :"),
                   ("S. DELCOURT", "BP K. VIDAL")]),
      ])

# D5 ---------------------------------------------------------------------
piece(5, "quart", ["RÉQUISITION À PERSONNE QUALIFIÉE",
                   "(ARTICLE 60 DU CODE DE PROCÉDURE PÉNALE)"],
      "Suite de la réquisition",
      [
          ("p", ouverture(17, 20, 10)),
          ("p", "Nous, Damien COSTE, Lieutenant de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction au commissariat de Lyon 7ème, agissant en flagrant délit,"),
          ("p", "Vu l'article 60 du code de procédure pénale,"),
          ("p", "Requérons le médecin de l'unité médico-judiciaire de Lyon à l'effet d'examiner Mme "
                "Sophie DELCOURT, née le 04/03/1985 à Roanne (Loire), victime de violences commises "
                "le 17/09/2026 avenue Berthelot à Lyon 7ème, de décrire les lésions constatées, d'en "
                "préciser la compatibilité avec les faits allégués et de fixer la durée de l'incapacité "
                "totale de travail au sens pénal."),
          ("p", "Disons que la personne à examiner se présentera à l'unité médico-judiciaire le 18/09/2026 "
                "au matin, la présente réquisition lui étant remise en main propre."),
          ("p", "Prions le praticien de bien vouloir nous faire retour de son certificat dans les meilleurs "
                "délais, par courriel au service de quart."),
          ("sig", [("", "L'officier de police judiciaire :"), ("", "Lieutenant D. COSTE")]),
      ])

# D6 ---------------------------------------------------------------------
piece(6, "quart", ["PROCÈS-VERBAL DE NOTIFICATION DE PLACEMENT EN GARDE À VUE",
                   "ET DES DROITS AFFÉRENTS À CETTE MESURE"],
      "Suite du procès-verbal de notification de placement en garde à vue de VERGNE Anthony",
      [
          ("p", ouverture(17, 20, 41)),
          ("p", "Nous, Damien COSTE, Lieutenant de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction au commissariat de Lyon 7ème,"),
          ("p", "Vu les articles 53, 62-2, 63, 63-1 à 63-4 et 803-6 du code de procédure pénale,"),
          ("p", "Constatons la présence dans nos locaux de la personne dénommée : VERGNE Anthony, né le "
                "11/06/2002 à Saint-Étienne (Loire), de nationalité française, préparateur de commandes, "
                "demeurant 12 rue des Tilleuls à Vénissieux (69200)."),
          ("p", "Mentionnons que l'intéressé nous a été présenté à 18h34 par les fonctionnaires de la "
                "brigade anticriminalité de jour. Mentionnons que la notification de la mesure et des "
                "droits y afférents n'a pu intervenir qu'à 20h41, l'officier de police judiciaire de "
                "quart étant retenu jusqu'alors par une procédure distincte."),
          ("p", "Lui notifions qu'il est placé en garde à vue à compter du 17 septembre 2026 à 18 heures "
                "11 minutes (heure de son interpellation), pour une durée de vingt-quatre heures, "
                "cette mesure constituant l'unique moyen de permettre l'exécution des investigations "
                "impliquant sa présence, d'empêcher qu'il ne modifie les preuves ou indices matériels, "
                "d'empêcher toute pression sur la victime et le témoin et de garantir sa présentation "
                "devant le procureur de la République."),
          ("p", "Lui notifions qu'il existe des raisons plausibles de soupçonner qu'il a commis ou tenté "
                "de commettre les infractions suivantes :"),
          ("liste", [
              "vol avec violences ayant entraîné une incapacité totale de travail n'excédant pas huit "
              "jours, commis le 17/09/2026 à Lyon 7ème au préjudice de Mme Sophie DELCOURT ;",
              "détention non autorisée de produits stupéfiants (résine de cannabis), le 17/09/2026 à "
              "Lyon 7ème.",
          ]),
          ("p", "Lui notifions les droits attachés à la mesure de garde à vue, prévus aux articles 63-1 à "
                "63-4 du code de procédure pénale :"),
          ("p", "1. Le droit de faire prévenir un proche et son employeur. L'intéressé déclare : je veux "
                "que vous préveniez ma mère, Mme Nadine VERGNE, au 06 39 98 17 54. Je ne veux pas que "
                "vous préveniez mon agence d'intérim."),
          ("p", "2. Le droit d'être examiné par un médecin. L'intéressé déclare : oui, je veux voir un "
                "médecin, j'ai mal au poignet gauche depuis qu'on m'a mis les menottes."),
          ("p", "3. Le droit d'être assisté par un avocat. L'intéressé déclare : je veux un avocat commis "
                "d'office, je veux lui parler avant de répondre à vos questions."),
          ("p", "4. Le droit d'être assisté par un interprète. L'intéressé déclare comprendre parfaitement "
                "la langue française et n'en pas avoir besoin."),
          ("p", "5. Le droit de consulter, dans les meilleurs délais et au plus tard avant l'éventuelle "
                "prolongation de la garde à vue, les documents mentionnés à l'article 63-4-1 du code de "
                "procédure pénale."),
          ("p", "6. Le droit de présenter des observations au procureur de la République lorsque ce "
                "magistrat se prononce sur l'éventuelle prolongation de la garde à vue."),
          ("p", "7. Le droit, lors des auditions, après avoir décliné son identité, de faire des "
                "déclarations, de répondre aux questions qui lui sont posées ou de se taire."),
          ("p", "Remettons à l'intéressé le document énonçant ces droits, rédigé en langue française, "
                "qu'il est autorisé à conserver pendant toute la durée de la garde à vue."),
          ("p", "Mentionnons que l'intéressé déclare : je ne dirai rien avant d'avoir vu mon avocat."),
          ("p", "Disons qu'avis de la mesure sera donné au procureur de la République près le tribunal "
                "judiciaire de Lyon, et qu'il sera procédé aux diligences relatives à l'avis à un proche, "
                "à l'examen médical et à l'avis à avocat."),
          ("p", "Lecture faite par lui-même, l'intéressé persiste et signe avec nous le présent "
                "procès-verbal."),
          ("sig", [("La personne gardée à vue :", "L'officier de police judiciaire :"),
                   ("A. VERGNE", "Lieutenant D. COSTE")]),
      ])

# D7 ---------------------------------------------------------------------
piece(7, "quart", ["RÉQUISITION À PERSONNE QUALIFIÉE",
                   "(ARTICLES 60 ET 63-3 DU CODE DE PROCÉDURE PÉNALE)"],
      "Suite de la réquisition",
      [
          ("p", ouverture(17, 20, 48)),
          ("p", "Nous, Damien COSTE, Lieutenant de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction au commissariat de Lyon 7ème,"),
          ("p", "Vu les articles 60 et 63-3 du code de procédure pénale, vu la demande d'examen médical "
                "formulée par la personne gardée à vue lors de la notification de ses droits,"),
          ("p", "Requérons le médecin de permanence de l'unité médico-judiciaire de Lyon à l'effet de "
                "procéder, dans les locaux du commissariat de Lyon 7ème, à l'examen médical de VERGNE "
                "Anthony, né le 11/06/2002 à Saint-Étienne (Loire), placé en garde à vue, de se "
                "prononcer sur l'aptitude au maintien en garde à vue et de procéder à toutes "
                "constatations utiles."),
          ("p", "Transmettons la présente réquisition par courriel à l'unité médico-judiciaire."),
          ("sig", [("", "L'officier de police judiciaire :"), ("", "Lieutenant D. COSTE")]),
      ])

# D8 ---------------------------------------------------------------------
piece(8, "quart", ["PROCÈS-VERBAL D'AVIS À AVOCAT"],
      "Suite du procès-verbal d'avis à avocat",
      [
          ("p", ouverture(17, 20, 58)),
          ("p", "Nous, Damien COSTE, Lieutenant de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction au commissariat de Lyon 7ème,"),
          ("p", "Vu l'article 63-3-1 du code de procédure pénale,"),
          ("p", "Vu la demande d'assistance d'un avocat commis d'office formulée par VERGNE Anthony, "
                "placé en garde à vue, lors de la notification de ses droits,"),
          ("p", "Avisons par téléphone la permanence pénale de l'ordre des avocats du barreau de Lyon de "
                "cette demande. Il nous est indiqué que Maître Bastien LAFARGUE, avocat au barreau de "
                "Lyon, est désigné au titre de la commission d'office et qu'il se présentera au service "
                "dans les meilleurs délais."),
          ("p", "Informons la permanence de la nature et de la date présumée des infractions reprochées, "
                "ainsi que de l'heure du début de la mesure."),
          ("p", "Dont procès-verbal."),
          ("sig", [("", "L'officier de police judiciaire :"), ("", "Lieutenant D. COSTE")]),
      ])

# D9 ---------------------------------------------------------------------
piece(9, "quart", ["PROCÈS-VERBAL D'AUDITION DE TÉMOIN"],
      "Suite du procès-verbal d'audition de Yacine BOUZID",
      [
          ("p", ouverture(17, 21, 5)),
          ("p", "Devant nous, Karine VIDAL, Brigadier de police, agent de police judiciaire en fonction au "
                "commissariat de Lyon 7ème, agissant en flagrant délit, se présente la personne ci-après "
                "désignée, qui nous déclare vouloir témoigner :"),
          ("liste", [
              "Nom : BOUZID",
              "Prénom : Yacine",
              "Né le 22/10/1996 à Lyon 8ème (Rhône)",
              "Profession : employé de commerce, tabac-presse Le Carillon, avenue Berthelot à Lyon",
              "Adresse : 5 impasse des Glycines à Bron (69500)",
          ]),
          ("p", "Mentionnons que le témoin prête serment de dire toute la vérité, rien que la vérité, et "
                "déclare n'être ni parent, ni allié, ni au service des parties."),
          ("p", "M. Yacine BOUZID déclare :"),
          ("p", "Je travaille au tabac-presse Le Carillon depuis deux ans. Ce soir, je sortais des cartons "
                "vides sur le trottoir devant la boutique quand j'ai vu la scène. Un jeune homme est "
                "passé derrière une dame qui marchait vers l'arrêt du tramway et il a tiré sur son sac. "
                "La dame est tombée. Je suis allé l'aider et j'ai appelé le 17 avec mon portable."),
          ("qr", "À quelle heure les faits se sont-ils produits ?",
           "Il était un peu avant 18 heures. Je regarde toujours l'heure à ce moment-là parce que mon "
           "patron fait la caisse à 18h et je venais de voir qu'il était 17h55."),
          ("qr", "Pouvez-vous décrire la tenue vestimentaire de l'auteur ?",
           "Il avait une casquette noire, une veste noire genre bombers et un jogging gris clair. Il "
           "avait des baskets blanches je crois."),
          ("qr", "Pouvez-vous décrire les gestes de l'auteur lors du vol du sac ?",
           "Il est venu par derrière et il a tiré d'un coup sec sur le sac. La dame s'est accrochée à la "
           "sangle, elle a été tirée sur un mètre à peu près et elle est tombée en avant. Je n'ai pas vu "
           "de coup de poing."),
          ("qr", "Où vous trouviez-vous au moment de la chute de la victime ?",
           "Oui, j'étais à une dizaine de mètres, en face. Elle est tombée sur les genoux et sur les mains. "
           "Il ne l'a pas frappée, il a tiré et le sac est parti quand la sangle a cassé."),
          ("qr", "Avez-vous vu la direction prise par l'auteur ?",
           "Il est parti en courant vers la rue de Marseille. Je l'ai suivi des yeux et je l'ai vu jeter "
           "quelque chose dans une poubelle au coin de la rue de l'Université."),
          ("qr", "Pourriez-vous reconnaître l'auteur ?",
           "Je ne pense pas. Je l'ai surtout vu de dos et de profil, il avait la casquette baissée."),
          ("qr", "Avez-vous d'autres éléments à porter à notre connaissance ?",
           "Non. La dame était très choquée, elle pleurait et elle disait qu'il l'avait frappée."),
          ("p", "Lecture faite par lui-même, M. Yacine BOUZID persiste et signe avec nous le présent "
                "procès-verbal, clos à 21h50."),
          ("sig", [("Le témoin :", "L'agent de police judiciaire :"),
                   ("Y. BOUZID", "BP K. VIDAL")]),
      ])

# D10 --------------------------------------------------------------------
piece(10, "quart", ["PROCÈS-VERBAL D'AVIS À MAGISTRAT"],
      "Suite du procès-verbal d'avis à magistrat",
      [
          ("p", ouverture(17, 21, 56)),
          ("p", "Nous, Damien COSTE, Lieutenant de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction au commissariat de Lyon 7ème,"),
          ("p", "Vu l'article 63 du code de procédure pénale,"),
          ("p", "Avisons par courriel puis par téléphone Madame Laure DESCHAMPS, substitut du procureur de "
                "la République de permanence au parquet de Lyon, service du traitement en temps réel, du "
                "placement en garde à vue de VERGNE Anthony, né le 11/06/2002 à Saint-Étienne (Loire), "
                "depuis le 17 septembre 2026 à 18h11, heure de son interpellation, pour des faits de vol "
                "avec violences et de détention de produits stupéfiants commis le même jour à Lyon 7ème."),
          ("p", "Informons le magistrat des motifs justifiant la mesure au regard de l'article 62-2 du "
                "code de procédure pénale ainsi que de la qualification des faits notifiée à "
                "l'intéressé."),
          ("p", "Le magistrat nous prescrit de poursuivre la mesure, de procéder à l'audition de la "
                "personne gardée à vue, à l'exploitation des images de vidéoprotection et à la "
                "vérification de sa situation pénale, et de lui rendre compte le 18/09/2026 dans la "
                "matinée."),
          ("p", "Dont procès-verbal."),
          ("sig", [("", "L'officier de police judiciaire :"), ("", "Lieutenant D. COSTE")]),
      ])

# D11 --------------------------------------------------------------------
piece(11, "umj", ["CERTIFICAT MÉDICAL",
                  "EXAMEN D'UNE PERSONNE PLACÉE EN GARDE À VUE"],
      "Suite du certificat médical",
      [
          ("p", "Lyon, le 17 septembre 2026."),
          ("p", "Je soussignée, Docteur Claire MONTEIL, médecin à l'unité médico-judiciaire de Lyon, "
                "agissant sur réquisition du 17/09/2026 reçue à 20h52 émanant du Lieutenant de police "
                "Damien COSTE, commissariat de Lyon 7ème,"),
          ("p", "Certifie avoir examiné ce jour 17/09/2026 à 22h35, dans le local médical du commissariat "
                "de Lyon 7ème, la personne dénommée : VERGNE Anthony, né le 11/06/2002, placé en garde à "
                "vue."),
          ("h", "Doléances"),
          ("p", "Douleur du poignet gauche depuis le menottage. Pas d'autre plainte. Déclare une "
                "consommation quotidienne de cannabis, pas d'autre toxique, pas de traitement en cours."),
          ("h", "Examen clinique"),
          ("p", "Patient conscient, orienté, calme et coopérant. Érythème circulaire des deux poignets, "
                "plus marqué à gauche, sans plaie ni déformation, mobilité conservée, compatible avec "
                "le port de menottes. Dermabrasion superficielle de 2 cm de la paume droite."),
          ("p", "Examen des mains : absence de plaie, d'ecchymose ou de tuméfaction de la face dorsale "
                "des mains et des articulations métacarpo-phalangiennes."),
          ("p", "Pas d'autre lésion traumatique récente visible. Constantes normales."),
          ("h", "Conclusion"),
          ("p", "L'état de santé de l'intéressé est compatible avec la mesure de garde à vue dans les "
                "locaux de police. Pas de traitement nécessaire. Pas de nouvel examen requis sauf "
                "demande de l'intéressé."),
          ("p", "Certificat établi à la demande de l'autorité requérante et remis en main propre à "
                "l'officier de police judiciaire."),
          ("p", "Fait à Lyon, le 17/09/2026 à 22h50."),
          ("sig", [("", "Docteur C. MONTEIL"), ("", "Médecin légiste")]),
      ], meta=False)

# D12 --------------------------------------------------------------------
piece(12, "quart", ["PROCÈS-VERBAL DE DÉROULEMENT DE L'ENTRETIEN AVEC L'AVOCAT"],
      "Suite du procès-verbal d'entretien avec l'avocat",
      [
          ("p", ouverture(17, 23, 40)),
          ("p", "Nous, Damien COSTE, Lieutenant de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction au commissariat de Lyon 7ème,"),
          ("p", "Vu les articles 63-4 et 63-4-1 du code de procédure pénale,"),
          ("p", "Concernant la personne gardée à vue dénommée : VERGNE Anthony, né le 11/06/2002 à "
                "Saint-Étienne (Loire),"),
          ("p", "Demande d'entretien formulée le 17/09/2026 à 20h41, lors de la notification des droits."),
          ("p", "Mentionnons que Maître Bastien LAFARGUE, avocat au barreau de Lyon, commis d'office, "
                "s'est présenté au service à 23h05."),
          ("p", "Entretien confidentiel réalisé le 17/09/2026 de 23h10 à 23h40, dans un local permettant "
                "d'en garantir la confidentialité."),
          ("p", "Mentionnons que l'avocat a pu consulter, préalablement à l'entretien, le procès-verbal de "
                "notification du placement en garde à vue et des droits, le certificat médical établi à "
                "22h35 et le procès-verbal d'interpellation, conformément à l'article 63-4-1 du code de "
                "procédure pénale."),
          ("p", "Mentionnons que Maître LAFARGUE nous indique vouloir assister son client lors de ses "
                "auditions et confrontations."),
          ("sig", [("L'avocat :", "L'officier de police judiciaire :"),
                   ("Me B. LAFARGUE", "Lieutenant D. COSTE")]),
      ])

# D13 --------------------------------------------------------------------
piece(13, "quart", ["PROCÈS-VERBAL D'AUDITION DE PERSONNE GARDÉE À VUE"],
      "Suite du procès-verbal d'audition de VERGNE Anthony (première audition)",
      [
          ("p", ouverture(17, 23, 45)),
          ("p", "Nous, Damien COSTE, Lieutenant de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction au commissariat de Lyon 7ème, agissant en flagrant délit,"),
          ("p", "Entendons la personne gardée à vue ci-après désignée, en présence de Maître Bastien "
                "LAFARGUE, avocat au barreau de Lyon :"),
          ("liste", [
              "Nom : VERGNE",
              "Prénom : Anthony",
              "Né le 11/06/2002 à Saint-Étienne (Loire)",
              "Fils de Didier VERGNE et de Nadine VERGNE",
              "Nationalité : française",
              "Situation familiale : célibataire, sans enfant",
              "Profession : préparateur de commandes intérimaire",
              "Domicile : chez sa mère, 12 rue des Tilleuls à Vénissieux (69200)",
          ]),
          ("p", "Mentionnons que l'intéressé est de nouveau informé de son droit, après avoir décliné son "
                "identité, de faire des déclarations, de répondre aux questions qui lui sont posées ou de "
                "se taire. Il déclare vouloir répondre."),
          ("qr", "Où vous trouviez-vous le 17 septembre 2026 vers 18 heures ?",
           "J'étais chez un copain, Kévin, vers Jean Macé. Je suis parti de chez lui vers 18h05 pour "
           "aller prendre le métro à Guillotière."),
          ("qr", "Quel est le nom de famille et l'adresse de ce Kévin ?",
           "Je ne connais pas son nom de famille. Il habite rue Chevreul mais je ne sais pas le numéro."),
          ("qr", "Comment expliquez-vous la présence sur vous du téléphone de Mme DELCOURT ?",
           "Je l'ai trouvé par terre rue de Marseille, sur le trottoir, en marchant. Je l'ai ramassé, je "
           "comptais le déposer au commissariat."),
          ("qr", "Pourquoi avez-vous pris la fuite à la vue des policiers ?",
           "J'ai eu peur à cause du shit que j'avais sur moi. Je n'ai pas réfléchi."),
          ("qr", "Reconnaissez-vous avoir arraché le sac de Mme DELCOURT avenue Berthelot ?",
           "Non. Je n'ai jamais touché à ce sac. Je ne suis même pas passé avenue Berthelot."),
          ("qr", "Pourquoi le téléphone a-t-il sonné quand son numéro a été composé ?",
           "Parce que je l'avais ramassé, je vous l'ai dit. Je ne savais pas à qui il était."),
          ("qr", "À qui appartiennent les neuf barrettes de résine de cannabis ?",
           "C'est à moi, c'est pour ma consommation. Je fume depuis mes seize ans, j'achète pour la "
           "semaine parce que ça revient moins cher."),
          ("qr", "D'où provient la somme de 185 euros découverte sur vous ?",
           "C'est ma paye d'intérim. J'ai retiré de l'argent lundi au distributeur de Vénissieux."),
          ("qr", "Portiez-vous un sweat à capuche gris ce jour ?",
           "Non, je n'en ai pas. J'avais mon bombers noir et ma casquette noire, comme maintenant."),
          ("qr", "Avez-vous été blessé lors de votre interpellation ?",
           "J'ai mal au poignet à cause des menottes, elles étaient trop serrées. Le médecin m'a vu."),
          ("qr", "Avez-vous quelque chose à ajouter ?",
           "Je n'ai rien fait à cette dame. Je veux que ma mère soit prévenue."),
          ("p", "Mentionnons qu'à l'issue de l'audition, Maître LAFARGUE pose la question suivante :"),
          ("qr", "Avez-vous porté un coup à qui que ce soit ce soir ?",
           "Non, jamais. Je n'ai frappé personne."),
          ("p", "Maître LAFARGUE indique qu'il déposera des observations écrites qui seront jointes à la "
                "procédure."),
          ("p", "Mentionnons que l'audition a débuté le 17/09/2026 à 23h45 et s'est achevée le 18/09/2026 "
                "à 00h40."),
          ("p", "Lecture faite par lui-même, l'intéressé persiste et signe avec nous et son avocat le "
                "présent procès-verbal."),
          ("sig", [("La personne gardée à vue :", "L'avocat :"),
                   ("A. VERGNE", "Me B. LAFARGUE"),
                   ("", "L'officier de police judiciaire :"),
                   ("", "Lieutenant D. COSTE")]),
      ])

# D14 --------------------------------------------------------------------
piece(14, "utj", ["PROCÈS-VERBAL DE CONSTATATIONS",
                  "PESÉE ET TEST DE PRODUITS STUPÉFIANTS"],
      "Suite du procès-verbal de pesée",
      [
          ("p", ouverture(18, 8, 5)),
          ("p", "Nous, Nathalie ROCHER, Capitaine de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction à l'unité de traitement judiciaire du commissariat de Lyon 7ème, "
                "poursuivant l'enquête de flagrance,"),
          ("p", "Procédons à l'ouverture du scellé numéro UN, constitué le 17/09/2026 à 18h50 par le "
                "Lieutenant de police COSTE, en l'absence de la personne gardée à vue, qui ne l'a pas "
                "demandé."),
          ("p", "Constatons que le scellé contient un sachet de congélation renfermant neuf barrettes "
                "d'une substance brunâtre compacte, chacune emballée individuellement dans du film "
                "plastique transparent, de dimensions et d'aspect homogènes."),
          ("p", "Procédons à la pesée au moyen de la balance de précision du service, préalablement "
                "tarée :"),
          ("liste", [
              "poids brut de l'ensemble, emballages compris : 23,4 grammes ;",
              "poids net de la substance, hors emballages : 21,9 grammes ;",
              "poids unitaire moyen : 2,4 grammes par barrette.",
          ]),
          ("p", "Prélevons un fragment de l'une des barrettes et le soumettons à un test de dépistage de "
                "type narcotest. Le réactif présente une coloration caractéristique d'une réaction "
                "positive au tétrahydrocannabinol (THC)."),
          ("p", "Reconstituons le scellé numéro UN, que nous étiquetons et signons."),
          ("sig", [("", "L'officier de police judiciaire :"), ("", "Capitaine N. ROCHER")]),
      ])

# D15 --------------------------------------------------------------------
piece(15, "utj", ["PROCÈS-VERBAL D'AVIS À FAMILLE"],
      "Suite du procès-verbal d'avis à famille",
      [
          ("p", ouverture(18, 8, 15)),
          ("p", "Nous, Nathalie ROCHER, Capitaine de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction à l'unité de traitement judiciaire du commissariat de Lyon 7ème,"),
          ("p", "Vu l'article 63-2 du code de procédure pénale,"),
          ("p", "Vu la demande formulée par VERGNE Anthony, placé en garde à vue, lors de la notification "
                "de ses droits,"),
          ("p", "Donnons avis par téléphone à Mme Nadine VERGNE, mère de la personne gardée à vue, "
                "joignable au 06 39 98 17 54, de la mesure de garde à vue dont son fils fait l'objet "
                "depuis le 17/09/2026 à 18h11."),
          ("p", "Mme Nadine VERGNE prend acte de cet avis. Elle nous indique que son fils réside chez "
                "elle, 12 rue des Tilleuls à Vénissieux (69200), et qu'il travaille actuellement en "
                "intérim."),
          ("p", "Dont procès-verbal."),
          ("sig", [("", "L'officier de police judiciaire :"), ("", "Capitaine N. ROCHER")]),
      ])

# D16 --------------------------------------------------------------------
piece(16, "umj", ["CERTIFICAT MÉDICAL INITIAL",
                  "DÉTERMINATION DE L'INCAPACITÉ TOTALE DE TRAVAIL"],
      "Suite du certificat médical initial",
      [
          ("p", "Lyon, le 18 septembre 2026."),
          ("p", "Je soussigné, Docteur Paul ESTRADE, médecin légiste à l'unité médico-judiciaire de Lyon, "
                "agissant sur réquisition de l'officier de police judiciaire du commissariat de Lyon "
                "7ème en date du 17 septembre 2026,"),
          ("p", "Certifie avoir examiné le 18 septembre 2026 à 9h40, à l'unité médico-judiciaire, la "
                "personne dénommée : DELCOURT Sophie, née le 04/03/1985, qui déclare avoir été victime le 17 septembre 2026 d'un vol "
                "de sac à main commis avec violences sur la voie publique."),
          ("h", "Doléances"),
          ("p", "La patiente rapporte une traction violente sur la bandoulière de son sac, suivie d'une "
                "chute en avant sur les genoux et les mains. Elle déclare avoir reçu un coup de poing à la "
                "joue gauche. Elle se plaint de douleurs du poignet droit, des deux genoux et de la joue "
                "gauche, ainsi que de troubles du sommeil la nuit suivant les faits."),
          ("h", "Examen clinique"),
          ("p", "Poignet droit : ecchymose violacée de 4 cm sur 2 cm de la face antérieure, douleur à la "
                "mobilisation, pas de déformation. Genoux : dermabrasions de 3 cm à droite et de 2 cm à "
                "gauche, en voie de croûtage. Paume gauche : dermabrasion superficielle de 1 cm."),
          ("p", "Face : pas d'ecchymose, pas d'œdème ni de tuméfaction de la région malaire gauche, pas de "
                "plaie endobuccale. La palpation de la joue gauche est décrite comme sensible, sans "
                "lésion objectivable."),
          ("p", "Radiographie du poignet droit réalisée ce jour : absence de lésion osseuse."),
          ("h", "Retentissement psychologique"),
          ("p", "Anxiété réactionnelle, reviviscences et appréhension à l'idée de ressortir seule le soir."),
          ("h", "Conclusion"),
          ("p", "Les lésions constatées au poignet droit, aux genoux et à la paume gauche sont compatibles "
                "avec les faits allégués de traction et de chute. Aucune lésion n'est constatée au niveau "
                "de la face. L'incapacité totale de travail au sens pénal est fixée à 6 (six) jours, "
                "sous réserve de complications."),
          ("p", "Fait à Lyon, le 18/09/2026 à 10h15."),
          ("sig", [("", "Docteur P. ESTRADE"), ("", "Médecin légiste")]),
      ], meta=False)

# D17 --------------------------------------------------------------------
piece(17, "utj", ["PROCÈS-VERBAL DE CONSTATATIONS",
                  "EXPLOITATION DES IMAGES DE VIDÉOPROTECTION"],
      "Suite du procès-verbal d'exploitation des images de vidéoprotection",
      [
          ("p", ouverture(18, 10, 30)),
          ("p", "Nous, Inès LEROY, Gardien de la paix, agent de police judiciaire en fonction au "
                "commissariat de Lyon 7ème, agissant sous la direction de la Capitaine de police Nathalie "
                "ROCHER, officier de police judiciaire, poursuivant l'enquête de flagrance,"),
          ("p", "Procédons à l'exploitation des deux enregistrements suivants, extraits le 18/09/2026 :"),
          ("liste", [
              "Source 1 : caméra intérieure du tabac-presse Le Carillon, orientée vers la vitrine et le "
              "trottoir de l'avenue Berthelot, extraction réalisée avec l'accord du gérant.",
              "Source 2 : caméra de vidéoprotection urbaine implantée à l'angle de la rue de Marseille "
              "et de la rue de l'Université, extraction réalisée sur réquisition auprès du centre de "
              "supervision urbaine de la Ville de Lyon.",
          ]),
          ("p", "Mentionnons que l'horloge de l'enregistreur de la source 1 présente une avance de 3 "
                "minutes par rapport à l'heure légale, constatée par comparaison avec l'horloge "
                "parlante. Les horaires indiqués ci-après pour cette source sont corrigés. L'horloge de "
                "la source 2 est synchronisée."),
          ("h", "Source 1 - tabac-presse Le Carillon"),
          ("p", "À 17h57min48s, une femme vêtue d'un manteau clair, portant un sac à main en bandoulière "
                "sur l'épaule droite, entre dans le champ par la gauche et marche en direction de l'arrêt "
                "de tramway."),
          ("p", "À 17h58min12s, un individu de sexe masculin entre dans le champ par la droite, en "
                "marchant rapidement derrière la femme. Il porte un couvre-chef de type casquette de "
                "couleur sombre, un vêtement haut de couleur sombre et un bas de couleur claire. La "
                "qualité des images et la visière de la casquette ne permettent pas de distinguer les "
                "traits du visage."),
          ("p", "À 17h58min15s, l'individu saisit le sac de la femme à deux mains et tire vers l'arrière. "
                "La femme retient la bandoulière. Elle est entraînée sur environ un mètre puis chute vers "
                "l'avant, sur les genoux et les mains, à 17h58min17s. La bandoulière cède au même moment."),
          ("p", "Mentionnons qu'aucun geste de frappe de l'individu en direction de la femme n'est visible "
                "sur les images. Mentionnons que l'individu se trouve en permanence derrière la femme "
                "durant la séquence."),
          ("p", "À 17h58min19s, l'individu quitte le champ en courant par la gauche, le sac à la main, en "
                "direction de la rue de Marseille. Un homme en tee-shirt clair sort de la boutique et se "
                "dirige vers la femme à 17h58min25s."),
          ("h", "Source 2 - angle rue de Marseille et rue de l'Université"),
          ("p", "À 17h58min41s, un individu dont la silhouette et la tenue sont compatibles avec celles "
                "décrites ci-dessus entre dans le champ en courant, un sac sombre à la main."),
          ("p", "À 17h58min50s, l'individu soulève le couvercle du conteneur à ordures ménagères situé à "
                "l'angle, y jette le sac, puis repart en marchant rapidement en direction de la rue "
                "Sébastien-Gryphe. Il manipule un objet de petite taille, pouvant être un téléphone "
                "portable, avant de le glisser dans la poche droite de son vêtement haut."),
          ("p", "Le visage de l'individu n'est pas exploitable sur cette source en raison de la distance "
                "et de l'angle de prise de vue."),
          ("p", "Gravons les deux séquences sur un disque, que nous plaçons sous scellé numéro CINQ, et "
                "réalisons les planches photographiques jointes au présent procès-verbal."),
          ("sig", [("", "L'agent de police judiciaire :"), ("", "GPX I. LEROY")]),
      ])

# D18 --------------------------------------------------------------------
piece(18, "utj", ["PROCÈS-VERBAL D'AUDITION DE PERSONNE GARDÉE À VUE"],
      "Suite du procès-verbal d'audition de VERGNE Anthony (deuxième audition)",
      [
          ("p", ouverture(18, 11, 30)),
          ("p", "Nous, Nathalie ROCHER, Capitaine de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction à l'unité de traitement judiciaire du commissariat de Lyon 7ème, "
                "poursuivant l'enquête de flagrance,"),
          ("p", "Entendons de nouveau VERGNE Anthony, placé en garde à vue, déjà identifié, en présence "
                "de Maître Bastien LAFARGUE, avocat au barreau de Lyon, avisé de la présente audition à "
                "09h05 par téléphone."),
          ("p", "Mentionnons que l'intéressé est de nouveau informé de son droit de faire des "
                "déclarations, de répondre aux questions qui lui sont posées ou de se taire. Il déclare "
                "vouloir répondre."),
          ("qr", "Comment expliquez-vous la présence sur vous du téléphone de Mme DELCOURT ?",
           "Je ne vous ai pas dit toute la vérité hier. Un gars me l'a vendu 40 euros place "
           "Gabriel-Péri, vers 18h05. Je ne le connais pas. Je savais que ce n'était pas net, c'est "
           "pour ça que j'ai dit que je l'avais trouvé."),
          ("qr", "Hier, vous disiez avoir quitté votre ami vers 18h05. Qu'en est-il ?",
           "Je suis parti de chez Kévin un peu avant, vers 18h, et j'ai croisé le gars place "
           "Gabriel-Péri. Je ne regardais pas l'heure."),
          ("qr", "Pouvez-vous décrire l'homme qui vous a vendu ce téléphone ?",
           "Un jeune, plus petit que moi, avec une capuche. Je ne l'avais jamais vu."),
          ("qr", "Pourquoi acheter un téléphone dont vous saviez l'origine douteuse ?",
           "Pour le revendre plus cher, je ne vais pas vous mentir. Mais je ne l'ai pas volé."),
          ("qr", "Sur les images, l'auteur est vêtu comme vous. Qu'en dites-vous ?",
           "La moitié du quartier est habillée comme ça. On ne voit pas mon visage sur vos images, ce "
           "n'est pas moi."),
          ("qr", "L'auteur a jeté le sac rue de l'Université à 17h58. Où étiez-vous ?",
           "Je n'étais pas là. À cette heure-là j'étais encore chez Kévin ou dans la rue, je ne sais "
           "plus exactement."),
          ("qr", "Pouvez-vous communiquer le numéro de téléphone de Kévin ?",
           "Non, je ne l'ai plus, j'ai changé de téléphone la semaine dernière et j'ai perdu mes "
           "contacts."),
          ("qr", "Ces barrettes emballées une à une étaient-elles destinées à la vente ?",
           "Non. Je les achète déjà comme ça. Je ne vends pas, je fume tous les jours."),
          ("qr", "Avez-vous autre chose à déclarer ?",
           "Je regrette d'avoir acheté ce téléphone. Pour le reste je n'ai rien fait."),
          ("p", "Mentionnons que Maître LAFARGUE formule l'observation suivante, qu'il demande de "
                "consigner : aucun élément de la procédure ne permet d'identifier le visage de l'auteur "
                "sur les images exploitées."),
          ("p", "Mentionnons que l'audition a débuté à 11h30 et s'est achevée à 12h20."),
          ("p", "Lecture faite par lui-même, l'intéressé persiste et signe avec nous et son avocat le "
                "présent procès-verbal."),
          ("sig", [("La personne gardée à vue :", "L'avocat :"),
                   ("A. VERGNE", "Me B. LAFARGUE"),
                   ("", "L'officier de police judiciaire :"),
                   ("", "Capitaine N. ROCHER")]),
      ])

# D19 --------------------------------------------------------------------
piece(19, "utj", ["PROCÈS-VERBAL DE CONFRONTATION"],
      "Suite du procès-verbal de confrontation",
      [
          ("p", ouverture(18, 13, 15)),
          ("p", "Nous, Nathalie ROCHER, Capitaine de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction à l'unité de traitement judiciaire du commissariat de Lyon 7ème, "
                "poursuivant l'enquête de flagrance,"),
          ("p", "Mettons en présence l'une de l'autre les personnes ci-après désignées :"),
          ("liste", [
              "Mme Sophie DELCOURT, plaignante, déjà entendue ;",
              "VERGNE Anthony, placé en garde à vue, déjà entendu, assisté de Maître Bastien LAFARGUE, "
              "avocat au barreau de Lyon, avisé à 11h45.",
          ]),
          ("p", "Mentionnons que Mme Sophie DELCOURT a accepté la confrontation et qu'elle déclare ne pas "
                "souhaiter être assistée par un avocat."),
          ("p", "Donnons lecture aux parties de leurs déclarations respectives."),
          ("qr", "à Mme DELCOURT : Reconnaissez-vous la personne ici présente ?",
           "Je ne peux pas être formelle. Je l'ai vu de dos puis de trois quarts quand il est parti. "
           "C'est la même carrure et la même taille, c'est tout ce que je peux dire."),
          ("qr", "à Mme DELCOURT : Vous avez décrit une casquette rouge. Le maintenez-vous ?",
           "Tout est allé très vite. J'ai dit rouge mais je ne suis plus sûre de la couleur, elle était "
           "peut-être foncée."),
          ("qr", "à Mme DELCOURT : Maintenez-vous avoir reçu un coup de poing au visage ?",
           "Je maintiens que j'ai reçu un choc au visage. Je ne sais plus si c'est son poing ou si c'est "
           "quand je suis tombée, mais j'avais mal à la joue."),
          ("qr", "à Mme DELCOURT : À quelle heure les faits ont-ils eu lieu selon vous ?",
           "Je pensais qu'il était plus tard mais si le monsieur du tabac a appelé tout de suite, "
           "c'était sûrement avant 18h."),
          ("qr", "à VERGNE Anthony : Qu'avez-vous à répondre ?",
           "Je maintiens ce que j'ai dit ce matin. J'ai acheté le téléphone, je n'ai pas arraché le sac "
           "de madame et je ne l'ai jamais frappée."),
          ("qr", "à VERGNE Anthony : Avez-vous quelque chose à dire à Mme DELCOURT ?",
           "Je suis désolé pour ce qu'elle a subi mais ce n'est pas moi."),
          ("p", "Maître LAFARGUE ne formule pas de question."),
          ("p", "Mentionnons que la confrontation a débuté à 13h15 et s'est achevée à 13h55."),
          ("p", "Lecture faite par elles-mêmes, les parties persistent et signent avec nous et l'avocat "
                "le présent procès-verbal."),
          ("sig", [("La plaignante :", "La personne gardée à vue :"),
                   ("S. DELCOURT", "A. VERGNE"),
                   ("L'avocat :", "L'officier de police judiciaire :"),
                   ("Me B. LAFARGUE", "Capitaine N. ROCHER")]),
      ])

# D20 --------------------------------------------------------------------
piece(20, "utj", ["PROCÈS-VERBAL DE RESTITUTION"],
      "Suite du procès-verbal de restitution",
      [
          ("p", ouverture(18, 14, 0)),
          ("p", "Nous, Nathalie ROCHER, Capitaine de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction à l'unité de traitement judiciaire du commissariat de Lyon 7ème,"),
          ("p", "Vu l'article 56 du code de procédure pénale, vu l'accord du procureur de la République "
                "recueilli le 18/09/2026 à 09h20,"),
          ("p", "Restituons à Mme Sophie DELCOURT, qui le reconnaît comme sien, le téléphone portable de "
                "marque Samsung, modèle Galaxy A55, de couleur bleu marine, correspondant à la ligne "
                "06 39 98 41 27, après ouverture du scellé numéro TROIS, ainsi que son sac à main et "
                "l'ensemble de son contenu décrit au procès-verbal de découverte."),
          ("p", "Mme Sophie DELCOURT déclare que la somme d'environ 60 euros contenue dans son portefeuille "
                "ne lui a pas été restituée."),
          ("p", "Lecture faite par elle-même, Mme Sophie DELCOURT persiste et signe avec nous."),
          ("sig", [("La bénéficiaire :", "L'officier de police judiciaire :"),
                   ("S. DELCOURT", "Capitaine N. ROCHER")]),
      ])

# D21 --------------------------------------------------------------------
piece(21, "cjn", ["BULLETIN N° 1 DU CASIER JUDICIAIRE"],
      "Suite du bulletin n° 1",
      [
          ("p", "Relevé intégral des fiches du casier judiciaire applicables à la même personne, délivré "
                "le 18/09/2026 à 11h02, au procureur de la République près le tribunal judiciaire de "
                "Lyon."),
          ("liste", [
              "Nom : VERGNE",
              "Prénom : Anthony",
              "Né le 11/06/2002 à Saint-Étienne (42)",
              "Sexe : masculin - Nationalité : française",
          ]),
          ("p", "Le bulletin comporte trois condamnations :"),
          ("h", "Condamnation n° 1"),
          ("liste", [
              "Date de la décision : 14/04/2021",
              "Juridiction : tribunal correctionnel de Saint-Étienne, jugement contradictoire",
              "Nature de l'infraction : vol, faits commis le 02/01/2021 à Saint-Étienne",
              "Peine : 70 heures de travail d'intérêt général, exécutées",
          ]),
          ("h", "Condamnation n° 2"),
          ("liste", [
              "Date de la décision : 09/02/2023",
              "Juridiction : tribunal correctionnel de Lyon, ordonnance pénale",
              "Nature de l'infraction : usage illicite de stupéfiants, faits commis le 12/11/2022 à Lyon",
              "Peine : amende de 300 euros",
          ]),
          ("h", "Condamnation n° 3"),
          ("liste", [
              "Date de la décision : 27/06/2024",
              "Juridiction : tribunal correctionnel de Lyon, jugement contradictoire",
              "Nature de l'infraction : vol en réunion, faits commis le 03/05/2024 à Villeurbanne",
              "Peine : 4 mois d'emprisonnement avec sursis simple",
          ]),
          ("p", "Fin du relevé."),
      ], meta=False)

# D22 --------------------------------------------------------------------
piece(22, "esr", ["ENQUÊTE SOCIALE RAPIDE",
                  "ENQUÊTE DE PERSONNALITÉ (ARTICLE 41 DU CODE DE PROCÉDURE PÉNALE)"],
      "Suite de l'enquête sociale rapide concernant VERGNE Anthony",
      [
          ("p", "Enquête réalisée le 18/09/2026 à 14h30, dans les locaux du commissariat de Lyon "
                "7ème, sur réquisition du parquet de Lyon, par Mme Amandine ROYER, enquêtrice sociale."),
          ("p", "Personne concernée : VERGNE Anthony, né le 11/06/2002 à Saint-Étienne (Loire), âgé de "
                "24 ans."),
          ("h", "Situation familiale"),
          ("p", "Anthony VERGNE est l'aîné d'une fratrie de deux enfants. Ses parents se sont séparés "
                "lorsqu'il avait neuf ans. Il n'a plus de contact avec son père depuis 2015. Il vit avec "
                "sa mère, Mme Nadine VERGNE, aide-soignante, et sa sœur cadette âgée de 17 ans, au "
                "domicile familial situé 12 rue des Tilleuls à Vénissieux (69200). Il est célibataire, "
                "sans enfant, et déclare une relation sentimentale depuis un an."),
          ("h", "Scolarité et formation"),
          ("p", "Il a obtenu un CAP opérateur logistique en 2019. Il a ensuite suivi une formation de "
                "cariste qu'il n'a pas menée à son terme."),
          ("h", "Situation professionnelle et ressources"),
          ("p", "Anthony VERGNE travaille comme préparateur de commandes par l'intermédiaire de l'agence "
                "d'intérim Horizon Emploi de Vénissieux. Il est en mission depuis le 1er juillet 2026 "
                "dans un entrepôt de Corbas, mission prévue jusqu'au 30 octobre 2026. Il déclare un "
                "revenu mensuel moyen de 1 400 euros. Il participe aux charges du foyer à hauteur de 300 "
                "euros par mois. Il ne déclare pas de dette."),
          ("h", "Santé"),
          ("p", "Il déclare une consommation quotidienne de résine de cannabis depuis l'âge de 16 ans, "
                "de l'ordre de cinq joints par jour. Il n'a jamais bénéficié d'un suivi en addictologie "
                "et se dit prêt à en engager un. Il ne signale pas d'autre problème de santé."),
          ("h", "Antécédents judiciaires"),
          ("p", "L'intéressé reconnaît avoir déjà été condamné, notamment pour un vol en 2024, pour lequel "
                "il a été condamné à une peine d'emprisonnement avec sursis. Il indique ne pas faire "
                "l'objet d'un suivi par le service pénitentiaire d'insertion et de probation."),
          ("h", "Vérifications effectuées"),
          ("p", "Mme Nadine VERGNE, jointe au 06 39 98 17 54 à 14h50, confirme héberger son fils de façon "
                "stable et se déclare prête à continuer de l'accueillir. L'agence Horizon Emploi, jointe "
                "à 14h55, confirme la mission en cours et précise que l'intéressé est apprécié et "
                "ponctuel. Le domicile n'a pas pu faire l'objet d'une visite."),
          ("h", "Avis de l'enquêtrice"),
          ("p", "Anthony VERGNE dispose d'un hébergement stable chez sa mère, d'une activité "
                "professionnelle en cours et d'un entourage familial mobilisé. Sa consommation de "
                "cannabis apparaît installée et non prise en charge. Au regard des éléments recueillis, "
                "l'intéressé présente des garanties de représentation. Une mesure de contrôle judiciaire "
                "comportant une obligation de soins et le maintien de l'activité professionnelle "
                "apparaît envisageable."),
          ("p", "Fin de l'entretien à 15h00. Fait à Lyon, le 18/09/2026 à 15h05."),
          ("sig", [("", "L'enquêtrice sociale :"), ("", "A. ROYER")]),
      ], meta=False)

# D23 --------------------------------------------------------------------
piece(23, "utj", ["PROCÈS-VERBAL DE COMPTE RENDU AU MAGISTRAT"],
      "Suite du procès-verbal de compte rendu au magistrat",
      [
          ("p", ouverture(18, 15, 10)),
          ("p", "Nous, Nathalie ROCHER, Capitaine de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction à l'unité de traitement judiciaire du commissariat de Lyon 7ème,"),
          ("p", "Rendons compte par téléphone à Madame Laure DESCHAMPS, substitut du procureur de la "
                "République de permanence au parquet de Lyon, de l'ensemble des investigations "
                "réalisées : audition de la victime et du témoin, certificats médicaux, exploitation des "
                "images de vidéoprotection, pesée des produits stupéfiants, auditions de la personne "
                "gardée à vue et confrontation, bulletin n° 1 du casier judiciaire et enquête sociale "
                "rapide."),
          ("p", "Le magistrat nous prescrit de mettre fin à la mesure de garde à vue et de conduire "
                "VERGNE Anthony au dépôt du tribunal judiciaire de Lyon afin qu'il soit présenté au "
                "procureur de la République le 18/09/2026, en vue d'une comparution immédiate."),
          ("p", "Dont procès-verbal."),
          ("sig", [("", "L'officier de police judiciaire :"), ("", "Capitaine N. ROCHER")]),
      ])

# D24 --------------------------------------------------------------------
piece(24, "utj", ["PROCÈS-VERBAL DE FIN DE GARDE À VUE ET DE DÉFÈREMENT"],
      "Suite du procès-verbal de fin de garde à vue de VERGNE Anthony",
      [
          ("p", ouverture(18, 15, 40)),
          ("p", "Nous, Nathalie ROCHER, Capitaine de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction à l'unité de traitement judiciaire du commissariat de Lyon 7ème,"),
          ("p", "Vu les articles 63 et 64 du code de procédure pénale, vu les instructions du procureur de "
                "la République,"),
          ("p", "Mettons fin ce jour à 15h40 à la mesure de garde à vue de la personne dénommée : VERGNE "
                "Anthony, né le 11/06/2002 à Saint-Étienne (Loire), placée en garde à vue le 17/09/2026 "
                "à 18h11, heure de son interpellation."),
          ("p", "Mentionnons, conformément à l'article 64 du code de procédure pénale, les éléments "
                "suivants :"),
          ("liste", [
              "Auditions : le 17/09/2026 de 23h45 au 18/09/2026 à 00h40 ; le 18/09/2026 de 11h30 à "
              "12h20 ; confrontation le 18/09/2026 de 13h15 à 13h55.",
              "Repos : entre les actes, en cellule de garde à vue.",
              "Alimentation : repas proposé le 17/09/2026 à 19h30, refusé ; petit déjeuner le "
              "18/09/2026 à 07h30, accepté ; repas le 18/09/2026 à 12h30, accepté.",
              "Examen médical : réalisé le 17/09/2026 à 22h35.",
              "Entretien avec l'avocat : le 17/09/2026 de 23h10 à 23h40.",
              "Avis à famille : donné le 18/09/2026 à 08h15.",
          ]),
          ("p", "Mentionnons que l'intéressé n'a formulé aucune déclaration au terme de la mesure."),
          ("p", "Disons que l'intéressé est conduit sous escorte au dépôt du tribunal judiciaire de Lyon en "
                "vue de sa présentation au procureur de la République."),
          ("p", "Lecture faite par lui-même, l'intéressé persiste et signe avec nous."),
          ("sig", [("La personne concernée :", "L'officier de police judiciaire :"),
                   ("A. VERGNE", "Capitaine N. ROCHER")]),
      ])

# D25 --------------------------------------------------------------------
piece(25, "utj", ["RAPPORT DE SYNTHÈSE"],
      "Suite du rapport de synthèse",
      [
          ("p", ouverture(18, 15, 50)),
          ("p", "Nous, Nathalie ROCHER, Capitaine de police, officier de police judiciaire en résidence à "
                "Lyon, en fonction à l'unité de traitement judiciaire du commissariat de Lyon 7ème,"),
          ("p", "Avons l'honneur de rendre compte à Madame le procureur de la République près le tribunal "
                "judiciaire de Lyon des résultats de l'enquête de flagrance diligentée à l'encontre de "
                "VERGNE Anthony."),
          ("h", "Les faits"),
          ("p", "Le 17/09/2026 vers 17h58, avenue Berthelot à Lyon 7ème, Mme Sophie DELCOURT était "
                "victime d'un vol de son sac à main commis par un individu qui prenait la fuite à pied. "
                "La victime chutait lors de la traction exercée sur son sac. Le sac était découvert à "
                "18h25 dans un conteneur à ordures rue de l'Université, sans l'argent liquide qu'il "
                "contenait."),
          ("p", "À 18h11, les effectifs de la brigade anticriminalité de jour interpellaient VERGNE "
                "Anthony rue Sébastien-Gryphe après une courte poursuite. Il était trouvé porteur du "
                "téléphone portable de la victime, de neuf barrettes de résine de cannabis d'un poids "
                "net de 21,9 grammes et de la somme de 185 euros."),
          ("h", "Les investigations"),
          ("p", "La victime décrivait un auteur porteur d'une casquette rouge et d'un sweat à capuche gris "
                "et indiquait avoir reçu un coup de poing au visage. Le témoin, M. Yacine BOUZID, "
                "décrivait une casquette noire et une veste de type bombers noire et n'avait pas vu de "
                "coup porté. Le certificat médical fixait l'incapacité totale de travail de la victime à "
                "six jours et ne constatait aucune lésion au visage."),
          ("p", "L'exploitation des images de vidéoprotection montrait la traction exercée sur le sac et "
                "la chute de la victime à 17h58, sans geste de frappe visible, puis le jet du sac dans le "
                "conteneur par un individu de tenue compatible avec celle de VERGNE Anthony lors de son "
                "interpellation. Le visage de l'auteur n'était pas exploitable."),
          ("h", "Les déclarations du mis en cause"),
          ("p", "Entendu en présence de son avocat, VERGNE Anthony contestait les faits de vol avec "
                "violences. Il déclarait d'abord avoir trouvé le téléphone sur le trottoir, puis l'avoir "
                "acheté 40 euros à un inconnu place Gabriel-Péri. Il reconnaissait la détention des "
                "produits stupéfiants, qu'il disait destinés à sa consommation personnelle. Lors de la "
                "confrontation, la victime ne le reconnaissait pas formellement."),
          ("h", "Personnalité"),
          ("p", "VERGNE Anthony, 24 ans, réside chez sa mère à Vénissieux et travaille en intérim. Son "
                "casier judiciaire porte trace de trois condamnations, dont une pour vol en réunion le "
                "27/06/2024 à quatre mois d'emprisonnement avec sursis."),
          ("p", "Sur instructions du parquet, VERGNE Anthony est déféré ce jour en vue d'une comparution "
                "immédiate."),
          ("sig", [("", "L'officier de police judiciaire :"), ("", "Capitaine N. ROCHER")]),
      ])
