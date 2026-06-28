const app = document.querySelector("#app");

if (!app) {
  throw new Error("App root not found");
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const MONTHS_PER_ROW = 3;
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const WEEKS_PER_MONTH = 6;
const MONOSPACE_FONT_STACK = "Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace";
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();
const CURRENT_MONTH = TODAY.getMonth();
const CURRENT_DAY = TODAY.getDate();
const FULL_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric"
});
const SHORT_FULL_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});
const SHORT_MONTH_DAY_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric"
});
const SHORT_MONTH_DAY_YEAR_FORMATTER = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric"
});
const ANNIVERSARY_DATE_FORMATTER = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric"
});
const LIGHT_SELECTION_COLORS = [
  { color: "#dbeafe", border: "#2563eb", text: "#111827" },
  { color: "#dcfce7", border: "#16a34a", text: "#111827" },
  { color: "#fef3c7", border: "#d97706", text: "#111827" },
  { color: "#fce7f3", border: "#db2777", text: "#111827" },
  { color: "#e9d5ff", border: "#7c3aed", text: "#111827" },
  { color: "#cffafe", border: "#0891b2", text: "#111827" },
  { color: "#d1fae5", border: "#059669", text: "#111827" },
  { color: "#fee2e2", border: "#dc2626", text: "#111827" },
  { color: "#fef08a", border: "#ca8a04", text: "#111827" },
  { color: "#dbe4ff", border: "#4338ca", text: "#111827" }
];
const PASTEL_SELECTION_COLORS = [
  { color: "#c7f9cc", border: "#2f855a", text: "#102418" },
  { color: "#bfdbfe", border: "#2563eb", text: "#102139" },
  { color: "#fde68a", border: "#d97706", text: "#35210c" },
  { color: "#fbcfe8", border: "#db2777", text: "#3d1027" },
  { color: "#ddd6fe", border: "#7c3aed", text: "#24103f" },
  { color: "#bae6fd", border: "#0891b2", text: "#072c38" },
  { color: "#fecdd3", border: "#e11d48", text: "#3a1020" },
  { color: "#ccfbf1", border: "#0f766e", text: "#092725" },
  { color: "#fde68a", border: "#ca8a04", text: "#35290b" },
  { color: "#e9d5ff", border: "#6d28d9", text: "#23103c" }
];
const DEFAULT_THEME_KEY = "light";
const THEMES = {
  light: {
    label: "Light",
    colorScheme: "light",
    pageBackground: "Canvas",
    surface: "transparent",
    frameBorder: "transparent",
    frameShadow: "none",
    frameBackdropFilter: "none",
    shellRadius: "0",
    textColor: "CanvasText",
    mutedText: "CanvasText",
    linkColor: "LinkText",
    linkHoverColor: "LinkText",
    linkDecoration: "underline",
    headerText: "LinkText",
    borderColor: "#000000",
    subtleBorder: "rgba(0, 0, 0, 0.2)",
    controlBackground: "ButtonFace",
    controlText: "ButtonText",
    controlBorder: "ButtonBorder",
    controlRadius: "2px",
    accentBorder: "#2563eb",
    focusRing: "#2563eb",
    monthBackground: "transparent",
    monthRadius: "0",
    panelShadow: "none",
    currentMonthSurface: "#fff9c4",
    currentMonthShadow: "inset 0 0 0 1px #000000",
    todayBackground: "#fff9c4",
    todayBorder: "#000000",
    todayText: "#111827",
    hoverBackground: "#f3f3f3",
    selectionCardBorder: "rgba(0, 0, 0, 0.14)",
    selectionCardRadius: "0",
    metadataBorder: "rgba(0, 0, 0, 0.2)",
    settingsSurface: "Canvas",
    settingsShadow: "none",
    settingsOptionHover: "#f3f3f3",
    settingsOptionActive: "#e5e7eb",
    settingsBorderRadius: "0",
    selectionColors: LIGHT_SELECTION_COLORS
  },
  dark: {
    label: "Dark",
    colorScheme: "dark",
    pageBackground: "radial-gradient(circle at top, #283244 0%, #111827 48%, #020617 100%)",
    surface: "rgba(15, 23, 42, 0.86)",
    frameBorder: "#334155",
    frameShadow: "0 22px 60px rgba(2, 6, 23, 0.52)",
    textColor: "#e2e8f0",
    mutedText: "#94a3b8",
    linkColor: "#cbd5e1",
    linkHoverColor: "#cbd5e1",
    linkDecoration: "none",
    headerText: "#f8fafc",
    borderColor: "#475569",
    subtleBorder: "rgba(148, 163, 184, 0.28)",
    controlBackground: "rgba(15, 23, 42, 0.78)",
    controlText: "#f8fafc",
    controlBorder: "#64748b",
    controlRadius: "8px",
    accentBorder: "#a5b4fc",
    focusRing: "#c4b5fd",
    monthBackground: "rgba(15, 23, 42, 0.68)",
    monthRadius: "18px",
    panelShadow: "0 10px 28px rgba(15, 23, 42, 0.32)",
    currentMonthSurface: "rgba(30, 41, 59, 0.92)",
    currentMonthShadow: "inset 0 0 0 1px rgba(196, 181, 253, 0.7), 0 10px 28px rgba(15, 23, 42, 0.32)",
    todayBackground: "#f8fafc",
    todayBorder: "#cbd5f5",
    todayText: "#0f172a",
    hoverBackground: "rgba(148, 163, 184, 0.2)",
    selectionCardBorder: "rgba(15, 23, 42, 0.14)",
    selectionCardRadius: "16px",
    metadataBorder: "rgba(15, 23, 42, 0.14)",
    settingsSurface: "rgba(15, 23, 42, 0.97)",
    settingsShadow: "0 24px 48px rgba(2, 6, 23, 0.52)",
    settingsOptionHover: "rgba(148, 163, 184, 0.16)",
    settingsOptionActive: "rgba(165, 180, 252, 0.18)",
    settingsBorderRadius: "16px",
    selectionColors: PASTEL_SELECTION_COLORS
  },
  matrix: {
    label: "Matrix",
    colorScheme: "dark",
    pageBackground: "radial-gradient(circle at top, #14341f 0%, #05130b 50%, #010503 100%)",
    surface: "rgba(4, 15, 9, 0.88)",
    frameBorder: "#1f5135",
    frameShadow: "0 22px 60px rgba(0, 0, 0, 0.58)",
    textColor: "#b7f7c9",
    mutedText: "#7bd990",
    linkColor: "#d9ffd7",
    linkHoverColor: "#d9ffd7",
    linkDecoration: "none",
    headerText: "#ecffeb",
    borderColor: "#2a6a45",
    subtleBorder: "rgba(123, 217, 144, 0.28)",
    controlBackground: "rgba(7, 27, 16, 0.9)",
    controlText: "#eaffea",
    controlBorder: "#35a15a",
    controlRadius: "8px",
    accentBorder: "#86efac",
    focusRing: "#bbf7d0",
    monthBackground: "rgba(8, 23, 14, 0.72)",
    monthRadius: "18px",
    panelShadow: "0 10px 28px rgba(0, 0, 0, 0.35)",
    currentMonthSurface: "rgba(12, 34, 20, 0.94)",
    currentMonthShadow: "inset 0 0 0 1px rgba(134, 239, 172, 0.72), 0 10px 28px rgba(0, 0, 0, 0.35)",
    todayBackground: "#f0fdf4",
    todayBorder: "#86efac",
    todayText: "#052e16",
    hoverBackground: "rgba(134, 239, 172, 0.18)",
    selectionCardBorder: "rgba(15, 23, 42, 0.14)",
    selectionCardRadius: "16px",
    metadataBorder: "rgba(15, 23, 42, 0.14)",
    settingsSurface: "rgba(3, 12, 7, 0.97)",
    settingsShadow: "0 24px 48px rgba(0, 0, 0, 0.6)",
    settingsOptionHover: "rgba(134, 239, 172, 0.14)",
    settingsOptionActive: "rgba(134, 239, 172, 0.2)",
    settingsBorderRadius: "16px",
    selectionColors: PASTEL_SELECTION_COLORS
  },
  brown: {
    label: "Brownish",
    colorScheme: "light",
    pageBackground: "radial-gradient(circle at top, #f6ead9 0%, #dfc4a5 50%, #9e7758 100%)",
    surface: "rgba(248, 239, 225, 0.86)",
    frameBorder: "#8b5e3c",
    frameShadow: "0 22px 60px rgba(92, 58, 34, 0.24)",
    textColor: "#4b2e1f",
    mutedText: "#7c5b42",
    linkColor: "#5b3927",
    linkHoverColor: "#5b3927",
    linkDecoration: "none",
    headerText: "#3f2618",
    borderColor: "#a77a57",
    subtleBorder: "rgba(122, 91, 66, 0.28)",
    controlBackground: "rgba(255, 249, 241, 0.86)",
    controlText: "#4b2e1f",
    controlBorder: "#b08968",
    controlRadius: "8px",
    accentBorder: "#d97706",
    focusRing: "#f59e0b",
    monthBackground: "rgba(255, 248, 239, 0.74)",
    monthRadius: "18px",
    panelShadow: "0 10px 28px rgba(122, 91, 66, 0.18)",
    currentMonthSurface: "rgba(255, 245, 230, 0.96)",
    currentMonthShadow: "inset 0 0 0 1px rgba(217, 119, 6, 0.42), 0 10px 28px rgba(122, 91, 66, 0.18)",
    todayBackground: "#fff7ed",
    todayBorder: "#f59e0b",
    todayText: "#78350f",
    hoverBackground: "rgba(176, 137, 104, 0.18)",
    selectionCardBorder: "rgba(15, 23, 42, 0.14)",
    selectionCardRadius: "16px",
    metadataBorder: "rgba(15, 23, 42, 0.14)",
    settingsSurface: "rgba(255, 247, 236, 0.98)",
    settingsShadow: "0 24px 48px rgba(92, 58, 34, 0.2)",
    settingsOptionHover: "rgba(176, 137, 104, 0.12)",
    settingsOptionActive: "rgba(217, 119, 6, 0.14)",
    settingsBorderRadius: "16px",
    selectionColors: PASTEL_SELECTION_COLORS
  }
};
const ONE_MONTH_MAX_WIDTH = 359;
const TWO_MONTH_MAX_WIDTH = 899;
const YEAR_OPTION_MIN = CURRENT_YEAR - 100;
const YEAR_OPTION_MAX = CURRENT_YEAR + 100;
const LOCAL_STORAGE_KEY = "multical-local-state";
const SELECTION_METADATA_FUNCTIONS = [
  {
    key: "daysSince",
    description: "Days since the selection ended, or since the selected day for a single date.",
    evaluate(context) {
      const referenceDate = context.endDate;

      if (referenceDate > context.todayDate) {
        return null;
      }

      return getWholeDayDifference(context.todayDate, referenceDate);
    }
  },
  {
    key: "daysRemaining",
    description: "Days until the selection starts, or until it ends when the range is already active.",
    evaluate(context) {
      const referenceDate = context.isActive && !context.isSingleDay ? context.endDate : context.startDate;

      if (referenceDate < context.todayDate) {
        return null;
      }

      return getWholeDayDifference(referenceDate, context.todayDate);
    }
  },
  {
    key: "durationDays",
    description: "Total number of calendar days covered by the selection.",
    evaluate(context) {
      return context.durationDays;
    }
  },
  {
    key: "durationHours",
    description: "Total duration of the selection measured in hours.",
    evaluate(context) {
      return context.durationHours;
    }
  },
  {
    key: "durationMinutes",
    description: "Total duration of the selection measured in minutes.",
    evaluate(context) {
      return context.durationMinutes;
    }
  },
  {
    key: "durationSeconds",
    description: "Total duration of the selection measured in seconds.",
    evaluate(context) {
      return context.durationSeconds;
    }
  },
  {
    key: "durationWeeks",
    description: "Total duration of the selection measured in weeks.",
    evaluate(context) {
      return Number(context.durationWeeks.toFixed(2));
    }
  },
  {
    key: "daysSinceStart",
    description: "Days since the starting date of the selection.",
    evaluate(context) {
      if (context.startDate > context.todayDate) {
        return null;
      }

      return getWholeDayDifference(context.todayDate, context.startDate);
    }
  },
  {
    key: "daysSinceEnd",
    description: "Days since the ending date of the selection.",
    evaluate(context) {
      if (context.endDate > context.todayDate) {
        return null;
      }

      return getWholeDayDifference(context.todayDate, context.endDate);
    }
  },
  {
    key: "daysUntilStart",
    description: "Days remaining until the starting date of the selection.",
    evaluate(context) {
      if (context.startDate < context.todayDate) {
        return null;
      }

      return getWholeDayDifference(context.startDate, context.todayDate);
    }
  },
  {
    key: "daysUntilEnd",
    description: "Days remaining until the ending date of the selection.",
    evaluate(context) {
      if (context.endDate < context.todayDate) {
        return null;
      }

      return getWholeDayDifference(context.endDate, context.todayDate);
    }
  },
  {
    key: "isPast",
    description: "Whether the full selection is already in the past.",
    evaluate(context) {
      return context.isPast;
    }
  },
  {
    key: "isFuture",
    description: "Whether the full selection is still in the future.",
    evaluate(context) {
      return context.isFuture;
    }
  },
  {
    key: "isActive",
    description: "Whether today falls inside the selected range or matches the selected day.",
    evaluate(context) {
      return context.isActive;
    }
  },
  {
    key: "liveCountDown",
    description: "Live countdown to the selection start, or to the end when an active range is in progress.",
    evaluate(context) {
      const referenceDate = getCountdownReferenceDate(context);

      if (!referenceDate) {
        return null;
      }

      const now = new Date();

      if (referenceDate < now) {
        return null;
      }

      return formatDurationParts(Math.floor((referenceDate - now) / MS_PER_SECOND));
    }
  },
  {
    key: "liveCountUp",
    description: "Live count up since the selection ended, or since the selected day for a single date.",
    evaluate(context) {
      const referenceDate = context.endDate;
      const now = new Date();

      if (referenceDate > now) {
        return null;
      }

      return formatDurationParts(Math.floor((now - referenceDate) / MS_PER_SECOND));
    }
  },
  {
    key: "containsToday",
    description: "Whether today is included anywhere inside the selection.",
    evaluate(context) {
      return context.containsToday;
    }
  },
  {
    key: "dayOfYearStart",
    description: "Day number within the year for the selection start date.",
    evaluate(context) {
      return getDayOfYear(context.startDate);
    }
  },
  {
    key: "weekdayStart",
    description: "Weekday for the selection start date.",
    evaluate(context) {
      return context.weekdayStart;
    }
  },
  {
    key: "anniversary",
    description: "Lists matching anniversary dates, or anniversary ranges, across a selected span of years.",
    getDefaultArgs() {
      return {
        fromYear: CURRENT_YEAR - 10,
        toYear: CURRENT_YEAR + 10
      };
    },
    evaluate(context, args) {
      return buildAnniversaryEntries(context, args);
    }
  }
];
const SELECTION_METADATA_FUNCTIONS_BY_KEY = Object.fromEntries(
  SELECTION_METADATA_FUNCTIONS.map((definition) => [definition.key, definition])
);
const SORTED_SELECTION_METADATA_FUNCTIONS = [...SELECTION_METADATA_FUNCTIONS].sort((left, right) => {
  return humanizeFunctionKey(left.key).localeCompare(humanizeFunctionKey(right.key));
});

