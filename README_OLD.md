# System Monitor MCP

Mac のパフォーマンス問題を診断し、具体的な解決策を提案する Claude Desktop 用 MCP サーバーです。

## 📦 インストール

### npmからインストール（推奨）

```bash
npm install -g system-monitor-mcp
```

### GitHubからインストール

```bash
# リポジトリをクローン
git clone https://github.com/system-monitor-team/system-monitor-mcp.git
cd system-monitor-mcp

# 依存関係をインストール
npm install

# グローバルにリンク
npm link
```

## ⚙️ Claude Desktop設定

Claude Desktop で使用するには、設定ファイルに以下を追加してください：

### macOS の場合

`~/Library/Application Support/Claude/claude_desktop_config.json` を編集：

```json
{
  "mcpServers": {
    "system-monitor": {
      "command": "system-monitor-mcp"
    }
  }
}
```

### npmでグローバルインストールしていない場合

```json
{
  "mcpServers": {
    "system-monitor": {
      "command": "node",
      "args": ["/path/to/system-monitor-mcp/server/index.js"]
    }
  }
}
```

## 機能

### 🔍 主要ツール

- **diagnose_performance**: 「なんで今パソコン重いの？」という疑問に答える総合診断
- **get_system_snapshot**: CPU、メモリ、ディスク、ネットワークの現在状況を取得
- **analyze_processes**: リソースを多く使っているプロセスを特定・分析
- **kill_process**: 安全にプロセスを終了
- **get_startup_apps**: 起動時に自動実行されるアプリの一覧

### 💡 診断内容

- **CPU 使用率**: 高負荷プロセスの特定と対処法
- **メモリ使用量**: メモリ不足の原因と解決策
- **ディスク状況**: 容量不足や I/O 集中の警告
- **プロセス分析**: Chrome のタブ過多、開発プロセスなど
- **温度監視**: CPU 温度の異常検知

## 使用例

### 基本的な診断

```
ユーザー: 「MacBook が急に重くなったんですが、何が原因でしょうか？」

Claude: システムを診断しています...

🔍 システム診断結果
🟡 総合健康度: 65/100
パフォーマンスの問題が検出されました。

⚠️ 検出された問題

🟡 CPU使用率が高めです
CPU使用率が78.4%です

影響: システムの応答が遅くなる可能性があります

関連プロセス:
- Google Chrome Helper: CPU 35.2%, メモリ 1.2GB
- Adobe Photoshop: CPU 25.8%, メモリ 3.4GB
- node: CPU 12.1%, メモリ 0.8GB

⚡ 今すぐできる対処法
1. Chromeを再起動（現在CPU 35.2%使用中）
2. Adobe Photoshopを一時終了（CPU 25.8%使用中）
3. 使っていない開発サーバーを停止

🎯 長期的な改善提案
1. バックグラウンドアプリの自動起動を無効化
2. Chromeのタブ管理を改善
3. 同時使用アプリ数を制限
```

### システム状況の確認

```
ユーザー: 「現在のシステム状況を教えて」

Claude: 📊 システム状況スナップショット
取得時刻: 2025年6月30日 14:30:15

🔥 CPU状況
- モデル: Apple M1 Pro
- 使用率: 45.2%
- コア数: 10コア（物理: 8）
- 温度: 52°C

💾 メモリ状況
- 使用率: 75.8%
- 使用量: 12.1GB / 16.0GB
- 空き容量: 3.9GB
- メモリ圧迫レベル: 🟡 warning

💿 ストレージ状況
- 使用率: 82.5%
- 使用量: 412GB / 500GB
- 空き容量: 88GB
```

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. Desktop Extension としてパッケージ化

```bash
# DXT CLI をインストール
npm install -g @anthropic-ai/dxt

# Extension をパッケージ化
dxt pack

# 生成された .dxt ファイルを Claude Desktop にドラッグ&ドロップ
```

### 3. Claude Desktop での設定

1. 生成された `system-monitor.dxt` ファイルをダウンロード
2. Claude Desktop の設定画面を開く
3. Extensions セクションに `.dxt` ファイルをドラッグ&ドロップ
4. "Install" をクリック

## 技術仕様

### 対応プラットフォーム

- macOS (Darwin) のみ

### 必要環境

- Node.js 18.0.0 以上
- Claude Desktop 1.0.0 以上

### 使用ライブラリ

- `@modelcontextprotocol/sdk`: MCP プロトコル実装
- `systeminformation`: クロスプラットフォーム システム情報取得
- `zod`: スキーマ検証

### セキュリティ

- システムプロセスの終了は安全性チェック付き
- sudo 権限は不要（一部機能除く）
- 個人データの収集・送信なし

## 開発

### ローカル実行

```bash
npm run dev
```

### テスト

```bash
# MCP Inspector でテスト
npx @modelcontextprotocol/inspector node server/index.js
```

## トラブルシューティング

### よくある問題

1. **CPU 温度が取得できない**

   - `sudo` 権限なしでは一部の温度情報を取得できません
   - 基本機能には影響しません

2. **プロセス終了ができない**

   - システムプロセスは安全のため終了できません
   - `force=true` オプションで強制終了可能（注意が必要）

3. **起動時アプリが表示されない**
   - macOS のセキュリティ設定で AppleScript の実行が制限されている可能性があります

## ライセンス

MIT License

## 貢献

Issue や Pull Request をお待ちしています。

## 免責事項

このツールはシステム診断を目的としており、重要なプロセスの終了は慎重に行ってください。データの損失や予期しないシステム動作について、開発者は責任を負いません。
