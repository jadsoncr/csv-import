import { AsMap, TooltipProps } from "./types";
export default function Tooltip<T extends keyof AsMap>({ as, className, title, children, icon, ...props }: TooltipProps<T>): import("react/jsx-runtime").JSX.Element;
