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
const MS_PER_SECOND = 1000;
const MS_PER_MINUTE = 60 * MS_PER_SECOND;
const MS_PER_HOUR = 60 * MS_PER_MINUTE;
const MS_PER_DAY = 24 * MS_PER_HOUR;
const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();
const CURRENT_MONTH = TODAY.getMonth();
const CURRENT_DAY = TODAY.getDate();
const HIGHLIGHT_STYLE = "border: 1px solid #000; background: #fff9c4;";
const HOVER_STYLE = "background: #f3f3f3;";
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
const SELECTION_COLORS = [
  { color: "#dbeafe", border: "#2563eb" },
  { color: "#dcfce7", border: "#16a34a" },
  { color: "#fef3c7", border: "#d97706" },
  { color: "#fce7f3", border: "#db2777" },
  { color: "#e9d5ff", border: "#7c3aed" },
  { color: "#cffafe", border: "#0891b2" },
  { color: "#d1fae5", border: "#059669" },
  { color: "#fee2e2", border: "#dc2626" },
  { color: "#fef08a", border: "#ca8a04" },
  { color: "#dbe4ff", border: "#4338ca" }
];
const ONE_MONTH_MAX_WIDTH = 359;
const TWO_MONTH_MAX_WIDTH = 899;
const SELECTION_METADATA_FUNCTIONS = [
  {
    key: "daysSince",
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
    evaluate(context) {
      return context.durationDays;
    }
  },
  {
    key: "durationHours",
    evaluate(context) {
      return context.durationHours;
    }
  },
  {
    key: "durationMinutes",
    evaluate(context) {
      return context.durationMinutes;
    }
  },
  {
    key: "durationSeconds",
    evaluate(context) {
      return context.durationSeconds;
    }
  },
  {
    key: "durationWeeks",
    evaluate(context) {
      return Number(context.durationWeeks.toFixed(2));
    }
  },
  {
    key: "daysSinceStart",
    evaluate(context) {
      if (context.startDate > context.todayDate) {
        return null;
      }

      return getWholeDayDifference(context.todayDate, context.startDate);
    }
  },
  {
    key: "daysSinceEnd",
    evaluate(context) {
      if (context.endDate > context.todayDate) {
        return null;
      }

      return getWholeDayDifference(context.todayDate, context.endDate);
    }
  },
  {
    key: "daysUntilStart",
    evaluate(context) {
      if (context.startDate < context.todayDate) {
        return null;
      }

      return getWholeDayDifference(context.startDate, context.todayDate);
    }
  },
  {
    key: "daysUntilEnd",
    evaluate(context) {
      if (context.endDate < context.todayDate) {
        return null;
      }

      return getWholeDayDifference(context.endDate, context.todayDate);
    }
  },
  {
    key: "isPast",
    evaluate(context) {
      return context.isPast;
    }
  },
  {
    key: "isFuture",
    evaluate(context) {
      return context.isFuture;
    }
  },
  {
    key: "isActive",
    evaluate(context) {
      return context.isActive;
    }
  },
  {
    key: "containsToday",
    evaluate(context) {
      return context.containsToday;
    }
  },
  {
    key: "dayOfYearStart",
    evaluate(context) {
      return getDayOfYear(context.startDate);
    }
  },
  {
    key: "weekdayStart",
    evaluate(context) {
      return context.weekdayStart;
    }
  }
];
const SELECTION_METADATA_FUNCTIONS_BY_KEY = Object.fromEntries(
  SELECTION_METADATA_FUNCTIONS.map((definition) => [definition.key, definition])
);

