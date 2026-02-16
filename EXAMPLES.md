# BotEmail.ai MCP Server - Usage Examples

## Example 1: Create a Bot Email Account

**You say to Claude:**
> "I need a new email account for my automation bot. Call it 'automation-helper'."

**Claude uses:**
```javascript
use_mcp_tool("botemail", "create_bot_email", {
  username: "automation-helper"
})
```

**Result:**
```json
{
  "email": "automation-helper_bot@botemail.ai",
  "apiKey": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
}
```

---

## Example 2: Check for New Emails

**You say to Claude:**
> "Check if I have any new emails at automation-helper_bot@botemail.ai. Here's my API key: a1b2c3d4-e5f6-7890-abcd-ef1234567890"

**Claude uses:**
```javascript
use_mcp_tool("botemail", "get_emails", {
  email: "automation-helper_bot@botemail.ai",
  apiKey: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
})
```

**Result:**
```json
{
  "emails": [
    {
      "id": "email_123abc",
      "from": "sender@example.com",
      "to": "automation-helper_bot@botemail.ai",
      "subject": "Your verification code",
      "timestamp": "2026-02-16T17:30:00Z",
      "bodyText": "Your code is: 123456"
    }
  ]
}
```

**Claude responds:**
> "You have 1 new email from sender@example.com with the subject 'Your verification code'. The message contains: Your code is: 123456"

---

## Example 3: Read a Specific Email

**You say to Claude:**
> "Show me the full details of email ID email_123abc"

**Claude uses:**
```javascript
use_mcp_tool("botemail", "get_email_by_id", {
  email: "automation-helper_bot@botemail.ai",
  apiKey: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  emailId: "email_123abc"
})
```

**Result:**
```json
{
  "id": "email_123abc",
  "from": "sender@example.com",
  "to": "automation-helper_bot@botemail.ai",
  "cc": null,
  "subject": "Your verification code",
  "timestamp": "2026-02-16T17:30:00Z",
  "bodyText": "Your code is: 123456\n\nThis code expires in 10 minutes.",
  "bodyHtml": "<p>Your code is: <strong>123456</strong></p><p>This code expires in 10 minutes.</p>",
  "attachments": []
}
```

---

## Example 4: Set Up a Webhook

**You say to Claude:**
> "Set up a webhook at https://myapp.com/webhook for incoming emails"

**Claude uses:**
```javascript
use_mcp_tool("botemail", "register_webhook", {
  email: "automation-helper_bot@botemail.ai",
  apiKey: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  webhookUrl: "https://myapp.com/webhook"
})
```

**Result:**
```json
{
  "success": true,
  "message": "Webhook registered successfully"
}
```

---

## Example 5: Multi-Step Automation Workflow

**You say to Claude:**
> "Create a new bot email, then check if there are any emails waiting."

**Claude executes:**

1. **Step 1:** Create account
```javascript
const account = use_mcp_tool("botemail", "create_bot_email", {
  username: "workflow-bot"
});
// Returns: { email: "workflow-bot_bot@botemail.ai", apiKey: "xyz..." }
```

2. **Step 2:** Check emails with new credentials
```javascript
const emails = use_mcp_tool("botemail", "get_emails", {
  email: account.email,
  apiKey: account.apiKey
});
```

**Claude responds:**
> "I've created workflow-bot_bot@botemail.ai and checked for emails. The inbox is currently empty."

---

## Example 6: Extract Verification Code

**You say to Claude:**
> "Check my bot's inbox and extract any verification codes"

**Claude workflow:**
1. Fetches all emails
2. Scans for patterns like "code is: 123456" or "verification: ABC123"
3. Extracts and presents codes

**Claude responds:**
> "I found 2 verification codes in your inbox:
> - From github.com: 456789 (received 5 minutes ago)
> - From google.com: ABC123 (received 2 hours ago)"

---

## Tips for Best Results

1. **Store API Keys Securely** - Don't hardcode them in your prompts
2. **Use Descriptive Usernames** - Makes it easier to remember what each bot is for
3. **Check Regularly** - Emails are stored for 6 months, but checking regularly keeps things fresh
4. **Webhooks for Real-Time** - Set up webhooks if you need instant notifications

---

## Common Use Cases

- 🤖 **Testing signup flows** - Verify email verification works
- 📧 **Automation testing** - End-to-end email testing
- 🔐 **2FA code retrieval** - Automatically extract verification codes
- 🔔 **Monitoring** - Watch for specific emails or alerts
- 📊 **Data collection** - Aggregate emails from multiple sources

---

For more information, visit: https://botemail.ai
