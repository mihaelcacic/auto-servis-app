# Run Frontend & Backend with Docker

Simple guide to get the frontend running in a Docker container.

## What you need

- Docker Desktop installed and RUNNING!!! on Windows

## Steps

### 1) Copy the environment file

In the root folder of the project, you'll find a file called `.env.example`.

**Copy** this files contents into `.env` (keep it in the same root folder).

If you don't have `.env` created, create it. Feel free to change env's

### 2) Start the container

In VS Code, open the `compose.yml` file in the root folder.

You'll see a line that says `services:` with `frontend:` or `backend:` below it.

**Click the "Run Service" button** that appears above the service you wanna start (`frontend:` or `backend:`) (it looks like a play icon ▶️).

VS Code will build and start the container automatically.

### 3) Open in your browser

Once the container is running, open your browser and go to:

**http://127.0.0.1:3000/health** for `frontend:` or

**http://127.0.0.3:8080/health** for `backend:` if you haven't change env's inside .env

You should see "OK" - this means the service is running!

### 4) Stop the container

When you're done:

1. Open **Docker Desktop**
2. Go to the **Containers** tab
3. Find the container (usually named `auto-servis-app-frontend-1`)
4. Click the **Stop** button (⏹️)

# Run Frontend & Backend without Docker

## Run frontend

Position yourself in frontend driectory/folder

Run `node server˙

When done send a kill signal in terminal

## Run backend

Position yourself in backend driectory/folder inside _CMD_

Run: mvnw.cmd spring-boot:run

When you are done, send a kill signal in terminal

### PS. When running withouth docker, these services use .env.dev.local env's in their directories/folders and .env doesn't get used at all