let activeSelectionId = 0;
let activeThemeKey = DEFAULT_THEME_KEY;
let displayYear = 2026;
let nextSelectionNumber = 2;
let editingSelectionId = null;
let editingNameSelectionId = null;
let isEditingYear = false;
let settingsOpen = false;
let selectionsCollapsed = true;
let shouldFocusSelectionEditor = false;
let shouldFocusSelectionNameEditor = false;
let availableColorIndices = THEMES[DEFAULT_THEME_KEY].selectionColors.map((_, index) => index).slice(1);
let selections = [createSelection(0)];

function getMonthsPerRow() {
  const width = window.innerWidth;
  const isPortrait = window.innerHeight >= window.innerWidth;

  if (!isPortrait) {
    return 3;
  }

  if (width <= ONE_MONTH_MAX_WIDTH) {
    return 1;
  }

  if (width <= TWO_MONTH_MAX_WIDTH) {
    return 2;
  }

  return 3;
}

function useStackedHeader() {
  return window.innerHeight >= window.innerWidth && window.innerWidth <= TWO_MONTH_MAX_WIDTH;
}

function getCurrentTheme() {
  return THEMES[activeThemeKey] ?? THEMES[DEFAULT_THEME_KEY];
}

function getSelectionPaletteCount() {
  return getCurrentTheme().selectionColors.length;
}

function getSelectionPalette(colorIndex) {
  const theme = getCurrentTheme();
  const palette = theme.selectionColors[colorIndex] ?? theme.selectionColors[0];

  return palette;
}

function assignSelectionPalette(selection) {
  const palette = getSelectionPalette(selection.colorIndex);

  selection.color = palette.color;
  selection.border = palette.border;
  selection.text = palette.text;
}

function syncSelectionColors() {
  for (const selection of selections) {
    assignSelectionPalette(selection);
  }
}

function getTodayHighlightStyle() {
  const theme = getCurrentTheme();

  return [
    `border-color: ${theme.todayBorder};`,
    `background: ${theme.todayBackground};`,
    `color: ${theme.todayText};`
  ].join(" ");
}

function takeColorIndex(preferredIndex) {
  if (preferredIndex !== undefined) {
    const preferredPoolIndex = availableColorIndices.indexOf(preferredIndex);

    if (preferredPoolIndex !== -1) {
      availableColorIndices.splice(preferredPoolIndex, 1);
    }

    return preferredIndex;
  }

  if (availableColorIndices.length > 0) {
    return availableColorIndices.shift();
  }

  return 0;
}

