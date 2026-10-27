# -*- coding: utf-8 -*-
"""
Generates 70 easy, 70 medium, and 70 spicy extra questions for 'souvenirs'.
Together with the 35 existing of each, totals 105 easy, 105 medium, 105 spicy (315 questions).
"""

def get_souvenirs_extras():
    easy = [
        {
            "q": "Quel a été le premier surnom affectueux (ou ridicule) apparu dans votre couple ?",
            "target": "Quel premier surnom as-tu reçu ou donné à {partner} ?",
            "guesser": "Quel a été votre tout premier surnom affectueux avec {target} ?",
            "opts": ["Mon cœur / Bébé classique", "Un diminutif mignon de prénom", "Un nom d'animal loufoque", "Une blague interne un peu kitsch"],
            "hint": "Ce petit mot doux parfois un peu gênant qui reste gravé !"
        },
        {
            "q": "Quelle chanson vous rappelle immédiatement le tout début de votre histoire ?",
            "target": "Quelle chanson te rappelle immédiatement le début avec {partner} ?",
            "guesser": "Quelle chanson rappelle vos débuts à {target} ?",
            "opts": ["Le tube qui passait en boucle à la radio", "Une mélodie douce écoutée en voiture", "Une chanson passée pendant une soirée", "Un slow romantique inoubliable"],
            "hint": "La bande-son officielle de votre premier coup de foudre."
        },
        {
            "q": "Qui a envoyé le premier message après votre tout premier date ?",
            "target": "Qui a envoyé le premier message après votre premier date avec {partner} ?",
            "guesser": "Selon toi, qui a envoyé le premier SMS après le rendez-vous avec {target} ?",
            "opts": ["Moi, dès en rentrant chez moi", "{partner}, dans les 10 minutes", "Le lendemain matin au réveil", "On s'est écrit sans s'arrêter dès le départ"],
            "hint": "Ce fameux texto pour savoir si l'autre était bien rentré..."
        },
        {
            "q": "Quel a été le tout premier film ou série regardé ensemble sous un plaid ?",
            "target": "Quel a été le premier film ou série vu blotti contre {partner} ?",
            "guesser": "Quel premier film ou série as-tu regardé collé(e) contre {target} ?",
            "opts": ["Une comédie romantique bien guimauve", "Un thriller ou film d'action captivant", "Un film d'animation plein de tendresse", "Une série binge-watchée jusqu'au matin"],
            "hint": "Ce film où l'on regardait plus l'autre que l'écran !"
        },
        {
            "q": "Où avez-vous bu votre tout premier café ou verre en tête-à-tête ?",
            "target": "Où as-tu bu ton tout premier verre avec {partner} ?",
            "guesser": "Où avez-vous partagé votre tout premier verre avec {target} ?",
            "opts": ["En terrasse d'un bistrot animé", "Au comptoir d'un bar cosy et tamisé", "Sur un banc dans un parc au calme", "À emporter en marchant dans les rues"],
            "hint": "La première gorgée pleine de timidité et d'étincelles."
        },
        {
            "q": "Quel a été votre premier fou rire incontrôlable à deux ?",
            "target": "Quel a été ton premier fou rire mémorable avec {partner} ?",
            "guesser": "Quel premier fou rire partagé a marqué {target} ?",
            "opts": ["Une maladresse à table en mangeant", "Un lapsus embarrassant mais hilarant", "Une blague nulle qui a fait mouche", "Une chute ou glissade sans gravité"],
            "hint": "Le moment où la timidité a explosé de rire !"
        },
        {
            "q": "Quelle photo de vous deux est devenue votre premier vrai cliché souvenir ?",
            "target": "Quelle première photo mémorable as-tu prise avec {partner} ?",
            "guesser": "Quelle première photo avec {target} te revient immédiatement à l'esprit ?",
            "opts": ["Un selfie un peu flou mais trop mignon", "Une photo volée par un ami complice", "Un cliché pris lors d'un premier week-end", "Une photo dans un photomaton vintage"],
            "hint": "Ce premier cliché où vos deux sourires rayonnaient."
        },
        {
            "q": "Quel a été le premier plat cuisiné pour l'autre au début de l'histoire ?",
            "target": "Quel premier plat as-tu cuisiné (ou fait goûter) à {partner} ?",
            "guesser": "Quel plat préparé au début symbolise votre histoire avec {target} ?",
            "opts": ["Des pâtes travaillées avec une sauce maison", "Un plat commandé en faisant semblant d'avoir cuisiné", "Un dessert gourmand pour impressionner", "Un brunch improvisé du dimanche"],
            "hint": "La séduction passe très souvent par les papilles !"
        },
        {
            "q": "Comment s'est passé votre tout premier 'Je t'aime' de vive voix ?",
            "target": "Comment s'est passé le premier 'Je t'aime' prononcé avec {partner} ?",
            "guesser": "Qui a prononcé le premier 'Je t'aime' selon {target} ?",
            "opts": ["Toi dans un élan spontané et ému", "{partner} murmuré au creux de l'oreille", "Les deux au même moment les yeux dans les yeux", "Par message ou écrit sur un mot doux avant"],
            "hint": "Ces trois petits mots qui font battre le cœur à fond."
        },
        {
            "q": "Quel transport avez-vous pris lors de votre première escapade à deux ?",
            "target": "Quel moyen de transport avez-vous pris pour votre première escapade avec {partner} ?",
            "guesser": "Comment êtes-vous partis lors de votre tout premier voyage avec {target} ?",
            "opts": ["En voiture avec une playlist mémorable", "En train avec la tête posée sur l'épaule", "En avion vers une destination lointaine", "À vélo ou en transport en commun improvisé"],
            "hint": "Le voyage où le trajet comptait autant que la destination."
        },
        {
            "q": "Quel détail vestimentaire t'a tout de suite sauté aux yeux lors du premier date ?",
            "target": "Quel vêtement ou accessoire as-tu remarqué en premier chez {partner} ?",
            "guesser": "Quel détail vestimentaire chez toi a marqué {target} lors du premier rencard ?",
            "opts": ["Ses chaussures impeccablement choisies", "Sa veste ou manteau très élégant", "Son parfum envoûtant senti de loin", "Un bijou ou détail unique qui avait du style"],
            "hint": "Ce look soigné qui prouvait l'envie de séduire."
        },
        {
            "q": "Quel était le sujet futile de votre toute première micro-dispute ?",
            "target": "Quel sujet dérisoire a provoqué votre première chamaillerie avec {partner} ?",
            "guesser": "Sur quel sujet futile avez-vous eu votre première querelle avec {target} ?",
            "opts": ["Le choix de l'itinéraire ou du GPS", "Où aller dîner ce soir-là", "Un retard de quelques minutes au rencard", "Une mauvaise foi manifeste lors d'un jeu"],
            "hint": "La petite tension vite désamorcée par un gros câlin."
        },
        {
            "q": "Quel a été le premier cadeau symbolique offert par l'un à l'autre ?",
            "target": "Quel a été le tout premier cadeau échangé avec {partner} ?",
            "guesser": "De quel premier cadeau offert par {target} te souviens-tu le plus ?",
            "opts": ["Un livre ou vinyle avec une dédicace", "Une gourmandise ou chocolats fins", "Un vêtement ou accessoire de mode", "Un petit objet souvenir clin d'œil"],
            "hint": "Le cadeau qui prouvait qu'on s'écoutait vraiment."
        },
        {
            "q": "Quelle boisson est devenue votre commande automatique au début ?",
            "target": "Quelle boisson commandiez-vous toujours au début avec {partner} ?",
            "guesser": "Quelle était votre boisson fétiche des premiers verres avec {target} ?",
            "opts": ["Une bonne bière fraîche ou artisanale", "Un verre de vin rouge ou blanc partagé", "Un cocktail fruité ou un Spritz", "Un café gourmand ou thé réconfortant"],
            "hint": "La commande lancée d'office dès que le serveur approchait."
        },
        {
            "q": "Comment s'est passée la première rencontre avec la bande d'amis de l'autre ?",
            "target": "Quelle a été l'ambiance lors de ta première soirée avec les amis de {partner} ?",
            "guesser": "Comment s'est passée l'intégration dans le cercle d'amis de {target} ?",
            "opts": ["Coup de cœur amical immédiat et rires", "Un peu réservé au début, puis super naturel", "Un interrogatoire bienveillant et curieux", "On est restés complices dans notre bulle"],
            "hint": "L'épreuve des amis franchie avec succès !"
        },
        {
            "q": "Quel lieu insolite a été le théâtre d'un de vos premiers baisers volés ?",
            "target": "Dans quel lieu insolite avez-vous échangé un de vos premiers baisers avec {partner} ?",
            "guesser": "Quel endroit inattendu évoque un de vos premiers baisers avec {target} ?",
            "opts": ["Sur un quai de gare avant le départ d'un train", "Sous un porche pour s'abriter d'une averse", "Dans un ascenseur entre deux étages", "Sur un belvédère ou un pont la nuit"],
            "hint": "Une scène digne d'un film de cinéma romantique."
        },
        {
            "q": "Quelle météo avez-vous bravée lors de votre première grande promenade ?",
            "target": "Sous quel temps avez-vous marché des heures au début avec {partner} ?",
            "guesser": "Quelle météo accompagnait votre première grande marche avec {target} ?",
            "opts": ["Un soleil radieux et chaleureux", "Une pluie battante sous un seul parapluie", "Un froid d'hiver blottis l'un contre l'autre", "Une brise douce au coucher de soleil"],
            "hint": "L'excuse parfaite pour marcher collés l'un à l'autre."
        },
        {
            "q": "Quel genre de confidence intime as-tu confié en premier à l'autre ?",
            "target": "Quel premier secret ou confidence as-tu partagé avec {partner} ?",
            "guesser": "Quelle première confidence intime t'a confiée {target} ?",
            "opts": ["Une peur d'enfance un peu ridicule", "Un grand rêve que personne d'autre ne savait", "Une blessure du passé aujourd'hui guérie", "Une anecdote de famille croustillante"],
            "hint": "L'instant précis où la confiance totale s'est installée."
        },
        {
            "q": "Qui a fait la toute première gaffe au début de la relation ?",
            "target": "Qui a fait la première bourde attachante entre toi et {partner} ?",
            "guesser": "Qui a commis la première maladresse amusante selon {target} ?",
            "opts": ["Toi en voulant trop bien faire", "{partner} avec une timidité craquante", "Les deux ensemble dans une situation absurde", "Le serveur ou une personne extérieure"],
            "hint": "La gaffe qui a rendu l'instant encore plus mignon."
        },
        {
            "q": "Quel était votre rituel du coucher lors de votre première semaine ensemble ?",
            "target": "Quel était votre rituel avant d'éteindre la lumière avec {partner} ?",
            "guesser": "Quel rituel du coucher a marqué vos premiers moments avec {target} ?",
            "opts": ["Parler pendant des heures jusqu'à 3h du matin", "S'endormir immédiatement enlacés", "Se raconter nos journées dans les détails", "Rigoler sur des vidéos et anecdotes"],
            "hint": "Les yeux qui piquent mais le refus de s'endormir."
        },
        {
            "q": "Quel premier objet oublié chez l'autre a officialisé le cocon ?",
            "target": "Quel premier objet as-tu laissé chez {partner} ?",
            "guesser": "Quel objet laissé chez toi par {target} a officialisé votre nid ?",
            "opts": ["Une brosse à dents flambant neuve", "Un chargeur de smartphone indispensable", "Un t-shirt ou pull fétiche pour dormir", "Un bijou ou produit de beauté sur l'étagère"],
            "hint": "L'art de laisser une petite trace pour vite revenir !"
        },
        {
            "q": "Quel compliment venant de l'autre t'a le plus fait rougir au début ?",
            "target": "Quel compliment de {partner} t'a fait le plus fondre au tout début ?",
            "guesser": "Quel compliment sincère fait à {target} l'a le plus touché(e) ?",
            "opts": ["Sur la beauté et l'intensité de mon regard", "Sur mon rire communicatif et ma joie de vivre", "Sur mon intelligence et ma façon de penser", "Sur mon charme naturel et mon élégance"],
            "hint": "Le mot doux qui t'a donné le sourire pour toute la semaine."
        },
        {
            "q": "Quel a été votre premier fou rire pendant un moment censé être sérieux ?",
            "target": "Quel moment sérieux s'est transformé en crise de rire avec {partner} ?",
            "guesser": "Dans quel moment solennel as-tu explosé de rire avec {target} ?",
            "opts": ["Au cinéma pendant un passage dramatique", "Dans un resto chic et très silencieux", "Pendant une réunion formelle ou présentation", "Lors d'une visite guidée silencieuse"],
            "hint": "Se mordre la lèvre pour ne pas éclater de rire !"
        },
        {
            "q": "Quelle saison de l'année a vu naître votre histoire d'amour ?",
            "target": "En quelle saison votre histoire a-t-elle officiellement commencé avec {partner} ?",
            "guesser": "Quelle saison de l'année symbolise votre début avec {target} ?",
            "opts": ["Au printemps avec le renouveau et la douceur", "En plein été sous le soleil et les vacances", "En automne sous les feuilles dorées et les plaids", "En hiver blottis au chaud au coin du feu"],
            "hint": "L'ambiance et la lumière de cette période magique."
        },
        {
            "q": "Quel SMS mignon des débuts as-tu screené pour ne jamais l'oublier ?",
            "target": "Quel genre de message de {partner} as-tu conservé précieusement ?",
            "guesser": "Quel message doux de ta part {target} a-t-il gardé en mémoire ?",
            "opts": ["Une déclaration poétique envoyée tard la nuit", "Un texto disant à quel point le rencard était parfait", "Une promesse ou un souhait pour le futur", "Une phrase pleine d'esprit qui t'a fait hurler de rire"],
            "hint": "Le texto relu cinquante fois avant de fermer les yeux."
        },
        # 45 more easy questions:
    ]
    
    # Generate remaining items up to 70 with rich templates
    topics_easy = [
        ("votre premier dessert partagé à la petite cuillère", "Tiramisu maison généreux", "Moelleux au chocolat fondant", "Coupe de glace chantilly", "Cheesecake coulis framboise"),
        ("votre première pause gourmande improvisée", "Une crêpe sucrée dans la rue", "Des viennoiseries chaudes du matin", "Un cornet de glace en bord de mer", "Des churros à la fête foraine"),
        ("le premier film d'horreur regardé collés l'un à l'autre", "Mains devant les yeux à chaque sursaut", "Rires nerveux pour masquer la peur", "Un oreiller comme bouclier protecteur", "Zéro peur, analyse cynique du scénario"),
        ("la première fois où vous avez cuisiné à quatre mains", "Une parfaite harmonie de chefs étoilés", "La cuisine enfumée mais le plat réussi", "Un désordre mémorable mais un régal", "Des pâtes trop cuites compensées par l'amour"),
        ("le premier cadeau fait main ou attention artisanale", "Une lettre manuscrite émouvante", "Une playlist musicale confectionnée avec soin", "Un dessin ou bricolage amusant", "Un album photo ou collage souvenir"),
        ("la première soirée passée à regarder les étoiles", "Allongés dans l'herbe en été", "Depuis un balcon ou une terrasse en ville", "Au sommet d'une colline ou plage", "À travers le toit ouvrant d'une voiture"),
        ("la première fois où vous avez dansé ensemble", "Un slow romantique serrés l'un contre l'autre", "Une danse endiablée en soirée festive", "Un pas de danse improvisé dans le salon", "Un petit déhanché timide dans la cuisine"),
        ("votre première visite de musée ou exposition", "Commenter chaque œuvre en chuchotant", "Marcher main dans la main sans un mot", "Chercher l'œuvre la plus insolite pour rigoler", "Admirer passionnément une toile maîtresse"),
        ("votre premier pique-nique dans l'herbe", "Nappe à carreaux et panier garni", "Sandwichs triangles et chips sur le pouce", "Fromage, pain frais et fruits de saison", "Pique-nique gâché par des guêpes curieuses"),
        ("la première fois où vous avez pris la pluie ensemble", "Courir sous l'averse en riant", "Partager une veste au-dessus de la tête", "S'abriter sous un arbre et s'embrasser", "Attendre patiemment dans l'entrée d'un immeuble"),
        ("votre première photo prise dans un miroir d'ascenseur", "Une pose grimace complice", "Un baiser tendre sur la joue", "Un sourire élégant de sortie", "Une accolade spontanée et naturelle"),
        ("la première anecdote de famille racontée à l'autre", "L'histoire de l'oncle excentrique", "Une bêtise d'enfance inoubliable", "Une tradition familiale un peu bizarre", "Un souvenir d'enfance très touchant"),
        ("votre premier réveil un dimanche matin ensemble", "Grâce matinée jusqu'à midi passé", "Petit déjeuner au lit apporté sur un plateau", "Câlins sans fin sous la couette chaude", "Réveil matinal pour profiter de la journée"),
        ("la première surprise organisée pour l'anniversaire de l'autre", "Un dîner aux chandelles dans un bel endroit", "Une fête surprise avec tous ses amis réunis", "Un week-end secret sans révéler la destination", "Un cadeau tant attendu et recherché"),
        ("votre premier long trajet en voiture", "Chanter à tue-tête sur les refrains", "Discussions profondes sur le sens de la vie", "Deviner les plaques d'immatriculation", "Arrêt gourmand à chaque station-service"),
        ("la première fois où vous avez partagé un livre ou podcast", "Lire des passages à haute voix au lit", "Débattre avec passion des idées du livre", "Écouter un podcast captivant sur la route", "Prêter son livre préféré avec des pages cornées"),
        ("votre première balade sur une plage au coucher du soleil", "Pieds nus dans l'écume des vagues", "Ramasser des coquillages ou jolis galets", "S'asseoir sur le sable pour voir le soleil disparaître", "Écrire vos prénoms gravés dans le sable"),
        ("votre première partie de jeu de société à deux", "Mauvaise foi et petites tricheries affectueuses", "Compétition féroce jusqu'au dernier point", "Éclats de rire face aux erreurs de l'autre", "Partie abandonnée pour se faire des câlins"),
        ("la première fois où vous avez partagé une pizza", "Chacun sa moitié de garniture préférée", "Piquer la dernière part avec un grand sourire", "Débat éternel sur la pâte fine vs épaisse", "Manger directement dans le carton sur le canapé"),
        ("la première grasse matinée où vous avez zappé vos réveils", "Panique joyeuse en voyant l'heure tardive", "Décision unanime de rester sous la couette", "Brunch géant pour compenser le retard", "Rire de votre flemme totalement partagée"),
        ("le premier accessoire ou vêtement emprunté à l'autre", "Un gros sweat douillet deux fois trop grand", "Une écharpe chaude qui sent son parfum", "Une veste en jean portée en soirée", "Un bonnet ou casquette volé pour la journée"),
        ("votre premier brunch gourmand en ville", "Pancakes dégoulinants de sirop d'érable", "Œufs Bénédicte et avocat toast savoureux", "Viennoiseries, confitures et jus pressé", "Buffet à volonté où l'on a trop mangé"),
        ("la première fois où l'un a pris soin de l'autre un peu malade", "Préparer un thé chaud au miel et citron", "Border la couette et apporter des médicaments", "Rester collé(e) pour regarder des séries", "Des caresses sur les cheveux pour apaiser la fièvre"),
        ("votre premier souvenir d'achat commun", "Une belle plante verte pour le salon", "Un plaid ultra doux pour les soirées télé", "Une jolie tasse à café ou mug design", "Un jeu de société ou vinyle pour la maison"),
        ("la première fois où vous avez couru ou fait du sport ensemble", "Encouragements mutuels et dépassement de soi", "Abandon rapide pour aller manger une glace", "Footing tranquille en papotant sans arrêt", "Fou rire face aux tenues de sport respectives"),
        ("votre premier voyage dans une ville étrangère", "Perdus sans plan dans des ruelles charmantes", "Visiter tous les monuments incontournables au pas de course", "Tester les spécialités culinaires locales sans hésiter", "Prendre un café en terrasse en observant les gens"),
        ("la première fête foraine ou kermesse faite ensemble", "Tour de grande roue romantique au sommet", "Gagner une peluche ridicule au stand de tir", "Sensations fortes dans un manège à loopings", "Manger de la barbe à papa à deux"),
        ("votre première promenade en forêt ou nature sauvage", "Respirer l'air frais sous la canopée", "S'asseoir sur un tronc moussus pour discuter", "Cueillir des mûres ou fleurs sauvages", "Marcher en silence en écoutant les oiseaux"),
        ("votre premier baiser devant tout le monde en public", "Un baiser doux et discret sur la joue", "Un baiser passionné assumé en pleine foule", "Un baiser volé à un feu rouge ou passage piéton", "Un bisou timide en voyant des regards amusés"),
        ("la première fois où vous avez refait le monde jusqu'à l'aube", "Sur un balcon avec une tisane ou un verre", "Allongés sur un tapis dans le salon", "Dans un lit avec seulement une veilleuse allumée", "En marchant dans une ville totalement endormie"),
        ("votre premier souvenir de Nouvel An célébré ensemble", "Compte à rebours crié à minuit et baiser intense", "Soirée intime et cocooning en amoureux", "Grande fête entre amis avec cotillons et champagne", "Regarder les feux d'artifice depuis la fenêtre"),
        ("le premier livre ou poème lu à deux", "Un poème romantique qui a touché droit au cœur", "Un roman captivant dévoré chapitre par chapitre", "Une bande dessinée lue en rigolant ensemble", "Des citations inspirantes partagées au petit matin"),
        ("la première fois où vous avez chanté en duo en voiture", "Chansons des années 80 chantées à tue-tête", "Refrains pop actuels avec toutes les paroles", "Imitation théâtrale des chanteurs célèbres", "Harmonie parfaite (ou casseroles mémorables)"),
        ("le premier coucher de soleil en terrasse avec vue", "Le ciel flamboyant virant au rose et violet", "Trinquer en admirant le panorama", "Prendre une photo magnifique en contre-jour", "Le silence complice devant la beauté du spectacle"),
        ("votre première soirée jeux vidéo ou mini-jeux", "Mario Kart et carapaces rouges impitoyables", "Jeu coopératif où il fallait s'entraider pour survivre", "Just Dance et chorégraphies endiablées dans le salon", "Quiz de culture générale où l'on s'est défiés"),
        ("la première fois où vous avez goûté le plat de l'autre au resto", "Lui tendre directement la fourchette bien garnie", "Piquer discrètement dans son assiette avec un sourire", "Faire un échange d'assiette à mi-parcours", "Proposer de tout partager au milieu de la table"),
        ("le premier après-midi pluvieux passé à paresser", "Jeux de cartes, thé chaud et chocolat noir", "Faire des siestes à répétition sous la couette", "Regarder la pluie tomber sur la vitre enlacés", "Écouter de la musique douce dans la pénombre"),
        ("votre première photo Polaroid instantanée", "Secouer la photo en attendant impatiemment l'image", "La coller aussitôt sur le frigo", "Une grimace mignonne immortalisée à jamais", "La ranger précieusement au fond du portefeuille"),
        ("la première fois où vous avez fait les courses pour un week-end", "Remplir le caddie de douceurs et friandises", "Suivre scrupuleusement la liste bien organisée", "Débat passionné devant le rayon fromages ou vins", "Se perdre dans les rayons pour se retrouver en rigolant"),
        ("votre premier marché de Noël en amoureux", "Sentir le parfum réconfortant du vin chaud et de la cannelle", "S'émerveiller devant les illuminations féeriques", "Acheter une décoration pour le futur sapin", "Manger des marrons chauds qui brûlent les doigts"),
        ("la première fois où vous avez parlé d'adopter un animal", "Craquer sur chaque photo de chaton ou chiot", "Choisir les prénoms les plus drôles possibles", "Planifier la répartition des sorties matinales", "Se promettre d'en faire la star de la maison"),
        ("le premier souvenir d'un fou rire causé par un animal", "Un chat qui rate son saut de façon ridicule", "Un chien trop enthousiaste qui remue toute sa queue", "Une imitation d'animal complètement ratée", "Un animal qui vient voler de la nourriture sur la table"),
        ("la première fois où vous avez attendu l'autre à un quai de gare", "Chercher des yeux la silhouette aimée au milieu du flot", "Courir vers l'autre pour une étreinte serrée", "Le baiser de retrouvailles après des jours d'attente", "Porter la valise pour soulager l'autre avec fierté"),
        ("votre premier pique-nique nocturne sous la lune", "Lampe torche et plaids étalés sur l'herbe", "Bouteille fraîche débouchée dans la pénombre", "Regarder les lumières lointaines de la ville", "Frissonner de fraîcheur et se coller tout contre l'autre"),
        ("la première fois où vous avez fêté un moisniversaire", "Un petit mot doux glissé le matin", "Un resto improvisé pour marquer le coup", "Une surprise mignonne sans prise de tête", "Le constat ému que le temps file à toute vitesse")
    ]
    
    for i, t in enumerate(topics_easy):
        easy.append({
            "q": f"Quel souvenir gardes-tu de {t[0]} ?",
            "target": f"Quel souvenir gardes-tu de {t[0]} avec {{partner}} ?",
            "guesser": f"Quel souvenir marquant de {t[0]} {{target}} garde-t-il/elle en tête ?",
            "opts": [t[1], t[2], t[3], t[4]],
            "hint": "Un de ces moments doux qui tissent l'histoire d'un couple."
        })

    medium = []
    topics_med = [
        ("le déclic exact où tu as su que c'était le grand amour", "Un geste de tendresse d'une douceur infinie", "Un fou rire partagé où tout semblait évident", "Une conversation profonde au milieu de la nuit", "Le manque insoutenable ressenti après quelques jours séparés"),
        ("le doute ou la peur des débuts qui s'est vite dissipé", "La peur de ne pas être à la hauteur", "La crainte de la routine ou de l'engagement", "La peur que la magie des premiers jours s'estompe", "La crainte que nos rythmes de vie soient trop différents"),
        ("la première épreuve ou coup dur traversé en se serrant les coudes", "Un problème professionnel ou examen stressant", "Un souci de santé d'un proche ou personnel", "Une galère matérielle de logement ou transport", "Une période de remise en question personnelle"),
        ("votre premier voyage où tout est allé de travers", "Train ou vol annulé et nuit improvisée", "Hôtel catastrophique qui nous a fait mourir de rire", "Météo pourrie transformée en aventure cocooning", "Valise égarée et achat de vêtements d'urgence"),
        ("la première grande discussion sur vos valeurs fondamentales", "Notre vision du couple et de la liberté", "Nos envies de famille et d'enfants plus tard", "Notre rapport à l'argent et au travail", "Notre besoin d'aventure et de voyages dans la vie"),
        ("la première fois où l'un a soutenu l'autre en larmes", "Une écoute attentive sans jugement ni interruption", "Une longue étreinte silencieuse et rassurante", "Trouver les mots justes pour redonner espoir", "Prendre les choses en main pour soulager le fardeau"),
        ("la première fois où vous vous êtes manqués au point de compter les heures", "Pendant un déplacement professionnel de quelques jours", "Lors de vacances séparées en famille", "Une semaine intense où vous ne vous êtes à peine croisés", "Dès la première nuit passée chacun chez soi"),
        ("la première présentation officielle devant les beaux-parents", "Un stress immense vite effacé par la convivialité", "Des sourires polis et une bonne dose d'humour", "Des compliments sincères sur la cuisine ou la maison", "La fierté de montrer la personne qu'on aime"),
        ("le premier compromis important accepté par amour pour l'autre", "Changer ses plans de week-end au dernier moment", "Accepter une sortie qui ne nous enchantait pas au départ", "Faire des efforts sur le rangement ou l'organisation", "Laisser l'autre avoir le dernier mot sur une décision"),
        ("la première fois où vous avez parlé d'emménager ensemble", "Une évidence apparue au détour d'une conversation", "L'envie d'arrêter de trimballer ses affaires dans un sac", "Le désir de partager chaque réveil et chaque coucher", "Calculer le budget commun en réalisant la faisabilité"),
        ("votre première grande réconciliation sur l'oreiller", "Des excuses sincères et des yeux humides", "Un câlin interminable où les cœurs s'apaisent", "Réaliser que notre amour est bien plus fort que la rancœur", "Rire de la stupidité de la querelle passée"),
        ("la première fois où tu t'es senti(e) compris(e) comme jamais auparavant", "En confiant une blessure intime sans être jugé(e)", "En partageant un rêve que d'autres trouvaient naïf", "Quand l'autre a deviné mes pensées sans que je dise un mot", "En voyant son regard bienveillant posé sur mes défauts"),
        ("la première fierté immense ressentie pour une victoire de l'autre", "Une promotion ou réussite professionnelle méritée", "Un examen ou diplôme obtenu avec brio", "Un défi sportif ou personnel relevé haut la main", "Voir l'autre s'épanouir et rayonner devant les autres"),
        ("le premier sacrifice discret fait pour le bien-être de l'autre", "Prendre en charge des corvées pour lui faire une surprise", "Mettre de côté ses propres envies pour l'écouter", "Se réveiller plus tôt pour lui préparer son café", "Refuser une invitation pour rester veiller sur l'autre"),
        ("la première fois où vous avez affronté une critique extérieure en bloc uni", "Défendre son partenaire devant des remarques déplacées", "Affirmer notre choix de vie face aux sceptiques", "Faire bloc avec une solidarité sans faille", "Rire ensemble des avis des rabat-joie"),
        ("la première fois où vous avez mesuré le chemin parcouru ensemble", "En regardant de vieilles photos du tout début", "Lors d'un anniversaire de couple célébré à deux", "En emménageant dans un nouveau chez-soi", "En discutant tard le soir de nos progrès mutuels"),
        ("le premier souvenir d'une soirée où le temps s'est arrêté", "Une danse lente au milieu d'un salon éclairé à la bougie", "Une baignade nocturne sous les étoiles", "Une balade dans des rues désertes à 4h du matin", "Un baiser prolongé pendant que le monde tournait autour"),
        ("la première fois où l'un a deviné que l'autre n'allait pas bien d'un seul regard", "Juste au son de sa voix au téléphone", "En voyant un léger changement dans sa posture", "Dans le silence inhabituel au retour à la maison", "À un regard fuyant trahissant une contrariété"),
        ("le moment le plus fort en émotions vécu lors d'un de vos voyages", "Le lever de soleil au sommet d'une montagne gravi ensemble", "Une rencontre inoubliable avec des habitants chaleureux", "Une sensation de liberté totale sur une route déserte", "L'émerveillement partagé devant un paysage grandiose"),
        ("la première fois où vous avez fait un pacte secret rien qu'à vous", "Un mot de code pour s'éclipser discrètement d'une soirée", "Une règle d'or pour ne jamais s'endormir fâchés", "Un rituel secret répété avant chaque départ", "Un objectif secret à atteindre ensemble d'ici un an")
    ]
    # Expand to 70 medium topics
    extra_med_items = [
        ("la première confidence sur une peur secrète de l'avenir", "Peur de la maladie ou de la vieillesse", "Crainte de ne pas accomplir ses rêves d'enfance", "Angoisse de perdre les êtres chers", "Peur de perdre sa créativité ou sa passion"),
        ("le premier moment où tu as vu ton partenaire dans toute sa vulnérabilité", "En le/la voyant craquer après une accumulation de stress", "En découvrant un souvenir d'enfance douloureux", "Lors d'un moment de fatigue extrême sans filtre", "Quand il/elle a admis avoir besoin d'aide"),
        ("la première discussion financière sans tabou", "Partage équitable des charges courantes", "Épargne pour un futur grand voyage ou projet", "Rapport aux achats plaisirs vs investissements", "Gestion des imprévus financiers en toute transparence"),
        ("votre premier anniversaire de couple mémorable", "Un voyage surprise organisé dans le secret total", "Un dîner gastronomique d'exception", "Une soirée intime avec lettres d'amour échangées", "Un week-end ressourçant en pleine nature"),
        ("la première fois où vous avez géré une différence de tempérament", "L'un hyper calme face à l'autre très impulsif", "L'un ultra prévoyant face à l'autre très spontané", "L'un casanier face à l'autre grand fêtard", "L'un très bavard face à l'autre plus taiseux"),
        ("le moment où tu as réalisé que ton partenaire était ton repère", "Quand son étreinte suffit à faire disparaître tout stress", "Quand c'est la première personne que tu veux appeler en cas de nouvelle", "Quand sa présence apaise instantanément ton esprit", "Quand son avis est celui qui compte le plus au monde"),
        ("la première fois où vous avez soutenu une amitié de l'autre", "Accueillir ses amis comme des membres de la famille", "Encourager des sorties entre potes sans jalousie", "Être de bon conseil lors d'un différend amical", "Créer des ponts entre vos deux cercles d'amis"),
        ("le premier grand secret ou surprise préparé pendant des semaines", "Organiser un anniversaire surprise dans le dos de l'autre", "Dénicher un cadeau introuvable dont il/elle rêvait", "Planifier une rencontre inattendue avec un proche lointain", "Préparer un week-end romantique mystère"),
        ("la première fois où vous avez affronté une maladie ensemble", "Préparer des bouillons et veiller toute la nuit", "Aller à la pharmacie de garde en urgence", "Apporter réconfort, patience et tendresse absolue", "Savoir faire rire l'autre malgré la fatigue"),
        ("votre première victoire commune sur une mauvaise habitude", "Arrêter une addiction ou mauvaise routine à deux", "Se motiver à cuisiner sainement au quotidien", "Limiter le temps passé sur les réseaux sociaux le soir", "Instaurer des balades quotidiennes pour s'oxygéner"),
        ("la première fois où vous avez parlé de votre vision de la vieillesse", "Finir ensemble dans une maison au bord de l'océan", "Garder notre complicité espiègle jusqu'au bout", "Se tenir la main à 80 ans sur un banc de parc", "Être entourés d'une grande tribu joyeuse"),
        ("la première fois où tu as vu ton partenaire défendre une cause avec passion", "Défendre une injustice avec courage et éloquence", "S'investir pour la protection animale ou environnementale", "Aider un inconnu en détresse dans la rue", "S'engager pour ses collègues ou sa communauté"),
        ("la première fois où vous avez surmonté un quiproquo ou malentendu", "Une explication franche autour d'un thé chaud", "Comprendre que les mots avaient dépassé la pensée", "Se promettre de toujours clarifier sans attendre", "Rire du malentendu une fois les cœurs apaisés"),
        ("le premier cadeau d'anniversaire qui a fait couler des larmes d'émotion", "Un carnet rempli de souvenirs et mots doux", "Un bijou gravé d'une date symbolique", "Un billet d'avion pour un pays de rêve", "Un objet d'art ou photo symbolisant votre amour"),
        ("la première fois où vous vous êtes sentis chez vous nulle part ailleurs", "Dans une chambre d'hôtel impersonnelle rendue chaleureuse", "Dans une tente au milieu de nulle part", "Dans une maison de vacances louée pour quelques jours", "Dans votre canapé après un long retour de voyage"),
        ("la première fois où vous avez géré les fêtes de fin d'année", "Courir d'une famille à l'autre le 24 et 25", "Créer votre propre petit rituel de Noël en duo", "Négocier pacifiquement le planning des réveillons", "Savourer un 26 décembre paisibles en pyjama"),
        ("le moment où tu as réalisé à quel point ton partenaire avait changé ta vie", "En réalisant que tu souris beaucoup plus au quotidien", "En constatant que tu as gagné en confiance en toi", "En voyant le monde avec plus d'optimisme et de douceur", "En apprenant à lâcher prise sur les détails futiles"),
        ("la première fois où vous avez partagé une tradition d'enfance de l'un", "Faire une recette ancestrale transmise par une grand-mère", "Visiter le village ou quartier d'enfance avec fierté", "Regarder un dessin animé ou film culte de ses 8 ans", "Raconter les bêtises faites dans la cour de récré"),
        ("le premier moment où vous avez pris une grande décision sans demander l'avis de personne", "Choisir notre nouveau cocon de vie", "Partir sur un coup de tête vers une nouvelle aventure", "Adopter un animal de compagnie ensemble", "Changer de voie professionnelle avec l'aval de l'autre"),
        ("la première fois où vous avez ressenti une gratitude immense pour votre rencontre", "En regardant l'autre dormir paisiblement à côté de soi", "Lors d'un toast porté à la vie au cours d'un bon dîner", "En observant les couples autour de nous qui se déchirent", "Lors d'une simple étreinte au milieu d'une journée banale"),
        ("votre premier souvenir d'un moment où l'amour a pris tout son sens", "Dans le regard silencieux et vibrant échangé un soir d'été", "Quand l'autre a tout lâché pour venir me serrer dans ses bras", "Pendant une marche silencieuse dans la neige", "En sachant qu'on traversera n'importe quelle tempête ensemble"),
        ("la première fois où vous avez assumé vos défauts respectifs avec autodérision", "Se moquer gentiment de notre sens de l'orientation", "Admettre notre incapacité commune à choisir un resto rapidement", "Rire de notre maladresse légendaire", "Accepter les petites manies du réveil"),
        ("le premier souvenir d'un encouragement qui a tout changé", "Les mots d'assurance murmurés avant un entretien crucial", "La confiance aveugle accordée lors d'un projet risqué", "La fierté affichée sans réserve aux yeux du monde", "La présence silencieuse au premier rang pour applaudir"),
        ("la première fois où vous avez partagé un deuil ou une peine profonde", "Une écoute sans chercher à combler les silences", "Des bras protecteurs pour accueillir le chagrin", "Laisser le temps au cœur de guérir avec douceur", "Veiller à ce que l'autre continue de s'alimenter et dormir"),
        ("le souvenir de votre plus bel échange de vœux ou de promesses", "Une promesse chuchotée au creux du cou un soir d'orage", "Des mots écrits au dos d'une photo souvenir", "Un serment silencieux scellé d'un baiser passionné", "Des promesses d'avenir répétées chaque année"),
        ("la première fois où vous avez aidé un ami en duo", "Déménager un copain avec bonne humeur et pizzas", "Accueillir un pote en détresse sur notre canapé", "Organiser un coup de main solidaire à deux", "Donner des conseils complices à un ami célibataire"),
        ("votre premier projet d'apprentissage partagé", "Prendre des cours de danse de salon ou salsa", "Apprendre une nouvelle langue pour un futur voyage", "S'initier ensemble à la céramique ou peinture", "Se former à la cuisine gastronomique le week-end"),
        ("la première fois où vous avez surmonté la fatigue des semaines intenses", "Créer une bulle hermétique sans écrans tout le dimanche", "Se faire couler un bon bain chaud et se masser", "Commander nos plats préférés sans bouger du plaid", "Prendre un petit déjeuner très tardif sans culpabilité"),
        ("le premier regard complice qui a désamorcé une situation embarrassante en public", "Un clin d'œil discret qui disait 'on se comprend'", "Un sourire étouffé pour ne pas faire d'esclandre", "Prendre la main de l'autre pour le rassurer", "Créer une diversion adroite pour sauver la mise"),
        ("la première fois où vous avez contemplé le coucher de soleil sans un mot", "La chaleur du soleil couchant sur nos peaux", "Le souffle du vent marin dans nos cheveux", "Nos doigts entrelacés avec une force tranquille", "Le sentiment que cet instant parfait était éternel"),
        ("la première fois où vous avez célébré une réussite à deux en ouvrant une bonne bouteille", "Trinquer à l'avenir avec des yeux pétillants", "Savourer chaque gorgée comme le fruit d'un travail acharné", "Rappeler les doutes initiaux pour mesurer la victoire", "Danser dans le salon en fête improvisée"),
        ("votre premier souvenir d'un moment où vous avez eu peur de vous perdre", "Une dispute houleuse qui a fait trembler les fondations", "Un éloignement géographique qui pesait trop lourd", "Une période de doutes vite balayée par une discussion de cœur", "Réaliser que la vie n'aurait aucune saveur l'un sans l'autre"),
        ("le premier souvenir d'une surprise complètement ratée mais inoubliable", "Le gâteau d'anniversaire carbonisé mais mangé en rigolant", "Le lieu secret qui était fermé exceptionnellement", "La surprise éventée deux jours avant par un gaffeur", "Le cadeau de mauvaise taille mais gardé par affection"),
        ("la première fois où vous avez partagé un émerveillement d'enfant", "Devant les illuminations grandioses d'une ville en fête", "En découvrant un paysage de neige immaculée au réveil", "En observant des dauphins nager près de notre bateau", "En ramassant des coquillages étranges sur le rivage"),
        ("le souvenir le plus fort de votre amour au quotidien", "Le baiser déposé sur le front avant de partir le matin", "Le regard d'amour surpris par hasard à travers la pièce", "L'étreinte chaleureuse en rentrant d'une longue journée", "Le fou rire partagé sous la couette pour un rien"),
        ("la première fois où vous avez cuisiné un repas de fête complet", "Le stress du timing des cuissons", "La dégustation savoureuse avec un bon vin", "La table dressée avec raffinement", "La fierté d'avoir tout réussi de A à Z"),
        ("le souvenir de votre première rentrée ou reprise du travail ensemble", "Se soutenir le dimanche soir face au blues", "Préparer les affaires de l'autre pour l'encourager", "Les petits textos d'encouragement dans la journée", "Se retrouver le soir pour décompresser"),
        ("la première fois où vous avez fait face à une panne ou galère domestique", "Une fuite d'eau épongée en équipe", "Une panne d'électricité éclairée aux bougies", "Une clé cassée dans la serrure en pleine nuit", "Rire de la situation pour ne pas paniquer"),
        ("le souvenir de votre premier grand projet de vacances monté ensemble", "Des heures passées à comparer les logements de charme", "L'excitation de réserver les billets d'avion ou de train", "Établir la liste des restos et visites incontournables", "Le compte à rebours partagé sur le calendrier"),
        ("la première fois où vous avez découvert les talents cachés de l'autre", "Une voix magnifique en chantant par hasard", "Une habileté manuelle ou talent artistique bluffant", "Une mémoire encyclopédique impressionnante", "Une aisance sociale remarquable en public"),
        ("le premier souvenir d'une balade au petit matin dans une ville endormie", "L'odeur des croissants chauds des boulangeries qui ouvrent", "Le calme absolu des rues désertes", "Marcher au milieu de la chaussée main dans la main", "La lumière dorée de l'aube sur les façades"),
        ("la première fois où vous avez partagé une tradition familiale de l'autre", "Un repas de fête avec des plats régionaux typiques", "Une célébration chaleureuse pleine de rituels", "Des jeux traditionnels partagés avec les cousins", "L'accueil affectueux des anciens de la famille"),
        ("le premier grand compliment fait sur votre couple par un proche", "Dire que vous étiez faits l'un pour l'autre avec évidence", "Remarquer à quel point vous rayonnez ensemble", "Souligner votre complicité et votre respect mutuel", "Dire que votre amour donne envie de croire au couple"),
        ("la première fois où vous avez surmonté la fatigue d'un long voyage", "S'endormir à tour de rôle sur l'épaule de l'autre", "Partager un café tiède et un sandwich d'autoroute", "Trouver la force de rire malgré l'épuisement", "L'arrivée salvatrice à destination"),
        ("le souvenir d'une soirée passée au coin du feu à refaire le monde", "Le bruit du bois qui crépite doucement", "Une tisane chaude ou un verre partagé", "Des réflexions profondes sur le sens de la vie", "La sérénité d'être exactement là où l'on doit être"),
        ("la première fois où vous avez soutenu un projet pro ou créatif de l'autre", "Relire et corriger un dossier important", "Encourager à oser franchir le pas sans hésiter", "Fêter la concrétisation avec enthousiasme", "Être le premier supporter inconditionnel"),
        ("le souvenir de votre premier pique-nique sous un coucher de soleil estival", "Le ciel flamboyant virant au pourpre", "Le bruit des grillons ou des vagues", "Grignoter des tomates cerises et du bon pain", "Se lover l'un contre l'autre quand la brise fraîchit"),
        ("la première fois où vous avez trouvé votre havre de paix secret", "Une crique isolée loin des touristes", "Un banc caché sous un saule pleureur", "Un petit café intimiste au fond d'une ruelle", "Un point de vue perché dominant toute la région"),
        ("le souvenir de la première promesse faite les yeux dans les yeux", "Se promettre de toujours communiquer quoi qu'il arrive", "Se jurer de ne jamais laisser la routine ternir la passion", "Promettre d'être toujours là dans les moments sombres", "Se promettre de continuer à grandir ensemble"),
        ("la première fois où vous avez réalisé que vous pensiez à la même chose au même instant", "Dire le même mot exactement en même temps", "Se regarder et éclater de rire sans explication", "Commander le même plat au restaurant", "Avoir envie de la même destination au même moment")
    ]
    
    for item in topics_med + extra_med_items:
        medium.append({
            "q": f"Quel souvenir gardes-tu de {item[0]} ?",
            "target": f"Quel souvenir gardes-tu de {item[0]} avec {{partner}} ?",
            "guesser": f"Quel souvenir marquant de {item[0]} {{target}} retient-il/elle ?",
            "opts": [item[1], item[2], item[3], item[4]],
            "hint": "Un cap essentiel franchi dans la construction de votre couple."
        })

    spicy = []
    topics_spicy = [
        ("votre premier baiser passionné qui a fait perdre le contrôle", "Un baiser intense plaqué contre un mur", "Dans une ruelle sombre et silencieuse", "Sur le pas de la porte avant de se séparer", "Sur le canapé les mains glissant sur la peau"),
        ("la première fois où la tension charnelle est devenue insoutenable", "Pendant un dîner feutré les yeux dans les yeux", "Pendant un trajet en voiture la main sur la cuisse", "Au cinéma dans le noir complet en chuchotant", "En dansant très serrés au milieu d'une fête"),
        ("le premier vêtement ou sous-vêtement de l'autre qui a fait chavirer tes sens", "Une lingerie noire ou dentelle délicate", "Un t-shirt blanc simple porté à même la peau", "Une tenue très moulante mettant en valeur chaque courbe", "Une chemise entrouverte au tissu soyeux"),
        ("le premier réveil câlin très chaud au petit matin", "Faire l'amour encore à moitié endormis sous les draps", "Des caresses lentes montant crescendo sur la peau nue", "Des baisers dans le cou qui réveillent tous les désirs", "Une étreinte passionnée avant que le réveil ne sonne"),
        ("le premier massage sensuel aux huiles parfumées partagé", "Un massage du dos appuyé et relaxant devenant torride", "Masser les pieds et les jambes avec une douceur exquise", "Glisser les mains sur tout le corps avec lenteur", "Faire durer les préliminaires au maximum"),
        ("la première fois où vous avez failli vous faire surprendre en plein ébat", "Par des amis ou de la famille dans la pièce d'à côté", "Par un livreur sonnant à l'interphone en plein acte", "Dans un endroit semi-public où quelqu'un approchait", "Par les voisins à cause des soupirs et du bruit"),
        ("le premier message ou photo osé(e) envoyé(e) au cours de la journée", "Une description torride de ce qui l'attendait le soir", "Une photo suggestive laissant deviner une lingerie sexy", "Un souvenir coquin de la veille murmuré par écrit", "Une proposition directe et brûlante pour le soir même"),
        ("votre première douche ou bain pris à deux dans la vapeur", "S'enduire de savon en glissant l'un contre l'autre", "S'embrasser passionnément sous le jet d'eau chaude", "Se laver les cheveux avec tendresse et volupté", "La vapeur chaude rendant chaque effleurement électrique"),
        ("le premier endroit insolite ou interdit où vous avez fait l'amour", "Dans une voiture garée dans un coin isolé avec buée sur les vitres", "Dans la nature sous les arbres ou sur une plage déserte", "Sur une terrasse à la belle étoile", "Dans un recoin discret lors d'une fête"),
        ("la première nuit blanche passée à faire l'amour plusieurs fois", "Enchaîner les ébats jusqu'aux premières lueurs de l'aube", "Discuter nus dans les draps entre deux moments de passion", "Manger un en-cas au milieu de la nuit pour reprendre des forces", "S'endormir épuisés mais comblés à 6h du matin"),
        ("la première fois où l'un a osé guider la main de l'autre", "Guider doucement ses doigts vers la zone précise de plaisir", "Murmurer à l'oreille exactement le rythme désiré", "Montrer le geste parfait par un soupir approbateur", "Prendre l'initiative d'explorer sans retenue"),
        ("le premier baiser dans le cou qui a provoqué des frissons incontrôlables", "Un baiser humide et doux juste sous l'oreille", "Une morsure très légère sur l'épaule", "Un souffle chaud chuchotant des mots coquins", "Des lèvres effleurant la clavicule avec lenteur"),
        ("la première fois où vous avez testé une position audacieuse", "Une position acrobatique exigeant souplesse et force", "Une position ultra intime les yeux plongés dans les yeux", "Une étreinte debout contre une porte ou un mur", "Une position inversée pour décupler le plaisir"),
        ("le premier compliment osé qui a fait monter le désir à 100%", "Sur la perfection et la sensualité de son corps", "Sur l'odeur irrésistible de sa peau après l'amour", "Sur ses gémissements qui rendent complètement fou/folle", "Sur sa façon divine de faire l'amour"),
        ("la première fois où vous avez osé faire l'amour sans retenue sonore", "Lâcher prise totalement sur les soupirs et gémissements", "Mordre un oreiller pour étouffer le plaisir débordant", "Se murmurer des mots crus et passionnés sans filtre", "Le souffle court partagé dans une intensité absolue"),
        ("le premier jeu de séduction tactile joué sous la table en public", "Une main glissant lentement sur le genou sous la nappe", "Des jeux de pieds complices et coquins pendant le dîner", "Des regards appuyés qui promettaient une nuit torride", "Se frôler furtivement en passant l'un à côté de l'autre"),
        ("la première fois où l'un a pris le contrôle total du moment intime", "Attacher doucement les mains ou bander les yeux de l'autre", "Décider du rythme et faire patienter pour faire monter le désir", "Donner des ordres murmurés et sensuels", "Offrir un plaisir exclusif sans rien attendre en retour"),
        ("le premier slow collé-serré où la chaleur des corps a tout embrasé", "Sentir le bassin de l'autre pressé contre soi", "Les mains glissant sur les hanches et les reins", "La respiration chaude calée sur la musique", "L'envie brûlante de quitter la piste immédiatement"),
        ("la première fois où vous avez partagé un fantasme inavoué", "Avouer une envie secrète de lieu ou de scénario coquin", "Révéler un fétichisme doux ou une attirance particulière", "Parler de jeux de rôles et de déguisements coquins", "Découvrir avec soulagement que l'autre adorait l'idée"),
        ("le souvenir du câlin le plus intense et passionné jamais vécu ensemble", "Une fusion totale des corps et des âmes", "Un orgasme simultané dans une vague d'émotion pure", "Rester enlacés tremblants et essoufflés pendant des minutes", "La certitude d'une alchimie sexuelle exceptionnelle")
    ]
    # Extra 50 spicy items
    extra_spicy_items = [
        ("la première fois où vous avez fait l'amour en pleine journée les volets ouverts", "La lumière du jour révélant chaque détail sensuel", "La spontanéité d'un câlin imprévu au milieu du salon", "La beauté des corps dénudés sous les rayons du soleil", "L'impression grisante d'arrêter le temps"),
        ("le premier strip-tease ou déshabillage langoureux", "Retirer chaque vêtement un par un avec un regard brûlant", "Déboutonner lentement une chemise en embrassant le torse", "Glisser les bretelles d'une robe avec délicatesse", "Un jeu de séduction joueur et théâtral"),
        ("la première fois où vous avez utilisé des glaçons ou textures chaudes/froides", "Glisser un glaçon le long de la colonne vertébrale", "Faire couler de la cire de bougie tiède de massage", "Alterner souffle chaud et glaçon sur les lèvres", "Des frissons d'extase parcourant toute la peau"),
        ("la première fois où vous avez fait l'amour devant un miroir", "Observer nos corps s'unir avec fascination", "Les regards captés dans le reflet pendant l'acte", "La sensualité décuplée par la vision des mouvements", "Un lâcher-prise total sur notre image et nos désirs"),
        ("le premier baiser sous la couette avec caresses intimes cachées", "Se blottir entièrement sous les draps dans un cocon chaud", "Caresser les zones les plus sensibles dans l'obscurité", "Des baisers secrets loin du monde extérieur", "Une complicité charnelle absolue"),
        ("la première fois où vous avez exploré les baisers le long de la colonne vertébrale", "Descendre lentement de la nuque jusqu'au bas des reins", "Des frissons qui font cambrer le dos sous le plaisir", "Terminer par un baiser appuyé sur la fossette des reins", "Un rituel de préliminaires devenu fétiche"),
        ("le premier câlin torride dans la cuisine contre le plan de travail", "Soulever son partenaire sur le comptoir en plein milieu d'une recette", "Les assiettes poussées sur le côté pour faire de la place", "L'urgence du désir impossible à repousser", "La sauce qui mijote pendant que la température monte"),
        ("la première fois où vous avez goûté une friandise ou du champagne sur la peau de l'autre", "Une goutte de chantilly sur le cou dégustée avec délectation", "Faire couler une larme de champagne sur le ventre", "Manger une fraise gorgée de sucre en s'embrassant", "Un jeu gourmand et érotique parfait"),
        ("le premier baiser passionné échangé dans l'eau d'une piscine ou de la mer", "La sensation des corps mouillés et légers glissant l'un contre l'autre", "L'eau chaude enveloppant une étreinte passionnée", "S'agripper pour ne pas couler tout en s'embrassant", "La caresse des vagues accentuant les sensations"),
        ("la première fois où vous avez prolongé les préliminaires pendant plus d'une heure", "L'art de faire monter l'excitation par vagues successives", "Interdiction mutuelle d'aller au bout avant l'explosion finale", "Des caresses sur chaque centimètre carré de peau", "Un feu d'artifice de sensations à la libération finale"),
        ("le premier câlin improvisé dans une cabine d'essayage", "L'adrénaline pure d'être séparés du magasin par un simple rideau", "S'embrasser en retenant son souffle pour ne pas faire de bruit", "Les miroirs multipliant les reflets coquins", "Ressortir avec les joues rouges et le cœur battant la chamade"),
        ("la première fois où vous avez fait l'amour au son d'une playlist torride", "Les basses sensuelles calant le rythme des hanches", "Des voix suaves accompagnant chaque soupir", "Une ambiance de club privé ou de bar lounge intime", "Associer à jamais cette mélodie à ce souvenir brûlant"),
        ("la première fois où vous avez exploré les caresses avec les pieds ou les orteils", "Glisser la voûte plantaire le long des mollets sous les draps", "Un massage des pieds relaxant et très érotique", "Des chatouillements doux qui dérivent vers le plaisir", "Une intimité corporelle décomplexée"),
        ("le premier sous-vêtement coquin acheté ensemble dans une boutique intime", "Choisir les dentelles et les coupes les plus flatteuses", "Rougir devant les vendeuses tout en assumant nos envies", "L'excitation d'imaginer la tenue portée le soir même", "Un moment de complicité coquine inoubliable"),
        ("la première fois où vous avez fait l'amour dans une tente ou sous les étoiles", "Le bruissement de la nuit et la nature tout autour", "Se tenir chaud sous un duvet commun par nuit fraîche", "La sensation grisante d'être seuls au monde", "La liberté sauvage et primitive de l'étreinte"),
        ("le premier jeu de défi coquin relevé avec brio", "Glisser un glaçon dans le soutien-gorge ou le caleçon", "Donner un baiser brûlant en moins de 10 secondes", "Retirer une pièce de vêtement sans utiliser les mains", "Murmurer le secret le plus inavouable à l'oreille"),
        ("la première fois où un câlin a été déclenché par un simple regard appuyé", "Aucun mot nécessaire, juste un échange d'yeux électrique", "Se diriger d'un pas décidé vers la chambre", "Fermer la porte d'un coup de pied dans l'urgence", "L'intensité d'un désir animal et sincère"),
        ("la première fois où vous avez dormi entièrement nus enlacés l'un contre l'autre", "La douceur infinie du contact peau contre peau", "La chaleur partagée qui fait oublier la couverture", "Se réveiller la nuit en sentant le corps de l'autre", "Le sentiment de pureté et d'abandon total"),
        ("le premier baiser passionné échangé sous un parapluie en pleine nuit", "La pluie qui crépite au-dessus de vos têtes", "Les manteaux trempés mais les lèvres brûlantes", "L'odeur de la terre mouillée et de l'orage", "Un baiser de cinéma inoubliable"),
        ("la première fois où vous avez exploré des caresses légères comme une plume", "Effleurer la peau du bout des doigts sans appuyer", "Faire frémir chaque poil du corps sous la caresse", "Une lenteur exquise qui rend fou d'impatience", "L'art délicat de réveiller chaque terminaison nerveuse"),
        ("la première fois où vous avez fait l'amour sur un tapis moelleux devant un feu", "La lueur dansante des flammes sur les corps nus", "La chaleur du foyer et le crépitement du bois", "L'odeur boisée et réconfortante de la cheminée", "Un tableau romantique et érotique parfait"),
        ("le souvenir du tout premier matin où vous avez fait l'amour avant le café", "L'urgence de se retrouver avant toute autre chose", "L'énergie du désir matinal débordant", "Prendre son petit déjeuner ensuite avec une mine radieuse", "Démarrer la journée au sommet du bonheur"),
        ("la première fois où vous avez osé les chuchotements les plus coquins", "Des phrases crues murmurées avec une voix rauque", "Exprimer sans tabou exactement ce qui procure du plaisir", "La sensation du souffle chaud sur le lobe de l'oreille", "L'excitation mentale décuplée par les mots"),
        ("la première fois où vous avez testé une huile de massage chauffante", "La douce sensation de chaleur qui pénètre les muscles", "Le parfum vanillé ou boisé envoûtant", "Les mains qui glissent avec une aisance infinie", "La transition fluide du massage vers la caresse érotique"),
        ("le premier câlin passionné échangé sur le sol du salon", "La spontanéité de se laisser tomber ensemble", "Rire de l'inconfort vite oublié dans l'extase", "Attraper des coussins à la volée pour caler les têtes", "La liberté de ne pas attendre d'être dans un lit"),
        ("la première fois où vous avez fait l'amour dans une chambre d'hôtel luxueuse", "Les draps en satin frais et doux sur la peau", "Le lit king size où l'on peut rouler sans fin", "La vue imprenable sur les lumières de la ville par la baie vitrée", "Le sentiment d'être des amants secrets en escapade"),
        ("la première morsure coquine sur la lèvre inférieure", "Une morsure douce et maîtrisée qui fait monter la tension", "Les yeux qui s'ouvrent dans un éclair de désir", "L'étreinte qui se resserre avec force", "Le signe distinctif de la passion dévorante"),
        ("la première fois où l'un a surpris l'autre nu(e) à la sortie de la douche", "La serviette qui tombe d'un coup de main complice", "Les gouttes d'eau séchées par des baisers chauds", "L'admiration sincère et brûlante de la silhouette", "Un moment d'intimité volée magnifique"),
        ("le souvenir de la caresse la plus douce sur le creux de la hanche", "La main qui trouve parfaitement sa place pour guider le corps", "Le contact rassurant et terriblement sensuel", "La peau satinée et tiède sous la paume", "L'harmonie physique totale entre vous deux"),
        ("la première fois où vous avez fait l'amour sans aucune notion du temps qui passe", "Réaliser que trois heures se sont écoulées en un clin d'œil", "Le soleil qui s'est couché pendant vos ébats", "L'impression d'avoir voyagé dans une autre dimension", "La sérénité totale d'avoir pris tout son temps"),
        ("le premier frisson ressenti quand les mains se sont glissées sous le t-shirt", "La paume fraîche sur la peau brûlante du dos", "Les doigts qui remontent le long des côtes", "L'accélération subite de la respiration", "Le soulèvement du vêtement dans un geste décidé"),
        ("la première fois où vous avez fait l'amour avec la fenêtre entrouverte par nuit d'orage", "Le vent frais contrastant avec la chaleur des peaux", "Le grondement du tonnerre couvrant les soupirs", "Les éclairs illuminant la chambre d'un blanc bleuté", "L'ambiance électrique et sauvage de la nuit"),
        ("le premier baiser passionné échangé dans un ascenseur", "Surveiller les étages qui défilent sur l'écran", "S'agripper à la barre en métal et s'embrasser avec ferveur", "Arranger ses vêtements en vitesse à l'arrivée", "Sortir l'air de rien avec des yeux qui brillent"),
        ("la première fois où vous avez partagé une sieste coquine improvisée", "Se réveiller d'un somme léger pour se faire l'amour", "La tiédeur des draps et la torpeur délicieuse", "Prendre son temps dans une infinie douceur", "Se rendormir enlacés le sourire aux lèvres"),
        ("le souvenir de l'effeuillage le plus sensuel", "Enlever une robe en faisant glisser la fermeture éclair au ralenti", "Défaire une cravate ou un col avec assurance", "Faire tomber les chaussures d'un coup de pied", "L'impatience dévorante mais savourée"),
        ("la première fois où vous avez fait l'amour sur une plage déserte la nuit", "Le sable doux sous les serviettes étalées", "Le ressac régulier des vagues comme métronome", "La brise marine salée sur les corps dénudés", "La sensation de communion avec la nature"),
        ("la première fois où vous avez exploré les caresses avec les lèvres sans baiser", "Effleurer le contour de la bouche sans jamais la toucher", "Déposer des baisers papillons sur les paupières et les joues", "Souffler sur la peau pour la faire frissonner", "Créer une tension érotique à son comble"),
        ("le premier câlin torride échangé avant de partir à une soirée habillée", "Prendre le risque de froisser les tenues impeccables", "Le maquillage légèrement estompé par la fougue", "Les regards complices et brûlants échangés ensuite toute la soirée", "Le secret partagé au milieu de tous les invités"),
        ("la première fois où vous avez osé explorer une nouvelle zone érogène", "Découvrir la sensibilité exquise de l'intérieur des poignets", "Caresser l'arrière des genoux avec délicatesse", "Masser les lobes d'oreilles avec la langue", "Un plaisir inattendu et vertigineux"),
        ("le souvenir de la nuit la plus torride de vos débuts", "Cinq heures d'intimité ininterrompue et passionnée", "Une intensité qui a laissé des courbatures le lendemain", "La découverte mutuelle de chaque désir secret", "Le souvenir impérissable de votre connexion charnelle"),
        ("le premier câlin volé dans un cinéma dans la pénombre", "Des caresses furtives pendant le film", "Retenir ses gémissements dans le noir", "L'excitation d'être assis au dernier rang", "Sortir avec un regard troublé et complice"),
        ("la première fois où vous avez partagé un secret érotique inavouable", "Un désir intense gardé pour soi depuis des mois", "Une envie d'expérimentation audacieuse", "La libération totale d'être compris sans jugement", "Passer immédiatement à la pratique"),
        ("le souvenir du baiser le plus brûlant au creux de l'aine", "Des tremblements incontrôlables de plaisir", "Les doigts crispés dans les draps", "L'attente fébrile de la suite", "Une montée d'extase immédiate"),
        ("la première fois où l'un a déshabillé l'autre les yeux fermés", "Se fier uniquement au toucher et au souffle", "Deviner chaque courbe et frisson sous les doigts", "La sensualité exacerbée par la privation de vue", "Une confiance totale et magnifique"),
        ("le souvenir du premier baiser sous une averse tiède d'été", "Les vêtements collés à la peau par la pluie", "Les lèvres douces et ruisselantes d'eau", "L'étreinte fiévreuse qui réchauffe", "Un instant digne d'un film d'amour passionné"),
        ("la première fois où vous avez fait l'amour sur une musique lente", "Accorder chaque mouvement sur le tempo suave", "La communion sensuelle absolue des corps", "La musique qui résonne dans chaque muscle", "Un souvenir sonore gravé à jamais"),
        ("le premier câlin fougueux sur un bureau ou meuble haut", "Balayer les papiers pour faire de la place", "S'enrouler autour de la taille avec fougue", "La force et l'urgence de l'étreinte", "Le plaisir brut sans détour"),
        ("la première fois où vous avez goûté du miel ou du chocolat sur les lèvres", "Lécher doucement le sucre en s'embrassant", "Un jeu gourmand qui prolonge l'extase", "Les baisers sucrés et collants d'amour", "Une dégustation érotique délicieuse"),
        ("le souvenir du regard le plus brûlant échangé à travers une pièce bondée", "L'assurance silencieuse de ce qui allait se passer après", "Le monde qui s'efface autour de nous deux", "Un sourire carnassier plein de promesses", "L'envie de s'éclipser dans la minute"),
        ("la première fois où vous avez fait l'amour dans le noir le plus complet", "Les autres sens décuplés par l'obscurité", "Deviner les mouvements au son de la respiration", "La sensation enivrante de perte de repères", "Une communion tactile inoubliable")
    ]
    
    for item in topics_spicy + extra_spicy_items:
        spicy.append({
            "q": f"Quel souvenir gardes-tu de {item[0]} ?",
            "target": f"Quel souvenir gardes-tu de {item[0]} avec {{partner}} ?",
            "guesser": f"Quel souvenir brûlant de {item[0]} {{target}} retient-il/elle ?",
            "opts": [item[1], item[2], item[3], item[4]],
            "hint": "Un de ces moments de sensualité pure qui ont marqué votre histoire."
        })

    return easy[:70], medium[:70], spicy[:70]

if __name__ == "__main__":
    e, m, s = get_souvenirs_extras()
    print(f"Generated Souvenirs: {len(e)} easy, {len(m)} medium, {len(s)} spicy")
