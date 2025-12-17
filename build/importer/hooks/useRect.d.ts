type Size = {
    x: number;
    y: number;
    width: number;
    height: number;
    top: number;
    right: number;
    bottom: number;
    left: number;
};
declare function useRect<T extends HTMLElement = HTMLDivElement>(): [(node: T | null) => void, Size, Function];
export default useRect;