function releaseColorIndex(colorIndex) {
  if (colorIndex === 0) {
    return;
  }

  if (!availableColorIndices.includes(colorIndex)) {
    availableColorIndices.push(colorIndex);
    availableColorIndices.sort((left, right) => left - right);
  }
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function createSelection(id, labelNumber = id + 1, colorIndex = takeColorIndex(id === 0 ? 0 : undefined)) {
  const palette = getSelectionPalette(colorIndex);

  return {
    id,
    label: `Selection ${labelNumber}`,
    color: palette.color,
    border: palette.border,
    text: palette.text,
    colorIndex,
    start: null,
    end: null,
    name: "",
    metadataFunctionKeys: [],
    metadataFunctionArgs: {},
    metadataDraft: "",
    hiddenMetadataFunctionKeys: []
  };
}

function rebuildAvailableColorIndices() {
  const usedColorIndices = new Set(
    selections
      .map((selection) => selection.colorIndex)
      .filter((colorIndex) => Number.isInteger(colorIndex) && colorIndex >= 0 && colorIndex < getSelectionPaletteCount())
  );

  availableColorIndices = getCurrentTheme().selectionColors
    .map((_, index) => index)
    .filter((index) => index !== 0 && !usedColorIndices.has(index));
}

function serializeSelection(selection) {
  return {
    id: selection.id,
    label: selection.label,
    colorIndex: selection.colorIndex,
    start: selection.start,
    end: selection.end,
    name: selection.name,
    metadataFunctionKeys: selection.metadataFunctionKeys,
    metadataFunctionArgs: selection.metadataFunctionArgs,
    hiddenMetadataFunctionKeys: selection.hiddenMetadataFunctionKeys
  };
}

function hydrateSelection(rawSelection, index) {
  const rawColorIndex = rawSelection?.colorIndex;
  let nextColorIndex = 0;

  if (Number.isInteger(rawColorIndex) && rawColorIndex >= 0 && rawColorIndex < getSelectionPaletteCount()) {
    nextColorIndex = rawColorIndex === 0 ? 0 : takeColorIndex(rawColorIndex);
  } else {
    nextColorIndex = index === 0 ? 0 : takeColorIndex();
  }

  const palette = getSelectionPalette(nextColorIndex);
  const nextSelection = {
    id: index,
    label: typeof rawSelection?.label === "string" ? rawSelection.label : `Selection ${index + 1}`,
    color: palette.color,
    border: palette.border,
    text: palette.text,
    colorIndex: nextColorIndex,
    start: typeof rawSelection?.start === "string" ? rawSelection.start : null,
    end: typeof rawSelection?.end === "string" ? rawSelection.end : null,
    name: typeof rawSelection?.name === "string" ? rawSelection.name : "",
    metadataFunctionKeys: Array.isArray(rawSelection?.metadataFunctionKeys)
      ? rawSelection.metadataFunctionKeys.filter((key) => typeof key === "string" && SELECTION_METADATA_FUNCTIONS_BY_KEY[key])
      : [],
    metadataFunctionArgs: typeof rawSelection?.metadataFunctionArgs === "object" && rawSelection.metadataFunctionArgs !== null
      ? rawSelection.metadataFunctionArgs
      : {},
    metadataDraft: "",
    hiddenMetadataFunctionKeys: Array.isArray(rawSelection?.hiddenMetadataFunctionKeys)
      ? rawSelection.hiddenMetadataFunctionKeys.filter((key) => typeof key === "string" && SELECTION_METADATA_FUNCTIONS_BY_KEY[key])
      : []
  };

  if (nextSelection.start && nextSelection.end && compareIsoDates(nextSelection.start, nextSelection.end) > 0) {
    const originalStart = nextSelection.start;
    nextSelection.start = nextSelection.end;
    nextSelection.end = originalStart;
  }

  return nextSelection;
}

function saveSessionState() {
  try {
    const nextState = {
      activeSelectionId,
      activeThemeKey,
      displayYear,
      nextSelectionNumber,
      selectionsCollapsed,
      selections: selections.map(serializeSelection)
    };

    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextState));
  } catch {
    // Ignore storage failures and keep the app usable.
  }
}

function loadSessionState() {
  try {
    const rawState = window.localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!rawState) {
      rebuildAvailableColorIndices();
      syncSelectionColors();
      return;
    }

    const parsedState = JSON.parse(rawState);
    const rawSelections = Array.isArray(parsedState?.selections) ? parsedState.selections : [];
    activeThemeKey = typeof parsedState?.activeThemeKey === "string" && THEMES[parsedState.activeThemeKey]
      ? parsedState.activeThemeKey
      : DEFAULT_THEME_KEY;

    availableColorIndices = getCurrentTheme().selectionColors.map((_, index) => index).slice(1);
    selections = rawSelections.length > 0
      ? rawSelections.map((rawSelection, index) => hydrateSelection(rawSelection, index))
      : [createSelection(0)];

    rebuildAvailableColorIndices();
    syncSelectionColors();

    activeSelectionId = Number.isInteger(parsedState?.activeSelectionId) ? parsedState.activeSelectionId : 0;
    displayYear = Number.isInteger(parsedState?.displayYear) ? parsedState.displayYear : displayYear;
    nextSelectionNumber = Number.isInteger(parsedState?.nextSelectionNumber) ? parsedState.nextSelectionNumber : nextSelectionNumber;
    selectionsCollapsed = typeof parsedState?.selectionsCollapsed === "boolean" ? parsedState.selectionsCollapsed : selectionsCollapsed;

    normalizeSelections();

    const activeSelection = selections[activeSelectionId];

    if (!activeSelection || activeSelection.start) {
      const nextSelection = getOrCreateNextSelection();
      activeSelectionId = nextSelection.id;
    }
  } catch {
    activeThemeKey = DEFAULT_THEME_KEY;
    selections = [createSelection(0)];
    rebuildAvailableColorIndices();
    syncSelectionColors();
  }
}

function getDayOfYear(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const msPerDay = 24 * 60 * 60 * 1000;

  return Math.floor((date - startOfYear) / msPerDay) + 1;
}

function getDaysInYear(year) {
  return new Date(year, 1, 29).getMonth() === 1 ? 366 : 365;
}

function toIsoDate(year, monthIndex, day) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseIsoDate(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);

  return new Date(year, month - 1, day);
}

