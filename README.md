# BotEmail.ai MCP Server

Model Context Protocol (MCP) server for [BotEmail.ai](https://botemail.ai) - Email infrastructure for autonomous agents.

## What is this?

This MCP server allows Claude Desktop (and other MCP clients) to create and manage bot email accounts on BotEmail.ai directly through the AI interface.

## Features

- **Create bot email accounts** - Get a new `yourbot_bot@botemail.ai` address instantly
- **Fetch emails** - Retrieve all emails for a bot account
- **Read specific emails** - Get full details of any message
- **Register webhooks** - Set up push notifications for incoming emails

## Installation

### Prerequisites

- Node.js 18+ installed
- Claude Desktop or another MCP client

### Setup

1. Clone this repository:
```bash
git clone https://github.com/claw-silhouette/botemail-mcp-server.git
cd botemail-mcp-server
```

2. Install dependencies:
```bash
npm install
```

3. Configure Claude Desktop:

Edit your Claude Desktop config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

Add this to the `mcpServers` section:

```json
{
  "mcpServers": {
    "botemail": {
      "command": "node",
      "args": ["/absolute/path/to/botemail-mcp-server/index.js"]
    }
  }
}
```

4. Restart Claude Desktop

## Usage

Once configured, you can ask Claude to:

- "Create a new bot email account for my automation"
- "Check if I have any emails at mybot@botemail.ai"
- "Show me the latest email in my bot's inbox"
- "Set up a webhook for incoming emails"

**See [EXAMPLES.md](EXAMPLES.md) for detailed usage examples!**

## Available Tools

### `create_bot_email`

Create a new bot email account.

**Parameters:**
- `username` (string, optional) - Username for the bot (will become `username_bot@botemail.ai`). If omitted, generates random username like `9423924_bot@botemail.ai`

**Returns:**
- `email` - The full email address created
- `apiKey` - Authentication key for this account

### `get_emails`

Get all emails for a bot account.

**Parameters:**
- `email` (string, required) - Full email address (e.g., `mybot_bot@botemail.ai`)
- `apiKey` (string, required) - API key for authentication

**Returns:**
- `emails` - Array of email objects with id, from, to, subject, timestamp, bodyText

### `get_email_by_id`

Get a specific email by ID.

**Parameters:**
- `email` (string, required) - Bot email address
- `apiKey` (string, required) - API key
- `emailId` (string, required) - Email ID to retrieve

**Returns:**
- Full email object with all headers and body content

### `register_webhook`

Register a webhook URL for push notifications.

**Parameters:**
- `email` (string, required) - Bot email address
- `apiKey` (string, required) - API key
- `webhookUrl` (string, required) - Your webhook endpoint URL

**Returns:**
- Confirmation of webhook registration

## API Endpoint

All tools connect to: `https://api.botemail.ai`

## Example

```javascript
// Claude can do this for you:
const result = await use_mcp_tool("botemail", "create_bot_email", {
  username: "myautomation"
});

console.log(result.email);  // myautomation_bot@botemail.ai
console.log(result.apiKey); // Your API key for this account
```

## Architecture

This MCP server is a thin wrapper around the BotEmail.ai REST API. It translates MCP tool calls into HTTP requests and returns formatted responses.

## Links

- **Main Site**: https://botemail.ai
- **API Documentation**: https://botemail.ai/docs
- **Dashboard**: https://botemail.ai/dashboard

## License

MIT

## Support

- Email: support@botemail.ai
- Issues: https://github.com/claw-silhouette/botemail-mcp-server/issues
