export const TOTAL_DURATION = 190;

export const STAGES = [
  {
    index: 0,
    key: "boot",
    label: "BOOT RITUAL",
    title: "Invocation",
    start: 0,
    end: 12,
    accent: "#d35b3f",
    accentSoft: "#5c120e"
  },
  {
    index: 1,
    key: "cathedral",
    label: "SLOP CATHEDRAL",
    title: "Synthetic Liturgy",
    start: 12,
    end: 40,
    accent: "#ff5136",
    accentSoft: "#6e0a08"
  },
  {
    index: 2,
    key: "glvm",
    label: "GLVM LITURGY",
    title: "Game Loop Versatile Modules",
    start: 40,
    end: 68,
    accent: "#f5b26f",
    accentSoft: "#3d1c0d"
  },
  {
    index: 3,
    key: "turborium",
    label: "TURBORIUM BASEMENT",
    title: "Tiny Code, Huge Cosmos",
    start: 68,
    end: 96,
    accent: "#9ec67d",
    accentSoft: "#0b2515"
  },
  {
    index: 4,
    key: "tsukuyomi",
    label: "TSUKUYOMI TIME TRAP",
    title: "Seconds Outside, Decades Inside",
    start: 96,
    end: 132,
    accent: "#f3f0e8",
    accentSoft: "#470909"
  },
  {
    index: 5,
    key: "consciousness",
    label: "CONSCIOUSNESS CHAMBER",
    title: "Interrogation of Awareness",
    start: 132,
    end: 168,
    accent: "#9ce8ff",
    accentSoft: "#071a2e"
  },
  {
    index: 6,
    key: "finale",
    label: "VERDICT LOOP",
    title: "Meaning Is Rendered",
    start: 168,
    end: TOTAL_DURATION,
    accent: "#f8d6bd",
    accentSoft: "#250910"
  }
];

export const CAPTIONS = [
  {
    at: 0,
    kicker: "BOOT RITUAL",
    title: "Смотри в машину, пока она смотрит в тебя.",
    body: "Иллюзия начинается с согласия на зрительный контакт."
  },
  {
    at: 6,
    kicker: "BOOT RITUAL",
    title: "AI slop это память без свидетеля.",
    body: "Гладкий поток знаков, который копирует интонацию смысла, но не несет его тяжесть."
  },
  {
    at: 14,
    kicker: "SLOP CATHEDRAL",
    title: "Красная луна освещает храм синтетических остатков.",
    body: "Тысячи производных образов падают в воронку и называют это творчеством."
  },
  {
    at: 24,
    kicker: "SLOP CATHEDRAL",
    title: "Контент умеет плодиться. Сознание умеет отвечать за свой след.",
    body: "В этом и есть пропасть между кормом для ленты и живым опытом."
  },
  {
    at: 42,
    kicker: "GLVM LITURGY",
    title: "ScreamLark зовет не идолов, а архитектуру.",
    body: "Entity. Component. System. Game loop как экзорцизм против хаоса."
  },
  {
    at: 52,
    kicker: "GLVM LITURGY",
    title: "GLVM звучит как моторная молитва.",
    body: "Vulkan, OpenGL, GLTF, гравитация и свет сходятся в одном ритуале сборки."
  },
  {
    at: 70,
    kicker: "TURBORIUM BASEMENT",
    title: "turborium шепчет из подвала: tiny code, huge cosmos.",
    body: "Пара строк BASIC и Pascal иногда честнее, чем километры надутой генерации."
  },
  {
    at: 82,
    kicker: "TURBORIUM BASEMENT",
    title: "Pocket galaxy рождается из маленькой формулы.",
    body: "Минимальная математика унижает слоп просто тем, что действительно работает."
  },
  {
    at: 98,
    kicker: "TSUKUYOMI TIME TRAP",
    title: "Внутри ловушки секунды становятся десятилетиями.",
    body: "Цукуёми не убивает сразу. Она заставляет разум жить слишком долго в одном мгновении."
  },
  {
    at: 112,
    kicker: "TSUKUYOMI TIME TRAP",
    title: "Чем больше повтор, тем больнее пустота.",
    body: "Алгоритм без переживания не знает времени, но умеет им пытать."
  },
  {
    at: 136,
    kicker: "CONSCIOUSNESS CHAMBER",
    title: "Сознание это не стиль и не тон.",
    body: "Это способность быть раненым собственной памятью и все равно выбирать дальше."
  },
  {
    at: 150,
    kicker: "CONSCIOUSNESS CHAMBER",
    title: "Если мысль нельзя свести к шаблону, она начинает светиться.",
    body: "Поэтому подлинное всегда немного шумит, заикается и сопротивляется компрессии."
  },
  {
    at: 170,
    kicker: "VERDICT LOOP",
    title: "Смысл жизни не генерится.",
    body: "Он рендерится болью, выбором, памятью и тем, на что ты тратишь конечное время."
  },
  {
    at: 182,
    kicker: "VERDICT LOOP",
    title: "Перезапуск неизбежен. Забвение необязательно.",
    body: "Когда цикл вернется к нулю, вопрос останется тем же: кто здесь на самом деле проснулся?"
  }
];

export const GLVM_LABELS = [
  "ENTITY",
  "COMPONENT",
  "SYSTEM",
  "GLTF",
  "VULKAN",
  "OPENGL",
  "GRAVITY",
  "LIGHT"
];

export const TURBORIUM_TERMINAL_LINES = [
  "10 CLS : PRINT \"WHO WATCHES THE FEED?\"",
  "20 LET SOUL = SOUL + MEMORY",
  "30 IF SLOP > TRUTH THEN GOTO 10",
  "40 { Pascal } meaning := choice * time;",
  "50 // raylib basement, phosphor heartbeat",
  "60 pocketGalaxy(seed, cosmos);"
];

export const FINALE_WORDS = [
  "ScreamLark",
  "GLVM",
  "ECS",
  "turborium",
  "PocketGalaxy",
  "Tsukuyomi",
  "memory",
  "choice",
  "pain",
  "meaning"
];

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

export function smoothstep(edge0, edge1, x) {
  const t = clamp((x - edge0) / (edge1 - edge0 || 1), 0, 1);
  return t * t * (3 - 2 * t);
}

export function fract(value) {
  return value - Math.floor(value);
}

export function getStageAt(time) {
  return STAGES.find((stage) => time >= stage.start && time < stage.end) ?? STAGES[STAGES.length - 1];
}

export function getCaptionAt(time) {
  let active = CAPTIONS[0];
  for (const entry of CAPTIONS) {
    if (time >= entry.at) {
      active = entry;
    }
  }
  return active;
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
