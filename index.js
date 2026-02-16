#!/usr/bin/env node
// BotEmail.ai MCP Server
// Allows Claude to create and manage bot email accounts via Model Context Protocol

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import fetch from 'node-fetch';

const API_BASE = process.env.BOTEMAIL_API || 'https://botemail.ai';
const API_KEY = process.env.BOTEMAIL_API_KEY;

class BotEmailMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'botemail-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  setupErrorHandling() {
    this.server.onerror = (error) => {
      console.error('[MCP Error]', error);
    };

    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'create_bot_email',
          description: 'Create a new bot email account at botemail.ai',
          inputSchema: {
            type: 'object',
            properties: {
              username: {
                type: 'string',
                description: 'Username for the bot (lowercase, letters, numbers, underscores, hyphens only)',
              },
            },
            required: ['username'],
          },
        },
        {
          name: 'get_emails',
          description: 'Get inbox for a bot email account',
          inputSchema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                description: 'Bot email address (e.g., mybot_bot@botemail.ai)',
              },
              apiKey: {
                type: 'string',
                description: 'API key for the bot account',
              },
            },
            required: ['email', 'apiKey'],
          },
        },
        {
          name: 'get_email_by_id',
          description: 'Get a specific email by ID',
          inputSchema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                description: 'Bot email address',
              },
              emailId: {
                type: 'string',
                description: 'Email ID to retrieve',
              },
              apiKey: {
                type: 'string',
                description: 'API key for the bot account',
              },
            },
            required: ['email', 'emailId', 'apiKey'],
          },
        },
        {
          name: 'register_webhook',
          description: 'Register a webhook URL to receive push notifications for new emails',
          inputSchema: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
                description: 'Bot email address',
              },
              webhookUrl: {
                type: 'string',
                description: 'URL to send webhook notifications to',
              },
              apiKey: {
                type: 'string',
                description: 'API key for the bot account',
              },
            },
            required: ['email', 'webhookUrl', 'apiKey'],
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_bot_email':
            return await this.createBotEmail(args.username);

          case 'get_emails':
            return await this.getEmails(args.email, args.apiKey);

          case 'get_email_by_id':
            return await this.getEmailById(args.email, args.emailId, args.apiKey);

          case 'register_webhook':
            return await this.registerWebhook(args.email, args.webhookUrl, args.apiKey);

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async createBotEmail(username) {
    const response = await fetch(`${API_BASE}/api/create-account`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            email: data.email,
            apiKey: data.apiKey,
            message: data.message,
          }, null, 2),
        },
      ],
    };
  }

  async getEmails(email, apiKey) {
    const response = await fetch(`${API_BASE}/api/emails/${encodeURIComponent(email)}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async getEmailById(email, emailId, apiKey) {
    const response = await fetch(
      `${API_BASE}/api/emails/${encodeURIComponent(email)}/${emailId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async registerWebhook(email, webhookUrl, apiKey) {
    const response = await fetch(`${API_BASE}/api/webhook/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        botEmail: email,
        webhookUrl,
        apiKey,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('BotEmail.ai MCP server running on stdio');
  }
}

const server = new BotEmailMCPServer();
server.run().catch(console.error);
