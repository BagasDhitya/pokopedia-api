export interface CreateTransactionDTO {
    cartId: number;
}

export interface TransactionResponseDTO {
    id: number;
    cartId: number;
    createdAt: Date;
    updatedAt: Date;
}
