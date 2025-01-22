export interface SecretListResponse {
    id: string;
    name: string;
    folder: string;
}

export interface SecretDetailResponse {
    id: string;
    name: string;
    folder: string;
    value: string;
}

export interface SecretCreateRequest {
    name: string;
    folder: string;
    value: string;
}
 
export interface SecretUpdateRequest {
    name?: string;
    folder?:string;
    value?: string;
}