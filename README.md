# **🛒 Node Order Processing System**

Welcome to the **Order Processing System**!

This project implements an **Order Processing System** using **AWS SQS**.  
It includes:
- **Order Validation** before pushing to SQS.
- **SQS Consumer Worker** that processes orders from the queue.
- **Order Status Updates** to "Processed" or "Failed".

---

## **🚀 Features**

✅ **Push Order to AWS SQS** after inventory validation.  
✅ **Worker reads from AWS SQS** and processes messages.  
✅ **Updates Order Status** to "Processed" or "Failed".  
✅ **Deletes SQS Messages** after processing.  
✅ **Runs every 5 seconds** to keep processing new orders.  

---

## **📌 Prerequisites**

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## **📌 Installation**

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Pratik1091999/order-processing-system.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd order-processing-system
   ```

3. **Install the dependencies**:

   ```bash
   npm install
   ```

---

## **🔧 Environment Setup (.env file)**

Before running the project, create a `.env` file in the root directory and add share credentials.
---

## **📌 Usage**

To start the **development server**, run:

```bash
npm run dev
```

The server is running locally on http://localhost:5000.

## **📚 API Documentation**

### **1. User Registration**

**Endpoint:** `POST /api/auth/register`

This endpoint registers a new user.

#### Request Body:
- `name`: The user's name.
- `email`: The user's email address.
- `password`: The user's password.

---

### **2. User Login**

**Endpoint:** `POST /api/auth/login`

This endpoint logs in an existing user and provides authentication tokens.

#### Request Body:
- `email`: The user's email address.
- `password`: The user's password.

---

### **3. Refresh JWT Token**

**Endpoint:** `POST /api/auth/refresh`

This endpoint allows the user to refresh their JWT access token using a valid refresh token.

#### Request Body:
- `refreshToken`: The user's valid refresh token.

---

### **4. Create an Order**

**Endpoint:** `POST /api/orders`

This endpoint creates a new order for a user. The order must include the product details.

#### Request Body:
- `items`: An array of items in the order, each containing:
  - `productId`: The product's unique ID.
  - `quantity`: The quantity of the product being ordered.

---

### **5. Get Order Status**

**Endpoint:** `GET /api/orders/{orderId}`

This endpoint retrieves the status of an order by its unique ID.

#### Path Parameter:
- `orderId`: The unique ID of the order.

---

### **🔒 Authentication and Authorization**

- **Registration**: No authentication required.
- **Login**: No authentication required.
- **Refresh Token**: Requires a valid `refreshToken`.
- **Create Order**: Requires a valid `accessToken` in the `Authorization` header.
- **Get Order Status**: Requires a valid `accessToken` in the `Authorization` header.

---

## **📂 Project Structure**

Here’s an overview of the project structure:

```
order-processing-system:
├── logs
│   ├── all.log
│   └── error.log
├── package.json
├── package-lock.json
├── public
│   └── index.html
├── README.md
├── scripts
│   ├── bash
│   │   └── codegen-node-be.sh
│   └── template
│       └── snippet
│           ├── controllers
│           │   └── entity.js
│           ├── models
│           │   └── entity.js
│           └── routes
│               └── entity.js
└── src
    ├── app.js
    ├── config
    │   └── config.js
    ├── constants.js
    ├── controllers
    │   └── api
    │       └── v1
    │           ├── order.js
    │           └── user.js
    ├── db
    │   └── index.js
    ├── middleware
    │   ├── authMiddleware.js
    │   ├── errorHandler.js
    │   └── morgan.js
    ├── models
    │   ├── inventory.js
    │   ├── order.js
    │   ├── product.js
    │   └── user.js
    ├── routes
    │   └── api
    │       └── v1
    │           ├── order.js
    │           └── user.js
    ├── server.js
    ├── services
    │   └── sqsConsumer.js
    └── utils
        ├── apiError.js
        ├── apiResponse.js
        ├── asyncHandler.js
        ├── authValidation.js
        ├── awsConfig.js
        ├── common_function.js
        ├── errorCode.js
        ├── errorMessage.js
        ├── logger.js
        ├── redisConfig.js
        └── sqsService.js
```

---

## **🛠 Creating a New Entity**

To create a new entity, run the following command in your bash terminal:

```bash
./scripts/bash/codegen-node-be.sh <Entity Name in CamelCase>
```

Replace `<Entity Name in CamelCase>` with the desired name of your entity.

---
