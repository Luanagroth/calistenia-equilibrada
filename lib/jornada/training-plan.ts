export type TrainingStep = {
  label: string;
  description: string;
};

export type TrainingExerciseCategory =
  | "aquecimento"
  | "mobilidade"
  | "estabilidade"
  | "forca"
  | "alongamento"
  | "respiracao";

export type TrainingPlanLevel =
  | "base"
  | "adaptacao"
  | "estabilidade"
  | "forca"
  | "integracao"
  | "consolidacao";

export type TrainingExercise = {
  id: string;
  category: TrainingExerciseCategory;
  name: string;
  summary: string;
  howTo: string[];
  sets: string;
  reps: string;
  rest: string;
  commonMistakes: string[];
  adaptation: string;
  safetyNote: string;
  media?: {
    imageSrc?: string;
    videoSrc?: string;
  };
};

export type TrainingHabit = {
  id: string;
  label: string;
  description: string;
};

export type TrainingDayPlan = {
  day: number;
  title: string;
  focus: string;
  duration: string;
  description: string;
  level: TrainingPlanLevel;
  exercises: TrainingExercise[];
  habits: TrainingHabit[];
  steps: TrainingStep[];
  adaptation: string;
  safetyNote: string;
};

type DayConfig = {
  day: number;
  title: string;
  focus: string;
  duration: string;
  description: string;
  level: TrainingPlanLevel;
  exerciseIds: string[];
  adaptation: string;
  safetyNote: string;
};

const defaultSafetyNote =
  "Pare se sentir dor forte, tontura, formigamento ou perda importante de controle do movimento.";

const defaultHabits: TrainingHabit[] = [
  {
    id: "hydration",
    label: "Bebi agua hoje",
    description: "A hidratacao ajuda o corpo a responder melhor ao treino e a se recuperar.",
  },
  {
    id: "balancedFood",
    label: "Fiz uma alimentacao equilibrada",
    description: "Comer de forma equilibrada ajuda energia, foco e constancia.",
  },
  {
    id: "naturalFoods",
    label: "Inclui frutas, verduras ou alimentos naturais",
    description: "Escolhas simples durante o dia contribuem para uma rotina mais sustentavel.",
  },
  {
    id: "respectedLimits",
    label: "Respeitei meus limites",
    description: "Evoluir sem forcar o corpo e mais importante do que terminar rapido.",
  },
  {
    id: "rest",
    label: "Descansei ou dormi bem",
    description: "Recuperacao tambem faz parte da jornada.",
  },
  {
    id: "reading",
    label: "Li ou revisei a orientacao do dia",
    description: "Revisar a orientacao ajuda a praticar com mais clareza e intencao.",
  },
];

