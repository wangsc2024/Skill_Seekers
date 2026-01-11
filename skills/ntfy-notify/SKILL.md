---
name: ntfy-notify
description: |
  透過 ntfy.sh 發送任務完成通知。當用戶說「完成後通知 xxx」、
  「做完通知 xxx」、「完成後提醒 xxx」時，xxx 即為 ntfy topic，
  任務完成後用 curl 發送通知到 ntfy.sh/xxx。
triggers:
  - "通知"
  - "提醒"
  - "notify"
  - "完成後通知"
  - "做完通知"
  - "完成後提醒"
  - "處理完提醒"
---

# ntfy 通知 (ntfy Notification Skill)

任務完成後透過 ntfy.sh 發送推播通知，讓你在手機或桌面即時收到任務狀態。

## 什麼是 ntfy？

[ntfy](https://ntfy.sh) 是一個簡單的 HTTP-based 推播通知服務：
- 完全免費、開源
- 無需註冊或 API Key
- 支援 iOS、Android、桌面通知
- 只需要一個 topic 名稱即可接收通知

## 觸發條件

當用戶指令中包含以下模式時觸發：

| 用戶指令範例 | 提取的 topic |
|-------------|-------------|
| 「做完這個功能後通知 wangsc2025」 | `wangsc2025` |
| 「完成後通知 my-alerts」 | `my-alerts` |
| 「處理完提醒 test123」 | `test123` |

### 觸發關鍵字

- `通知 + topic名稱`
- `提醒 + topic名稱`
- `完成後通知 + topic名稱`
- `做完通知 + topic名稱`

## 通知發送格式

**使用 JSON 格式發送，完美支援中文標題與訊息，跨平台無亂碼問題。**

### 基本格式

```bash
curl -H "Content-Type: application/json" -d '{"topic":"TOPIC","message":"訊息內容"}' ntfy.sh
```

### 成功通知

```bash
curl -H "Content-Type: application/json" -d '{"topic":"TOPIC","title":"任務完成","message":"Task summary here","tags":["white_check_mark"]}' ntfy.sh
```

### 失敗通知

```bash
curl -H "Content-Type: application/json" -d '{"topic":"TOPIC","title":"任務失敗","message":"Error description","priority":4,"tags":["x"]}' ntfy.sh
```

### 進度通知

```bash
curl -H "Content-Type: application/json" -d '{"topic":"TOPIC","title":"進行中","message":"Progress: 50%","tags":["hourglass_flowing_sand"]}' ntfy.sh
```

## JSON 欄位說明

| 欄位 | 必填 | 說明 |
|------|------|------|
| `topic` | 是 | 通知頻道名稱 |
| `message` | 是 | 通知內容 |
| `title` | 否 | 通知標題（支援中文） |
| `tags` | 否 | 標籤陣列，自動轉為 emoji |
| `priority` | 否 | 優先級 1-5（5 最高） |
| `click` | 否 | 點擊通知開啟的 URL |
| `delay` | 否 | 延遲發送（如 "30m", "1h"） |

## 完整範例

### 範例 1: 建立專案

**用戶指令：** 幫我建立 React 專案，做完通知 wangsc2025

**完成後執行：**
```bash
curl -H "Content-Type: application/json" -d '{"topic":"wangsc2025","title":"任務完成","message":"React project created at ./my-react-app","tags":["white_check_mark"]}' ntfy.sh
```

### 範例 2: 跑測試

**成功：**
```bash
curl -H "Content-Type: application/json" -d '{"topic":"ci-alerts","title":"測試通過","message":"46 tests passed, 85% coverage","tags":["white_check_mark","test_tube"]}' ntfy.sh
```

**失敗：**
```bash
curl -H "Content-Type: application/json" -d '{"topic":"ci-alerts","title":"測試失敗","message":"3 tests failed","priority":4,"tags":["x","test_tube"]}' ntfy.sh
```

### 範例 3: 部署

```bash
curl -H "Content-Type: application/json" -d '{"topic":"ops-team","title":"部署成功","message":"v2.1.0 deployed to production","tags":["rocket","white_check_mark"]}' ntfy.sh
```

## 進階用法

### 帶連結

```bash
curl -H "Content-Type: application/json" -d '{"topic":"TOPIC","title":"PR 已合併","message":"PR #123 merged","tags":["white_check_mark"],"click":"https://github.com/user/repo/pull/123"}' ntfy.sh
```

### 延遲通知

```bash
curl -H "Content-Type: application/json" -d '{"topic":"TOPIC","title":"提醒","message":"30 分鐘提醒","delay":"30m"}' ntfy.sh
```

### 高優先級（緊急）

```bash
curl -H "Content-Type: application/json" -d '{"topic":"TOPIC","title":"緊急","message":"Server down!","priority":5,"tags":["fire","warning"]}' ntfy.sh
```

## 重要規則

**禁止使用附件功能**：發送通知時不要使用 `attach` 欄位，只發送純文字訊息。

## 如何接收通知

1. **手機 App**
   - iOS: [App Store](https://apps.apple.com/app/ntfy/id1625396347)
   - Android: [Google Play](https://play.google.com/store/apps/details?id=io.heckel.ntfy)

2. **訂閱 Topic**
   - 開啟 App → 點擊 + → 輸入 topic 名稱

3. **桌面通知**
   - 訪問 https://ntfy.sh/YOUR_TOPIC
   - 允許瀏覽器通知

## 常用 Tags

Tags 會自動轉換為 emoji：

| Tag | Emoji | 用途 |
|-----|-------|------|
| `white_check_mark` | ✅ | 成功 |
| `x` | ❌ | 失敗 |
| `warning` | ⚠️ | 警告 |
| `hourglass_flowing_sand` | ⏳ | 進行中 |
| `rocket` | 🚀 | 部署 |
| `test_tube` | 🧪 | 測試 |
| `package` | 📦 | 打包 |
| `bug` | 🐛 | Bug |
| `chart` | 📊 | 報告 |
| `tada` | 🎉 | 慶祝 |
| `fire` | 🔥 | 緊急 |

## 快速範本

**成功：**
```bash
curl -H "Content-Type: application/json" -d '{"topic":"TOPIC","title":"任務完成","message":"DESCRIPTION","tags":["white_check_mark"]}' ntfy.sh
```

**失敗：**
```bash
curl -H "Content-Type: application/json" -d '{"topic":"TOPIC","title":"任務失敗","message":"DESCRIPTION","priority":4,"tags":["x"]}' ntfy.sh
```

## 注意事項

- Topic 是公開的，使用不易猜測的名稱
- 避免放敏感資訊
- 免費版每天約 250 條限制

---

**Generated by Skill Seekers** | ntfy Notification Skill
