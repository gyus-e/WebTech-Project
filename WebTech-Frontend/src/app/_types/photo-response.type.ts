export interface PhotoResponse {
    id: number;
    title: string;
    description: string | null;
    geolocation: [number, number] | null;
}