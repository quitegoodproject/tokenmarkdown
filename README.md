# ⚡ TokenMarkdown (`tokenmarkdown.com`)

> **Sub-150ms Web-to-Markdown Engine & Model Context Protocol (MCP) Server**  
> Engineered for LLM context window efficiency, RAG pipelines, and autonomous AI coding agents.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![MCP](https://img.shields.io/badge/MCP-1.0_Compliant-emerald.svg)](https://modelcontextprotocol.io)
[![Part of Quite Good Project](https://img.shields.io/badge/Maintained_by-Quite_Good_Project-09090b.svg)](https://quitegoodproject.com)
[![npm version](https://img.shields.io/npm/v/tokenmarkdown-mcp.svg)](https://www.npmjs.com/package/tokenmarkdown-mcp)

---

## 🧭 The Problem: Prompt Bloat & Token Degradation

When autonomous agents or RAG pipelines scrape the web using Puppeteer, Jina, or Firecrawl, they dump **25,000+ tokens** of navigation trees, cookie popups, tracking scripts, and inline SVGs directly into the prompt.

* **High Cost**: $0.08+ per page in Claude 3.5 Sonnet token fees.
* **Slow Latency**: 4 to 8 seconds per scrape.
* **Context Poisoning**: LLMs hallucinate on irrelevant footer links and cookie consent disclaimers.

**TokenMarkdown** compresses web pages by **95% into dense, clean Markdown** in **sub-150ms**, preserving your context budget and boosting reasoning accuracy.

---

## ⚡ Comparison Benchmark

| Feature | Raw HTML / Scrapers | Firecrawl / Jina | **TokenMarkdown.com** |
| :--- | :---: | :---: | :---: |
| **Average Latency** | 6,200ms | 2,100ms | **⚡ 148ms** |
| **Tokens Consumed** | ~28,500 tokens | ~3,200 tokens | **🎯 ~940 tokens (95% Savings)** |
| **Prompt Cost (Sonnet)** | $0.0855 / call | $0.0096 / call | **💰 $0.0028 / call** |
| **Zero-SDK URL Proxy** | ❌ No | ❌ No | **✅ Yes (`curl tokenmarkdown.com/https://...`)** |
| **Native MCP (Stdio + SSE)** | ❌ No | Partial | **✅ Yes (`npx -y tokenmarkdown-mcp`)** |

---

## 🚀 Quickstart

### 1. Zero-SDK Terminal / cURL Prefix Proxy
You don't even need an API key for quick testing. Prepend `https://tokenmarkdown.com/` to any URL:

```bash
curl -s "https://tokenmarkdown.com/https://stripe.com/docs/api"
```

---

### 2. Claude Desktop & Cursor IDE Setup (MCP)

Add to your Claude Desktop configuration (`claude_desktop_config.json`) or Cursor MCP settings:

```json
{
  "mcpServers": {
    "tokenmarkdown": {
      "command": "npx",
      "args": ["-y", "tokenmarkdown-mcp"],
      "env": {
        "TOKENMARKDOWN_API_KEY": "<TOKENMARKDOWN_API_KEY>"
      }
    }
  }
}
```

---

### 3. REST API (`POST /v1/extract`)

```bash
curl -X POST "https://tokenmarkdown.com/v1/extract" \
  -H "Authorization: Bearer <TOKENMARKDOWN_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://linear.app/blog/rethinking-issue-tracking",
    "include_images": false
  }'
```

#### Response:
```json
{
  "url": "https://linear.app/blog/rethinking-issue-tracking",
  "title": "Rethinking issue tracking — Linear Blog",
  "markdown": "# Rethinking issue tracking\n\nMost issue trackers are built as databases...",
  "tokens": 820,
  "savings_percent": 96.2,
  "execution_ms": 142
}
```

---

## 📦 1-Click Blueprints for Agencies & Automation

* **[Clay.com Blueprint](./workflows/clay-blueprint.json)**: Drop-in HTTP enrichment column to cut Clay AI credits by 90%.
* **[n8n Workflow Blueprint](./workflows/n8n-workflow.json)**: Instant webhook extractor node for automated research agents.

---

## 🏛️ developer suite & Governance

TokenMarkdown is an official developer primitive engineered by **[The Quite Good Project](https://quitegoodproject.com)**.  
* **Parent Specification**: [RFC-2601 Sovereign Primitives Spec](https://quitegoodproject.com)  
* **Companion Tool**: [TokenEnrich.com](https://tokenenrich.com) (Sub-140ms ~180-Token Firmographics)

---

## 📄 License
MIT © 2026 The Quite Good Project.
