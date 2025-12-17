import { TemplateColumn } from "../../../types";
export default function useTemplateTable(fields?: TemplateColumn[]): {
    [x: string]: string | {
        raw: string;
        content: import("react/jsx-runtime").JSX.Element;
    } | {
        raw: number;
        content: import("react/jsx-runtime").JSX.Element;
    };
}[];
