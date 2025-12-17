export declare const StepEnum: {
    Upload: number;
    RowSelection: number;
    MapColumns: number;
    Complete: number;
};
declare function useStepNavigation(initialStep: number, skipHeader: boolean): {
    currentStep: any;
    setStep: (newStep: number) => void;
    goBack: (backStep?: number) => void;
    goNext: (nextStep?: number) => void;
    stepper: import("../../../components/Stepper/types").StepperProps;
    stepId: string | number | undefined;
    setStorageStep: any;
};
export default useStepNavigation;
