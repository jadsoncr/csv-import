declare const useTransformValue: (initialValue: string) => {
    transformedValue: string;
    transformValue: (value: string) => void;
};
export default useTransformValue;
