---
name: ntfy
description: 透過 ntfy.sh 發送推播通知到手機或桌面。當用戶說「完成後通知」、「通知我」、「提醒我」、「notify」時觸發。支援標題、優先級、標籤、emoji、點擊連結、附件、動作按鈕等功能。免費服務，無需註冊。
---

# ntfy 通知服務

使用 HTTP PUT/POST 發送推播通知。Topic 為公開，選擇不易猜測的名稱。

## 基本發送

```bash
curl -d "訊息內容" ntfy.sh/{topic}
```

## JSON 格式（推薦）

POST 到 `ntfy.sh`（不是 topic 路徑）：

```bash
curl -H "Content-Type: application/json" -d '{
  "topic": "mytopic",
  "title": "標題",
  "message": "訊息內容",
  "priority": 4,
  "tags": ["warning", "skull"],
  "click": "https://example.com"
}' ntfy.sh
```

## 所有可用欄位

| 欄位 | 說明 | 範例 |
|------|------|------|
| `topic` | 必填，目標 topic | `"mytopic"` |
| `message` | 訊息內容 | `"Hello"` |
| `title` | 通知標題 | `"Alert"` |
| `priority` | 1-5（1最低，5最高） | `5` |
| `tags` | emoji 或標籤陣列 | `["warning", "tag1"]` |
| `click` | 點擊通知開啟的 URL | `"https://..."` |
| `attach` | 附件 URL | `"https://.../file.jpg"` |
| `filename` | 附件檔名 | `"image.jpg"` |
| `icon` | 通知圖示 URL | `"https://.../icon.png"` |
| `delay` | 延遲發送 | `"30m"`, `"1h"`, `"tomorrow 10am"` |
| `actions` | 動作按鈕陣列 | 見下方 |
| `markdown` | 啟用 Markdown | `true` |

## 優先級

| 值 | 名稱 | 效果 |
|----|------|------|
| 5 | `max/urgent` | 長震動、彈出通知 |
| 4 | `high` | 長震動、彈出通知 |
| 3 | `default` | 預設震動與聲音 |
| 2 | `low` | 無震動聲音，下拉才見 |
| 1 | `min` | 靜音，折疊在其他通知下 |

## 常用 Emoji Tags

| Tag | Emoji | Tag | Emoji |
|-----|-------|-----|-------|
| `white_check_mark` | ✅ | `warning` | ⚠️ |
| `heavy_check_mark` | ✔️ | `rotating_light` | 🚨 |
| `tada` | 🎉 | `skull` | 💀 |
| `partying_face` | 🥳 | `no_entry` | ⛔ |
| `+1` | 👍 | `-1` | 👎 |
| `rocket` | 🚀 | `fire` | 🔥 |
| `bell` | 🔔 | `mega` | 📣 |

完整列表：https://docs.ntfy.sh/emojis/

## 動作按鈕

```json
{
  "actions": [
    {
      "action": "view",
      "label": "開啟網站",
      "url": "https://example.com"
    },
    {
      "action": "http",
      "label": "呼叫 API",
      "url": "https://api.example.com/action",
      "method": "POST",
      "body": "{\"key\": \"value\"}",
      "clear": true
    }
  ]
}
```

動作類型：
- `view`：開啟 URL
- `http`：發送 HTTP 請求
- `broadcast`：Android 廣播

## 完整範例

```bash
curl -H "Content-Type: application/json" -d '{
  "topic": "alerts",
  "title": "🚨 伺服器警報",
  "message": "CPU 使用率超過 90%\n請立即處理",
  "priority": 5,
  "tags": ["rotating_light", "server"],
  "click": "https://monitor.example.com",
  "markdown": true,
  "actions": [
    {"action": "view", "label": "查看監控", "url": "https://monitor.example.com"},
    {"action": "http", "label": "重啟服務", "url": "https://api.example.com/restart", "method": "POST"}
  ]
}' ntfy.sh
```

## 延遲發送

```json
{
  "topic": "reminders",
  "message": "記得開會",
  "delay": "30m"
}
```

支援格式：`30m`、`2h`、`1 day`、`tomorrow 10am`、`Tuesday 8am`、Unix 時間戳

## 使用 Header（非 JSON）

```bash
curl \
  -H "Title: 標題" \
  -H "Priority: high" \
  -H "Tags: warning,server" \
  -H "Click: https://example.com" \
  -d "訊息內容" \
  ntfy.sh/mytopic
```

## 免費版限制

- 每日訊息：250 則
- 附件大小：15MB
- 附件保留：3 小時
- 訊息快取：12 小時
- 速率限制：每 5 秒 1 則（最多 burst 60 則）

## 重要規則

1. JSON 格式必須 POST 到 `ntfy.sh`，不是 `ntfy.sh/topic`
2. Topic 為公開，使用難以猜測的名稱
3. `tags` 必須是陣列，不是字串
4. `priority` 用數字 1-5，不是字串
