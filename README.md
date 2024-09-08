# HORA API

This project is a Node.js and TypeScript-based API for managing students productivity and to also enable them collaborate using special features. It includes functionality for creating accountability groups, progress bars, leaderboard and points for tracking progress.

## Features

- Accountability groups
- Progress tracking
- Task management
- Leaderboard

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
    CLIENT_ID=<clientid>
    CLIENT_SECRET=<clientsecret>
    SESSION_SECRET=<sessionsecret>
    PORT=3000
    JWT_SECRET=<jwtsecret>
    MONGODB_URL=<mongodburl>
    FRONTEND_URL=<frontendurl>
    EMAIL_USER=<email>
    EMAIL_PASS=<emailpassword>
    REFRESH_TOKEN=<refreshtoken>
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

For detailed API documentation, please refer to the [API Documentation](https://documenter.getpostman.com/view/29099038/2sAXjRVotE) on Postman.

## License

This project is licensed under the MIT License.