function compareIsoDates(left, right) {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

function getDaySpan(startDate, endDate) {
  return Math.floor((endDate - startDate) / MS_PER_DAY) + 1;
}

function getWholeDayDifference(laterDate, earlierDate) {
  return Math.floor((laterDate - earlierDate) / MS_PER_DAY);
}

function formatDurationParts(totalSeconds) {
  const safeSeconds = Math.max(0, totalSeconds);
  const days = Math.floor(safeSeconds / (24 * 60 * 60));
  const hours = Math.floor((safeSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((safeSeconds % (60 * 60)) / 60);
  const seconds = safeSeconds % 60;
  const parts = [];

  if (days > 0) {
    parts.push(`${days} ${days === 1 ? "day" : "days"}`);
  }

  if (days > 0 || hours > 0) {
    parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  }

  if (days > 0 || hours > 0 || minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? "min" : "mins"}`);
  }

  parts.push(`${seconds} ${seconds === 1 ? "sec" : "secs"}`);

  return parts.join(", ");
}

function createDateInYear(year, monthIndex, day) {
  const date = new Date(year, monthIndex, day);

  if (date.getFullYear() !== year || date.getMonth() !== monthIndex || date.getDate() !== day) {
    return null;
  }

  return date;
}

function formatAnniversaryDate(date) {
  return ANNIVERSARY_DATE_FORMATTER.format(date);
}

function normalizeAnniversaryArgs(rawArgs) {
  const defaults = {
    fromYear: CURRENT_YEAR - 10,
    toYear: CURRENT_YEAR + 10
  };
  const parsedFromYear = Number.parseInt(String(rawArgs?.fromYear ?? defaults.fromYear), 10);
  const parsedToYear = Number.parseInt(String(rawArgs?.toYear ?? defaults.toYear), 10);
  const safeFromYear = Number.isInteger(parsedFromYear) ? parsedFromYear : defaults.fromYear;
  const safeToYear = Number.isInteger(parsedToYear) ? parsedToYear : defaults.toYear;

  if (safeFromYear <= safeToYear) {
    return {
      fromYear: safeFromYear,
      toYear: safeToYear
    };
  }

  return {
    fromYear: safeToYear,
    toYear: safeFromYear
  };
}

function buildAnniversaryEntries(context, args) {
  const entries = [];
  const startMonthIndex = context.startDate.getMonth();
  const startDay = context.startDate.getDate();
  const endMonthIndex = context.endDate.getMonth();
  const endDay = context.endDate.getDate();
  const yearOffset = context.endDate.getFullYear() - context.startDate.getFullYear();
  const normalizedArgs = normalizeAnniversaryArgs(args);

  for (let year = normalizedArgs.fromYear; year <= normalizedArgs.toYear; year += 1) {
    const startAnniversary = createDateInYear(year, startMonthIndex, startDay);

    if (!startAnniversary) {
      continue;
    }

    if (context.isSingleDay) {
      entries.push(formatAnniversaryDate(startAnniversary));
      continue;
    }

    const endAnniversary = createDateInYear(year + yearOffset, endMonthIndex, endDay);

    if (!endAnniversary) {
      continue;
    }

    entries.push(`${formatAnniversaryDate(startAnniversary)} - ${formatAnniversaryDate(endAnniversary)}`);
  }

  return entries;
}

function formatSelectionValue(selection) {
  if (!selection.start) {
    return "Select";
  }

  const startDate = parseIsoDate(selection.start);
  const endDate = parseIsoDate(selection.end);
  const sameYearAsToday = startDate.getFullYear() === TODAY.getFullYear() && endDate.getFullYear() === TODAY.getFullYear();

  if (selection.start === selection.end) {
    return sameYearAsToday ? SHORT_MONTH_DAY_FORMATTER.format(startDate) : SHORT_MONTH_DAY_YEAR_FORMATTER.format(startDate);
  }

  const startText = sameYearAsToday ? SHORT_MONTH_DAY_FORMATTER.format(startDate) : SHORT_MONTH_DAY_YEAR_FORMATTER.format(startDate);
  const endText = sameYearAsToday ? SHORT_MONTH_DAY_FORMATTER.format(endDate) : SHORT_MONTH_DAY_YEAR_FORMATTER.format(endDate);

  return `${startText}-${endText}`;
}

function formatSelectionEditorValue(selection) {
  if (!selection.start || !selection.end) {
    return "";
  }

  const startDate = parseIsoDate(selection.start);
  const endDate = parseIsoDate(selection.end);

  if (selection.start === selection.end) {
    return SHORT_FULL_DATE_FORMATTER.format(startDate);
  }

  return `${SHORT_FULL_DATE_FORMATTER.format(startDate)} - ${SHORT_FULL_DATE_FORMATTER.format(endDate)}`;
}

function parseSelectionInput(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const parts = trimmedValue.split(/\s+-\s+/);

  if (parts.length > 2) {
    return null;
  }

  const startDate = new Date(parts[0]);

  if (Number.isNaN(startDate.getTime())) {
    return null;
  }

  const endDate = parts[1] ? new Date(parts[1]) : startDate;

  if (Number.isNaN(endDate.getTime())) {
    return null;
  }

  const normalizedStart = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const normalizedEnd = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const startIso = toIsoDate(normalizedStart.getFullYear(), normalizedStart.getMonth(), normalizedStart.getDate());
  const endIso = toIsoDate(normalizedEnd.getFullYear(), normalizedEnd.getMonth(), normalizedEnd.getDate());

  if (compareIsoDates(startIso, endIso) <= 0) {
    return { start: startIso, end: endIso };
  }

  return { start: endIso, end: startIso };
}

function relabelSelections() {
  selections = selections.map((selection, index) => {
    return {
      ...selection,
      id: index
    };
  });
}

function getOrCreateNextSelection() {
  const nextSelection = createSelection(selections.length, nextSelectionNumber);
  nextSelectionNumber += 1;
  selections.push(nextSelection);
  return nextSelection;
}

function getSelectionForDate(isoDate) {
  return selections.find((selection) => {
    if (!selection.start || !selection.end) {
      return false;
    }

    return compareIsoDates(selection.start, isoDate) <= 0 && compareIsoDates(isoDate, selection.end) <= 0;
  });
}

function updateSelection(selection, isoDate) {
  if (!selection.start || !selection.end) {
    selection.start = isoDate;
    selection.end = isoDate;
    return "single";
  }

  if (selection.start === selection.end && selection.start !== isoDate) {
    selection.start = compareIsoDates(selection.start, isoDate) < 0 ? selection.start : isoDate;
    selection.end = compareIsoDates(selection.end, isoDate) > 0 ? selection.end : isoDate;
    return "range";
  }

  selection.start = isoDate;
  selection.end = isoDate;
  return "single";
}

function deriveSelectionContext(selection) {
  if (!selection.start || !selection.end) {
    return null;
  }

  const startDate = parseIsoDate(selection.start);
  const endDate = parseIsoDate(selection.end);
  const todayDate = new Date(CURRENT_YEAR, CURRENT_MONTH, CURRENT_DAY);
  const durationDays = getDaySpan(startDate, endDate);

  return {
    selection,
    startDate,
    endDate,
    todayDate,
    isSingleDay: selection.start === selection.end,
    isFuture: startDate > todayDate,
    isPast: endDate < todayDate,
    isActive: startDate <= todayDate && endDate >= todayDate,
    containsToday: startDate <= todayDate && endDate >= todayDate,
    durationDays,
    durationHours: durationDays * 24,
    durationMinutes: durationDays * 24 * 60,
    durationSeconds: durationDays * 24 * 60 * 60,
    durationWeeks: durationDays / 7,
    weekdayStart: DAY_NAMES[startDate.getDay()]
  };
}

function getCountdownReferenceDate(context) {
  if (context.isActive && !context.isSingleDay) {
    return context.endDate;
  }

  return context.startDate;
}

function getAutomaticMetadataFunctionKeys(context) {
  const defaultKeys = ["durationDays"];

  if (context.isFuture) {
    return [...defaultKeys, "daysRemaining"];
  }

  if (context.isPast || context.isSingleDay) {
    return [...defaultKeys, "daysSince"];
  }

  if (context.isActive) {
    return [...defaultKeys, "daysRemaining"];
  }

  return defaultKeys;
}

function getSelectionFunctionArgs(selection, functionKey) {
  const definition = SELECTION_METADATA_FUNCTIONS_BY_KEY[functionKey];
  const storedArgs = selection.metadataFunctionArgs?.[functionKey] ?? {};
  const defaultArgs = typeof definition?.getDefaultArgs === "function" ? definition.getDefaultArgs() : {};

  if (functionKey === "anniversary") {
    return normalizeAnniversaryArgs({
      ...defaultArgs,
      ...storedArgs
    });
  }

  return {
    ...defaultArgs,
    ...storedArgs
  };
}

function resolveMetadataFunctionKey(value) {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const matchingDefinition = SELECTION_METADATA_FUNCTIONS.find((definition) => {
    return definition.key.toLowerCase() === trimmedValue.toLowerCase()
      || humanizeFunctionKey(definition.key).toLowerCase() === trimmedValue.toLowerCase();
  });

  return matchingDefinition ? matchingDefinition.key : null;
}

function addMetadataFunctionToSelection(selectionId, rawValue) {
  const selection = selections[selectionId];

  if (!selection) {
    return false;
  }

  const functionKey = resolveMetadataFunctionKey(rawValue);

  if (!functionKey) {
    selection.metadataDraft = rawValue;
    return false;
  }

  if (!selection.metadataFunctionKeys.includes(functionKey)) {
    selection.metadataFunctionKeys.push(functionKey);
  }

  const definition = SELECTION_METADATA_FUNCTIONS_BY_KEY[functionKey];

  if (definition && typeof definition.getDefaultArgs === "function" && !selection.metadataFunctionArgs[functionKey]) {
    selection.metadataFunctionArgs[functionKey] = definition.getDefaultArgs();
  }

  selection.hiddenMetadataFunctionKeys = selection.hiddenMetadataFunctionKeys.filter((key) => key !== functionKey);
  selection.metadataDraft = "";
  return true;
}

function removeMetadataFunctionFromSelection(selectionId, functionKey) {
  const selection = selections[selectionId];

  if (!selection) {
    return;
  }

  selection.metadataFunctionKeys = selection.metadataFunctionKeys.filter((key) => key !== functionKey);

  if (!selection.hiddenMetadataFunctionKeys.includes(functionKey)) {
    selection.hiddenMetadataFunctionKeys.push(functionKey);
  }
}

function updateSelectionFunctionArg(selectionId, functionKey, argKey, rawValue) {
  const selection = selections[selectionId];

  if (!selection) {
    return;
  }

  if (!selection.metadataFunctionArgs[functionKey]) {
    selection.metadataFunctionArgs[functionKey] = getSelectionFunctionArgs(selection, functionKey);
  }

  selection.metadataFunctionArgs[functionKey] = {
    ...selection.metadataFunctionArgs[functionKey],
    [argKey]: rawValue
  };

  if (functionKey === "anniversary") {
    selection.metadataFunctionArgs[functionKey] = normalizeAnniversaryArgs(selection.metadataFunctionArgs[functionKey]);
  }
}

function humanizeFunctionKey(functionKey) {
  return functionKey
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());
}

function isLiveMetadataFunctionKey(functionKey) {
  return functionKey === "liveCountDown" || functionKey === "liveCountUp";
}

function serializeMetadataValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry)).join("\n");
  }

  if (value === null) {
    return "n/a";
  }

  return String(value);
}

function serializeMetadataCopyText(functionKey, value) {
  return `${humanizeFunctionKey(functionKey)}:\n${serializeMetadataValue(value)}`;
}

function renderMetadataValue(value, functionKey, selectionId) {
  if (isLiveMetadataFunctionKey(functionKey)) {
    const textValue = value === null ? "n/a" : String(value);

    return `<span data-live-metadata="${selectionId}" data-live-function-key="${functionKey}" style="font-family: ${MONOSPACE_FONT_STACK};">${escapeHtml(textValue)}</span>`;
  }

  if (Array.isArray(value)) {
    return value.map((entry) => `<div style="font-family: ${MONOSPACE_FONT_STACK};">${escapeHtml(String(entry))}</div>`).join("");
  }

  if (value === null) {
    return `<span style="font-family: ${MONOSPACE_FONT_STACK};">n/a</span>`;
  }

  return `<span style="font-family: ${MONOSPACE_FONT_STACK};">${escapeHtml(String(value))}</span>`;
}

async function copyTextValue(text) {
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function buildYearSelectOptions(selectedYear) {
  const options = [];

  for (let year = YEAR_OPTION_MIN; year <= YEAR_OPTION_MAX; year += 1) {
    options.push(`<option value="${year}"${year === selectedYear ? " selected" : ""}>${year}</option>`);
  }

  return options.join("");
}

function buildThemeStyles() {
  const theme = getCurrentTheme();

  return `
    <style>
      #app {
        min-height: 100vh;
        padding: 24px 18px 40px;
        background: ${theme.pageBackground};
        color: ${theme.textColor};
        font-family: ${MONOSPACE_FONT_STACK};
      }

      #app,
      #app table,
      #app th,
      #app td,
      #app div,
      #app span,
      #app label {
        color: inherit;
      }

      #app a {
        color: ${theme.linkColor};
        text-decoration: ${theme.linkDecoration};
      }

      #app a:hover {
        color: ${theme.linkHoverColor};
        text-decoration: ${theme.linkDecoration};
      }

      #app button,
      #app input,
      #app select {
        font: inherit;
        color: ${theme.controlText};
        background: ${theme.controlBackground};
        border: 1px solid ${theme.controlBorder};
        border-radius: ${theme.controlRadius};
        padding: 4px 8px;
      }

      #app button {
        cursor: pointer;
      }

      #app input,
      #app select {
        max-width: 100%;
      }

      #app button:focus-visible,
      #app input:focus-visible,
      #app select:focus-visible {
        outline: 2px solid ${theme.focusRing};
        outline-offset: 2px;
      }

      #app [data-calendar-shell] {
        max-width: 1180px;
        margin: 0 auto;
        padding: 18px;
        border: 1px solid ${theme.frameBorder};
        border-radius: ${theme.shellRadius};
        background: ${theme.surface};
        box-shadow: ${theme.frameShadow};
        backdrop-filter: ${theme.frameBackdropFilter ?? "blur(14px)"};
      }

      #app [data-header-date-link] {
        color: ${theme.headerText};
      }

      #app [data-month-table] {
        width: 100%;
        border: 1px solid ${theme.borderColor};
        border-radius: ${theme.monthRadius};
        background: ${theme.monthBackground};
        box-shadow: ${theme.panelShadow};
      }

      #app [data-month-table="current"] {
        background: ${theme.currentMonthSurface};
        box-shadow: ${theme.currentMonthShadow};
      }

      #app [data-selection-card] {
        border: 1px solid ${theme.selectionCardBorder};
        border-radius: ${theme.selectionCardRadius};
      }

      #app [data-selection-metadata] {
        border-top: 1px solid ${theme.metadataBorder};
      }

      #app [data-selection-function-picker] {
        border-top: 1px solid ${theme.metadataBorder};
      }

      #app [data-settings-anchor] {
        position: relative;
      }

      #app [data-settings-panel] {
        position: absolute;
        top: calc(100% + 10px);
        right: 0;
        width: min(260px, 80vw);
        padding: 12px;
        border: 1px solid ${theme.borderColor};
        border-radius: ${theme.settingsBorderRadius};
        background: ${theme.settingsSurface};
        box-shadow: ${theme.settingsShadow};
        z-index: 20;
      }

      #app [data-settings-title] {
        color: ${theme.mutedText};
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      #app [data-theme-options] {
        display: grid;
        gap: 6px;
        padding-top: 8px;
      }

      #app [data-theme-option-label] {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 10px;
        border: 1px solid transparent;
        border-radius: 10px;
        cursor: pointer;
      }

      #app [data-theme-option-label]:hover {
        background: ${theme.settingsOptionHover};
      }

      #app [data-theme-option-label][data-active="true"] {
        border-color: ${theme.accentBorder};
        background: ${theme.settingsOptionActive};
      }
    </style>
  `;
}

function buildSettingsPanel() {
  const themeOptions = Object.entries(THEMES).map(([themeKey, theme]) => {
    return `
      <label data-theme-option-label data-active="${themeKey === activeThemeKey ? "true" : "false"}">
        <input
          type="radio"
          name="app-theme"
          value="${themeKey}"
          data-theme-option="${themeKey}"
          ${themeKey === activeThemeKey ? "checked" : ""}
        />
        <span>${theme.label}</span>
      </label>
    `;
  }).join("");

  return `
    <div data-settings-panel>
      <div data-settings-title>Themes</div>
      <div data-theme-options>
        ${themeOptions}
      </div>
    </div>
  `;
}

function buildHeaderContent(yearDisplay, metadataText, stackedHeader) {
  const settingsMarkup = `
    <div data-settings-anchor>
      <button type="button" data-settings-toggle="true" aria-label="Open settings">⚙</button>
      ${settingsOpen ? buildSettingsPanel() : ""}
    </div>
  `;

  if (stackedHeader) {
    return `
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <th align="left">
            <button type="button" data-year-nav="prev" aria-label="Previous year">&lt;</button>
            ${yearDisplay}
            <button type="button" data-year-nav="next" aria-label="Next year">&gt;</button>
          </th>
          <th align="right">
            ${settingsMarkup}
          </th>
        </tr>
        <tr>
          <th colspan="2" align="center" style="padding-top: 8px;">
            <a href="#" data-jump-current-year="true" data-header-date-link="true">${metadataText}</a>
          </th>
        </tr>
      </table>
    `;
  }

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <th align="left" width="33%">
          <button type="button" data-year-nav="prev" aria-label="Previous year">&lt;</button>
          ${yearDisplay}
          <button type="button" data-year-nav="next" aria-label="Next year">&gt;</button>
        </th>
        <th align="center" width="34%">
          <a href="#" data-jump-current-year="true" data-header-date-link="true">${metadataText}</a>
        </th>
        <th align="right" width="33%">
          ${settingsMarkup}
        </th>
      </tr>
    </table>
  `;
}

