import { Question } from '../types/quiz';

export const EXTRA_QUESTIONS: Question[] = [
  // ==========================================
  // SOUVENIRS & DÉBUTS (12 questions extra)
  // ==========================================
  {
    id: 'souv_e_9',
    category: 'souvenirs',
    difficulty: 'easy',
    question: 'Quelle chanson ou mélodie vous replonge immédiatement dans vos débuts ?',
    targetQuestion: 'Quelle musique te rappelle avec nostalgie le tout début de votre histoire avec {partner} ?',
    guesserQuestion: 'Selon toi, quelle musique replonge le plus {target} dans vos premiers rendez-vous ?',
    options: ['Le morceau qui passait lors de votre première soirée', 'Une chanson douce écoutée en boucle en voiture', 'Le tube de l’été de votre rencontre', 'Un slow ou une mélodie romantique intemporelle'],
    hint: 'La bande-originale secrète de votre coup de foudre.'
  },
  {
    id: 'souv_e_10',
    category: 'souvenirs',
    difficulty: 'easy',
    question: 'À quel moment as-tu su que c’était du sérieux entre vous ?',
    targetQuestion: 'À quel instant précis as-tu réalisé que ton histoire avec {partner} était unique et sérieuse ?',
    guesserQuestion: 'À quel moment penses-tu que {target} a compris que votre histoire devenait vraiment sérieuse ?',
    options: ['Dès la première semaine, une évidence immédiate', 'Lors de vos premières vacances ou week-end à deux', 'Après une longue discussion nocturne à cœur ouvert', 'Quand l’absence de l’autre est devenue insupportable'],
    hint: 'Le déclic émotionnel qui a tout scellé.'
  },
  {
    id: 'souv_m_9',
    category: 'souvenirs',
    difficulty: 'medium',
    question: 'Quel est le premier gros fou rire incontrôlable partagé ensemble ?',
    targetQuestion: 'Quel fou rire mémorable partagé avec {partner} te fait encore sourire aujourd’hui ?',
    guesserQuestion: 'Selon toi, quel souvenir de fou rire partagé a le plus marqué {target} ?',
    options: ['Une maladresse hilarante au restaurant', 'Une blague nulle que personne d’autre n’a comprise', 'Une chute ou un petit accident sans gravité', 'Un moment de fatigue extrême où tout devenait drôle'],
    hint: 'Ce fou rire où vous n’arriviez plus à respirer !'
  },
  {
    id: 'souv_m_10',
    category: 'souvenirs',
    difficulty: 'medium',
    question: 'Quelle petite peur ou angoisse aviez-vous avant de présenter votre partenaire aux proches ?',
    targetQuestion: 'Quelle appréhension avais-tu avant de présenter {partner} à tes amis ou à ta famille ?',
    guesserQuestion: 'Selon toi, qu’est-ce qui stressait le plus {target} avant la rencontre avec les proches ?',
    options: ['La peur qu’un proche sorte un dossier gênant', 'La peur d’un blanc gênant pendant le repas', 'La peur qu’ils ne partagent pas le même humour', 'Zéro stress, une totale confiance en son charme'],
    hint: 'Le grand test de l’intégration dans le cercle intime.'
  },
  {
    id: 'souv_s_9',
    category: 'souvenirs',
    difficulty: 'spicy',
    question: 'Quelle est la dispute du passé la plus absurde avec le recul ?',
    targetQuestion: 'Avec le recul, quelle est la dispute la plus ridicule ou dérisoire que tu as eue avec {partner} ?',
    guesserQuestion: 'Selon toi, quel désaccord du passé fait le plus rire {target} aujourd’hui par son absurdité ?',
    options: ['Une histoire d’itinéraire ou de GPS en voiture', 'Le choix du resto ou de la commande à emporter', 'Une tâche ménagère mal faite ou oubliée', 'Une mauvaise interprétation d’un message par SMS'],
    hint: 'De la pure mauvaise foi qui se termine en éclat de rire avec le recul.'
  },
  {
    id: 'souv_s_10',
    category: 'souvenirs',
    difficulty: 'spicy',
    question: 'Quel secret inavouable gardiez-vous au tout début de votre rencontre ?',
    targetQuestion: 'Au début de votre relation, quel petit secret ou complexe cachais-tu soigneusement à {partner} ?',
    guesserQuestion: 'Quel petit secret ou manie {target} a-t-il/elle attendu quelques semaines avant de t’avouer ?',
    options: ['Faire semblant d’adorer un plat ou un style de musique', 'Mettre 2h à choisir sa tenue en faisant croire à l’improvisation', 'Avoir stalké ses réseaux sociaux de fond en comble', 'Avoir répété ses messages avec un ami avant de les envoyer'],
    hint: 'Les petits stratagèmes des premiers jours pour séduire !'
  },

  // ==========================================
  // GOÛTS & QUOTIDIEN (12 questions extra)
  // ==========================================
  {
    id: 'quot_e_9',
    category: 'quotidien',
    difficulty: 'easy',
    question: 'Quel est l’aliment ou l’ingrédient interdit dans l’assiette de votre partenaire ?',
    targetQuestion: 'Quel est l’aliment que tu ne supportes absolument pas et que {partner} ne doit jamais te forcer à manger ?',
    guesserQuestion: 'Quel ingrédient {target} repousse-t-il/elle systématiquement sur le bord de son assiette ?',
    options: ['Les fruits de mer ou le poisson trop fort', 'Les champignons ou les légumes amers', 'La coriandre ou les épices trop fortes', 'Le fromage fort ou trop crémeux'],
    hint: 'Le cauchemar culinaire numéro 1.'
  },
  {
    id: 'quot_e_10',
    category: 'quotidien',
    difficulty: 'easy',
    question: 'Quelle est la réaction typique au réveil le dimanche matin ?',
    targetQuestion: 'Le dimanche matin au réveil, quelle est ton humeur habituelle aux côtés de {partner} ?',
    guesserQuestion: 'Quelle est la routine de réveil préférée de {target} le dimanche ?',
    options: ['Se lover sous la couette et faire la grasse matinée le plus longtemps possible', 'Bondir du lit avec une envie de café chaud et de croissants', 'Scroller sur son téléphone en silence pendant 45 minutes', 'Proposer immédiatement une balade ou une activité tonique'],
    hint: 'Marmotte en hibernation ou pile électrique dès le saut du lit ?'
  },
  {
    id: 'quot_m_9',
    category: 'quotidien',
    difficulty: 'medium',
    question: 'Quelle corvée domestique est la plus redoutée et négociée ?',
    targetQuestion: 'Parmi les tâches ménagères, laquelle négocies-tu systématiquement pour la refiler à {partner} ?',
    guesserQuestion: 'Selon toi, quelle tâche domestique {target} déteste-t-il/elle par-dessus tout faire ?',
    options: ['Plier et ranger le linge propre', 'Vider et récurer le lave-vaisselle', 'Passer la serpillière ou l’aspirateur dans les coins', 'Descendre les poubelles sous la pluie'],
    hint: 'La corvée qui fait soupirer rien que d’y penser.'
  },
  {
    id: 'quot_m_10',
    category: 'quotidien',
    difficulty: 'medium',
    question: 'Si le frigo est quasiment vide un soir de flemme, quel est le réflexe ?',
    targetQuestion: 'Face à un frigo vide un soir de flemme, quelle option choisis-tu le plus souvent avec {partner} ?',
    guesserQuestion: 'Quel est le réflexe de survie gourmand de {target} un soir de flemme totale ?',
    options: ['Commander des sushis ou une pizza en 3 clics', 'Cuisiner une recette de bric et de broc avec des restes', 'Manger du pain, du fromage ou des œufs sur le pouce', 'Faire les yeux doux à l’autre pour qu’il/elle trouve la solution'],
    hint: 'La gastronomie improvisée des soirs de flemme.'
  },
  {
    id: 'quot_s_9',
    category: 'quotidien',
    difficulty: 'spicy',
    question: 'Quel est le défaut de communication le plus flagrant sous le coup de la fatigue ?',
    targetQuestion: 'Quand tu es vidé(e) ou fatigué(e), quelle attitude involontaire adoptes-tu avec {partner} ?',
    guesserQuestion: 'Comment se manifeste la mauvaise humeur passagère de {target} quand la fatigue s’installe ?',
    options: ['Répondre par des phrases de 3 mots et soupirer', 'Bouder dans son coin en attendant un câlin réconfortant', 'Devenir susceptible sur la moindre remarque anodine', 'Partir dans un monologue pour décharger sa journée'],
    hint: 'Les petits signaux de batterie faible du couple.'
  },
  {
    id: 'quot_s_10',
    category: 'quotidien',
    difficulty: 'spicy',
    question: 'Combien de temps peut durer une bouderie dans votre duo ?',
    targetQuestion: 'Quand tu boudes {partner}, combien de temps arrives-tu à tenir avant d’éclater de rire ou de céder ?',
    guesserQuestion: 'Combien de temps dure généralement la bouderie de {target} avant que la paix revienne ?',
    options: ['Moins de 5 minutes, le premier câlin désamorce tout', 'Une heure environ, le temps de digérer dans son coin', 'Une demi-journée jusqu’au prochain repas partagé', 'Tant que l’autre ne vient pas s’excuser officiellement'],
    hint: 'La fierté mise à rude épreuve par l’amour.'
  },

  // ==========================================
  // PERSONNALITÉ & DILEMMES (12 questions extra)
  // ==========================================
  {
    id: 'pers_e_9',
    category: 'personnalite',
    difficulty: 'easy',
    question: 'Quel super-pouvoir imaginaire correspondrait le mieux à votre partenaire ?',
    targetQuestion: 'Si tu pouvais t’octroyer un super-pouvoir dans la vraie vie, lequel choisirais-tu ?',
    guesserQuestion: 'Quel super-pouvoir correspondrait le plus à l’esprit de {target} ?',
    options: ['La téléportation pour voyager instantanément', 'Le pouvoir de lire dans les pensées (pour démasquer les menteurs)', 'Contrôler le temps pour rallonger les week-ends', 'L’invisibilité pour observer discrètement le monde'],
    hint: 'Le rêve d’enfant qui sommeille en chacun.'
  },
  {
    id: 'pers_e_10',
    category: 'personnalite',
    difficulty: 'easy',
    question: 'Face à un film très triste ou émouvant, qui verse sa larme en premier ?',
    targetQuestion: 'Devant un film dramatique bouleversant, comment réagis-tu aux côtés de {partner} ?',
    guesserQuestion: 'Selon toi, quelle est la sensibilité émotionnelle de {target} devant un film émouvant ?',
    options: ['Pleurer à chaudes larmes sans aucune gêne', 'Avoir la gorge nouée mais faire semblant d’avoir une poussière dans l’œil', 'Rester imperturbable et analyser le scénario', 'Regarder l’autre en souriant pour voir s’il/elle pleure'],
    hint: 'La corde sensible face au grand écran.'
  },
  {
    id: 'pers_m_9',
    category: 'personnalite',
    difficulty: 'medium',
    question: 'En société ou en soirée, quel rôle votre partenaire incarne-t-il naturellement ?',
    targetQuestion: 'Lors d’une grande soirée avec des amis et des inconnus, quelle est ta posture naturelle ?',
    guesserQuestion: 'Comment {target} se comporte-t-il/elle spontanément lors d’une fête animée ?',
    options: ['Le boute-en-train au centre des conversations et des blagues', 'L’observateur complice qui préfère les discussions intimistes à 2 ou 3', 'Le barman / DJ improvisé qui s’assure que tout le monde va bien', 'Celui/celle qui veut rentrer se coucher dès minuit passé'],
    hint: 'L’énergie sociale en groupe.'
  },
  {
    id: 'pers_m_10',
    category: 'personnalite',
    difficulty: 'medium',
    question: 'Quelle est la réaction face à une critique ou une injustice ?',
    targetQuestion: 'Quand tu es victime d’une injustice ou d’une critique infondée, comment réagis-tu ?',
    guesserQuestion: 'Comment réagit {target} face à une injustice ou une situation inéquitable ?',
    options: ['Monter au créneau immédiatement avec des arguments percutants', 'Prendre sur soi sur le moment et en débattre plus tard à froid', 'Ronger son frein et ruminer pendant des heures', 'Prendre de la hauteur et laisser couler avec philosophie'],
    hint: 'Le tempérament face aux conflits du quotidien.'
  },
  {
    id: 'pers_s_9',
    category: 'personnalite',
    difficulty: 'spicy',
    question: 'Si vous pouviez effacer un petit défaut chez votre partenaire d’un coup de baguette, quel serait-il ?',
    targetQuestion: 'Quel petit défaut chez {partner} aimerais-tu atténuer d’un coup de baguette magique ?',
    guesserQuestion: 'Quel petit trait de caractère {target} adorerait-il/elle adoucir chez toi ?',
    options: ['L’impatience ou le besoin de tout contrôler', 'La mauvaise foi lors des débats d’idées', 'Le manque d’organisation ou les retards chroniques', 'Rien du tout, ses défauts font son charme irrésistible'],
    hint: 'La petite manie qu’on pardonne mais qui met à l’épreuve !'
  },
  {
    id: 'pers_s_10',
    category: 'personnalite',
    difficulty: 'spicy',
    question: 'Quel est votre niveau de jalousie secrète au quotidien ?',
    targetQuestion: 'Soyons francs : quelle est ta dose de jalousie intérieure quand quelqu’un tourne un peu trop autour de {partner} ?',
    guesserQuestion: 'À ton avis, quel est le niveau réel de jalousie intérieure de {target} ?',
    options: ['Zéro jalousie, une confiance totale et sereine', 'Une pointe de fierté amusée mêlée à un regard vigilant', 'Un petit pincement au cœur vite désamorcé par un câlin', 'Un instinct protecteur territorial très aiguisé'],
    hint: 'La sincérité sur la possessivité amoureuse.'
  },

  // ==========================================
  // PROJETS & RÊVES (12 questions extra)
  // ==========================================
  {
    id: 'proj_e_9',
    category: 'projets',
    difficulty: 'easy',
    question: 'Quel animal de compagnie de rêve rejoindrait votre foyer parfait ?',
    targetQuestion: 'Si vous deviez accueillir un nouveau compagnon à 4 pattes chez vous avec {partner}, ce serait quoi ?',
    guesserQuestion: 'Quel animal ferait craquer {target} pour agrandir votre famille ?',
    options: ['Un gros chien affectueux et joueur (type Golden ou Samoyède)', 'Un chat indépendant mais très câlin ronronnant sur les genoux', 'Deux petits compagnons inséparables', 'Aucun animal, liberté totale pour voyager sans contrainte'],
    hint: 'L’ambiance animale sous votre toit.'
  },
  {
    id: 'proj_e_10',
    category: 'projets',
    difficulty: 'easy',
    question: 'Si vous gagniez une somme folle à la loterie demain, quel serait le tout premier geste ?',
    targetQuestion: 'Si vous touchiez le jackpot demain, quelle serait ta toute première folie avec {partner} ?',
    guesserQuestion: 'Quelle folie immédiate {target} voudrait-il/elle réaliser en apprenant le jackpot ?',
    options: ['Réserver un vol en première classe pour faire le tour du monde', 'Acheter la maison de vos rêves avec jardin et vue imprenable', 'Mettre ses proches à l’abri et démissionner sur-le-champ', 'Organiser une fête géante et inoubliable avec tous les amis'],
    hint: 'Le grand fantasme du million d’euros !'
  },
  {
    id: 'proj_m_9',
    category: 'projets',
    difficulty: 'medium',
    question: 'Où vous voyez-vous fêter vos 10 ans d’amour ?',
    targetQuestion: 'Dans tes rêves les plus doux, où aimerais-tu célébrer une décennie d’amour avec {partner} ?',
    guesserQuestion: 'Où {target} rêverait-il/elle d’immortaliser vos 10 ans d’histoire d’amour ?',
    options: ['Sur une plage paradisiaque au bout du monde les pieds dans l’eau', 'Dans un grand domaine champêtre entourés de tous vos proches', 'Dans un palace historique pour un week-end d’exception en amoureux', 'Dans votre chez-vous cosy, simplement tous les deux devant un bon vin'],
    hint: 'La vision romantique à long terme.'
  },
  {
    id: 'proj_m_10',
    category: 'projets',
    difficulty: 'medium',
    question: 'Quel grand défi physique ou insolite aimeriez-vous relever ensemble ?',
    targetQuestion: 'Quel défi hors du commun te plairait le plus de partager avec {partner} ?',
    guesserQuestion: 'À quel défi un peu fou {target} aimerait-il/elle te voir participer à ses côtés ?',
    options: ['Faire un trek de plusieurs jours au milieu d’une nature sauvage', 'Sauter en parachute ou faire du parapente en tandem', 'Apprendre ensemble une nouvelle discipline (danse, plongée, poterie)', 'Rénover une vieille maison de campagne de A à Z avec vos mains'],
    hint: 'L’aventure commune qui forge les souvenirs.'
  },
  {
    id: 'proj_s_9',
    category: 'projets',
    difficulty: 'spicy',
    question: 'Si vous deviez vivre un an à l’étranger sans vos repères, où poseriez-vous vos valises ?',
    targetQuestion: 'Si tu devais convaincre {partner} de tout plaquer un an pour vivre ailleurs, quelle région choisirais-tu ?',
    guesserQuestion: 'Vers quelle contrée lointaine {target} voudrait-il/elle t’entraîner pour une année sabbatique ?',
    options: ['Un pays chaud et ensoleillé d’Asie du Sud-Est ou d’Amérique Latine', 'Une grande métropole vibrante (Tokyo, New York, Montréal)', 'Un village paisible d’Italie ou de Grèce au bord de la Méditerranée', 'Une région scandinave sauvage entre fjords et aurores boréales'],
    hint: 'L’appel du grand large en amoureux.'
  },
  {
    id: 'proj_s_10',
    category: 'projets',
    difficulty: 'spicy',
    question: 'Quelle est la chose la plus précieuse que vous ayez construite ou apprise ensemble jusqu’ici ?',
    targetQuestion: 'Quelle est la plus belle évolution personnelle que {partner} a inspirée en toi ?',
    guesserQuestion: 'Selon toi, quelle est la plus belle trace que votre amour a laissée dans la vie de {target} ?',
    options: ['Prendre confiance en soi et oser s’affirmer', 'Apprendre à écouter, tempérer son caractère et faire des concessions', 'Découvrir ce que signifie la sécurité affective inconditionnelle', 'Avoir le courage de rêver plus grand et de briser les barrières'],
    hint: 'La profondeur du lien qui grandit avec le temps.'
  },

  // ==========================================
  // COQUIN & INTIMITÉ (12 questions extra)
  // ==========================================
  {
    id: 'coq_e_9',
    category: 'coquin',
    difficulty: 'easy',
    question: 'Quelle zone de caresse fait frissonner instantanément ?',
    targetQuestion: 'Où une caresse délicate de {partner} te donne-t-elle immédiatement des frissons de désir ?',
    guesserQuestion: 'Quelle zone sensible fait frissonner {target} dès le premier contact ?',
    options: ['Le creux du cou et le lobe de l’oreille', 'Le bas du dos et le creux des reins', 'Le cuir chevelu et les doigts glissés dans les cheveux', 'L’intérieur des cuisses et les hanches'],
    hint: 'Les boutons magiques de la sensualité.'
  },
  {
    id: 'coq_e_10',
    category: 'coquin',
    difficulty: 'easy',
    question: 'Quelle heure de la journée inspire les plus douces envies coquines ?',
    targetQuestion: 'Quel moment de la journée trouve-tu le plus propice à l’intimité avec {partner} ?',
    guesserQuestion: 'À quel moment {target} est-il/elle le plus réceptif(ve) aux élans coquins ?',
    options: ['Le matin au réveil encore engourdis sous les draps chauds', 'L’après-midi lors d’une sieste improvisée le week-end', 'Le soir tard dans le silence et l’obscurité de la chambre', 'N’importe quand, le désir ne regarde pas la montre !'],
    hint: 'Le tempo de la séduction.'
  },
  {
    id: 'coq_m_9',
    category: 'coquin',
    difficulty: 'medium',
    question: 'Quel jeu de séduction fait le plus monter la tension avant l’amour ?',
    targetQuestion: 'Quel rituel de séduction te fait le plus perdre la tête avant de passer aux choses sérieuses ?',
    guesserQuestion: 'Qu’est-ce qui fait monter la tension érotique chez {target} à coup sûr ?',
    options: ['Des baisers langoureux et appuyés qui ne s’arrêtent plus', 'Des petits messages coquins et provocants distillés pendant la journée', 'Une tenue particulièrement séduisante et dénudée', 'Un massage à l’huile où les mains s’égarent lentement'],
    hint: 'Les préliminaires de l’esprit avant le corps.'
  },
  {
    id: 'coq_m_10',
    category: 'coquin',
    difficulty: 'medium',
    question: 'Quelle ambiance lumineuse crée la meilleure magie sous la couette ?',
    targetQuestion: 'Quelle ambiance visuelle préfères-tu pour vos étreintes intimes avec {partner} ?',
    guesserQuestion: 'Quelle lumière {target} préfère-t-il/elle pour vos moments coquins ?',
    options: ['La lueur chaleureuse et vacillante de quelques bougies', 'La pénombre tamisée d’une petite lampe de chevet', 'Le noir complet pour éveiller tous les autres sens au toucher', 'La lumière du jour pour admirer chaque courbe sans complexe'],
    hint: 'Le décor parfait pour faire monter la température.'
  },
  {
    id: 'coq_s_9',
    category: 'coquin',
    difficulty: 'spicy',
    question: 'Quel lieu insolite hors de la chambre titille le plus votre imagination ?',
    targetQuestion: 'Quel endroit inattendu ou un brin risqué piquerait ton audace avec {partner} ?',
    guesserQuestion: 'Selon toi, quel lieu inhabituel éveillerait le plus l’excitation de {target} ?',
    options: ['Sur la banquette arrière d’une voiture dans un coin discret', 'Dans l’eau chaude d’un bain ou d’une crique sauvage isolée', 'Sur le tapis du salon au coin d’un feu de cheminée', 'Dans une cabine d’essayage ou un ascenseur pour le frisson de l’interdit'],
    hint: 'Sortir des sentiers battus pour pimenter le désir.'
  },
  {
    id: 'coq_s_10',
    category: 'coquin',
    difficulty: 'spicy',
    question: 'Quel compliment pendant l’amour fait le plus d’effet ?',
    targetQuestion: 'Quel type de murmure ou de mot doux à l’oreille décuple ton plaisir pendant l’amour ?',
    guesserQuestion: 'Quel murmure coquin fait le plus chavirer {target} pendant vos étreintes ?',
    options: ['Un mot cru et direct sur le plaisir qu’il/elle te procure', 'Un murmure amoureux répétant à quel point tu le/la désires', 'Un soupir d’extase qui montre que tu perds totalement le contrôle', 'Une invitation taquine à prolonger le plaisir encore plus longtemps'],
    hint: 'La puissance des mots soufflés dans le creux du cou.'
  }
];
