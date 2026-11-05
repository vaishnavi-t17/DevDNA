# VedaFlux — Complete Run Guide

## 1\. Install

Required:

* Docker Desktop
* Node.js 22 LTS
* npm
* Git

The repository also includes `requirements.txt` for the Python AI sidecar.

## 2\. Configure credentials

Copy:

`backend/.env.example` → `backend/.env`

Fill these values:

```env
GROQ\_API\_KEY=your\_groq\_key
GROQ\_MODEL=openai/gpt-oss-120b

GITHUB\_TOKEN=your\_github\_token
GITHUB\_OWNER=your\_owner
GITHUB\_REPO=your\_repo

JIRA\_BASE\_URL=https://your-domain.atlassian.net
JIRA\_EMAIL=your-jira-email
JIRA\_API\_TOKEN=your-jira-api-token

SLACK\_BOT\_TOKEN=your\_slack\_bot\_token\_here
```

Generate strong random values for:

```env
JWT\_ACCESS\_SECRET=...
JWT\_REFRESH\_SECRET=...
```

Do not commit `backend/.env`.

## 3\. Start infrastructure

```bash
cd backend
docker compose up -d postgres redis ai-service
```

Wait until the AI service reports healthy at:

`http://localhost:8001/health`

This endpoint checks AI service configuration only; it does not verify live Groq availability.

## 4\. Initialize the database

```bash
npm ci
npx prisma generate
npx prisma migrate deploy
```

The database image includes pgvector.

## 5\. Start backend

```bash
npm run start:dev
```

Backend: `http://localhost:7000`
Swagger: `http://localhost:7000/docs`

## 6\. Start frontend

```bash
cd ../frontend
npm ci
npm run dev
```

Open:

`http://localhost:5173`

## 7\. Create connectors from the existing Connectors page

### GitHub config

```json
{
  "owner": "YOUR\_OWNER",
  "repo": "YOUR\_REPO",
  "branch": "main",
  "includeCommits": true,
  "includePullRequests": true,
  "maxFiles": 200,
  "maxCommits": 50,
  "maxPullRequests": 25
}
```

### Jira config

```json
{
  "projectKey": "YOUR\_PROJECT\_KEY",
  "maxIssues": 100
}
```

### Slack config

```json
{
  "channelIds": \["YOUR\_CHANNEL\_ID"],
  "oldestDays": 30,
  "maxMessagesPerChannel": 15
}
```

Click **Create**, then **Test**, then **Sync**.

## 8\. What gets indexed

GitHub indexes repository source files plus commit and pull-request evidence. Pull requests include changed-file patches when GitHub returns them.

Jira indexes issue details and comments returned by the Jira Cloud search API.

Slack indexes channel messages and available thread replies.

The existing RAG pipeline then extracts/chunks content, creates embeddings, stores them in pgvector, performs hybrid retrieval and sends retrieved evidence to the AI service for the final answer.

## 9\. Security notes

* Connector credentials are read from environment variables, not Connector JSON.
* Keep `backend/.env` private.
* The Groq model receives the retrieved context used for the answer. If your organization requires that source code never leave your infrastructure, replace the Groq call in `ai-service/main.py` with a self-hosted LLM endpoint.

