# Run the Frontend with Docker

Simple guide to get the frontend running in a Docker container.

## What you need

- Docker Desktop installed and running on Windows

## Steps

### 1) Copy the environment file

In the root folder of the project, you'll find a file called `.env.dev`.

**Copy** this files contents into `.env` (keep it in the same root folder).

If you don't have `.env` created, create it

You should now have:

- `.env.dev` (original, but you still must keep it)
- `.env` (another file, not tracked by git, but with contents of `.env.dev` in it)

### 2) Start the container

In VS Code, open the `compose.yml` file in the root folder.

You'll see a line that says `services:` with `frontend:` below it.

**Click the "Run Service" button** that appears above the `frontend:` line (it looks like a play icon ▶️).

VS Code will build and start the container automatically.

### 3) Open in your browser

Once the container is running, open your browser and go to:

**http://127.0.0.1:3000/health**

You should see "OK" - this means the frontend is running!

### 4) Stop the container

When you're done:

1. Open **Docker Desktop**
2. Go to the **Containers** tab
3. Find the container (usually named `auto-servis-app-frontend-1`)
4. Click the **Stop** button (⏹️)
