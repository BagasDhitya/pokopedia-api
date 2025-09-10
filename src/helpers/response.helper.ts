import { Response } from "express";


// 🔹 Custom Error class untuk aplikasi
// - Extend dari bawaan Error
// - Tambahkan statusCode (HTTP status), dan isOperational (indikasi error yang bisa diprediksi / handled)
// - Digunakan untuk melempar error terstruktur di service/controller tanpa harus manual res.status()
export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message);
        // Fix prototype chain agar instanceof tetap bekerja
        Object.setPrototypeOf(this, new.target.prototype);

        this.statusCode = statusCode; // HTTP status code (contoh: 400, 404, 500)
        this.isOperational = isOperational; // Flag apakah error terkontrol (misal validasi) atau tidak
        Error.captureStackTrace(this, this.constructor); // Simpan jejak stack trace untuk debugging
    }
}


// 🔹 Helper untuk kirim error response secara terpusat
// - Mengecek apakah error instance dari AppError
// - Jika iya, kirim JSON dengan statusCode & message dari AppError
// - Jika tidak, log error ke console & balikan "Internal Server Error"
export function errorResponse(res: Response, error: unknown) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }

    console.error("❌ Unhandled Error:", error);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};


// 🔹 Helper untuk kirim success response
// - Tujuannya agar semua response sukses punya format seragam
// - Bisa dikustomisasi message & statusCode
export function successResponse(
    res: Response,
    data: unknown,
    message = "Success",
    statusCode = 200
) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};
