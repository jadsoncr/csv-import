import { TemplateColumn, UploadColumn } from "../../../types";
import { TemplateColumnMapping } from "../types";
export default function useMapColumnsTable(uploadColumns: UploadColumn[], templateColumns: TemplateColumn[] | undefined, columnsValues: {
    [uploadColumnIndex: number]: TemplateColumnMapping;
}, isLoading?: boolean): {
    rows: {
        [x: string]: {
            raw: string | boolean;
            content: string | import("react/jsx-runtime").JSX.Element;
        };
    }[];
    formValues: {
        [key: number]: TemplateColumnMapping;
    };
};
