# TipTagPWA Cloudflare Pages 部署指南

本指南說明如何將 TipTagPWA 部署到 Cloudflare Pages。

## 前置需求

- Node.js 18+
- Cloudflare 帳號
- Git 儲存庫（GitHub、GitLab 或其他）

## 部署方式

### 方式一：透過 Cloudflare Dashboard（推薦）

1. **登入 Cloudflare Dashboard**
   - 前往 https://dash.cloudflare.com
   - 選擇「Pages」

2. **建立專案**
   - 點擊「Create a project」
   - 選擇「Connect to Git」
   - 授權並選擇您的 Git 儲存庫

3. **設定建置配置**
   ```
   Framework preset: Next.js (Static HTML Export)
   Build command: npm run build
   Build output directory: out
   Root directory: TipTagPWA（如果是子目錄）
   ```

4. **環境變數**（可選）
   - `NODE_VERSION`: 18

5. **部署**
   - 點擊「Save and Deploy」
   - 等待建置完成

### 方式二：透過 Wrangler CLI

1. **安裝依賴**
   ```bash
   cd TipTagPWA
   npm install
   ```

2. **建置專案**
   ```bash
   npm run build
   ```

3. **登入 Cloudflare**
   ```bash
   npx wrangler login
   ```

4. **部署**
   ```bash
   npx wrangler pages deploy out --project-name=tiptag-pwa
   ```

### 方式三：使用內建腳本

```bash
# 一鍵建置並部署
npm run pages:deploy
```

## 本地預覽

使用 Wrangler 在本地預覽 Cloudflare Pages 環境：

```bash
# 先建置
npm run build

# 本地預覽
npm run preview
```

然後打開 http://localhost:8788

## 建置輸出

建置後會產生 `out/` 目錄，包含：

```
out/
├── index.html          # 主頁面
├── _next/              # Next.js 靜態資源
│   └── static/         # JS、CSS 等
├── icons/              # PWA 圖示
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
├── _headers            # Cloudflare 自訂 headers
└── _redirects          # SPA 路由重導向
```

## 自訂網域

1. 在 Cloudflare Pages 專案設定中選擇「Custom domains」
2. 新增您的網域
3. 按照指示設定 DNS

## 環境變數

如需設定環境變數（例如 API 金鑰），在 Cloudflare Dashboard 中：

1. 進入專案設定
2. 選擇「Environment variables」
3. 新增變數（生產/預覽環境可分別設定）

**注意**：前端變數需以 `NEXT_PUBLIC_` 開頭。

## PWA 功能

部署後，PWA 功能會自動啟用：

- 離線支援（透過 Service Worker）
- 可安裝到主畫面
- 推送通知（需額外配置）

## 故障排除

### 建置失敗

1. 確認 Node.js 版本 >= 18
2. 檢查 `npm run build` 是否在本地成功
3. 查看 Cloudflare Pages 建置日誌

### 404 錯誤

確認 `_redirects` 檔案存在於 `public/` 目錄中。

### Service Worker 問題

清除瀏覽器快取並重新載入。

## 效能優化

Cloudflare Pages 已內建：

- 全球 CDN 分發
- 自動 Brotli/Gzip 壓縮
- HTTP/3 支援
- 邊緣快取

額外優化建議：

1. 使用 `_headers` 設定適當的快取策略
2. 壓縮圖片資源
3. 使用 Cloudflare 的圖片優化功能

## 相關連結

- [Cloudflare Pages 文件](https://developers.cloudflare.com/pages/)
- [Next.js Static Export](https://nextjs.org/docs/pages/building-your-application/deploying/static-exports)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
