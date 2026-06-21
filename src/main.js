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

let activeSelectionId = 0;
let displayYear = 2026;
let nextSelectionNumber = 2;
let editingSelectionId = null;
let isEditingYear = false;
let selectionsCollapsed = true;
let availableColorIndices = SELECTION_COLORS.map((_, index) => index).slice(1);
let selections = [createSelection(0)];

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

function createSelection(id, labelNumber = id + 1, colorIndex = takeColorIndex(id === 0 ? 0 : undefined)) {
  const palette = SELECTION_COLORS[colorIndex];

  return {
    id,
    label: `Selection ${labelNumber}`,
    color: palette.color,
    border: palette.border,
    colorIndex,
    start: null,
    end: null
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
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor((endDate - startDate) / msPerDay) + 1;
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
  const daySpan = getDaySpan(startDate, endDate);

  return `${startText}-${endText} (${daySpan})`;
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

function buildSelectionRows() {
  const rows = [];
  const toggleLabel = selectionsCollapsed ? "▸" : "▾";
  const headerRow = `
    <tr>
      <td colspan="${MONTHS_PER_ROW}" style="padding-top: 6px;">
        <a href="#" data-selection-toggle="true">${toggleLabel} Selections</a>
      </td>
    </tr>
  `;

  if (selectionsCollapsed) {
    return headerRow;
  }

  for (const selection of selections) {
    const isActive = selection.id === activeSelectionId;
    const isEditing = selection.id === editingSelectionId;
    const value = formatSelectionValue(selection);
    const isRangeSelection = Boolean(selection.start && selection.end && selection.start !== selection.end);
    const primaryAction = isRangeSelection ? "edit" : "done";
    const primaryIcon = isRangeSelection ? "✎" : "✓";
    const rowStyle = [
      "width: 100%;",
      "border: 1px solid #000;",
      `background: ${selection.color};`,
      "padding: 4px 6px;",
      isActive ? `box-shadow: inset 0 0 0 2px ${selection.border};` : ""
    ].join(" ");
    const actions = selection.start
      ? `
          <td align="right">
            <button type="button" data-selection-action="${primaryAction}" data-selection-id="${selection.id}" aria-label="${primaryAction === "edit" ? `Edit ${selection.label}` : `Done with ${selection.label}`}">${primaryIcon}</button>
            <button type="button" data-selection-action="delete" data-selection-id="${selection.id}" aria-label="Delete ${selection.label}">✕</button>
          </td>
        `
      : "<td></td>"
    ;
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
        `
    ;
    const content = `
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td>
            ${selectionTrigger}
          </td>
          ${actions}
        </tr>
      </table>
    `;

    rows.push(`
      <tr>
        <td colspan="${MONTHS_PER_ROW}" style="padding-top: 6px;">
          <div data-selection-id="${selection.id}" style="${rowStyle} cursor: pointer;">
            ${content}
          </div>
        </td>
      </tr>
    `);
  }

  return headerRow + rows.join("");
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

  for (let i = 0; i < monthCells.length; i += MONTHS_PER_ROW) {
    monthRows.push(`<tr>${monthCells.slice(i, i + MONTHS_PER_ROW).join("")}</tr>`);
  }

  return `
    <table align="center" cellpadding="12" cellspacing="0" border="0" aria-label="2026 calendar">
      <thead>
        <tr>
          <th
            colspan="${MONTHS_PER_ROW}"
            style="border-bottom: 1px solid #000; padding-bottom: 8px;"
          >
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
          </th>
        </tr>
        ${buildSelectionRows()}
      </thead>
      <tbody>${monthRows.join("")}</tbody>
    </table>
  `;
}

function render() {
  app.innerHTML = buildYearTable(displayYear);

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

    if (input instanceof HTMLInputElement) {
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
    render();
    return;
  }

  if (currentYearTarget instanceof HTMLAnchorElement) {
    event.preventDefault();
    displayYear = CURRENT_YEAR;
    editingSelectionId = null;
    isEditingYear = false;
    render();
    return;
  }

  const selectionActionTarget = target.closest("[data-selection-action]");
  const selectionAction = selectionActionTarget instanceof HTMLElement ? selectionActionTarget.dataset.selectionAction : undefined;
  const selectionTarget = target.closest("[data-selection-id]");
  const selectedSlotId = selectionTarget instanceof HTMLElement ? selectionTarget.dataset.selectionId : undefined;
  const selectionEditorTarget = target.closest("[data-selection-editor]");

  if (selectionTarget instanceof HTMLAnchorElement) {
    event.preventDefault();
  }

  if (selectionEditorTarget instanceof HTMLInputElement) {
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
      isEditingYear = false;
      render();
      return;
    }

    if (selectionAction === "edit") {
      activeSelectionId = selection.id;
      editingSelectionId = null;
      isEditingYear = false;

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
      isEditingYear = false;
      normalizeSelections();
      render();
      return;
    }
  }

  if (selectedSlotId !== undefined) {
    activeSelectionId = Number(selectedSlotId);
    editingSelectionId = activeSelectionId;
    isEditingYear = false;

    if (selections[activeSelectionId] && selections[activeSelectionId].start) {
      displayYear = parseIsoDate(selections[activeSelectionId].start).getFullYear();
    }

    render();
    return;
  }

  const dateTarget = target.closest("[data-date]");
  const isoDate = dateTarget instanceof HTMLElement ? dateTarget.dataset.date : undefined;

  if (isoDate) {
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
    } else {
      editingSelectionId = null;
    }

    isEditingYear = false;

    render();
  }
});

app.addEventListener("keydown", (event) => {
  const target = event.target;

  if (target instanceof HTMLInputElement && target.dataset.yearEditor === "true") {
    if (event.key === "Escape") {
      isEditingYear = false;
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
    render();
    return;
  }

  if (!(target instanceof HTMLInputElement) || target.dataset.selectionEditor === undefined) {
    return;
  }

  if (event.key === "Escape") {
    editingSelectionId = null;
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

  const parsedSelection = parseSelectionInput(target.value);

  if (!parsedSelection) {
    return;
  }

  selection.start = parsedSelection.start;
  selection.end = parsedSelection.end;
  displayYear = parseIsoDate(selection.start).getFullYear();

  const nextIndex = selection.id + 1;

  if (!selections[nextIndex]) {
    getOrCreateNextSelection();
  }

  activeSelectionId = nextIndex;
  editingSelectionId = nextIndex;
  render();
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
