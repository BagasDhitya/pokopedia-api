export interface CreateUserDTO {
  email: string;
  password: string;
  image?: string;
  role?: "CUSTOMER" | "ADMIN"; // default CUSTOMER
}

export interface UpdateUserDTO {
  email?: string;
  password?: string;
  image?: string;
  role?: "CUSTOMER" | "ADMIN";
}

export interface UserResponseDTO {
  id: number;
  email: string;
  image?: string;
  role: "CUSTOMER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}
