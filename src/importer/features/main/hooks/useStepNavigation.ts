import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useStepper from "../../../components/Stepper/hooks/useStepper";
import { Steps } from "../types";
import useMutableLocalStorage from "./useMutableLocalStorage";

// ✅ Steps com IDs (mantém o que funciona)
export const StepEnum = {
  Upload: "Upload",
  RowSelection: "RowSelection",
  MapColumns: "MapColumns",
  Review: "Review",
  Complete: "Complete",
} as const;

type StepNumber = (typeof StepEnum)[keyof typeof StepEnum];

const calculateNextStep = (nextStep: string, skipHeader: boolean): string => {
  // Se pulou seleção de header, RowSelection é bypass
  if (skipHeader) {
    switch (nextStep) {
      case StepEnum.Upload:
      case StepEnum.RowSelection:
        return StepEnum.MapColumns;

      case StepEnum.MapColumns:
        return StepEnum.Review;

      case StepEnum.Review:
        return StepEnum.Complete;

      default:
        return nextStep;
    }
  }

  // fluxo normal (sem skipHeader)
  switch (nextStep) {
    case StepEnum.MapColumns:
      return StepEnum.Review;

    case StepEnum.Review:
      return StepEnum.Complete;

    default:
      return nextStep;
  }
};

const getStepConfig = (skipHeader: boolean) => {
  // ✅ mantém labels existentes e adiciona Review/Complete
  return [
    { label: "Upload", id: StepEnum.Upload },
    { label: "Select Header", id: StepEnum.RowSelection, disabled: skipHeader },
    { label: "Map Columns", id: StepEnum.MapColumns },
    { label: "Review", id: StepEnum.Review },       // ✅ novo step 4
    { label: "Complete", id: StepEnum.Complete },   // ✅ mantém consistência do Stepper
  ];
};

function useStepNavigation(initialStep: string, skipHeader: boolean) {
  const [t] = useTranslation();

  // labels traduzidas (sem mudar comportamento)
  const translatedSteps = getStepConfig(skipHeader).map((step) => ({
    ...step,
    label: t(step.label),
  }));

  // Encontra o índice inicial baseado no ID do step
  const initialStepIndex = translatedSteps.findIndex((s) => s.id === initialStep);
  const stepper = useStepper(translatedSteps, initialStepIndex >= 0 ? initialStepIndex : 0, skipHeader);

  // ✅ mantém sua storage (não mexi no key)
  const [storageStep, setStorageStep] = useMutableLocalStorage(`tf_steps`, "");

  const [currentStep, setCurrentStep] = useState<string>(initialStep);

  const goBack = (backStep?: string) => {
    if (backStep) {
      setStep(backStep);
      return;
    }
    const currentIndex = translatedSteps.findIndex((s) => s.id === currentStep);
    if (currentIndex > 0) {
      const prevStep = translatedSteps[currentIndex - 1];
      if (prevStep && !prevStep.disabled) {
        setStep(prevStep.id as string);
      } else if (currentIndex > 1) {
        const prevPrevStep = translatedSteps[currentIndex - 2];
        if (prevPrevStep) setStep(prevPrevStep.id as string);
      }
    }
  };

  const goNext = (nextStep?: string) => {
    if (nextStep) {
      const calculatedStep = calculateNextStep(nextStep as StepNumber, skipHeader);
      setStep(calculatedStep);
      return;
    }
    const currentIndex = translatedSteps.findIndex((s) => s.id === currentStep);
    if (currentIndex < translatedSteps.length - 1) {
      const nextStepId = translatedSteps[currentIndex + 1]?.id as string;
      if (nextStepId) {
        const calculatedStep = calculateNextStep(nextStepId as StepNumber, skipHeader);
        setStep(calculatedStep);
      }
    }
  };

  const setStep = (newStep: string) => {
    setCurrentStep(newStep);
    setStorageStep(newStep);
    const stepIndex = translatedSteps.findIndex((s) => s.id === newStep);
    if (stepIndex >= 0) {
      stepper.setCurrent(stepIndex);
    }
  };

  useEffect(() => {
    // storageStep pode vir como string
    const safeStep = typeof storageStep === "string" && storageStep !== "" ? storageStep : currentStep;

    const stepIndex = translatedSteps.findIndex((s) => s.id === safeStep);
    if (stepIndex >= 0) {
      stepper.setCurrent(stepIndex);
      setCurrentStep(safeStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageStep]);

  return {
    currentStep: typeof storageStep === "string" && storageStep !== "" ? storageStep : currentStep,
    setStep,
    goBack,
    goNext,
    stepper,
    stepId: stepper?.step?.id,
    setStorageStep,
  };
}

export default useStepNavigation;
