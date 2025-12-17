declare function debounce<F extends (...args: any[]) => any>(func: F, wait: number, immediate?: boolean): (...args: Parameters<F>) => void;
export default debounce;