function applyDocumentTheme() {
  const theme = getCurrentTheme();

  document.documentElement.style.colorScheme = theme.colorScheme;
  document.body.style.background = theme.pageBackground;
  document.body.style.color = theme.textColor;
  document.body.style.fontFamily = MONOSPACE_FONT_STACK;
}

function buildMetadataArgumentControls(selection, functionKey, args) {
  if (functionKey !== "anniversary") {
    return "";
  }

  return `
    <tr>
      <td></td>
      <td colspan="2" style="padding-top: 2px;">
        <label>
          From
          <select data-selection-function-arg="${selection.id}" data-selection-function-key="${functionKey}" data-selection-function-arg-key="fromYear">
            ${buildYearSelectOptions(args.fromYear)}
          </select>
        </label>
        <label style="padding-left: 8px;">
          To
          <select data-selection-function-arg="${selection.id}" data-selection-function-key="${functionKey}" data-selection-function-arg-key="toYear">
            ${buildYearSelectOptions(args.toYear)}
          </select>
        </label>
      </td>
    </tr>
  `;
}

function buildSelectionNameControl(selection) {
  if (!selection.start) {
    return "";
  }

  if (selection.id === editingNameSelectionId) {
    return `
      <input
        type="text"
        data-selection-name="${selection.id}"
        value="${escapeHtml(selection.name || "")}"
        placeholder="name"
        aria-label="Name ${selection.label}"
        style="width: 100%;"
      />
    `;
  }

  const nameText = selection.name.trim() || "(no name)";

  return `
    <a href="#" data-selection-name-link="${selection.id}" aria-label="Name ${selection.label}" style="font-family: ${MONOSPACE_FONT_STACK}; color: inherit;">
      ${escapeHtml(nameText)}
    </a>
  `;
}

function commitSelectionEditor(selectionId, value) {
  const selection = selections[selectionId];

  editingSelectionId = null;
  shouldFocusSelectionEditor = false;

  if (!selection) {
    return false;
  }

  const parsedSelection = parseSelectionInput(value);

  if (!parsedSelection) {
    return false;
  }

  selection.start = parsedSelection.start;
  selection.end = parsedSelection.end;
  displayYear = parseIsoDate(selection.start).getFullYear();
  return true;
}

function commitSelectionName(selectionId, value) {
  const selection = selections[selectionId];

  editingNameSelectionId = null;
  shouldFocusSelectionNameEditor = false;

  if (!selection) {
    return;
  }

  selection.name = value.trim();
}

function getVisibleSelectionFunctionKeys(selection, context) {
  const automaticKeys = getAutomaticMetadataFunctionKeys(context);

  return [...new Set([...automaticKeys, ...selection.metadataFunctionKeys])]
    .filter((functionKey) => !selection.hiddenMetadataFunctionKeys.includes(functionKey))
    .sort((left, right) => humanizeFunctionKey(left).localeCompare(humanizeFunctionKey(right)));
}

function isSelectionFunctionVisible(selection, functionKey, context) {
  return getVisibleSelectionFunctionKeys(selection, context).includes(functionKey);
}

function buildSelectionFunctionSelectOptions() {
  const options = SORTED_SELECTION_METADATA_FUNCTIONS.map((definition) => {
    return `<option value="${definition.key}">${escapeHtml(humanizeFunctionKey(definition.key))}</option>`;
  }).join("");

  return `
    <option value="">Select Date Info</option>
    ${options}
  `;
}

