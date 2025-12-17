declare const Alert: {
    baseStyle?: ((props: import("@chakra-ui/styled-system").StyleFunctionProps) => {
        container: {
            backgroundColor: string;
            border: string;
            borderRadius: string;
            fontWeight: string;
        };
        title: {
            color: string;
        };
        description: {
            color: string;
        };
        icon: {
            color: string;
        };
    }) | undefined;
    sizes?: {
        [key: string]: import("@chakra-ui/styled-system").SystemStyleInterpolation;
    } | undefined;
    variants?: {
        [key: string]: import("@chakra-ui/styled-system").SystemStyleInterpolation;
    } | undefined;
    defaultProps?: {
        size?: string | number | undefined;
        variant?: string | number | undefined;
        colorScheme?: string | undefined;
    } | undefined;
};
export { Alert };
