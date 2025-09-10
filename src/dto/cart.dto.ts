// DTO untuk item dalam cart
export interface CartItemDTO {
    productId: number;
    name: string;
    image?: string;
    basePrice: number;
    quantity: number;
}

// DTO buat create cart
export interface CreateCartDTO {
    userId: number;
    items: CartItemDTO[];
}

// DTO buat response cart
export interface CartResponseDTO {
    id: number;
    userId: number;
    totalAmount: number;
    items: CartItemDTO[];
    createdAt: Date;
    updatedAt: Date;
}
