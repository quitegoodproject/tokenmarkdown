#!/usr/bin/env node
/**
 * TokenMarkdown MCP Server & CLI Client
 * Author: The Quite Good Project (https://quitegoodproject.com)
 * License: MIT
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";

const API_BASE = process.env.TOKENMARKDOWN_API_URL || "https://tokenmarkdown.com";
const API_KEY = process.env.TOKENMARKDOWN_API_KEY || "";

const server = new Server(
  {
    name: "tokenmarkdown-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Declare Public MCP Tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "extract_markdown",
        description: "Sub-150ms clean web-to-markdown extraction. Strips 95% of HTML bloat, cookie banners, tracking scripts, and SVGs to preserve LLM context windows.",
        inputSchema: {
          type: "object",
          properties: {
            url: {
              type: "string",
              description: "The fully qualified HTTP or HTTPS URL to extract into clean markdown.",
            },
            include_images: {
              type: "boolean",
              description: "Whether to retain image links in the markdown output (default: false).",
            },
          },
          required: ["url"],
        },
      },
      {
        name: "check_quota",
        description: "Check remaining TokenMarkdown API credits and usage status.",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Handle Tool Execution by proxying to live TokenMarkdown API
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === "extract_markdown") {
    const targetUrl = args?.url;
    if (!targetUrl) {
      return { content: [{ type: "text", text: "Error: Missing required 'url' parameter." }], isError: true };
    }

    try {
      const endpoint = `${API_BASE}/v1/extract`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": API_KEY ? `Bearer ${API_KEY}` : "",
          "User-Agent": "TokenMarkdown-MCP/1.0.0",
        },
        body: JSON.stringify({
          url: targetUrl,
          include_images: Boolean(args?.include_images),
          format: "json",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          content: [{ type: "text", text: `TokenMarkdown API Error (${response.status}): ${errorText}` }],
          isError: true,
        };
      }

      const data = await response.json();
      return {
        content: [
          {
            type: "text",
            text: data.markdown || data.content || JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (err) {
      return {
        content: [{ type: "text", text: `Connection Error: ${err.message}` }],
        isError: true,
      };
    }
  }

  if (name === "check_quota") {
    try {
      const response = await fetch(`${API_BASE}/v1/auth/key-status`, {
        headers: { "Authorization": API_KEY ? `Bearer ${API_KEY}` : "" }
      });
      const data = await response.json();
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    } catch (err) {
      return { content: [{ type: "text", text: `Error checking quota: ${err.message}` }], isError: true };
    }
  }

  return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error running TokenMarkdown MCP server:", err);
  process.exit(1);
});
