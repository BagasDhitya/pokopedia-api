# 🛒 Pokopedia API

The backend for the **Pokopedia** daily groceries application is built with **Express.js**, **TypeScript**, and **Prisma** as the ORM, connected to either **PostgreSQL** or **MySQL** as the database engine.
This project is designed with a **class-based architecture**, ensuring that every part of the application is modular, scalable, and easy to maintain. Each layer has its own clear responsibility — from database access and business logic, to request handling and routing. The codebase is organized into well-structured folders, making it straightforward for developers to navigate and extend new features.

The folder structure is as follows:

```
src/
 ┣ config/
 ┣ dto/
 ┣ services/
 ┣ controllers/
 ┣ routers/
 ┣ helpers/
 ┗ app.ts
```

---

## 🚀 Installation & Setup

### 1. Clone repository

```bash
git clone https://github.com/username/pokopedia-backend](https://github.com/BagasDhitya/pokopedia-api.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup environment

Create `.env` file:

```env
DATABASE_URL="YOUR-DATABASE-URL"
PORT=8000
```

### 4. Prisma migration

```bash
npx prisma migrate dev --name init
```

### 5. Run server

```bash
npx ts-node-dev src/app.ts
```

Server will running at:

```
http://localhost:8000
```

---

## 📖 API Documentation

### 1. **User**

| Method | Endpoint     | Description      |
| ------ | ------------ | ---------------- |
| POST   | `/users`     | Create new user  |
| GET    | `/users`     | Get all users    |
| GET    | `/users/:id` | Get user by ID   |
| PUT    | `/users/:id` | Update user      |
| DELETE | `/users/:id` | Soft delete user |

#### Request Body (POST/PUT)

```json
{
  "email": "test@mail.com",
  "password": "123456",
  "role": "customer",
  "image": "optional.png"
}
```

---

### 2. **Product**

| Method | Endpoint        | Description         |
| ------ | --------------- | ------------------- |
| POST   | `/products`     | Create new product  |
| GET    | `/products`     | Get all products    |
| GET    | `/products/:id` | Get product by ID   |
| PUT    | `/products/:id` | Update product      |
| DELETE | `/products/:id` | Soft delete product |

#### Request Body (POST/PUT)

```json
{
  "name": "Beras Premium",
  "stock": 100,
  "basePrice": 12000,
  "image": "optional.png"
}
```

---

### 3. **Cart**

| Method | Endpoint     | Description     |
| ------ | ------------ | --------------- |
| POST   | `/carts`     | Create new cart |
| GET    | `/carts`     | Get all carts   |
| GET    | `/carts/:id` | Get cart by ID  |
| PUT    | `/carts/:id` | Update cart     |
| DELETE | `/carts/:id` | Delete cart     |

#### Request Body (POST/PUT)

```json
{
  "products": [
    { "productId": 1, "name": "Beras Premium", "image": "beras.png", "basePrice": 12000 }
  ],
  "totalAmount": 12000
}
```

---

### 4. **Transaction**

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| POST   | `/transactions`     | Create new transaction |
| GET    | `/transactions`     | Get all transactions   |
| GET    | `/transactions/:id` | Get transaction by ID  |
| DELETE | `/transactions/:id` | Delete transaction     |

#### Request Body (POST)

```json
{
  "cartId": 1
}
```
