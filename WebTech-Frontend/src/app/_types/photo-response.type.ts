export interface PhotoResponse {
    id: number;
    catId: number;
    uploader: string;
    title: string;
    description: string | null;
    geolocation: string | null;
}