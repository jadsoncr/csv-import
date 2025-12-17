import { InputOption } from "../../../components/Input/types";
type DropdownFieldsProps = {
    options: {
        [key: string]: InputOption;
    };
    value: string;
    placeholder: string;
    onChange: (value: string) => void;
    selectedValues: {
        key: string;
        selected: boolean | undefined;
    }[];
    updateSelectedValues: (updatedValues: {
        key: string;
        selected: boolean | undefined;
    }[]) => void;
};
export default function DropdownFields({ options, value, placeholder, onChange, selectedValues, updateSelectedValues }: DropdownFieldsProps): import("react/jsx-runtime").JSX.Element;
export {};
