# YapChat 💬

**YapChat** is a real-time chat application developed using the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled with **Tailwind CSS**. It supports user authentication, group chats, instant messaging with real-time updates via **Socket.IO**, and state management with **Redux**. The app also includes toast notifications using **React-Toastify** for a smooth and interactive user experience.

---

##  Technologies

- **MongoDB** — Flexible NoSQL data store.
- **Express.js** — Node.js web framework for APIs and routing.
- **Node.js** — JavaScript runtime powering the backend.
- **React.js** — Frontend UI through reusable components.
- **Tailwind CSS** — Utility-first CSS for rapid, responsive UIs.
- **Socket.IO** — Real-time, bidirectional communication.
- **JWT (JSON Web Tokens)** — Secure, token-based authentication.
- **Redux** — Predictable state container.
- **React-Toastify** — Elegant toast notifications.

---

##  Features

- **User Authentication** — Sign up, login, and logout securely.
- **Real-time Chat** — Send and receive messages instantly.
- **Group Chat** — Create and join chat groups for multi-user communication.
- **Notifications** — Visual and sound alerts for incoming messages.
- **State Management** — Centralized app state via Redux.
- **Responsive UI** — Built with Tailwind CSS for mobile-first design.

---

##  Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rajeevcodes1/yapchat.git
cd yapchat
2. Install Dependencies
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
3. Configure Environment Variables

Create .env files in both frontend and backend directories.

Frontend (frontend/.env):

VITE_BACKEND_URL=http://localhost:9000


Backend (backend/.env):

FRONTEND_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/yapchat
PORT=9000
JWT_SECRET=your-strong-secret-key


Note: Replace your-strong-secret-key with a secure, random string.

4. Running the Application
# In a new terminal (frontend)
cd frontend
npm run dev

# In another terminal (backend)
cd backend
npm run dev

5. Usage

Open your browser and navigate to http://localhost:5173
 to start using YapChat.

Project Structure
yapchat/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── socket/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.js
│   ├── .env
│   └── package.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env
│   └── package.json
├── LICENSE
├── SECURITY.md
└── README.md


