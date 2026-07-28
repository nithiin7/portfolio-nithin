# Project: Remote File Server MCP

## Overview

Remote File Server MCP is an open-source MCP (Model Context Protocol) server built by Nithin Pradeep as a personal project from Mar 2026 to Apr 2026 (full time). It gives any MCP-compatible AI client (such as Claude or Cursor) secure read access to SMB/CIFS network file shares. It is listed on mcpservers.org, the public MCP server directory. Features include file listing, text/binary file reading, glob-pattern search, and detailed metadata retrieval.

## Security Design

Nithin Pradeep built Remote File Server MCP with enterprise-grade security: SMB packet signing is enforced, path traversal is blocked, sensitive files (.env, keys, certs) are auto-denied, and full JSON audit logging is included. Credentials are passed via environment variables and are never exposed in tool calls or conversation history. The server supports pip, uv, and Docker deployment.
