import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Resend } from "resend";
import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from the root .env.local
dotenv.config({ path: path.resolve(process.cwd(), "../../.env.local") });

const resend = new Resend(process.env.RESEND_API_KEY);

const server = new Server(
  {
    name: "resend-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List available tools.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "send_email",
        description: "Send an email using Resend",
        inputSchema: {
          type: "object",
          properties: {
            from: { type: "string", description: "Sender email (e.g., 'Coinvestopedia <hello@coinvestopedia.com>')" },
            to: { type: "array", items: { type: "string" }, description: "Recipient email addresses" },
            subject: { type: "string", description: "Email subject" },
            html: { type: "string", description: "Email body in HTML" },
            text: { type: "string", description: "Email body in plain text (fallback)" },
          },
          required: ["from", "to", "subject"],
        },
      },
      {
        name: "get_api_status",
        description: "Check if the Resend API key is valid and working",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

/**
 * Handle tool calls.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === "send_email") {
      const { from, to, subject, html, text } = z.object({
        from: z.string(),
        to: z.array(z.string()),
        subject: z.string(),
        html: z.string().optional(),
        text: z.string().optional(),
      }).parse(args);

      const response = await resend.emails.send({
        from,
        to,
        subject,
        html: html || "",
        text: text || "",
      });

      return {
        content: [{ type: "text", text: JSON.stringify(response, null, 2) }],
      };
    }

    if (name === "get_api_status") {
      // Try to fetch a simple resource to verify the key
      const response = await resend.domains.list();
      const status = response.data ? "Connected" : "Error";
      return {
        content: [{ type: "text", text: `API Status: ${status}` }],
      };
    }

    throw new Error(`Tool not found: ${name}`);
  } catch (error: any) {
    return {
      content: [{ type: "text", text: `Error: ${error.message}` }],
      isError: true,
    };
  }
});

/**
 * Start the server using stdio transport.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Resend MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
