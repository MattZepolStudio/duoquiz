export interface RawQ {
  q: string;
  target?: string;
  guesser?: string;
  opts: [string, string, string, string];
  hint: string;
}

export const SOUVENIRS_EXTRA_EASY: RawQ[] = [
  {
    q: "Quel a été le premier surnom affectueux (ou ridicule) donné au sein du couple ?",
    target: "Quel a été le premier surnom que tu as donné ou reçu de {partner} ?",
    guesser: "Quel a été le premier surnom donné ou reçu avec {target} ?",
    opts: ["Mon cœur / Mon bébé classique", "Un diminutif mignon de prénom", "Un nom d'animal loufoque", "Un surnom basé sur une blague interne"],
    hint: "Ce petit mot doux parfois un peu kitch qui reste gravé !"
  },
  {
    q: "Quelle chanson vous rappelle immédiatement le tout début de votre rencontre ?",
    target: "Quelle chanson te rappelle immédiatement le début de ton histoire avec {partner} ?",
    guesser: "Quelle musique rappelle à {target} vos tout débuts ensemble ?",
    opts: ["Le tube de l'été qui tournait en boucle", "Une mélodie douce écoutée en voiture", "Une chanson découverte lors d'une soirée", "Un slow romantique inoubliable"],
    hint: "La bande-son officielle de votre premier coup de foudre."
  },
  {
    q: "Qui a envoyé le premier message après votre tout premier rendez-vous ?",
    target: "Qui a envoyé le premier message après le premier rendez-vous avec {partner} ?",
    guesser: "Selon toi, qui a envoyé le premier SMS après le rencard avec {target} ?",
    opts: ["Moi, dès en rentrant chez moi", "{partner}, dans les 10 minutes", "Le lendemain matin au réveil", "On a discuté en direct sans s'arrêter"],
    hint: "Ce fameux message pour savoir si l'autre était bien rentré..."
  },
  {
    q: "Quel a été le tout premier film ou série regardé ensemble sous un plaid ?",
    target: "Quel a été le premier film ou série vu blotti contre {partner} ?",
    guesser: "Quel a été votre premier film ou série partagé avec {target} ?",
    opts: ["Une comédie romantique bien guimauve", "Un film d'action ou thriller prenant", "Un film d'animation plein de douceur", "Une série qu'on a binge-watchée toute la nuit"],
    hint: "Le film où l'on regardait plus l'autre que l'écran !"
  },
  {
    q: "Où avez-vous bu votre tout premier café ou verre ensemble ?",
    target: "Où as-tu bu ton tout premier verre en tête-à-tête avec {partner} ?",
    guesser: "Où avez-vous partagé votre tout premier verre avec {target} ?",
    opts: ["En terrasse d'un petit café animé", "Au comptoir d'un bar cosy", "Assis sur un banc dans un parc", "À emporter en marchant dans la ville"],
    hint: "La première gorgée pleine de timidité et de regards complices."
  },
  {
    q: "Quel a été votre tout premier fou rire incontrôlable à deux ?",
    target: "Quel a été ton premier fou rire mémorable avec {partner} ?",
    guesser: "Quel premier fou rire a marqué {target} lors de vos débuts ?",
    opts: ["Une maladresse en mangeant au resto", "Un lapsus très embarrassant mais hilarant", "Une blague nulle qui a fait mouche", "Une chute ou glissade sans gravité"],
    hint: "Ce moment où la glace s'est définitivement brisée dans un éclat de rire !"
  },
  {
    q: "Quelle photo de vous deux est devenue votre premier vrai cliché souvenir ?",
    target: "Quelle a été la toute première photo mémorable prise avec {partner} ?",
    guesser: "De quelle première photo avec {target} te souviens-tu le plus ?",
    opts: ["Un selfie raté mais trop mignon", "Une photo volée prise par un ami", "Un cliché en vacances ou en week-end", "Une photo prise dans un photomaton"],
    hint: "Ce premier cliché où vos deux visages rayonnaient ensemble."
  },
  {
    q: "Quel a été le premier plat cuisiné pour l'autre au début de la relation ?",
    target: "Quel premier plat as-tu cuisiné (ou fait goûter) à {partner} ?",
    guesser: "Quel plat symbolise vos premiers repas concoctés avec {target} ?",
    opts: ["Des pâtes maison avec une sauce travaillée", "Un plat commandé en faisant semblant d'avoir cuisiné", "Un dessert gourmand pour impressionner", "Un brunch improvisé du dimanche"],
    hint: "La séduction passe aussi très souvent par les papilles !"
  },
  {
    q: "Qui a dit 'Je t'aime' pour la première fois de vive voix ?",
    target: "Comment s'est passé le tout premier 'Je t'aime' avec {partner} ?",
    guesser: "Qui a prononcé le premier 'Je t'aime' selon {target} ?",
    opts: ["Toi dans un élan spontané", "{partner} au creux de l'oreille", "Les deux en même temps sous l'émotion", "Écrit d'abord sur un petit mot doux"],
    hint: "Ces trois mots magiques qui font battre le cœur à mille à l'heure."
  },
  {
    q: "Quel moyen de transport avez-vous pris lors de votre première escapade ?",
    target: "Quel moyen de transport avez-vous pris lors de votre premier week-end avec {partner} ?",
    guesser: "Quel transport a marqué votre première aventure avec {target} ?",
    opts: ["La voiture avec une playlist mémorable", "Le train avec la tête sur son épaule", "L'avion pour une destination lointaine", "À pied ou à vélo pour explorer"],
    hint: "Le voyage où le trajet comptait autant que l'arrivée."
  },
  {
    q: "Quel détail vestimentaire t'a tout de suite frappé(e) lors du premier rencard ?",
    target: "Quel détail vestimentaire as-tu remarqué en premier chez {partner} ?",
    guesser: "Quel vêtement ou accessoire {target} a-t-il remarqué chez toi au début ?",
    opts: ["Ses chaussures super bien choisies", "Sa veste ou manteau élégant", "Son parfum envoûtant", "Un bijou ou accessoire qui avait du style"],
    hint: "Ce détail soigné qui montrait l'effort pour plaire !"
  },
  {
    q: "Quelle a été votre toute première dispute (même complètement ridicule) ?",
    target: "Quel était le sujet futile de votre toute première micro-dispute avec {partner} ?",
    guesser: "Sur quoi portait votre première chamaillerie avec {target} ?",
    opts: ["Le choix de l'itinéraire sur le GPS", "Où aller manger ce soir-là", "Un retard de quelques minutes au rendez-vous", "Une mauvaise foi évidente lors d'un jeu"],
    hint: "Le petit clash sans gravité suivi d'un gros câlin de réconciliation."
  },
  {
    q: "Quel a été le premier cadeau symbolique offert par l'un à l'autre ?",
    target: "Quel a été le premier cadeau échangé entre toi et {partner} ?",
    guesser: "Quel premier cadeau offert par {target} t'a le plus marqué ?",
    opts: ["Un livre ou un vinyle avec une dédicace", "Une gourmandise ou boîte de chocolats fins", "Un vêtement ou accessoire de mode", "Un objet souvenir fait main ou symbolique"],
    hint: "Ce geste qui prouvait que l'autre avait bien écouté tes goûts."
  },
  {
    q: "Quelle boisson est devenue votre rituel des débuts en amoureux ?",
    target: "Quelle boisson commandiez-vous toujours au début avec {partner} ?",
    guesser: "Quelle était votre boisson fétiche des premiers verres avec {target} ?",
    opts: ["Une bonne bière artisanale ou IPA", "Un verre de vin rouge ou blanc partagé", "Un cocktail fruité ou un Spritz", "Un chocolat chaud ou un thé réconfortant"],
    hint: "La commande automatique dès que le serveur arrivait."
  },
  {
    q: "Comment s'est passée la première rencontre avec les amis de l'autre ?",
    target: "Quelle a été la vibe lors de ta première soirée avec les amis de {partner} ?",
    guesser: "Comment s'est passée l'intégration avec le cercle d'amis de {target} ?",
    opts: ["Validation immédiate et rires partagés", "Un peu timide au début, puis super fluide", "Un vrai interrogatoire bienveillant", "On est restés collés l'un à l'autre toute la soirée"],
    hint: "L'épreuve du feu des copains passée avec brio !"
  },
  {
    q: "Quel lieu improbable ou insolite a été le théâtre d'un de vos premiers baisers ?",
    target: "Quel lieu insolite se cache parmi vos premiers baisers avec {partner} ?",
    guesser: "Quel lieu atypique évoque un de vos premiers baisers avec {target} ?",
    opts: ["Sur un quai de gare avant un départ", "Sous un porche pour s'abriter de la pluie", "Dans un ascenseur entre deux étages", "Sur un toit ou un belvédère en hauteur"],
    hint: "Le baiser volé digne d'une scène de cinéma romantique."
  },
  {
    q: "Quelle était la première météo partagée lors de votre première grande promenade ?",
    target: "Quelle météo avez-vous bravée lors de votre première grande marche avec {partner} ?",
    guesser: "Quelle météo accompagnait votre première longue balade avec {target} ?",
    opts: ["Un grand soleil radieux et chaleureux", "Une pluie battante sous un seul parapluie", "Un froid mordant blottis l'un contre l'autre", "Une douce brise de fin d'après-midi"],
    hint: "Le prétexte parfait pour se serrer fort sous le même manteau !"
  },
  {
    q: "Quel a été le tout premier secret ou confidence intime partagé à deux ?",
    target: "Quel genre de secret as-tu confié en premier à {partner} ?",
    guesser: "Quelle première confidence intime t'a confiée {target} ?",
    opts: ["Une peur d'enfance un peu ridicule", "Un rêve secret que personne d'autre ne savait", "Une blessure du passé guérie depuis", "Une anecdote de famille très croustillante"],
    hint: "L'instant où la confiance absolue s'est installée entre vous."
  },
  {
    q: "Qui a fait la première gaffe ou maladresse au début de la relation ?",
    target: "Qui a commis la première gaffe mémorable entre toi et {partner} ?",
    guesser: "Qui a fait la première maladresse drôle selon {target} ?",
    opts: ["Toi en voulant trop bien faire", "{partner} avec une maladresse trop mignonne", "Une gaffe commise ensemble et assumée", "Le serveur ou une personne extérieure"],
    hint: "La maladresse qui a rendu la situation encore plus attachante !"
  },
  {
    q: "Quel était votre rituel du coucher lors de votre première semaine ensemble ?",
    target: "Quel était votre rituel avant d'éteindre la lumière avec {partner} ?",
    guesser: "Quel rituel du coucher a marqué vos premiers moments avec {target} ?",
    opts: ["Discuter pendant des heures jusqu'à 3h du matin", "S'endormir immédiatement enlacés", "Se raconter nos journées respectives", "Rigoler sur des vidéos ou des anecdotes"],
    hint: "Les paupières lourdes mais l'envie irrépressible de ne pas dormir."
  },
  {
    q: "Quel premier animal de compagnie ou chien croisé a fait craquer votre duo ?",
    target: "Quelle réaction aviez-vous en croisant des chiens mignons au début avec {partner} ?",
    guesser: "Quelle passion animale partagée a émergé dès le début avec {target} ?",
    opts: ["On s'arrêtait à chaque toutou pour le caresser", "On imaginait déjà adopter un chat ensemble", "On se montrait des vidéos d'animaux mignons", "On débattait sur quelle race de chien choisir"],
    hint: "Les premiers indices sur votre futur cocon familial."
  },
  {
    q: "Quelle première phrase d'accroche ou approche a marqué les esprits ?",
    target: "Quelle première approche t'a séduit(e) chez {partner} ?",
    guesser: "Quelle phrase ou approche {target} retient-il/elle de vous deux ?",
    opts: ["Une approche pleine d'humour et d'autodérision", "Un compliment sincère qui a touché droit au cœur", "Une question originale et curieuse", "Un simple regard appuyé qui disait tout"],
    hint: "Les premiers mots qui ont déclenché l'étincelle."
  },
  {
    q: "Quel premier dessert avez-vous partagé à la petite cuillère ?",
    target: "Quel premier dessert as-tu partagé à la même cuillère avec {partner} ?",
    guesser: "Quel dessert gourmand symbolise vos premiers péchés mignons avec {target} ?",
    opts: ["Un moelleux au chocolat coulant", "Un tiramisu maison gourmand", "Une coupe de glace avec double chantilly", "Une part de cheesecake généreuse"],
    hint: "La dernière bouchée laissée à l'autre par pur amour !"
  },
  {
    q: "Quel geste de tendresse t'a prouvé que cette relation était spéciale ?",
    target: "Quel petit geste de {partner} t'a fait fondre dès les premières semaines ?",
    guesser: "Quel geste affectueux a le plus touché {target} au début ?",
    opts: ["Prendre ma main sans prévenir dans la rue", "Remettre une mèche de cheveux derrière mon oreille", "Un bisou doux sur le front au réveil", "M'envoyer un message attentionné en plein milieu d'une journée stressante"],
    hint: "La délicatesse invisible aux yeux des autres mais inoubliable."
  },
  {
    q: "Quelle était votre première station de métro ou point de ralliement fétiche ?",
    target: "Où vous donniez-vous rendez-vous au tout début avec {partner} ?",
    guesser: "Quel point de rendez-vous récurrent évoque vos débuts avec {target} ?",
    opts: ["Devant une grande fontaine ou place connue", "À la sortie exacte d'une bouche de métro", "Devant le restaurant ou café choisi", "En bas de chez l'un ou l'autre"],
    hint: "L'endroit où ton cœur s'emballait en voyant l'autre arriver au loin."
  },
  {
    q: "Quel a été votre premier concert, festival ou spectacle vu ensemble ?",
    target: "Quel a été votre premier spectacle ou événement musical avec {partner} ?",
    guesser: "Quel concert ou spectacle partagé a marqué les débuts avec {target} ?",
    opts: ["Un concert en salle intime et feutrée", "Un grand festival en plein air à sauter dans la foule", "Une pièce de théâtre ou spectacle d'humour", "Un petit concert acoustique dans un bar"],
    hint: "Chanter les refrains à tue-tête l'un contre l'autre."
  },
  {
    q: "Quelle première odeur ou parfum reste associé(e) au début de votre histoire ?",
    target: "Quelle fragrance associes-tu immédiatement aux débuts avec {partner} ?",
    guesser: "Quel parfum rappelle instantanément votre rencontre à {target} ?",
    opts: ["Son parfum signature très envoûtant", "L'odeur de la pluie ou d'un café chaud", "L'odeur du linge propre dans les draps", "L'odeur de la mer ou des vacances"],
    hint: "La mémoire olfactive, la plus puissante pour raviver les émotions."
  },
  {
    q: "Quelle première série télévisée avez-vous juré de ne jamais regarder sans l'autre ?",
    target: "Pour quelle série aviez-vous conclu un pacte de fidélité avec {partner} ?",
    guesser: "Quelle série {target} s'interdisait-il/elle de regarder en solo ?",
    opts: ["Une série à suspense plein de rebondissements", "Une comédie feel-good réconfortante", "Une série fantastique ou médiévale", "Un docu palpitant ou true crime"],
    hint: "L'interdiction absolue de regarder l'épisode suivant tout(e) seul(e) !"
  },
  {
    q: "Quelle habitude de l'autre as-tu remarquée en premier chez lui/elle ?",
    target: "Quelle manie ou habitude as-tu captée en premier chez {partner} ?",
    guesser: "Quelle petite manie de chez toi a amusé {target} au début ?",
    opts: ["Sa façon unique de tenir sa tasse de café", "Le petit geste qu'il/elle fait quand il/elle réfléchit", "Sa démarche assurée ou bondissante", "Sa manie de vérifier 3 fois son téléphone"],
    hint: "Ce tic adorable qui n'appartient qu'à lui ou elle."
  },
  {
    q: "Quelle a été la première tenue que tu as choisie exprès pour lui plaire ?",
    target: "Comment t'es-tu habillé(e) pour le premier date officiel avec {partner} ?",
    guesser: "Quelle tenue portée par toi au début a marqué la mémoire de {target} ?",
    opts: ["Une tenue chic et élégante très soignée", "Un look décontracté mais stylé et naturel", "Une touche de sensualité subtile", "Mes vêtements préférés dans lesquels je me sens au top"],
    hint: "Le temps passé devant le miroir avant de partir !"
  },
  {
    q: "Quel a été le premier objet oublié chez l'autre qui a officialisé le cocon ?",
    target: "Quel premier objet as-tu laissé chez {partner} marquant ton territoire ?",
    guesser: "Quel objet oublié par {target} chez toi a marqué une étape importante ?",
    opts: ["Une brosse à dents flambant neuve", "Un chargeur de téléphone fétiche", "Un t-shirt ou pull pour dormir dedans", "Un bijou ou une pince à cheveux sur la table de nuit"],
    hint: "L'art de laisser une trace pour être sûr de vite revenir !"
  },
  {
    q: "Quel premier compliment de l'autre t'a fait rougir jusqu'aux oreilles ?",
    target: "Quel compliment de {partner} t'a fait le plus d'effet au début ?",
    guesser: "Quel compliment sincère fait à {target} l'a le plus touché(e) au cœur ?",
    opts: ["Sur la beauté de mon regard ou de mes yeux", "Sur mon intelligence et ma façon de penser", "Sur mon sourire ou mon rire communicatif", "Sur mon charme naturel et mon allure"],
    hint: "Le mot doux qui t'a donné le sourire pour toute la semaine."
  },
  {
    q: "Quel a été votre premier fou rire pendant un moment censé être sérieux ?",
    target: "Quel moment solennel s'est transformé en crise de rire avec {partner} ?",
    guesser: "Quel éclat de rire inopportun avec {target} reste un super souvenir ?",
    opts: ["Au cinéma pendant un film dramatique", "Lors d'un dîner feutré dans un resto chic", "Pendant une réunion de famille ou présentation", "En plein milieu d'une visite guidée silencieuse"],
    hint: "Se mordre les lèvres pour ne pas exploser de rire !"
  },
  {
    q: "Quelle saison de l'année a vu naître votre histoire d'amour ?",
    target: "Sous quelle saison votre coup de foudre s'est-il concrétisé avec {partner} ?",
    guesser: "Quelle saison symbolise l'éclosion de votre couple pour {target} ?",
    opts: ["Au printemps avec les premières fleurs", "En plein été sous la chaleur et les vacances", "En automne sous les feuilles dorées", "En hiver blottis au chaud au coin du feu"],
    hint: "L'atmosphère et la lumière de cette période inoubliable."
  },
  {
    q: "Quel a été le premier SMS mignon gardé précieusement en capture d'écran ?",
    target: "Quel type de message de {partner} as-tu screené pour ne jamais l'oublier ?",
    guesser: "Quel genre de message mignon de ta part {target} a-t-il conservé ?",
    opts: ["Une déclaration touchante envoyée au milieu de la nuit", "Un message pour dire à quel point le rendez-vous était génial", "Une promesse ou un vœu pour l'avenir", "Une phrase pleine d'esprit qui t'a fait éclater de rire"],
    hint: "Le message relu cinquante fois avant de s'endormir !"
  }
];
