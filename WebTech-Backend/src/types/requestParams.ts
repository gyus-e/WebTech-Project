export interface CatRequestParams {
    cat_id: string;
}

export interface CatPhotoRequestParams extends CatRequestParams {
    photo_id: string;
}