import React, { useMemo } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import type { BroAIColumn } from "../templates";
import { validateRows } from "./validateRows";

type Row = Record<string, any>;

type Props = {
  columns: BroAIColumn[];
  rows: Row[];
  onChangeRows: (next: Row[]) => void;
};

function defaultRow(columns: BroAIColumn[]): Row {
  const row: Row = {};
  for (const c of columns) row[c.key] = "";
  return row;
}

export function RepairTable({ columns, rows, onChangeRows }: Props) {
  const { errors, invalidCount, isValid } = useMemo(
    () => validateRows(columns, rows),
    [columns, rows]
  );

  const setCell = (rowIdx: number, key: string, value: any) => {
    const next = rows.map((r, i) => (i === rowIdx ? { ...r, [key]: value } : r));
    onChangeRows(next);
  };

  const addRow = () => onChangeRows([...rows, defaultRow(columns)]);
  const removeRow = (idx: number) => onChangeRows(rows.filter((_, i) => i !== idx));

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={3} gap={3} wrap="wrap">
        <Flex align="center" gap={2}>
          <Text fontWeight="600">Revisar & Corrigir</Text>
          {isValid ? (
            <Badge colorScheme="green">Tudo certo</Badge>
          ) : (
            <Badge colorScheme="red">{invalidCount} linha(s) com erro</Badge>
          )}
        </Flex>

        <Button leftIcon={<AddIcon />} onClick={addRow}>
          Adicionar linha
        </Button>
      </Flex>

      <Box borderWidth="1px" borderRadius="lg" overflow="auto">
        <Table size="sm">
          <Thead position="sticky" top={0} bg="white" zIndex={1}>
            <Tr>
              <Th>#</Th>
              {columns.map((c) => (
                <Th key={c.key}>
                  {c.name} {c.required ? <Text as="span" color="red.500">*</Text> : null}
                </Th>
              ))}
              <Th />
            </Tr>
          </Thead>

          <Tbody>
            {rows.map((row, idx) => {
              const rowErrs = errors[idx] || {};
              const rowHasError = Object.keys(rowErrs).length > 0;

              return (
                <Tr key={idx} bg={rowHasError ? "red.50" : undefined}>
                  <Td>
                    <Text fontSize="sm" color={rowHasError ? "red.700" : "gray.600"}>
                      {idx + 1}
                    </Text>
                  </Td>

                  {columns.map((c) => {
                    const cellErr = rowErrs[c.key]?.message;
                    return (
                      <Td key={c.key} minW="220px">
                        <Tooltip
                          label={cellErr || ""}
                          isDisabled={!cellErr}
                          placement="top"
                          hasArrow
                        >
                          <Input
                            value={row[c.key] ?? ""}
                            onChange={(e) => setCell(idx, c.key, e.target.value)}
                            size="sm"
                            borderColor={cellErr ? "red.400" : undefined}
                            focusBorderColor={cellErr ? "red.500" : "blue.400"}
                            placeholder={c.name}
                          />
                        </Tooltip>
                        {cellErr ? (
                          <Text mt={1} fontSize="xs" color="red.600">
                            {cellErr}
                          </Text>
                        ) : null}
                      </Td>
                    );
                  })}

                  <Td>
                    <IconButton
                      aria-label="Remover"
                      icon={<DeleteIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => removeRow(idx)}
                    />
                  </Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
