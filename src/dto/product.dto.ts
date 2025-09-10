export interface CreateProductDTO {
    name: string;
    image?: string;
    stock: number;
    basePrice: number;
}

export interface UpdateProductDTO {
    name?: string;
    image?: string;
    stock?: number;
    basePrice?: number;
}

export interface ProductResponseDTO {
    id: number;
    name: string;
    image?: string | null;
    stock: number;
    basePrice: number;
    createdAt: Date;
    updatedAt: Date;
}
