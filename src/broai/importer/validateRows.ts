import type { BroAIColumn } from "../templates";

export type CellError = { message: string };
export type RowErrors = Record<string, CellError>; // key -> erro
export type ErrorsByRow = Record<number, RowErrors>;

function isEmpty(v: any) {
  return v === null || v === undefined || (typeof v === "string" && v.trim() === "");
}

export function toNumberOrNull(v: any) {
  if (v === null || v === undefined) return null;
  const s = String(v).replace(",", ".").trim();
  if (!s) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

const UNIT_ALLOWED = new Set(["g", "kg", "ml", "l", "un", "und"]);

export function validateRows(columns: BroAIColumn[], rows: Record<string, any>[]) {
  const errors: ErrorsByRow = {};

  rows.forEach((row, idx) => {
    const rowErrs: RowErrors = {};

    for (const col of columns) {
      const v = row[col.key];

      // required
      if (col.required && isEmpty(v)) {
        rowErrs[col.key] = { message: "Obrigatório" };
        continue;
      }

      // numeric-ish keys (ajuste conforme seu produto)
      if (["quantidade", "valor_total", "custo_total", "rendimento"].includes(col.key) && !isEmpty(v)) {
        const n = toNumberOrNull(v);
        if (n === null) rowErrs[col.key] = { message: "Número inválido" };
      }

      // unidade (soft rule: valida só se preenchida)
      if (col.key === "unidade" && !isEmpty(v)) {
        const u = String(v).trim().toLowerCase();
        if (!UNIT_ALLOWED.has(u)) rowErrs[col.key] = { message: "Unidade fora do padrão (g, kg, ml, l, un)" };
      }
    }

    if (Object.keys(rowErrs).length) errors[idx] = rowErrs;
  });

  const invalidCount = Object.keys(errors).length;
  return { errors, invalidCount, isValid: invalidCount === 0 };
}
