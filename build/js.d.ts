/// <reference types="react" />
import { CSVImporterProps } from "./types";
type CreateImporterProps = CSVImporterProps & {
    domElement?: Element;
};
export declare function createCSVImporter(props: CreateImporterProps): {
    instance: (import("react").ForwardRefExoticComponent<import("react").HTMLAttributes<HTMLDialogElement> & import("react").HTMLAttributes<HTMLDivElement> & {
        template?: string | Record<string, unknown> | undefined;
        darkMode?: boolean | undefined;
        primaryColor?: string | undefined;
        className?: string | undefined;
        onComplete?: ((data: any) => void) | undefined;
        waitOnComplete?: boolean | undefined;
        customStyles?: string | Record<string, string> | undefined;
        showDownloadTemplateButton?: boolean | undefined;
        skipHeaderRowSelection?: boolean | undefined;
        language?: string | undefined;
        customTranslations?: import("i18next").Resource | undefined;
    } & {
        isModal?: boolean | undefined;
        modalIsOpen?: boolean | undefined;
        modalOnCloseTriggered?: (() => void) | undefined;
        modalCloseOnOutsideClick?: boolean | undefined;
    } & import("react").RefAttributes<unknown>> & HTMLDialogElement) | null;
    showModal: () => void;
    closeModal: () => void;
};
export {};
