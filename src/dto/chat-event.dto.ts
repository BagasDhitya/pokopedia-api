export interface JoinRoomDTO {
    room: string // bisa transactionId atau userId
    userId: number // siapa yang join
}

export interface SendMessageDTO {
    room: string // room tujuan
    content: string // isi pesan
    senderId: number,
    receiverId: number,
    transactionId?: number
}