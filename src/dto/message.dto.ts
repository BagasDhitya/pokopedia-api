export interface CreateMessageDTO {
    content: string // isi pesan
    senderId: number // pengirim (customer/admin)
    receiverId: number // penerima
    transactionId?: number // jika ada pesan terkait transaksi tertentu
}

export interface MessageResponseDTO {
    id: number,
    content: string,
    senderId: number,
    receiverId: number,
    transactionId?: number,
    createdAt: Date
}