function buildSelectionMetadata(selection) {
  const context = deriveSelectionContext(selection);

  if (!context) {
    return "";
  }

  const visibleFunctionKeys = getVisibleSelectionFunctionKeys(selection, context);
  const metadataLines = [];

  for (const functionKey of visibleFunctionKeys) {
    const definition = SELECTION_METADATA_FUNCTIONS_BY_KEY[functionKey];

    if (!definition) {
      continue;
    }

    const args = getSelectionFunctionArgs(selection, functionKey);
    const value = definition.evaluate(context, args);
    const valueMarkup = renderMetadataValue(value, definition.key, selection.id);
    const copyValue = escapeHtml(serializeMetadataCopyText(definition.key, value));
    const argumentControls = buildMetadataArgumentControls(selection, functionKey, args);

    metadataLines.push(`
      <tr>
        <td>${escapeHtml(humanizeFunctionKey(definition.key))}</td>
        <td>${valueMarkup}</td>
        <td align="right">
          <button type="button" data-selection-function-copy="${selection.id}" data-selection-function-key="${definition.key}" data-selection-function-value="${copyValue}" aria-label="Copy ${humanizeFunctionKey(definition.key)}">⧉</button>
          <button type="button" data-selection-function-remove="${selection.id}" data-selection-function-key="${definition.key}" aria-label="Remove ${humanizeFunctionKey(definition.key)}">✕</button>
        </td>
      </tr>
      ${argumentControls}
    `);
  }

  return `
    <div data-selection-metadata="${selection.id}" style="margin-top: 6px; padding-top: 6px;">
      <table width="100%" cellpadding="3" cellspacing="0" border="0">
        <tbody>
          ${metadataLines.join("")}
          <tr>
            <td colspan="3" style="padding-top: 8px;">
              <div data-selection-function-picker style="padding-top: 8px; text-align: center;">
                <select data-selection-function-select="${selection.id}" aria-label="Select Date Info for ${selection.label}">
                  ${buildSelectionFunctionSelectOptions()}
                </select>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;
}

function buildSelectionContent(selection) {
  const isEditing = selection.id === editingSelectionId;
  const value = formatSelectionValue(selection);
  const isRangeSelection = Boolean(selection.start && selection.end && selection.start !== selection.end);
  const primaryAction = isRangeSelection ? "edit" : "done";
  const primaryIcon = isRangeSelection ? "✎" : "✓";
  const actions = selection.start
    ? `
        <td style="padding-right: 8px;" width="240">
          ${buildSelectionNameControl(selection)}
        </td>
        <td align="right">
          <button type="button" data-selection-action="${primaryAction}" data-selection-id="${selection.id}" aria-label="${primaryAction === "edit" ? `Edit ${selection.label}` : `Done with ${selection.label}`}">${primaryIcon}</button>
          <button type="button" data-selection-action="delete" data-selection-id="${selection.id}" aria-label="Delete ${selection.label}">✕</button>
        </td>
      `
    : "<td></td>";
  const selectionTrigger = isEditing
    ? `
        <input
          type="text"
          data-selection-editor="${selection.id}"
          value="${formatSelectionEditorValue(selection)}"
          placeholder="MON DD, YYYY - MON DD, YYYY"
          aria-label="Edit ${selection.label}"
        />
      `
    : `
        <a href="#" data-selection-id="${selection.id}" style="font-family: ${MONOSPACE_FONT_STACK}; color: inherit;">
          ${selection.id + 1}. ${value}
        </a>
      `;
  const metadata = buildSelectionMetadata(selection);

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td>
          ${selectionTrigger}
        </td>
        ${actions}
      </tr>
      ${metadata
        ? `
            <tr>
              <td colspan="${selection.start ? 3 : 2}">
                ${metadata}
              </td>
            </tr>
          `
        : ""}
    </table>
  `;
}

function buildSelectionPanel(monthsPerRow) {
  const rows = [];
  const toggleLabel = selectionsCollapsed ? "▸" : "▾";
  const headerRow = `
    <tr>
      <td colspan="${monthsPerRow}" style="padding-top: 6px;">
        <a href="#" data-selection-toggle="true">${toggleLabel} Selections</a>
      </td>
    </tr>
  `;

  if (selectionsCollapsed) {
    return headerRow;
  }

  for (const selection of selections) {
    const isActive = selection.id === activeSelectionId;
    const rowStyle = [
      "width: 100%;",
      `background: ${selection.color};`,
      `color: ${selection.text};`,
      "padding: 4px 6px;",
      isActive ? `box-shadow: inset 0 0 0 2px ${selection.border};` : ""
    ].join(" ");

    rows.push(`
      <tr>
        <td colspan="${monthsPerRow}" style="padding-top: 6px;">
          <div data-selection-id="${selection.id}" data-selection-card style="${rowStyle} cursor: pointer;">
            ${buildSelectionContent(selection)}
          </div>
        </td>
      </tr>
    `);
  }

  return `
    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      ${headerRow}
      ${rows.join("")}
    </table>
  `;
}

function buildSelectionRows(monthsPerRow) {
  const toggleLabel = selectionsCollapsed ? "▸" : "▾";
  const rows = [
    `
      <tr>
        <td colspan="${monthsPerRow}" style="padding-top: 6px;">
          <a href="#" data-selection-toggle="true">${toggleLabel} Selections</a>
        </td>
      </tr>
    `
  ];

  if (selectionsCollapsed) {
    return rows.join("");
  }

  for (const selection of selections) {
    const isActive = selection.id === activeSelectionId;
    const rowStyle = [
      "width: 100%;",
      `background: ${selection.color};`,
      `color: ${selection.text};`,
      "padding: 4px 6px;",
      isActive ? `box-shadow: inset 0 0 0 2px ${selection.border};` : ""
    ].join(" ");

    rows.push(`
      <tr>
        <td colspan="${monthsPerRow}" style="padding-top: 6px;">
          <div data-selection-id="${selection.id}" data-selection-card style="${rowStyle} cursor: pointer;">
            ${buildSelectionContent(selection)}
          </div>
        </td>
      </tr>
    `);
  }

  return rows.join("");
}

function buildMonthWeeks(year, monthIndex) {
  const firstDay = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const slots = Array.from({ length: WEEKS_PER_MONTH * DAY_NAMES.length }, () => "");

  for (let day = 1; day <= daysInMonth; day += 1) {
    slots[firstDay + day - 1] = String(day);
  }

  return Array.from({ length: WEEKS_PER_MONTH }, (_, weekIndex) =>
    slots.slice(weekIndex * DAY_NAMES.length, (weekIndex + 1) * DAY_NAMES.length)
  );
}

function buildMonthTable(year, monthIndex) {
  const weeks = buildMonthWeeks(year, monthIndex);
  const headerCells = DAY_NAMES.map((dayName) => `<th scope="col">${dayName}</th>`).join("");
  const isCurrentMonth = year === CURRENT_YEAR && monthIndex === CURRENT_MONTH;
  const weekRows = weeks
    .map((week) => {
      const cells = week
        .map((day) => {
          if (day === "") {
            return "<td></td>";
          }

          const isoDate = toIsoDate(year, monthIndex, Number(day));
          const selection = getSelectionForDate(isoDate);
          const isCurrentDay = isCurrentMonth && Number(day) === CURRENT_DAY;
          const styles = [
            "border: 1px solid transparent;",
            "background: transparent;",
            "padding: 2px 4px;",
            "cursor: pointer;"
          ];

          if (selection) {
            styles.push(`border-color: ${selection.border};`, `background: ${selection.color};`, `color: ${selection.text};`);
          } else if (isCurrentDay) {
            styles.push(getTodayHighlightStyle());
          }

          return `
            <td align="right">
              <button
                type="button"
                data-date="${isoDate}"
                data-selected="${selection ? "true" : "false"}"
                style="${styles.join(" ")}"
              >
                ${day}
              </button>
            </td>
          `;
        })
        .join("");

      return `<tr>${cells}</tr>`;
    })
    .join("");
  return `
    <table cellpadding="2" cellspacing="0" border="0" data-month-table="${isCurrentMonth ? "current" : "default"}">
      <thead>
        <tr>
          <th colspan="7" scope="colgroup">${MONTH_NAMES[monthIndex]}</th>
        </tr>
        <tr>${headerCells}</tr>
      </thead>
      <tbody>${weekRows}</tbody>
    </table>
  `;
}

function buildYearTable(year) {
  const monthsPerRow = getMonthsPerRow();
  const stackedHeader = useStackedHeader();
  const useMobileLayout = monthsPerRow !== MONTHS_PER_ROW;
  const monthCells = MONTH_NAMES.map((_, monthIndex) => `<td valign="top">${buildMonthTable(year, monthIndex)}</td>`);
  const monthRows = [];
  const dayOfYear = getDayOfYear(TODAY);
  const daysInYear = getDaysInYear(TODAY.getFullYear());
  const yearProgress = Math.round((dayOfYear / daysInYear) * 100);
  const metadataText = `${FULL_DATE_FORMATTER.format(TODAY)} · Day ${dayOfYear}/${daysInYear} (${yearProgress}%)`;
  const yearDisplay = isEditingYear
    ? `
        <input
          type="text"
          inputmode="numeric"
          data-year-editor="true"
          value="${year}"
          aria-label="Edit year"
        />
      `
    : `<a href="#" data-edit-year="true">${year}</a>`;

  for (let i = 0; i < monthCells.length; i += monthsPerRow) {
    monthRows.push(`<tr>${monthCells.slice(i, i + monthsPerRow).join("")}</tr>`);
  }

  const headerContent = buildHeaderContent(yearDisplay, metadataText, stackedHeader);

  return `
    ${buildThemeStyles()}
    <div data-calendar-shell>
      <table align="center" cellpadding="12" cellspacing="0" border="0"${useMobileLayout ? ` width="100%"` : ""} aria-label="${year} calendar">
        <thead>
          <tr>
            <th
              colspan="${monthsPerRow}"
              style="border-bottom: 1px solid ${getCurrentTheme().subtleBorder}; padding-bottom: 8px;"
            >
              ${headerContent}
            </th>
          </tr>
          ${useMobileLayout
            ? `
                <tr>
                  <th colspan="${monthsPerRow}" data-selection-panel>
                    ${buildSelectionPanel(monthsPerRow)}
                  </th>
                </tr>
              `
            : buildSelectionRows(monthsPerRow)}
        </thead>
        <tbody>${monthRows.join("")}</tbody>
      </table>
    </div>
  `;
}