const exerciseLibrary: Record<string, TrainingExercise> = {
  "rotacao-ombros": {
    id: "rotacao-ombros",
    category: "aquecimento",
    name: "Rotacao de ombros",
    summary: "Mobilidade leve para soltar os ombros e preparar a parte superior.",
    howTo: [
      "Fique em pe ou sentado com a coluna alta e o peito aberto.",
      "Relaxe os ombros e deixe os bracos soltos ao lado do corpo.",
      "Faca circulos lentos com os ombros para frente por algumas repeticoes.",
      "Depois repita o mesmo movimento para tras, aumentando a amplitude aos poucos.",
      "Respire de forma calma e pare se sentir dor aguda ou estalo doloroso.",
    ],
    sets: "2 series",
    reps: "10 rotacoes para frente e 10 para tras",
    rest: "20 a 30 segundos",
    commonMistakes: [
      "Fazer rapido demais",
      "Encolher os ombros perto das orelhas",
      "Prender a respiracao",
    ],
    adaptation: "Faça circulos menores ou sente-se em uma cadeira se estiver cansado.",
    safetyNote: defaultSafetyNote,
  },
  "gato-camelo": {
    id: "gato-camelo",
    category: "aquecimento",
    name: "Gato e Camelo",
    summary: "Movimento suave para aquecer a coluna e melhorar a percepcao corporal.",
    howTo: [
      "Fique em quatro apoios com maos abaixo dos ombros e joelhos abaixo do quadril.",
      "Ao soltar o ar, arredonde a coluna e olhe levemente para o umbigo.",
      "Ao inspirar, devolva a coluna para uma extensao confortavel sem jogar a cabeca para tras.",
      "Mantenha o movimento lento, como se desenhasse a coluna vertebra por vertebra.",
      "Interrompa se sentir dor pontual ou pressao forte na lombar.",
    ],
    sets: "2 series",
    reps: "6 a 8 ciclos completos",
    rest: "20 segundos",
    commonMistakes: [
      "Fazer o movimento de forma brusca",
      "Dobrar demais os cotovelos",
      "Forcar a lombar para criar amplitude",
    ],
    adaptation: "Coloque uma toalha sob os joelhos ou reduza a amplitude do movimento.",
    safetyNote: defaultSafetyNote,
  },
  "mobilidade-toracica-quatro-apoios": {
    id: "mobilidade-toracica-quatro-apoios",
    category: "mobilidade",
    name: "Mobilidade toracica em quatro apoios",
    summary: "Ajuda a girar melhor a parte media das costas e facilita a postura.",
    howTo: [
      "Comece em quatro apoios e leve uma das maos atras da nuca.",
      "Mantenha o quadril firme enquanto gira o cotovelo para cima.",
      "Volte devagar e leve o cotovelo em direcao ao braco de apoio.",
      "Expire quando girar para cima e inspire ao voltar.",
      "Troque o lado mantendo a coluna longa e o movimento sem pressa.",
    ],
    sets: "2 series",
    reps: "6 a 8 repeticoes por lado",
    rest: "20 a 30 segundos",
    commonMistakes: [
      "Girar o quadril junto",
      "Forcar o pescoço",
      "Subir o cotovelo sem controle",
    ],
    adaptation: "Faça com a mao apoiada no peito em vez de atras da nuca se estiver dificil.",
    safetyNote: defaultSafetyNote,
  },
  "alongamento-toracico": {
    id: "alongamento-toracico",
    category: "alongamento",
    name: "Alongamento toracico",
    summary: "Abre a parte da frente do tronco e reduz rigidez na regiao media das costas.",
    howTo: [
      "Sente-se ou fique em pe com o peito aberto e as maos atras da cabeca ou apoiadas na parede.",
      "Eleve levemente o esterno, sem exagerar na lombar.",
      "Respire fundo e mantenha a expansao toracica por alguns segundos.",
      "Saia da posicao devagar e repita sem forcar o pescoço.",
      "A sensacao deve ser de abertura, nao de compressao.",
    ],
    sets: "2 series",
    reps: "20 a 30 segundos por repeticao",
    rest: "20 segundos",
    commonMistakes: [
      "Compensar jogando a lombar para frente",
      "Prender a respiracao",
      "Forcar o pescoço para tras",
    ],
    adaptation: "Apoie as maos em uma parede para reduzir a carga no ombro.",
    safetyNote: defaultSafetyNote,
  },
  "mobilidade-quadril": {
    id: "mobilidade-quadril",
    category: "mobilidade",
    name: "Mobilidade de quadril",
    summary: "Movimento controlado para soltar o quadril e melhorar conforto ao agachar.",
    howTo: [
      "Fique em pe com apoio leve em uma cadeira ou parede.",
      "Leve um joelho para cima e desenhe pequenos circulos com o quadril.",
      "Mantenha o tronco alto e o abdomen levemente ativo.",
      "Respire sem pressa e troque a direcao dos circulos antes de mudar de lado.",
      "Pare se perder o equilibrio ou sentir pinçamento forte no quadril.",
    ],
    sets: "2 series",
    reps: "6 a 8 circulos por direcao em cada lado",
    rest: "20 a 30 segundos",
    commonMistakes: [
      "Jogar o tronco para os lados",
      "Aumentar amplitude rapido demais",
      "Prender a respiracao",
    ],
    adaptation: "Diminua o tamanho do circulo e use mais apoio se necessario.",
    safetyNote: defaultSafetyNote,
  },
  "alongamento-flexores-quadril": {
    id: "alongamento-flexores-quadril",
    category: "alongamento",
    name: "Alongamento dos flexores do quadril",
    summary: "Ajuda a aliviar a frente do quadril e melhorar extensao do corpo.",
    howTo: [
      "Fique em meia-ajoelhado com um joelho no chao e o outro pe a frente.",
      "Contraia levemente o gluteo da perna de tras.",
      "Leve o quadril para frente sem arquear demais a lombar.",
      "Respire de forma lenta enquanto sustenta a posicao.",
      "Saia devagar e troque o lado se a sensacao estiver confortavel.",
    ],
    sets: "2 series",
    reps: "20 a 30 segundos por lado",
    rest: "20 segundos",
    commonMistakes: [
      "Empurrar o quadril demais",
      "Abrir demais a costela",
      "Ignorar desconforto no joelho de apoio",
    ],
    adaptation: "Use um colchonete, almofada ou faca com o joelho traseiro mais perto.",
    safetyNote: defaultSafetyNote,
  },
  "alongamento-tornozelos": {
    id: "alongamento-tornozelos",
    category: "mobilidade",
    name: "Alongamento de tornozelos",
    summary: "Melhora a dorsiflexao e ajuda em agachamentos e passadas mais confortaveis.",
    howTo: [
      "Fique de frente para uma parede com um pe mais a frente.",
      "Mantenha o calcanhar da frente no chao e leve o joelho em direcao a parede.",
      "Segure por um instante e volte sem tirar o pe do solo.",
      "Repita de forma lenta mantendo o arco do pe estavel.",
      "Troque o lado e respire naturalmente ao longo do movimento.",
    ],
    sets: "2 series",
    reps: "8 a 10 repeticoes por lado",
    rest: "20 segundos",
    commonMistakes: [
      "Levantar o calcanhar do chao",
      "Deixar o joelho cair para dentro",
      "Fazer tudo rapido demais",
    ],
    adaptation: "Diminua a distancia da parede para reduzir a exigencia.",
    safetyNote: defaultSafetyNote,
  },
  "agachamento-profundo-assistido": {
    id: "agachamento-profundo-assistido",
    category: "mobilidade",
    name: "Agachamento profundo assistido",
    summary: "Explora o agachamento com apoio para ganhar mobilidade e confianca.",
    howTo: [
      "Segure em um apoio firme na frente do corpo.",
      "Afaste os pes na largura mais confortavel e aponte levemente as pontas para fora.",
      "Desca o quadril devagar, usando o apoio para controlar o movimento.",
      "Mantenha o peito aberto e tente deixar os calcanhares no chao.",
      "Suba empurrando o chao e sem travar a respiracao.",
    ],
    sets: "2 a 3 series",
    reps: "6 a 8 repeticoes lentas",
    rest: "30 a 45 segundos",
    commonMistakes: [
      "Descer sem controle",
      "Colapsar os joelhos para dentro",
      "Perder o apoio do pe no chao",
    ],
    adaptation: "Desca menos e use mais apoio nas maos para aliviar a carga.",
    safetyNote: defaultSafetyNote,
  },
  "ponte-gluteos": {
    id: "ponte-gluteos",
    category: "estabilidade",
    name: "Ponte de gluteos",
    summary: "Ativa gluteos e cadeia posterior com baixo impacto.",
    howTo: [
      "Deite de barriga para cima com joelhos dobrados e pes apoiados no chao.",
      "Ative o abdomen e pressione os pes contra o solo.",
      "Eleve o quadril ate formar uma linha confortavel entre ombros, quadril e joelhos.",
      "Solte o ar ao subir e inspire ao descer devagar.",
      "Pare se sentir compressao forte na lombar ou cãibra persistente.",
    ],
    sets: "2 a 3 series",
    reps: "8 a 12 repeticoes",
    rest: "30 a 45 segundos",
    commonMistakes: [
      "Subir usando impulso",
      "Arquear demais a lombar",
      "Deixar os joelhos abrirem ou fecharem demais",
    ],
    adaptation: "Reduza a altura do quadril ou segure menos tempo no topo.",
    safetyNote: defaultSafetyNote,
  },
  "bird-dog": {
    id: "bird-dog",
    category: "estabilidade",
    name: "Bird Dog",
    summary: "Treina estabilidade do tronco com controle de braco e perna opostos.",
    howTo: [
      "Fique em quatro apoios com maos e joelhos bem posicionados.",
      "Ative o abdomen como se quisesse manter a coluna neutra.",
      "Estenda uma perna para tras e o braco oposto para frente sem girar o tronco.",
      "Solte o ar ao estender e volte devagar para a posicao inicial.",
      "Troque os lados mantendo o olhar para o chao e o movimento controlado.",
    ],
    sets: "2 a 3 series",
    reps: "6 a 8 repeticoes por lado",
    rest: "30 segundos",
    commonMistakes: [
      "Rodar o quadril",
      "Levantar demais a perna",
      "Perder o controle da respiracao",
    ],
    adaptation: "Movimente apenas a perna ou apenas o braco se os dois juntos forem dificeis.",
    safetyNote: defaultSafetyNote,
  },
  "dead-bug": {
    id: "dead-bug",
    category: "estabilidade",
    name: "Dead Bug",
    summary: "Exercicio de core para coordenar respiracao, abdomen e membros.",
    howTo: [
      "Deite de barriga para cima com quadris e joelhos a noventa graus.",
      "Eleve os bracos para o teto e encoste suavemente a lombar no chao.",
      "Estenda devagar uma perna e o braco oposto sem perder o controle do tronco.",
      "Expire ao estender e inspire ao retornar.",
      "Alterne os lados mantendo o pescoco relaxado.",
    ],
    sets: "2 a 3 series",
    reps: "6 a 8 repeticoes por lado",
    rest: "30 segundos",
    commonMistakes: [
      "Tirar a lombar do chao",
      "Fazer rapido demais",
      "Enrijecer o pescoco",
    ],
    adaptation: "Mova apenas as pernas ou apenas os bracos no inicio.",
    safetyNote: defaultSafetyNote,
  },
  "prancha-joelhos": {
    id: "prancha-joelhos",
    category: "estabilidade",
    name: "Prancha com joelhos",
    summary: "Fortalece o core em uma versao acessivel e controlada.",
    howTo: [
      "Apoie antebracos e joelhos no chao, com cotovelos abaixo dos ombros.",
      "Ative abdomen e gluteos de forma leve.",
      "Mantenha o corpo alinhado da cabeca aos joelhos sem deixar a lombar cair.",
      "Respire curto e ritmado sem prender o ar.",
      "Pare assim que perder o alinhamento.",
    ],
    sets: "2 a 3 series",
    reps: "15 a 30 segundos por repeticao",
    rest: "30 a 45 segundos",
    commonMistakes: [
      "Deixar o quadril despencar",
      "Subir demais o bumbum",
      "Prender a respiracao",
    ],
    adaptation: "Faça com as maos apoiadas em um banco ou sofa se o chao estiver pesado demais.",
    safetyNote: defaultSafetyNote,
  },
  "prancha-tradicional": {
    id: "prancha-tradicional",
    category: "estabilidade",
    name: "Prancha tradicional",
    summary: "Desafio maior de estabilidade para o tronco inteiro.",
    howTo: [
      "Apoie antebracos e pontas dos pes no chao.",
      "Empurre o chao com os antebracos e ative pernas, gluteos e abdomen.",
      "Mantenha a linha do corpo reta sem afundar a lombar.",
      "Respire em ciclos curtos e controlados.",
      "Encerre a serie quando a tecnica comecar a se perder.",
    ],
    sets: "2 a 3 series",
    reps: "15 a 30 segundos por repeticao",
    rest: "45 segundos",
    commonMistakes: [
      "Jogar o peso todo nos ombros",
      "Prender o ar",
      "Elevar ou baixar demais o quadril",
    ],
    adaptation: "Volte para a prancha com joelhos se nao conseguir manter o alinhamento.",
    safetyNote: defaultSafetyNote,
  },
  "prancha-lateral-adaptada": {
    id: "prancha-lateral-adaptada",
    category: "estabilidade",
    name: "Prancha lateral adaptada",
    summary: "Estimula estabilidade lateral do tronco com apoio ajustado.",
    howTo: [
      "Deite de lado e apoie o antebraco abaixo do ombro.",
      "Mantenha os joelhos dobrados e um joelho apoiado no chao.",
      "Eleve o quadril tirando a lateral do corpo do solo.",
      "Respire de forma constante e mantenha o pescoço neutro.",
      "Desca devagar e troque o lado.",
    ],
    sets: "2 series",
    reps: "15 a 25 segundos por lado",
    rest: "30 segundos",
    commonMistakes: [
      "Afundar o ombro de apoio",
      "Rodar o tronco para frente",
      "Tentar segurar alem do proprio controle",
    ],
    adaptation: "Apoie a mao de cima no chao a frente do corpo para ganhar estabilidade.",
    safetyNote: defaultSafetyNote,
  },
  "superman": {
    id: "superman",
    category: "estabilidade",
    name: "Superman",
    summary: "Ativacao leve da cadeia posterior para costas e gluteos.",
    howTo: [
      "Deite de barriga para baixo com testa apoiada em uma toalha se quiser.",
      "Ative o abdomen levemente para proteger a lombar.",
      "Eleve bracos e pernas alguns centimetros sem buscar altura exagerada.",
      "Solte o ar ao subir e inspire ao descer devagar.",
      "Interrompa se sentir compressao forte na lombar.",
    ],
    sets: "2 series",
    reps: "6 a 10 repeticoes",
    rest: "30 segundos",
    commonMistakes: [
      "Subir demais e travar a lombar",
      "Jogar o pescoco para tras",
      "Usar impulso para levantar",
    ],
    adaptation: "Levante apenas os bracos ou apenas as pernas se a versao completa estiver pesada.",
    safetyNote: defaultSafetyNote,
  },
  "flexao-inclinada": {
    id: "flexao-inclinada",
    category: "forca",
    name: "Flexao inclinada",
    summary: "Versao acessivel da flexao para fortalecer peito, ombros e triceps.",
    howTo: [
      "Apoie as maos em uma parede, bancada ou apoio firme.",
      "Caminhe com os pes para tras ate o corpo formar uma linha inclinada.",
      "Flexione os cotovelos aproximando o peito do apoio.",
      "Empurre o apoio para voltar, soltando o ar na subida.",
      "Pare antes de perder alinhamento do tronco.",
    ],
    sets: "2 a 3 series",
    reps: "6 a 10 repeticoes",
    rest: "45 segundos",
    commonMistakes: [
      "Abrir demais os cotovelos",
      "Deixar a lombar cair",
      "Escolher uma inclinacao muito baixa cedo demais",
    ],
    adaptation: "Use um apoio mais alto para deixar o exercicio mais leve.",
    safetyNote: defaultSafetyNote,
  },
  "afundo-apoio": {
    id: "afundo-apoio",
    category: "forca",
    name: "Afundo com apoio",
    summary: "Fortalece pernas e melhora controle unilateral com mais seguranca.",
    howTo: [
      "Fique em pe segurando em um apoio firme ao lado do corpo.",
      "De um passo para tras curto e mantenha a base estavel.",
      "Desca os joelhos de forma controlada, sem bater o joelho de tras no chao.",
      "Empurre o chao para subir soltando o ar.",
      "Troque o lado e mantenha o tronco alto durante toda a serie.",
    ],
    sets: "2 a 3 series",
    reps: "6 a 8 repeticoes por lado",
    rest: "45 segundos",
    commonMistakes: [
      "Dar um passo longo demais",
      "Deixar o joelho da frente cair para dentro",
      "Inclinar muito o tronco para frente",
    ],
    adaptation: "Reduza a descida ou transforme o afundo em passada estatica curta.",
    safetyNote: defaultSafetyNote,
  },
  "remada-adaptada": {
    id: "remada-adaptada",
    category: "forca",
    name: "Barra australiana ou remada adaptada",
    summary: "Fortalece costas e bracos com uma tracao acessivel.",
    howTo: [
      "Use uma mesa firme, barra baixa ou faixa bem presa para criar o apoio.",
      "Segure o apoio com as maos e alinhe tronco e pernas na variacao possivel.",
      "Puxe o peito em direcao ao apoio, aproximando as escapulas.",
      "Desca devagar controlando a volta e respirando de forma constante.",
      "Interrompa a serie se perder o controle do ombro ou do apoio.",
    ],
    sets: "2 a 3 series",
    reps: "6 a 10 repeticoes",
    rest: "45 a 60 segundos",
    commonMistakes: [
      "Dar tranco para subir",
      "Projetar a cabeca para frente",
      "Usar um apoio inseguro",
    ],
    adaptation: "Dobre mais os joelhos ou fique mais em pe para diminuir a carga.",
    safetyNote: "Confirme primeiro se o apoio esta estavel. Pare se houver dor forte, tontura ou formigamento.",
  },
  "alongamento-posterior-pernas": {
    id: "alongamento-posterior-pernas",
    category: "alongamento",
    name: "Alongamento posterior de pernas",
    summary: "Ajuda a soltar a parte de tras das pernas com controle.",
    howTo: [
      "Sente-se com uma perna estendida ou use apoio alto para o calcanhar.",
      "Mantenha a coluna alta e incline o tronco a partir do quadril.",
      "Vá apenas ate onde conseguir respirar sem encolher os ombros.",
      "Segure por alguns segundos e volte sem dar impulso.",
      "Troque o lado mantendo o joelho levemente destravado.",
    ],
    sets: "2 series",
    reps: "20 a 30 segundos por lado",
    rest: "20 segundos",
    commonMistakes: [
      "Arredondar demais a coluna",
      "Travar os joelhos com forca",
      "Forcar a ponta do pe alem do conforto",
    ],
    adaptation: "Use uma faixa ou sente-se sobre um apoio para facilitar a inclinacao.",
    safetyNote: defaultSafetyNote,
  },
  "elevacao-panturrilhas": {
    id: "elevacao-panturrilhas",
    category: "forca",
    name: "Elevacao de panturrilhas",
    summary: "Fortalece tornozelos e pernas com baixo impacto.",
    howTo: [
      "Fique em pe com um apoio leve em uma parede ou cadeira.",
      "Distribua o peso entre os dois pes.",
      "Suba os calcanhares lentamente, como se quisesse crescer.",
      "Segure um instante no topo e desca devagar.",
      "Mantenha a respiracao solta e o joelho alinhado.",
    ],
    sets: "2 a 3 series",
    reps: "10 a 15 repeticoes",
    rest: "30 segundos",
    commonMistakes: [
      "Quicar no final do movimento",
      "Jogar o peso todo para fora do pe",
      "Fazer rapido demais",
    ],
    adaptation: "Faça sentado ou reduza a altura da subida se estiver cansativo.",
    safetyNote: defaultSafetyNote,
  },
  "agachamento-livre": {
    id: "agachamento-livre",
    category: "forca",
    name: "Agachamento livre",
    summary: "Exercicio base de pernas para fortalecer com controle e autonomia.",
    howTo: [
      "Fique em pe com os pes na largura confortavel e pontas levemente para fora.",
      "Inicie o movimento levando o quadril para tras e dobrando joelhos ao mesmo tempo.",
      "Desca ate uma amplitude segura mantendo o peito organizado e os pes firmes no chao.",
      "Solte o ar ao subir empurrando o solo.",
      "Pare se sentir perda de controle, dor pontual ou tontura.",
    ],
    sets: "2 a 3 series",
    reps: "8 a 12 repeticoes",
    rest: "45 segundos",
    commonMistakes: [
      "Subir e descer com pressa",
      "Levar os joelhos para dentro",
      "Tirar os calcanhares do chao cedo demais",
    ],
    adaptation: "Use um banco como referencia de profundidade ou volte para a versao assistida.",
    safetyNote: defaultSafetyNote,
  },
  "step-up-baixo": {
    id: "step-up-baixo",
    category: "forca",
    name: "Step-up baixo",
    summary: "Trabalha pernas e estabilidade com um degrau baixo e controlado.",
    howTo: [
      "Use um degrau baixo, firme e sem escorregar.",
      "Coloque um pe inteiro sobre o degrau e incline o tronco so o necessario.",
      "Empurre o degrau para subir sem dar impulso excessivo com a perna de tras.",
      "Desca devagar controlando o retorno ao chao.",
      "Troque o lado e mantenha o olhar a frente.",
    ],
    sets: "2 a 3 series",
    reps: "6 a 8 repeticoes por lado",
    rest: "45 segundos",
    commonMistakes: [
      "Usar um degrau alto demais",
      "Descer batendo o pe",
      "Perder o alinhamento do joelho",
    ],
    adaptation: "Use um degrau menor ou toque o pe de tras com mais apoio para aliviar a subida.",
    safetyNote: defaultSafetyNote,
  },
  "respiracao-final": {
    id: "respiracao-final",
    category: "respiracao",
    name: "Respiracao e relaxamento final",
    summary: "Ajuda a encerrar o treino com mais calma e perceber como o corpo respondeu.",
    howTo: [
      "Sente-se ou deite-se em uma posicao confortavel.",
      "Inspire pelo nariz de forma suave, enchendo mais a parte baixa das costelas.",
      "Solte o ar devagar pela boca ou pelo nariz, sem pressa.",
      "Relaxe ombros, rosto e maos a cada exalacao.",
      "Finalize se sentindo mais calmo do que quando comecou.",
    ],
    sets: "1 a 2 series",
    reps: "2 a 4 minutos de pratica",
    rest: "Sem descanso necessario",
    commonMistakes: [
      "Forcar respiracoes muito profundas",
      "Tensionar ombros e mandibula",
      "Encerrar correndo sem desacelerar",
    ],
    adaptation: "Faça sentado com apoio nas costas se deitar nao for confortavel.",
    safetyNote: "Interrompa se houver falta de ar importante, tontura persistente ou desconforto incomum.",
  },
};

