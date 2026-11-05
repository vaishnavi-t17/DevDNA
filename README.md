

\# DevDNA — VedaFlux



\*\*An AI-powered developer onboarding assistant.\*\*



DevDNA is a collaborative project featuring VedaFlux, an AI-powered assistant designed to help developers understand codebases, explore project activity, and access information across development tools.



\## Integrated Sources



\- \*\*GitHub:\*\* Source files, commits, pull requests, and changed-file patches.

\- \*\*Jira Cloud:\*\* JQL-indexed issues and comments.

\- \*\*Slack:\*\* Channel history and thread replies.



\## AI \& RAG



The RAG pipeline is connected to a FastAPI AI sidecar, providing:



\- Document extraction

\- Local sentence-transformer embeddings

\- Reranking

\- Groq-powered chat and summarization



\## Technology \& Dependencies



\- \*\*Backend:\*\* NestJS

\- \*\*Frontend:\*\* React

\- \*\*AI Service:\*\* Python and FastAPI

\- \*\*Embeddings:\*\* Sentence Transformers

\- \*\*LLM:\*\* Groq



The Python dependency entrypoint is `requirements.txt`. NestJS and React dependencies are managed through their respective `package.json` files and lockfiles.



\## Getting Started



Refer to \[`VEDAFUX\_RUN\_GUIDE.md`](VEDAFUX\_RUN\_GUIDE.md) for setup instructions, environment variables, connector JSON examples, and run commands.



\## Project Collaboration



This project was developed collaboratively. The repository provides a separate copy of the project for independent development and documentation.



