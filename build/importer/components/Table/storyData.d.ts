declare const storyData: ({
    id: number;
    Name: {
        raw: string;
        content: string;
        captionInfo: string;
        tooltip?: undefined;
    };
    Age: number;
    Email: string;
    email?: undefined;
} | {
    id: number;
    Name: {
        raw: string;
        content: string;
        tooltip: string;
        captionInfo?: undefined;
    };
    Age: number;
    Email: string;
    email?: undefined;
} | {
    id: number;
    Name: string;
    Age: number;
    Email: string;
    email?: undefined;
} | {
    id: number;
    Name: string;
    Age: number;
    email: string;
    Email?: undefined;
})[];
export default storyData;
