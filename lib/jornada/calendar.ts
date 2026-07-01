export function getBrazilDateKey(date: Date = new Date()): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Failed to format Brazil date");
  }

  return `${year}-${month}-${day}`;
}

export function isWeekendBrazil(dateKey: string): boolean {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = date.getDay();

  return dayOfWeek === 0 || dayOfWeek === 6;
}

export function getEasterDate(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;

  return new Date(year, month - 1, day);
}

export function getBrazilNationalHolidays(year: number): string[] {
  const holidays: string[] = [];

  holidays.push(`${year}-01-01`);

  const easter = getEasterDate(year);
  const easterDateKey = formatDateKey(easter);

  const ashWednesday = new Date(easter);
  ashWednesday.setDate(ashWednesday.getDate() - 46);

  const carnivalTuesday = new Date(ashWednesday);
  carnivalTuesday.setDate(carnivalTuesday.getDate() - 1);

  const goodFriday = new Date(easter);
  goodFriday.setDate(goodFriday.getDate() - 2);

  const corpusChristi = new Date(easter);
  corpusChristi.setDate(corpusChristi.getDate() + 60);

  holidays.push(formatDateKey(carnivalTuesday));
  holidays.push(formatDateKey(goodFriday));
  holidays.push(formatDateKey(corpusChristi));

  holidays.push(`${year}-04-21`);
  holidays.push(`${year}-05-01`);
  holidays.push(`${year}-09-07`);
  holidays.push(`${year}-10-12`);
  holidays.push(`${year}-11-02`);
  holidays.push(`${year}-11-15`);
  holidays.push(`${year}-12-25`);

  return holidays;
}

export function isBrazilHoliday(dateKey: string): boolean {
  const [year] = dateKey.split("-").map(Number);
  const holidays = getBrazilNationalHolidays(year);
  return holidays.includes(dateKey);
}

export function isValidTrainingDay(dateKey: string): boolean {
  if (isWeekendBrazil(dateKey)) return false;
  if (isBrazilHoliday(dateKey)) return false;
  return true;
}

export function getNextValidTrainingDate(dateKey: string): string {
  const [year, month, day] = dateKey.split("-").map(Number);
  let currentDate = new Date(year, month - 1, day + 1);

  while (!isValidTrainingDay(formatDateKey(currentDate))) {
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return formatDateKey(currentDate);
}

export function getAccessDaysRemaining(endDate: string | Date): number {
  const todayKey = getBrazilDateKey();
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const endKey = getBrazilDateKey(end);

  if (todayKey >= endKey) return 0;

  const [todayYear, todayMonth, todayDay] = todayKey.split("-").map(Number);
  const [endYear, endMonth, endDay] = endKey.split("-").map(Number);

  const todayDate = new Date(todayYear, todayMonth - 1, todayDay);
  const endDateOnly = new Date(endYear, endMonth - 1, endDay);

  const diffTime = endDateOnly.getTime() - todayDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const remaining = diffDays - 1;

  return remaining > 0 ? remaining : 0;
}

export function countValidTrainingDaysUntil(endDate: string | Date): number {
  const todayKey = getBrazilDateKey();
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;
  const endKey = getBrazilDateKey(end);

  if (todayKey >= endKey) return 0;

  let count = 0;
  let currentKey = getNextValidTrainingDate(todayKey);

  while (currentKey < endKey) {
    count++;
    currentKey = getNextValidTrainingDate(currentKey);
  }

  return count;
}

function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
