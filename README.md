# Job Portal – Pet Project

A pet project where I experiment with **Clean Architecture (Onion Architecture)** using modern backend technologies.
The main goal is to build a job portal system while keeping layers separated and testable.

---

## 🛠️ Tech Stack

- **Backend Framework:** [Nest.js](https://nestjs.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Containerization:** [Docker](https://www.docker.com/)
- **Caching / Queue:** [Redis](https://redis.io/)
- **Testing:** Unit tests for the **app** layer (using Jest)

---

## 🏛️ Architecture

I'm experimenting with **Clean (Onion) Architecture** principles.
The project is divided into four main layers:

- **Core** – Contains business entities, domain logic, and interfaces.
- **App** – Application services and use cases (business rules that orchestrate domain logic).
- **Infrastructure** – Data access, database implementation (Prisma, repositories, external services).
- **Framework** – Nest.js-specific modules, controllers, dependency injection configuration.

> ⚠️ Note: Since this is an educational/pet project, I'm still iterating on some decisions in the architecture. Some boundaries between layers may not be perfectly strict, and I’m open to improving this structure as I learn more.

---

## 🚀 Features

- Manage companies and job postings.
- Apply for jobs as a candidate.
- Update application statuses.
- User roles and permissions.
- Basic authentication & authorization.

---

## 🧪 Testing

Unit tests exist for the App layer, focusing on use cases and business logic to ensure correctness independent of external frameworks or databases.

---

## 📦 Running the Project

```bash
# Clone repository
git clone git@github.com:ww-side/job-portal-nest.git
cd job-portal

# Install dependencies
pnpm i

# Run with Docker
docker-compose up --build

# Run without Docker
pnpm run start:dev

# Run tests
pnpm run test
```

---

## 📌 Notes

- This project is primarily for **learning purposes**.
- I'm experimenting with architectural decisions, especially the boundaries between layers.
- Contributions, suggestions, and feedback are welcome!

---
