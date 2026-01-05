# 🚀  Aution Web (Next.js + Express + Prisma + PostgreSQL)

A modern **fullstack monorepo** boilerplate built with:
- **TypeScript** as the language
- **Next.js** for the frontend
- **Node.js + Express** for the backend
- **PostgreSQL** as the database
---

## 📁 Folder Structure

```
project-root/
├── client/          # Next.js frontend
│   ├── .next/
│   ├── app/
|   ├── components/
|   ├── hooks/
|   ├── lib/
|   ├── public/
|   ├── styles/
|   ├── .env
|   ├── middleware.ts
|   ├── next.config.ts
|   ├── tsconfig.json
│   └── package.json
│
├── server/          # Node.js backend (Express + Prisma)
│   ├── src/
|   |   ├── controllers/
│   │   ├── exceptions/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── schema/
│   │   ├── services/
|   |   ├── types/
|   |   ├── utils/
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma
|   ├── .env
|   ├── nodemon.json
|   ├── tsconfig.json
│   └── package.json
│
├── shared/          # Shared logic (types, utils, constants, etc.)
│   ├── src/
│   │   ├── types/
│   │   └── utils/
│   │   └── api/
│   ├── package.json
│   └── tsconfig.json
│
└── package.json     # Root-level scripts & workspace config
└── tsconfig.json  
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | Next.js (App Router) |
| **Backend** | Node.js + Express + Prisma ORM |
| **Database** | PostgreSQL |
| **Language** | TypeScript (NodeNext) |
| **Package Manager** | npm (workspaces) |
| **Dev Tools** | concurrently, ts-node-dev |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Donavfulish/AutionWeb_FinalProject_PTUDW.git
cd project-name
```

### 2️⃣ Install dependencies
At the project root:
```bash
npm install
```

This installs dependencies for `client`, `server`, and `shared` automatically (thanks to npm workspaces).

---

## 🧩 Environment Variables
sau này viêt
---

## 🧱 Database Setup
sau nay luôn
---

## 🚀 Development

Run both **client** and **server** concurrently from the root:

```bash
npm run dev
```

### What happens
- 🖥️ Server runs at [http://localhost:8080](http://localhost:8080)
- 🌐 Client runs at [http://localhost:3000](http://localhost:3000)

---

## 🔧 Scripts Reference

| Command | Description |
|----------|-------------|
| `npm run dev` | Run both client & server concurrently |
| `npm run dev:client` | Run only the Next.js app |
| `npm run dev:server` | Run only the Express backend |
| `npm run build --workspace client` | Build frontend |
| `npm run build --workspace server` | Build backend |
| `npm run build --workspace shared` | Build shared library |

---

## 🤝 Contributing

1. Fork this repo
2. Create your branch (`git checkout -b feature/my-feature`)
3. Commit changes (`git commit -m "feat: add new feature"`)
4. Push to branch (`git push origin feature/my-feature`)
5. Open a Pull Request 🎉
6. Do not pull to main !!!!
---

## 📜 License

MIT © [Do Van Ha](https://github.com/Donavfulish)

---