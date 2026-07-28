# Project: Lang2Query

## Overview
Lang2Query is an AI-powered Text-to-SQL system built by Nithin Pradeep for Paytm Payments Bank (offsite) from Aug 2025 to Feb 2026 (full time). It converts plain English questions into optimized SQL queries using a multi-agent LangGraph workflow. Agents handle database identification, table selection, column resolution, query generation, and validation in a pipeline.

## Architecture
Lang2Query, built by Nithin Pradeep, uses ChromaDB-powered semantic search with BGE-M3 embeddings over database schemas for context-aware retrieval. It includes a Next.js + React 19 frontend with real-time WebSocket streaming of workflow progress, a FastAPI backend, and full Docker Compose deployment. It supports OpenAI, Ollama, and NVIDIA as LLM providers.
