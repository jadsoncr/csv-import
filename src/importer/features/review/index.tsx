import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@chakra-ui/button";
import { IconButton } from "@chakra-ui/button";
import Input from "../../components/Input";
import Errors from "../../components/Errors";
import { Template } from "../../types";
import { ReviewAndFixProps, MappedRow } from "./types";
import style from "./style/Review.module.scss";
import { PiTrash, PiPlus } from "react-icons/pi";

export default function ReviewAndFix({
  template,
  rows,
  columns,
  setRows,
  onBack,
  onConfirm,
  isSubmitting,
}: ReviewAndFixProps) {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  // Validação: verifica se campos required não estão vazios
  const isValid = useMemo(() => {
    const requiredKeys = template.columns.filter((col) => col.required).map((col) => col.key);
    if (requiredKeys.length === 0) return true;

    return rows.every((row) => {
      return requiredKeys.every((key) => {
        const value = row.values[key];
        return value != null && String(value).trim() !== "";
      });
    });
  }, [rows, template.columns]);

  const handleCellChange = (rowIndex: number, columnKey: string, value: string) => {
    const newRows = [...rows];
    newRows[rowIndex] = {
      ...newRows[rowIndex],
      values: {
        ...newRows[rowIndex].values,
        [columnKey]: value,
      },
    };
    setRows(newRows);
    setError(null);
  };

  const handleAddRow = () => {
    const newRow: MappedRow = {
      index: rows.length,
      values: {},
    };
    // Inicializa valores vazios para todas as colunas
    columns.forEach((col) => {
      newRow.values[col.key] = "";
    });
    setRows([...rows, newRow]);
  };

  const handleRemoveRow = (rowIndex: number) => {
    const newRows = rows.filter((_, index) => index !== rowIndex);
    // Reindexa as linhas
    const reindexedRows = newRows.map((row, index) => ({
      ...row,
      index,
    }));
    setRows(reindexedRows);
  };

  const handleConfirm = () => {
    if (!isValid) {
      setError(t("Please fill all required fields"));
      return;
    }
    onConfirm();
  };

  if (rows.length === 0) {
    return null;
  }

  return (
    <div className={style.content}>
      <div className={style.tableWrapper}>
        <div className={style.table}>
          <div className={style.thead}>
            <div className={style.tr}>
              <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns.length}, minmax(150px, 1fr))`, gap: "var(--m-xs)" }}>
                {columns.map((col) => {
                  const templateCol = template.columns.find((tc) => tc.key === col.key);
                  const isRequired = templateCol?.required || false;
                  return (
                    <div key={col.key} className={style.th}>
                      {col.name}
                      {isRequired && <span className={style.required}>*</span>}
                    </div>
                  );
                })}
              </div>
              <div className={style.th} style={{ width: "60px" }}></div>
            </div>
          </div>
          <div className={style.tbody}>
            {rows.map((row, rowIndex) => (
              <div key={row.index} className={style.tr}>
                <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns.length}, minmax(150px, 1fr))`, gap: "var(--m-xs)" }}>
                  {columns.map((col) => {
                    const templateCol = template.columns.find((tc) => tc.key === col.key);
                    const isRequired = templateCol?.required || false;
                    const value = String(row.values[col.key] || "");
                    const hasError = isRequired && !value.trim();

                    return (
                      <div key={col.key} className={style.td}>
                        <Input
                          value={value}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleCellChange(rowIndex, col.key, e.target.value)}
                          error={hasError ? t("Required") : undefined}
                          className={style.input}
                          variants={["small"]}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className={style.td}>
                  <IconButton
                    aria-label={t("Remove row")}
                    icon={<PiTrash />}
                    onClick={() => handleRemoveRow(rowIndex)}
                    size="sm"
                    colorScheme="secondary"
                    variant="ghost"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={style.actions}>
        <Button type="button" colorScheme="secondary" onClick={onBack} isDisabled={isSubmitting}>
          {t("Back")}
        </Button>
        <div className={style.actionsRight}>
          <Button
            type="button"
            colorScheme="secondary"
            onClick={handleAddRow}
            isDisabled={isSubmitting}
            leftIcon={<PiPlus />}
            variant="outline">
            {t("Add Row")}
          </Button>
          {!!error && (
            <div className={style.errorContainer}>
              <Errors error={error} />
            </div>
          )}
          <Button colorScheme="primary" isLoading={isSubmitting} onClick={handleConfirm} isDisabled={!isValid}>
            {t("Confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
}

