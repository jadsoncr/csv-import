import React, { useMemo } from "react";
import { PDV_TEMPLATE, NF_TEMPLATE, FICHA_TECNICA_TEMPLATE } from "./templates";
import ImporterComponent from "../components/CSVImporter";

export type BroAIType = "PDV" | "NF" | "FICHA_TECNICA";

type Props = {
  type: BroAIType;
  language?: "pt-BR" | "en-US"; // ajuste se tiver mais
  darkMode?: boolean;
  isModal?: boolean;
  onComplete?: (payload: any) => void;

  modalIsOpen?: boolean;
  modalOnCloseTriggered?: () => void;
};

export default function BroAIImporter({
  type,
  language = "pt-BR",
  darkMode = false,
  isModal = true,
  onComplete,
  modalIsOpen,
  modalOnCloseTriggered,
}: Props) {
  const template = useMemo(() => {
    switch (type) {
      case "PDV":
        return PDV_TEMPLATE;
      case "NF":
        return NF_TEMPLATE;
      case "FICHA_TECNICA":
      default:
        return FICHA_TECNICA_TEMPLATE;
    }
  }, [type]);

  return (
    <ImporterComponent
      template={template}
      language={language}
      darkMode={darkMode}
      isModal={isModal}
      onComplete={onComplete}
      modalIsOpen={modalIsOpen}
      modalOnCloseTriggered={modalOnCloseTriggered}
    />
  );
}
