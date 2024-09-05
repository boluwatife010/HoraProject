# HORA API

This project is a Node.js and TypeScript-based API for managing students productivity and to also enable them collaborate using special features. It includes functionality for creating accountability groups, progress bars, leaderboard and points for tracking progress.

## Features

- Get Specific weathers from different cities across the world

## Technologies Used

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- External API

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB Atlas account

### Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/boluwatife010/Todo-List-Project.git
    cd Todo-List-Project
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a `.env` file in the root of the project and add your environment variables:

    ```env
    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority
    PORT=8090
    JWT_SECRET=your jwt secret
    CLIENT_ID=Your google client id
    CLIENT_SECRET=Your your client secret
    SESSION_SECRET=Your session secret
    ```

4. Start the server:

    ```sh
    npm start
    ts-node app
    ```
## Challenges and Solutions

### 1. TypeScript Integration

**Challenge**: Ensuring type safety while interacting with Mongoose models.
**Solution**: Defined TypeScript interfaces for request bodies and Mongoose models to maintain type safety across the application.

### 2. Handling Optional Fields in Interfaces

**Challenge**: TypeScript errors when dealing with optional fields.
**Solution**: Used type assertions and optional chaining to handle optional fields properly.

### 3. Connecting to MongoDB Atlas

**Challenge**: Difficulty in connecting to the cloud MongoDB instance.
**Solution**: Whitelisted IP addresses and used the correct connection string format provided by MongoDB Atlas.




## API Documentation

For detailed API documentation, please refer to the [API Documentation]() on Postman.

## License

This project is licensed under the MIT License.