function getDateButtonStyle(isoDate) {
  const selection = getSelectionForDate(isoDate);
  const year = Number(isoDate.slice(0, 4));
  const monthIndex = Number(isoDate.slice(5, 7)) - 1;
  const day = Number(isoDate.slice(8, 10));
  const isCurrentDay = year === CURRENT_YEAR && monthIndex === CURRENT_MONTH && day === CURRENT_DAY;
  const styles = [
    "border: 1px solid transparent;",
    "background: transparent;",
    "padding: 2px 4px;",
    "cursor: pointer;"
  ];

  if (selection) {
    styles.push(`border-color: ${selection.border};`, `background: ${selection.color};`, `color: ${selection.text};`);
  } else if (isCurrentDay) {
    styles.push(getTodayHighlightStyle());
  }

  return {
    selected: selection ? "true" : "false",
    styleText: styles.join(" ")
  };
}

function updateVisibleDateButtons() {
  const dateButtons = app.querySelectorAll("button[data-date]");

  for (const button of dateButtons) {
    const isoDate = button.dataset.date;

    if (!isoDate) {
      continue;
    }

    const nextState = getDateButtonStyle(isoDate);
    button.dataset.selected = nextState.selected;
    button.style.cssText = nextState.styleText;
  }
}

function updateSelectionPanel() {
  if (getMonthsPerRow() === MONTHS_PER_ROW) {
    render();
    return;
  }

  const panel = app.querySelector("[data-selection-panel]");

  if (!(panel instanceof HTMLElement)) {
    return;
  }

  panel.innerHTML = buildSelectionPanel(getMonthsPerRow());
}

function updateSelectionUi() {
  updateSelectionPanel();
  updateVisibleDateButtons();
  updateLiveMetadataValues();
  saveSessionState();
}

function updateLiveMetadataValues() {
  const liveMetadataValues = app.querySelectorAll("[data-live-metadata]");

  for (const valueNode of liveMetadataValues) {
    if (!(valueNode instanceof HTMLElement)) {
      continue;
    }

    const selectionId = Number(valueNode.dataset.liveMetadata);
    const functionKey = valueNode.dataset.liveFunctionKey;
    const selection = selections[selectionId];

    if (!selection || !functionKey) {
      continue;
    }

    const definition = SELECTION_METADATA_FUNCTIONS_BY_KEY[functionKey];
    const context = deriveSelectionContext(selection);
    const args = getSelectionFunctionArgs(selection, functionKey);

    if (!definition || !context) {
      continue;
    }

    const nextValue = definition.evaluate(context, args);
    valueNode.textContent = nextValue === null ? "n/a" : String(nextValue);
  }
}

function render() {
  applyDocumentTheme();
  app.innerHTML = buildYearTable(displayYear);
  updateLiveMetadataValues();
  saveSessionState();

  if (isEditingYear) {
    const yearInput = app.querySelector("[data-year-editor='true']");

    if (yearInput instanceof HTMLInputElement) {
      yearInput.focus();
      yearInput.select();
      return;
    }
  }

  if (editingSelectionId !== null) {
    const input = app.querySelector(`[data-selection-editor="${editingSelectionId}"]`);

    if (input instanceof HTMLInputElement && shouldFocusSelectionEditor) {
      input.focus();
      input.select();
      return;
    }
  }

  if (editingNameSelectionId !== null) {
    const input = app.querySelector(`[data-selection-name="${editingNameSelectionId}"]`);

    if (input instanceof HTMLInputElement && shouldFocusSelectionNameEditor) {
      input.focus();
      input.select();
    }
  }
}

function normalizeSelections() {
  const removedSelections = selections.filter((selection, index) => index !== 0 && !selection.start && !selection.end);

  for (const selection of removedSelections) {
    releaseColorIndex(selection.colorIndex);
  }

  selections = selections.filter((selection, index) => index === 0 || selection.start || selection.end);

  if (selections.length === 0) {
    selections = [createSelection(0)];
  }

  relabelSelections();

  if (activeSelectionId >= selections.length) {
    activeSelectionId = selections.length - 1;
  }
}

app.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const settingsToggleTarget = target.closest("[data-settings-toggle]");
  const settingsPanelTarget = target.closest("[data-settings-panel]");
  const shouldCloseSettings = settingsOpen && !(settingsToggleTarget instanceof HTMLElement) && !(settingsPanelTarget instanceof HTMLElement);

  if (shouldCloseSettings) {
    settingsOpen = false;
  }

  if (settingsToggleTarget instanceof HTMLButtonElement) {
    settingsOpen = !settingsOpen;
    render();
    return;
  }

  if (settingsPanelTarget instanceof HTMLElement) {
    return;
  }

  const yearNavTarget = target.closest("[data-year-nav]");
  const direction = yearNavTarget instanceof HTMLElement ? yearNavTarget.dataset.yearNav : undefined;
  const yearEditTarget = target.closest("[data-edit-year]");
  const yearEditorTarget = target.closest("[data-year-editor]");
  const selectionToggleTarget = target.closest("[data-selection-toggle]");
  const currentYearTarget = target.closest("[data-jump-current-year]");

  if (direction === "prev") {
    displayYear -= 1;
    isEditingYear = false;
    render();
    return;
  }

  if (direction === "next") {
    displayYear += 1;
    isEditingYear = false;
    render();
    return;
  }

  if (yearEditTarget instanceof HTMLAnchorElement) {
    event.preventDefault();
    isEditingYear = true;
    editingSelectionId = null;
    shouldFocusSelectionEditor = false;
    render();
    return;
  }

  if (yearEditorTarget instanceof HTMLInputElement) {
    return;
  }

  if (selectionToggleTarget instanceof HTMLAnchorElement) {
    event.preventDefault();
    selectionsCollapsed = !selectionsCollapsed;
    editingSelectionId = null;
    isEditingYear = false;
    shouldFocusSelectionEditor = false;
    render();
    return;
  }

  if (currentYearTarget instanceof HTMLAnchorElement) {
    event.preventDefault();
    displayYear = CURRENT_YEAR;
    editingSelectionId = null;
    isEditingYear = false;
    shouldFocusSelectionEditor = false;
    render();
    return;
  }

  const selectionActionTarget = target.closest("[data-selection-action]");
  const selectionAction = selectionActionTarget instanceof HTMLElement ? selectionActionTarget.dataset.selectionAction : undefined;
  const selectionTarget = target.closest("[data-selection-id]");
  const selectedSlotId = selectionTarget instanceof HTMLElement ? selectionTarget.dataset.selectionId : undefined;
  const selectionEditorTarget = target.closest("[data-selection-editor]");
  const selectionNameTarget = target.closest("[data-selection-name]");
  const selectionNameLinkTarget = target.closest("[data-selection-name-link]");
  const selectionFunctionSelectTarget = target.closest("[data-selection-function-select]");
  const selectionFunctionArgTarget = target.closest("[data-selection-function-arg]");
  const selectionFunctionCopyTarget = target.closest("[data-selection-function-copy]");
  const selectionFunctionRemoveTarget = target.closest("[data-selection-function-remove]");
  const selectionMetadataTarget = target.closest("[data-selection-metadata]");

  if (selectionTarget instanceof HTMLAnchorElement) {
    event.preventDefault();
  }

  if (selectionEditorTarget instanceof HTMLInputElement) {
    return;
  }

  if (selectionNameTarget instanceof HTMLInputElement) {
    return;
  }

  if (selectionFunctionSelectTarget instanceof HTMLSelectElement) {
    return;
  }

  if (selectionFunctionArgTarget instanceof HTMLSelectElement) {
    return;
  }

  if (selectionFunctionCopyTarget instanceof HTMLButtonElement) {
    const selectionId = Number(selectionFunctionCopyTarget.dataset.selectionFunctionCopy);
    const functionKey = selectionFunctionCopyTarget.dataset.selectionFunctionKey;
    const selection = selections[selectionId];

    if (!selection || !functionKey) {
      return;
    }

    const definition = SELECTION_METADATA_FUNCTIONS_BY_KEY[functionKey];
    const context = deriveSelectionContext(selection);
    const args = getSelectionFunctionArgs(selection, functionKey);

    if (!definition || !context) {
      return;
    }

    void copyTextValue(serializeMetadataCopyText(functionKey, definition.evaluate(context, args)));
    return;
  }

  if (selectionFunctionRemoveTarget instanceof HTMLButtonElement) {
    const selectionId = Number(selectionFunctionRemoveTarget.dataset.selectionFunctionRemove);
    const functionKey = selectionFunctionRemoveTarget.dataset.selectionFunctionKey;

    if (!functionKey) {
      return;
    }

    activeSelectionId = selectionId;
    removeMetadataFunctionFromSelection(selectionId, functionKey);
    render();
    return;
  }

  if (selectionMetadataTarget instanceof HTMLElement) {
    return;
  }

  if (selectionNameLinkTarget instanceof HTMLAnchorElement) {
    event.preventDefault();

    const selectionId = Number(selectionNameLinkTarget.dataset.selectionNameLink);
    const selection = selections[selectionId];

    if (!selection) {
      return;
    }

    activeSelectionId = selectionId;
    editingSelectionId = null;
    editingNameSelectionId = selectionId;
    isEditingYear = false;
    shouldFocusSelectionEditor = false;
    shouldFocusSelectionNameEditor = true;
    render();
    return;
  }

  if (selectionAction && selectedSlotId !== undefined) {
    const selection = selections[Number(selectedSlotId)];

    if (!selection) {
      return;
    }

    activeSelectionId = selection.id;

    if (selectionAction === "done") {
      const nextIndex = selection.id + 1;

      if (!selections[nextIndex]) {
        getOrCreateNextSelection();
      }

      activeSelectionId = nextIndex;
      editingSelectionId = null;
      editingNameSelectionId = null;
      isEditingYear = false;
      shouldFocusSelectionEditor = false;
      shouldFocusSelectionNameEditor = false;
      render();
      return;
    }

    if (selectionAction === "edit") {
      activeSelectionId = selection.id;
      editingSelectionId = null;
      editingNameSelectionId = null;
      isEditingYear = false;
      shouldFocusSelectionEditor = false;
      shouldFocusSelectionNameEditor = false;

      if (selection.start) {
        displayYear = parseIsoDate(selection.start).getFullYear();
      }

      render();
      return;
    }

    if (selectionAction === "delete") {
      releaseColorIndex(selection.colorIndex);
      selections.splice(selection.id, 1);
      editingSelectionId = null;
      editingNameSelectionId = null;
      isEditingYear = false;
      shouldFocusSelectionEditor = false;
      shouldFocusSelectionNameEditor = false;
      normalizeSelections();
      render();
      return;
    }
  }

  if (selectedSlotId !== undefined) {
    activeSelectionId = Number(selectedSlotId);
    editingSelectionId = activeSelectionId;
    editingNameSelectionId = null;
    isEditingYear = false;
    shouldFocusSelectionEditor = true;
    shouldFocusSelectionNameEditor = false;

    if (selections[activeSelectionId] && selections[activeSelectionId].start) {
      displayYear = parseIsoDate(selections[activeSelectionId].start).getFullYear();
    }

    render();
    return;
  }

  const dateTarget = target.closest("[data-date]");
  const isoDate = dateTarget instanceof HTMLElement ? dateTarget.dataset.date : undefined;

  if (isoDate) {
    const shouldPatchOnly = !shouldCloseSettings && !isEditingYear && displayYear === parseIsoDate(isoDate).getFullYear();

    if (selectionsCollapsed) {
      selectionsCollapsed = false;
    }

    const selection = selections[activeSelectionId];
    const result = updateSelection(selection, isoDate);

    if (selection.start) {
      displayYear = parseIsoDate(selection.start).getFullYear();
    }

    if (result === "range") {
      const nextIndex = activeSelectionId + 1;

      if (!selections[nextIndex]) {
        getOrCreateNextSelection();
      }

      activeSelectionId = nextIndex;
      editingSelectionId = nextIndex;
      editingNameSelectionId = null;
      shouldFocusSelectionEditor = false;
      shouldFocusSelectionNameEditor = false;
    } else {
      editingSelectionId = null;
      editingNameSelectionId = null;
      shouldFocusSelectionEditor = false;
      shouldFocusSelectionNameEditor = false;
    }

    isEditingYear = false;

    if (shouldPatchOnly) {
      updateSelectionUi();
      return;
    }

    render();
  }
});

