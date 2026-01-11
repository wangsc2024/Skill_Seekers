---
name: context7
description: Context7 MCP 提供最新版本的程式庫文件。當需要查詢任何程式庫、框架、API 的最新文件時使用。觸發詞：「use context7」、「查文件」、「最新 API」、「框架文件」。可避免 LLM 產生過時或虛構的 API。
---

# Context7 MCP

從官方文件來源獲取最新、版本特定的程式庫文件與程式碼範例。

## 使用方式

在 prompt 中加入 `use context7`，或指定程式庫 ID：

```
用 Next.js 建立 middleware 來驗證 JWT。use context7
```

```
使用 /supabase/supabase 來實作基本認證
```

## 可用工具

### resolve-library-id

將程式庫名稱轉換為 Context7 相容的 ID。

參數：
- `libraryName`（必填）：要搜尋的程式庫名稱

### get-library-docs

使用 Context7 ID 獲取程式庫文件。

參數：
- `context7CompatibleLibraryID`（必填）：Context7 ID，如 `/mongodb/docs`、`/vercel/next.js`
- `topic`（選填）：聚焦特定主題，如 `routing`、`hooks`
- `tokens`（選填，預設 5000）：返回的最大 token 數，小於 1000 會自動調整為 1000

## MCP 設定

### 遠端連線（推薦）

```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "CONTEXT7_API_KEY": "YOUR_API_KEY"
      }
    }
  }
}
```

### 本地連線

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp", "--api-key", "YOUR_API_KEY"]
    }
  }
}
```

## 常見程式庫 ID

| 程式庫 | Context7 ID |
|--------|-------------|
| Next.js | /vercel/next.js |
| React | /facebook/react |
| Vue | /vuejs/vue |
| Supabase | /supabase/supabase |
| Tailwind CSS | /tailwindlabs/tailwindcss |
| MongoDB | /mongodb/docs |

## 自動觸發規則

在 MCP 客戶端設定以下規則可自動觸發：

```
Always use context7 when I need code generation, setup or configuration steps, or library/API documentation.
```

## 注意事項

- API Key 可從 https://context7.com/dashboard 免費取得
- 免費版有速率限制，付費版提供更高限制
- 斜線語法 `/org/project` 可直接指定程式庫，跳過搜尋步驟
