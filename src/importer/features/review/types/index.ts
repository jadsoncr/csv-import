import { Template } from "../../../types";

export type MappedRow = {
  index: number;
  values: Record<string, number | string>;
};

export type ReviewAndFixProps = {
  template: Template;
  rows: MappedRow[];
  columns: Array<{ key: string; name: string }>;
  setRows: (rows: MappedRow[]) => void;
  onBack: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
};

