# StackTalk Backend

**StackTalk** is a collaborative project management and communication platform that combines **real-time team chat** with **AI-powered assistance**.  
This backend handles authentication, authorization, project room management, chat messaging, and integration with the **Gemini LLM** for AI-driven code generation and structured file tree suggestions.

## Features

- **JWT Authentication & Role-Based Authorization** – Secure user login and permission control.
- **Project Room Management** – Create, update, and manage rooms for different projects.
- **Real-Time Chat with Socket.io** – Collaborate instantly with teammates in project rooms.
- **AI Integration with `@ai`** – Use Gemini LLM for coding help, file tree generation, and Q&A.
- **File Tree Updates** – Keep project structures synced for AI-generated code.
- **Modular Backend Architecture** – Controllers, services, and models for scalability.

## Project Structure

```md
Directory structure:
└── saumyajeet-varma-stacktalk-backend/
    ├── package.json
    └── src/
        ├── app.js
        ├── server.js
        ├── controllers/
        │   ├── gemini.controller.js
        │   ├── project.controller.js
        │   ├── projectMessage.controller.js
        │   └── user.controller.js
        ├── db/
        │   └── db.js
        ├── middlewares/
        │   └── auth.middleware.js
        ├── models/
        │   ├── project.model.js
        │   ├── projectMessage.model.js
        │   └── user.model.js
        ├── routes/
        │   ├── gemini.routes.js
        │   ├── project.route.js
        │   ├── projectMessage.route.js
        │   └── user.route.js
        └── services/
            ├── gemini.service.js
            ├── project.service.js
            └── user.service.js

```

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT
- **Real-Time Communication:** Socket.io
- **AI Integration:** Gemini LLM API
- **Other:** express-validator, bcrypt, dotenv, cors

## Installation and Setup

1. **Clone the repository**

```bash
git clone https://github.com/saumyajeet-varma/stacktalk-backend.git
cd stacktalk-backend

```

2. **Install dependencies**

```bash
npm install

```

3. **Set up environment variables**

Create a `.env` file in the project root:

```env
PORT = 8080
ALLOWED_ORIGIN = *
MONGODB_URI = mongodb+srv://your_mongodb_url
JWT_SECRET = your_jwt_secret
JWT_EXPIRE = 24h
GEMINI_API_KEY = your_gemini_api_key

```

4. **Run the server**

```bash
npm start

```

5. **For development with hot reload**

```bash
npm run dev

```

## API Endpoints

### User Routes (`/users`)

| Method | Endpoint    | Description                |
| ------ | ----------- | -------------------------- |
| POST   | `/register` | Register a new user        |
| POST   | `/login`    | Login and get JWT token    |
| GET    | `/profile`  | Get logged-in user profile |
| GET    | `/logout`   | Logout user                |
| GET    | `/all`      | Get list of all users      |

### Project Routes (`/projects`)

| Method | Endpoint              | Description                            |
| ------ | --------------------- | -------------------------------------- |
| POST   | `/create`             | Create a new project                   |
| GET    | `/all`                | Get all projects for the user          |
| PUT    | `/add-users`          | Add users to a project                 |
| GET    | `/project/:projectId` | Get project details by ID              |
| PUT    | `/update-file-tree`   | Update file tree for AI-generated code |
| DELETE | `/delete/:projectId`  | Delete a project                       |

### Project Message Routes (`/project-messages`)

| Method | Endpoint      | Description                    |
| ------ | ------------- | ------------------------------ |
| GET    | `/:projectId` | Get all messages for a project |
| POST   | `/save`       | Save a new message             |

### Gemini AI Routes (`/ai`)

| Method | Endpoint      | Description                         |
| ------ | ------------- | ----------------------------------- |
| GET    | `/get-result` | Get AI-generated result from Gemini |

## Usage

- Connect your frontend client to this backend to access all features.
- Create projects (rooms) and invite teammates to collaborate.
- Exchange real-time messages with your team via the chat feature.
- Mention `@ai` in chat to get Gemini-powered assistance for generating code snippets.

## Contributing

- Fork the repo
- Create your feature branch (`git checkout -b feature-name`)
- Commit changes (`git commit -m 'Add some feature'`)
- Push to branch (`git push origin feature-name`)
- Open a Pull Request

## Author

<a href="https://github.com/saumyajeet-varma">
    <img src="https://img.icons8.com/?size=100&id=AZOZNnY73haj&format=png&color=000000" alt="Saumyajeet Varma">
</a>