const dayConfigs: DayConfig[] = [
  {
    day: 1,
    title: "Primeiro contato com a jornada",
    focus: "Respiracao, soltura de ombros e consciencia corporal",
    duration: "15 a 20 min",
    description: "Um treino bem leve para conhecer o ritmo da jornada e observar como o corpo responde.",
    level: "adaptacao",
    exerciseIds: [
      "rotacao-ombros",
      "gato-camelo",
      "mobilidade-quadril",
      "alongamento-toracico",
      "respiracao-final",
    ],
    adaptation: "Hoje vale fazer menos e terminar se sentindo melhor do que começou.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 2,
    title: "Respirar e se organizar",
    focus: "Ritmo respiratorio e mobilidade suave",
    duration: "15 a 20 min",
    description: "A proposta e coordenar movimento com respiracao, sem pressa.",
    level: "adaptacao",
    exerciseIds: [
      "gato-camelo",
      "rotacao-ombros",
      "alongamento-tornozelos",
      "ponte-gluteos",
      "respiracao-final",
    ],
    adaptation: "Reduza as repeticoes se estiver acordando o corpo ainda com rigidez.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 3,
    title: "Quadril e coluna em movimento",
    focus: "Mobilidade leve e estabilidade inicial",
    duration: "15 a 20 min",
    description: "Um treino para ganhar conforto nas articulacoes sem cansar cedo demais.",
    level: "adaptacao",
    exerciseIds: [
      "gato-camelo",
      "mobilidade-quadril",
      "alongamento-flexores-quadril",
      "bird-dog",
      "respiracao-final",
    ],
    adaptation: "Pense em mover com suavidade em vez de buscar amplitude maxima.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 4,
    title: "Tornozelos, peito aberto e base",
    focus: "Base para agachar e respirar melhor",
    duration: "15 a 20 min",
    description: "Aqui voce prepara tornozelos e torax para os proximos treinos da jornada.",
    level: "adaptacao",
    exerciseIds: [
      "rotacao-ombros",
      "alongamento-tornozelos",
      "alongamento-toracico",
      "agachamento-profundo-assistido",
      "respiracao-final",
    ],
    adaptation: "Use bastante apoio nas maos se o agachamento ainda estiver pesado.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 5,
    title: "Primeira revisao da base",
    focus: "Consciencia corporal e repeticao leve",
    duration: "15 a 20 min",
    description: "Repetir os movimentos do inicio ajuda o corpo a entender o padrao.",
    level: "adaptacao",
    exerciseIds: [
      "gato-camelo",
      "mobilidade-quadril",
      "ponte-gluteos",
      "alongamento-posterior-pernas",
      "respiracao-final",
    ],
    adaptation: "Se um movimento estiver mais claro hoje, aproveite para refinar a tecnica.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 6,
    title: "Mobilidade geral com core",
    focus: "Soltura global e estabilidade abdominal basica",
    duration: "18 a 22 min",
    description: "Entramos na fase de mobilidade geral com mais atencao ao centro do corpo.",
    level: "base",
    exerciseIds: [
      "rotacao-ombros",
      "mobilidade-toracica-quatro-apoios",
      "dead-bug",
      "ponte-gluteos",
      "respiracao-final",
    ],
    adaptation: "Priorize a respiracao e reduza o alcance dos bracos e pernas no dead bug se necessario.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 7,
    title: "Core com apoio",
    focus: "Estabilidade basica do tronco",
    duration: "18 a 22 min",
    description: "Hoje o treino reforca o abdomen e a organizacao da coluna.",
    level: "base",
    exerciseIds: [
      "gato-camelo",
      "alongamento-tornozelos",
      "prancha-joelhos",
      "bird-dog",
      "respiracao-final",
    ],
    adaptation: "Faça series mais curtas de prancha se precisar manter a qualidade.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 8,
    title: "Quadril forte e tronco estavel",
    focus: "Mobilidade de quadril e ativacao posterior",
    duration: "18 a 22 min",
    description: "Um dia para deixar o quadril mais solto e com melhor apoio.",
    level: "base",
    exerciseIds: [
      "mobilidade-quadril",
      "alongamento-flexores-quadril",
      "ponte-gluteos",
      "dead-bug",
      "respiracao-final",
    ],
    adaptation: "Segure menos tempo no topo da ponte se sentir a lombar cansando antes dos gluteos.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 9,
    title: "Peito aberto, costas ativas",
    focus: "Torax mais livre e core organizado",
    duration: "18 a 22 min",
    description: "A proposta e melhorar postura, respiracao e controle de tronco.",
    level: "base",
    exerciseIds: [
      "rotacao-ombros",
      "mobilidade-toracica-quatro-apoios",
      "prancha-joelhos",
      "alongamento-toracico",
      "respiracao-final",
    ],
    adaptation: "Diminua a amplitude da rotacao toracica se ainda estiver muito travado.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 10,
    title: "Fechando a fase de base",
    focus: "Mobilidade geral e core basico",
    duration: "18 a 22 min",
    description: "Uma revisao para consolidar o que entrou na primeira metade da jornada.",
    level: "base",
    exerciseIds: [
      "gato-camelo",
      "alongamento-tornozelos",
      "bird-dog",
      "dead-bug",
      "respiracao-final",
    ],
    adaptation: "Se estiver cansado, reduza volume e preserve a tecnica do centro do corpo.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 11,
    title: "Controle corporal com calma",
    focus: "Estabilidade, postura e forca leve",
    duration: "20 a 24 min",
    description: "Comecamos a construir mais firmeza nos movimentos sem acelerar a progressao.",
    level: "estabilidade",
    exerciseIds: [
      "mobilidade-toracica-quatro-apoios",
      "prancha-joelhos",
      "ponte-gluteos",
      "agachamento-profundo-assistido",
      "respiracao-final",
    ],
    adaptation: "Use o apoio do agachamento para manter o peito aberto e o movimento organizado.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 12,
    title: "Lado a lado com estabilidade",
    focus: "Controle lateral do tronco e quadril",
    duration: "20 a 24 min",
    description: "Hoje o treino chama os lados do corpo para participar mais.",
    level: "estabilidade",
    exerciseIds: [
      "mobilidade-quadril",
      "prancha-lateral-adaptada",
      "bird-dog",
      "alongamento-posterior-pernas",
      "respiracao-final",
    ],
    adaptation: "Apoie a mao no chao na prancha lateral se quiser mais seguranca.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 13,
    title: "Primeira forca leve de membros superiores",
    focus: "Empurrar com controle e manter o tronco alinhado",
    duration: "20 a 24 min",
    description: "Entramos na forca leve sem abandonar a base de mobilidade.",
    level: "estabilidade",
    exerciseIds: [
      "rotacao-ombros",
      "flexao-inclinada",
      "dead-bug",
      "alongamento-toracico",
      "respiracao-final",
    ],
    adaptation: "Escolha um apoio bem alto na flexao inclinada se o movimento ainda estiver pesado.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 14,
    title: "Tronco firme, pernas organizadas",
    focus: "Controle corporal e apoio de pernas",
    duration: "20 a 24 min",
    description: "A ideia e unir um centro firme com pernas trabalhando em amplitude segura.",
    level: "estabilidade",
    exerciseIds: [
      "alongamento-tornozelos",
      "agachamento-profundo-assistido",
      "prancha-joelhos",
      "elevacao-panturrilhas",
      "respiracao-final",
    ],
    adaptation: "Se o agachamento cansar rapido, reduza a profundidade e compense com mais controle.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 15,
    title: "Revisao da fase de estabilidade",
    focus: "Mais controle e menos tensao",
    duration: "20 a 24 min",
    description: "Fechamos a fase com uma combinacao de movimentos para revisar base e postura.",
    level: "estabilidade",
    exerciseIds: [
      "gato-camelo",
      "bird-dog",
      "prancha-lateral-adaptada",
      "ponte-gluteos",
      "respiracao-final",
    ],
    adaptation: "Observe o que esta mais facil agora e preserve essa sensacao de controle.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 16,
    title: "Forca funcional de pernas",
    focus: "Agachar, subir e sustentar com mais autonomia",
    duration: "22 a 26 min",
    description: "A jornada entra em uma fase mais funcional, ainda com progressao segura.",
    level: "forca",
    exerciseIds: [
      "mobilidade-quadril",
      "agachamento-livre",
      "step-up-baixo",
      "alongamento-posterior-pernas",
      "respiracao-final",
    ],
    adaptation: "Use um banco como referencia do agachamento e um degrau bem baixo no step-up.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 17,
    title: "Empurrar e estabilizar",
    focus: "Forca leve de tronco e membros superiores",
    duration: "22 a 26 min",
    description: "Um treino para ganhar confianca no empurrar e sustentar o centro.",
    level: "forca",
    exerciseIds: [
      "rotacao-ombros",
      "flexao-inclinada",
      "prancha-joelhos",
      "superman",
      "respiracao-final",
    ],
    adaptation: "Aumente a inclinacao da flexao antes de pensar em repetir mais.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 18,
    title: "Perna forte, quadril ativo",
    focus: "Base funcional para levantar e sustentar o corpo",
    duration: "22 a 26 min",
    description: "A prioridade hoje e fortalecer pernas com movimento bem controlado.",
    level: "forca",
    exerciseIds: [
      "alongamento-tornozelos",
      "afundo-apoio",
      "ponte-gluteos",
      "elevacao-panturrilhas",
      "respiracao-final",
    ],
    adaptation: "Mantenha o apoio firme no afundo e desca apenas ate onde houver controle.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 19,
    title: "Puxar com seguranca",
    focus: "Costas mais ativas e tronco organizado",
    duration: "22 a 26 min",
    description: "Um dia importante para equilibrar o trabalho de costas com mobilidade e controle.",
    level: "forca",
    exerciseIds: [
      "mobilidade-toracica-quatro-apoios",
      "remada-adaptada",
      "dead-bug",
      "alongamento-toracico",
      "respiracao-final",
    ],
    adaptation: "Torne a remada mais vertical se ainda estiver aprendendo o movimento.",
    safetyNote: "Confira se o apoio esta firme antes da remada e interrompa se sentir dor forte ou instabilidade.",
  },
  {
    day: 20,
    title: "Fechando a fase funcional",
    focus: "Agachar, empurrar e estabilizar no mesmo treino",
    duration: "22 a 26 min",
    description: "Uma revisao funcional para perceber mais autonomia nos movimentos basicos.",
    level: "forca",
    exerciseIds: [
      "agachamento-livre",
      "flexao-inclinada",
      "bird-dog",
      "alongamento-flexores-quadril",
      "respiracao-final",
    ],
    adaptation: "Pense em qualidade de repeticao, nao em cansar ao maximo.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 21,
    title: "Movimentos em conversa",
    focus: "Integracao entre mobilidade, estabilidade e forca",
    duration: "24 a 28 min",
    description: "A partir daqui, os exercicios passam a conversar mais entre si.",
    level: "integracao",
    exerciseIds: [
      "gato-camelo",
      "agachamento-livre",
      "prancha-tradicional",
      "alongamento-posterior-pernas",
      "respiracao-final",
    ],
    adaptation: "Se a prancha tradicional quebrar sua tecnica, volte para a versao com joelhos.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 22,
    title: "Integração de pernas e centro",
    focus: "Pernas firmes com tronco mais estavel",
    duration: "24 a 28 min",
    description: "Um treino para subir, descer e sustentar melhor o proprio corpo.",
    level: "integracao",
    exerciseIds: [
      "step-up-baixo",
      "afundo-apoio",
      "dead-bug",
      "alongamento-flexores-quadril",
      "respiracao-final",
    ],
    adaptation: "Reduza a altura do step-up antes de aumentar repetições.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 23,
    title: "Empurrar e puxar com mais clareza",
    focus: "Parte superior mais integrada",
    duration: "24 a 28 min",
    description: "Hoje o treino combina costas, peito e core sem perder o ritmo da jornada.",
    level: "integracao",
    exerciseIds: [
      "rotacao-ombros",
      "flexao-inclinada",
      "remada-adaptada",
      "prancha-lateral-adaptada",
      "respiracao-final",
    ],
    adaptation: "Ajuste a dificuldade da flexao e da remada para terminar com boa tecnica.",
    safetyNote: "Confirme o apoio da remada e pare se houver perda de controle, tontura ou dor forte.",
  },
  {
    day: 24,
    title: "Fluxo de quadril e tronco",
    focus: "Conectar base, estabilidade e respiracao",
    duration: "24 a 28 min",
    description: "A proposta e sentir mais fluidez entre mobilidade, forca e desaceleracao.",
    level: "integracao",
    exerciseIds: [
      "mobilidade-quadril",
      "agachamento-profundo-assistido",
      "bird-dog",
      "superman",
      "respiracao-final",
    ],
    adaptation: "Se o superman cansar a lombar, reduza a amplitude ou mova um lado por vez.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 25,
    title: "Revisao da integracao",
    focus: "Movimento mais claro e sequencial",
    duration: "24 a 28 min",
    description: "Fechamos a fase de integracao com um treino que mistura pernas, tronco e controle.",
    level: "integracao",
    exerciseIds: [
      "agachamento-livre",
      "flexao-inclinada",
      "ponte-gluteos",
      "alongamento-toracico",
      "respiracao-final",
    ],
    adaptation: "Mantenha o ritmo constante sem transformar o treino em corrida.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 26,
    title: "Consolidando o que voce aprendeu",
    focus: "Resistencia leve com tecnica",
    duration: "25 a 30 min",
    description: "A fase final reforca autonomia e repeticao de boa qualidade.",
    level: "consolidacao",
    exerciseIds: [
      "agachamento-livre",
      "step-up-baixo",
      "prancha-tradicional",
      "alongamento-posterior-pernas",
      "respiracao-final",
    ],
    adaptation: "Reduza o tempo da prancha e preserve o restante do treino com boa postura.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 27,
    title: "Mais autonomia no tronco",
    focus: "Sustentar o centro com menos ajuda externa",
    duration: "25 a 30 min",
    description: "Hoje a proposta e confiar mais no proprio controle corporal.",
    level: "consolidacao",
    exerciseIds: [
      "mobilidade-toracica-quatro-apoios",
      "prancha-tradicional",
      "superman",
      "dead-bug",
      "respiracao-final",
    ],
    adaptation: "Mantenha cada serie curta se isso ajudar a preservar alinhamento e respiracao.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 28,
    title: "Pernas resistentes com calma",
    focus: "Repetir padroes funcionais sem perder tecnica",
    duration: "25 a 30 min",
    description: "Um treino para consolidar pernas, equilibrio e controle geral.",
    level: "consolidacao",
    exerciseIds: [
      "alongamento-tornozelos",
      "afundo-apoio",
      "elevacao-panturrilhas",
      "agachamento-livre",
      "respiracao-final",
    ],
    adaptation: "Faça menos repetições no afundo se o controle cair no final da serie.",
    safetyNote: defaultSafetyNote,
  },
  {
    day: 29,
    title: "Autonomia com puxar e empurrar",
    focus: "Parte superior mais confiante",
    duration: "25 a 30 min",
    description: "Quase no fim da jornada, o foco e repetir os fundamentos com mais clareza.",
    level: "consolidacao",
    exerciseIds: [
      "rotacao-ombros",
      "flexao-inclinada",
      "remada-adaptada",
      "alongamento-toracico",
      "respiracao-final",
    ],
    adaptation: "Escolha variacoes que permitam terminar todas as series com tecnica limpa.",
    safetyNote: "Use apenas apoio firme na remada e encerre a serie se a postura se perder.",
  },
  {
    day: 30,
    title: "Conclusao da jornada com controle",
    focus: "Revisao final, respiracao e autonomia",
    duration: "25 a 30 min",
    description: "O ultimo treino fecha a jornada reforcando o que voce construiu ao longo dos 30 dias.",
    level: "consolidacao",
    exerciseIds: [
      "gato-camelo",
      "agachamento-livre",
      "prancha-tradicional",
      "ponte-gluteos",
      "respiracao-final",
    ],
    adaptation: "Faça com serenidade. Hoje vale mais perceber sua evolucao do que aumentar desafio.",
    safetyNote: defaultSafetyNote,
  },
];

