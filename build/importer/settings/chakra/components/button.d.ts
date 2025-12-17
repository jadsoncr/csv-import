declare const Button: {
    baseStyle?: {
        fontWeight: string;
        borderRadius: string;
        height: string;
        lineHeight: string;
        fontSize: string;
        border: string;
        cursor: string;
    } | undefined;
    sizes?: {
        sm: {
            fontSize: string;
            px: number;
            py: number;
        };
        md: {
            fontSize: string;
            px: number;
            py: number;
        };
    } | undefined;
    variants?: {
        solid: (props: import("@chakra-ui/styled-system").StyleFunctionProps) => {
            _hover: {
                backgroundColor: string;
            };
            color: string;
        };
    } | undefined;
    defaultProps?: {
        size?: "sm" | "md" | undefined;
        variant?: "solid" | undefined;
        colorScheme?: string | undefined;
    } | undefined;
};
export { Button };
