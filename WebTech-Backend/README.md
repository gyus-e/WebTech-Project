# WebTech-Project

Backend for Unina WebTech 2025 StreetCats project.

## Prerequisites

Make sure you have installed:
- [node and npm](https://nodejs.org/en/download)

Rename the ``.env.example`` file to ``.env`` and change its values accordingly.

Run the following command:
```bash
npm install
```

## Getting Started

```bash
npm start
```

## Running with Docker
```bash
docker build -t webtech-backend . && \
docker run -p 3000:3000 webtech-backend
```