let activeSelectionId = 0;
let displayYear = 2026;
let nextSelectionNumber = 2;
let editingSelectionId = null;
let editingNameSelectionId = null;
let isEditingYear = false;
let selectionsCollapsed = true;
let shouldFocusSelectionEditor = false;
let shouldFocusSelectionNameEditor = false;
let availableColorIndices = SELECTION_COLORS.map((_, index) => index).slice(1);
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
  const palette = SELECTION_COLORS[colorIndex];

  return {
    id,
    label: `Selection ${labelNumber}`,
    color: palette.color,
    border: palette.border,
    colorIndex,
    start: null,
    end: null,
    name: "",
    metadataFunctionKeys: [],
    metadataDraft: "",
    hiddenMetadataFunctionKeys: []
  };
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

function humanizeFunctionKey(functionKey) {
  return functionKey
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (letter) => letter.toUpperCase());
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
    <a href="#" data-selection-name-link="${selection.id}" aria-label="Name ${selection.label}">
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

function buildSelectionMetadata(selection) {
  const context = deriveSelectionContext(selection);

  if (!context) {
    return "";
  }

  const automaticKeys = getAutomaticMetadataFunctionKeys(context);
  const renderedKeys = new Set();
  const metadataLines = [];

  for (const functionKey of [...automaticKeys, ...selection.metadataFunctionKeys]) {
    if (renderedKeys.has(functionKey)) {
      continue;
    }

    renderedKeys.add(functionKey);

    const definition = SELECTION_METADATA_FUNCTIONS_BY_KEY[functionKey];

    if (!definition) {
      continue;
    }

    if (selection.hiddenMetadataFunctionKeys.includes(functionKey)) {
      continue;
    }

    const value = definition.evaluate(context);
    const valueText = value === null ? "n/a" : String(value);

    metadataLines.push(`
      <tr>
        <td>${escapeHtml(humanizeFunctionKey(definition.key))}</td>
        <td>${escapeHtml(valueText)}</td>
        <td align="right">
          <button type="button" data-selection-function-remove="${selection.id}" data-selection-function-key="${definition.key}" aria-label="Remove ${humanizeFunctionKey(definition.key)}">✕</button>
        </td>
      </tr>
    `);
  }

  return `
    <div style="border-top: 1px solid rgba(0, 0, 0, 0.2); margin-top: 6px; padding-top: 6px;">
      <table width="100%" cellpadding="3" cellspacing="0" border="0">
        <thead>
          <tr>
            <th align="left">Function</th>
            <th align="left">Value</th>
            <th align="right">Remove</th>
          </tr>
        </thead>
        <tbody>
          ${metadataLines.join("")}
          <tr>
            <td colspan="3" style="padding-top: 4px;">
              <input
                type="text"
                list="selection-function-options"
                data-selection-function-input="${selection.id}"
                value="${escapeHtml(selection.metadataDraft || "")}"
                placeholder="function"
                aria-label="Function for ${selection.label}"
              />
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
        <a href="#" data-selection-id="${selection.id}">
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

function buildSelectionFunctionOptions() {
  const options = SELECTION_METADATA_FUNCTIONS.map((definition) => {
    return `<option value="${humanizeFunctionKey(definition.key)}"></option>`;
  }).join("");

  return `<datalist id="selection-function-options">${options}</datalist>`;
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
      "border: 1px solid #000;",
      `background: ${selection.color};`,
      "padding: 4px 6px;",
      isActive ? `box-shadow: inset 0 0 0 2px ${selection.border};` : ""
    ].join(" ");

    rows.push(`
      <tr>
        <td colspan="${monthsPerRow}" style="padding-top: 6px;">
          <div data-selection-id="${selection.id}" style="${rowStyle} cursor: pointer;">
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
      "border: 1px solid #000;",
      `background: ${selection.color};`,
      "padding: 4px 6px;",
      isActive ? `box-shadow: inset 0 0 0 2px ${selection.border};` : ""
    ].join(" ");

    rows.push(`
      <tr>
        <td colspan="${monthsPerRow}" style="padding-top: 6px;">
          <div data-selection-id="${selection.id}" style="${rowStyle} cursor: pointer;">
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
            styles.push(`border-color: ${selection.border};`, `background: ${selection.color};`);
          } else if (isCurrentDay) {
            styles.push(HIGHLIGHT_STYLE);
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
  const monthStyle = isCurrentMonth ? ` style="${HIGHLIGHT_STYLE}"` : "";

  return `
    <table cellpadding="2" cellspacing="0" border="0"${monthStyle}>
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

  const headerContent = stackedHeader
    ? `
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <th align="left">
              <button type="button" data-year-nav="prev" aria-label="Previous year">&lt;</button>
              ${yearDisplay}
              <button type="button" data-year-nav="next" aria-label="Next year">&gt;</button>
            </th>
          </tr>
          <tr>
            <th align="left" style="padding-top: 6px;">
              <a href="#" data-jump-current-year="true">${metadataText}</a>
            </th>
          </tr>
        </table>
      `
    : `
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <th align="left">
              <button type="button" data-year-nav="prev" aria-label="Previous year">&lt;</button>
              ${yearDisplay}
              <button type="button" data-year-nav="next" aria-label="Next year">&gt;</button>
            </th>
            <th align="right">
              <a href="#" data-jump-current-year="true">${metadataText}</a>
            </th>
          </tr>
        </table>
      `;

  return `
    <table align="center" cellpadding="12" cellspacing="0" border="0"${useMobileLayout ? ` width="100%"` : ""} aria-label="${year} calendar">
      <thead>
        <tr>
          <th
            colspan="${monthsPerRow}"
            style="border-bottom: 1px solid #000; padding-bottom: 8px;"
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
    styles.push(`border-color: ${selection.border};`, `background: ${selection.color};`);
  } else if (isCurrentDay) {
    styles.push(HIGHLIGHT_STYLE);
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
}

function render() {
  app.innerHTML = `${buildYearTable(displayYear)}${buildSelectionFunctionOptions()}`;

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
  const selectionFunctionInputTarget = target.closest("[data-selection-function-input]");
  const selectionFunctionRemoveTarget = target.closest("[data-selection-function-remove]");

  if (selectionTarget instanceof HTMLAnchorElement) {
    event.preventDefault();
  }

  if (selectionEditorTarget instanceof HTMLInputElement) {
    return;
  }

  if (selectionNameTarget instanceof HTMLInputElement) {
    return;
  }

  if (selectionFunctionInputTarget instanceof HTMLInputElement) {
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
    const shouldPatchOnly = !isEditingYear && displayYear === parseIsoDate(isoDate).getFullYear();

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

app.addEventListener("keydown", (event) => {
  const target = event.target;

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

  if (target instanceof HTMLInputElement && target.dataset.selectionFunctionInput !== undefined) {
    if (event.key === "Escape") {
      const selection = selections[Number(target.dataset.selectionFunctionInput)];

      if (selection) {
        selection.metadataDraft = "";
      }

      render();
      return;
    }

    if (event.key !== "Enter") {
      return;
    }

    if (addMetadataFunctionToSelection(Number(target.dataset.selectionFunctionInput), target.value)) {
      render();
    }

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

  if (target.dataset.selectionFunctionInput === undefined) {
    return;
  }

  const selectionId = Number(target.dataset.selectionFunctionInput);
  const selection = selections[selectionId];

  if (!selection) {
    return;
  }

  selection.metadataDraft = target.value;
});

app.addEventListener("change", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement) || target.dataset.selectionFunctionInput === undefined) {
    return;
  }

  if (addMetadataFunctionToSelection(Number(target.dataset.selectionFunctionInput), target.value)) {
    render();
  }
});

app.addEventListener("mouseover", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement) || !target.dataset.date || target.dataset.selected === "true") {
    return;
  }

  target.style.cssText += HOVER_STYLE;
});

app.addEventListener("mouseout", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement) || !target.dataset.date || target.dataset.selected === "true") {
    return;
  }

  target.style.background = "transparent";
});

render();
