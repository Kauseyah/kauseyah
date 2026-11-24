/**
 * Pure utility functions for the Kauseyah Craft Journal & Newsletter.
 * Kept isolated from "use server" actions to comply with Next.js App Router rules
 * requiring all exports in "use server" modules to be async.
 */

/**
 * Validates subscriber submission payload against bot honeypots, timing thresholds,
 * affirmative consent, and RFC 5322 email syntax rules.
 */
export function validateNewsletterSubscriptionInput(payload: {
  email: string;
  firstName?: string;
  consent: boolean;
  honeypot?: string;
  loadTime?: number;
}): { valid: boolean; error?: string; normalizedEmail?: string; cleanFirstName?: string; isBot?: boolean } {
  const { email, firstName, consent, honeypot, loadTime } = payload;

  if (honeypot && honeypot.trim().length > 0) {
    return { valid: false, isBot: true };
  }

  if (loadTime && Date.now() - loadTime < 700) {
    return { valid: false, isBot: true };
  }

  if (!consent) {
    return { valid: false, error: "Please agree to receive updates to subscribe to the Journal." };
  }

  const normalizedEmail = (email || "").trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (
    !normalizedEmail ||
    !emailRegex.test(normalizedEmail) ||
    normalizedEmail.includes("..") ||
    normalizedEmail.endsWith(".") ||
    normalizedEmail.length > 254
  ) {
    return { valid: false, error: "Please enter a valid email address." };
  }

  const cleanFirstName = firstName ? firstName.trim().slice(0, 100) : "";
  return { valid: true, normalizedEmail, cleanFirstName };
}

/**
 * Escapes cell values for CSV export and shields against Spreadsheet Formula Injection (CWE-1236).
 */
export function escapeForCsvExport(value?: string | number | boolean | null): string {
  if (value === null || value === undefined) return '""';
  let str = String(value);
  // Shield against Formula Injection: if value begins with =, +, -, @, \t, \r, prepend single quote
  if (/^[=\+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }
  return `"${str.replace(/"/g, '""')}"`;
}

/**
 * Robust RFC 4180 compliant CSV parser supporting multiline quoted fields,
 * commas inside quotes, escaped double quotes (""), and varied line breaks.
 */
export function parseCsvRfc4180(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        currentField += char;
        i++;
        continue;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
        i++;
        continue;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = "";
        i++;
        continue;
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField.trim());
        currentField = "";
        if (currentRow.some((c) => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        i++;
        continue;
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        currentField = "";
        if (currentRow.some((c) => c.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        i++;
        continue;
      } else {
        currentField += char;
        i++;
        continue;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((c) => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}