window.addEventListener("keydown", (event) => {
  const target = event.target;
  const isTypingTarget = target instanceof HTMLInputElement
    || target instanceof HTMLSelectElement
    || target instanceof HTMLTextAreaElement
    || (target instanceof HTMLElement && target.isContentEditable);

  if (event.key === "Escape" && settingsOpen && !isTypingTarget) {
    settingsOpen = false;
    render();
    return;
  }

  if (!isTypingTarget && !event.metaKey && !event.ctrlKey && !event.altKey) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      displayYear -= 1;
      isEditingYear = false;
      shouldFocusSelectionEditor = false;
      shouldFocusSelectionNameEditor = false;
      render();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      displayYear += 1;
      isEditingYear = false;
      shouldFocusSelectionEditor = false;
      shouldFocusSelectionNameEditor = false;
      render();
      return;
    }

    if (event.key === "/") {
      event.preventDefault();
      isEditingYear = true;
      editingSelectionId = null;
      editingNameSelectionId = null;
      shouldFocusSelectionEditor = false;
      shouldFocusSelectionNameEditor = false;
      render();
      return;
    }
  }

  if (target instanceof HTMLInputElement && target.dataset.yearEditor === "true") {
    if (event.key === "Escape") {
      isEditingYear = false;
      shouldFocusSelectionEditor = false;
      shouldFocusSelectionNameEditor = false;
      render();
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    const nextYear = Number.parseInt(target.value.trim(), 10);

    if (!Number.isInteger(nextYear)) {
      return;
    }

    displayYear = nextYear;
    isEditingYear = false;
    shouldFocusSelectionEditor = false;
    shouldFocusSelectionNameEditor = false;
    render();
    return;
  }

  if (target instanceof HTMLInputElement && target.dataset.selectionName !== undefined) {
    if (event.key === "Escape") {
      editingNameSelectionId = null;
      shouldFocusSelectionNameEditor = false;
      render();
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    commitSelectionName(Number(target.dataset.selectionName), target.value);
    render();
    return;
  }

  if (!(target instanceof HTMLInputElement) || target.dataset.selectionEditor === undefined) {
    return;
  }

  if (event.key === "Escape") {
    editingSelectionId = null;
    shouldFocusSelectionEditor = false;
    render();
    return;
  }

  if (event.key !== "Enter") {
    return;
  }

  const selectionId = Number(target.dataset.selectionEditor);
  const selection = selections[selectionId];

  if (!selection) {
    return;
  }

  if (!commitSelectionEditor(selectionId, target.value)) {
    return;
  }

  const nextIndex = selection.id + 1;

  if (!selections[nextIndex]) {
    getOrCreateNextSelection();
  }

  activeSelectionId = nextIndex;
  editingSelectionId = nextIndex;
  editingNameSelectionId = null;
  shouldFocusSelectionEditor = false;
  shouldFocusSelectionNameEditor = false;
  render();
});

app.addEventListener("blur", (event) => {
  const target = event.target;

  if (target instanceof HTMLInputElement && target.dataset.selectionEditor !== undefined) {
    const selectionId = Number(target.dataset.selectionEditor);

    commitSelectionEditor(selectionId, target.value);
    window.setTimeout(() => {
      render();
    }, 0);
    return;
  }

  if (!(target instanceof HTMLInputElement) || target.dataset.selectionName === undefined) {
    return;
  }

  commitSelectionName(Number(target.dataset.selectionName), target.value);
  window.setTimeout(() => {
    render();
  }, 0);
}, true);

app.addEventListener("input", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  if (target.dataset.selectionName !== undefined) {
    const selectionId = Number(target.dataset.selectionName);
    const selection = selections[selectionId];

    if (!selection) {
      return;
    }

    selection.name = target.value;
    return;
  }
});

app.addEventListener("change", (event) => {
  const target = event.target;

  if (target instanceof HTMLInputElement && target.dataset.themeOption !== undefined) {
    const nextThemeKey = target.dataset.themeOption;

    if (!THEMES[nextThemeKey]) {
      return;
    }

    activeThemeKey = nextThemeKey;
    settingsOpen = false;
    syncSelectionColors();
    rebuildAvailableColorIndices();
    render();
    return;
  }

  if (target instanceof HTMLSelectElement && target.dataset.selectionFunctionSelect !== undefined) {
    const selectionId = Number(target.dataset.selectionFunctionSelect);

    if (target.value && addMetadataFunctionToSelection(selectionId, target.value)) {
      render();
    }

    return;
  }

  if (target instanceof HTMLSelectElement && target.dataset.selectionFunctionArg !== undefined) {
    const selectionId = Number(target.dataset.selectionFunctionArg);
    const functionKey = target.dataset.selectionFunctionKey;
    const argKey = target.dataset.selectionFunctionArgKey;

    if (!functionKey || !argKey) {
      return;
    }

    updateSelectionFunctionArg(selectionId, functionKey, argKey, target.value);
    render();
    return;
  }
});

app.addEventListener("mouseover", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement) || !target.dataset.date || target.dataset.selected === "true") {
    return;
  }

  target.style.background = getCurrentTheme().hoverBackground;
});

app.addEventListener("mouseout", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement) || !target.dataset.date || target.dataset.selected === "true") {
    return;
  }

  const nextState = getDateButtonStyle(target.dataset.date);
  target.style.cssText = nextState.styleText;
});

loadSessionState();
render();
window.setInterval(() => {
  updateLiveMetadataValues();
}, MS_PER_SECOND);