function categoryToLegacyLabel(category: TrainingExerciseCategory): string {
  switch (category) {
    case "aquecimento":
      return "Aquecimento";
    case "mobilidade":
      return "Mobilidade";
    case "estabilidade":
    case "forca":
      return "Forca/controle";
    case "alongamento":
      return "Alongamento";
    case "respiracao":
      return "Respiracao/relaxamento";
    default:
      return "Etapa";
  }
}

function buildLegacySteps(exercises: TrainingExercise[]): TrainingStep[] {
  const categoryOrder: TrainingExerciseCategory[] = [
    "aquecimento",
    "mobilidade",
    "estabilidade",
    "forca",
    "alongamento",
    "respiracao",
  ];

  return categoryOrder
    .map((category) => {
      const categoryExercises = exercises.filter((exercise) => exercise.category === category);

      if (categoryExercises.length === 0) {
        return null;
      }

      return {
        label: categoryToLegacyLabel(category),
        description: categoryExercises.map((exercise) => exercise.name).join(", "),
      };
    })
    .filter((step): step is TrainingStep => step !== null);
}

function buildTrainingDayPlan(config: DayConfig): TrainingDayPlan {
  const exercises = config.exerciseIds.map((exerciseId) => exerciseLibrary[exerciseId]);

  return {
    day: config.day,
    title: config.title,
    focus: config.focus,
    duration: config.duration,
    description: config.description,
    level: config.level,
    exercises,
    habits: defaultHabits,
    steps: buildLegacySteps(exercises),
    adaptation: config.adaptation,
    safetyNote: config.safetyNote,
  };
}

export const trainingPlan: TrainingDayPlan[] = dayConfigs.map(buildTrainingDayPlan);

export function getTrainingDayPlan(day: number): TrainingDayPlan | undefined {
  return trainingPlan.find((item) => item.day === day);
}

export function getTrainingDay(day: number): TrainingDayPlan | undefined {
  return getTrainingDayPlan(day);
}
