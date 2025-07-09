# macOS システムモニター - Claude Desktop 拡張機能

**Macが遅い原因を診断して、解決策を提案します。**

## 🚀 クイックスタート

### 📥 直接ダウンロード・インストール

**最新バージョン: v1.0.1**

[![Download system-monitor-macos-1.0.1.dxt](https://img.shields.io/badge/Download-system--monitor--macos--1.0.1.dxt-blue?style=for-the-badge&logo=download)](https://github.com/nobita2041/macos-system-monitor-dxt/raw/main/system-monitor-macos-1.0.1.dxt)

1. **上のダウンロードボタンをクリック**して `system-monitor-macos-1.0.1.dxt` を取得
2. **ダウンロードしたファイルをダブルクリック**してClaude Desktopにインストール
3. **完了！** 拡張機能が使用可能になります。

---

このClaude Desktop拡張機能は、Claude内で直接アクティビティモニターレベルのシステム診断を提供し、macOS組み込みツールと同等の精度でMacのパフォーマンスを理解・最適化することができます。

## ✨ 機能

- **🔍 パフォーマンス診断**: CPU、メモリ、ディスク、ネットワーク使用量の包括的な分析
- **🎯 スマート問題検出**: 特定のパフォーマンスボトルネックとその解決策を特定
- **📊 アクティビティモニター統合**: macOSアクティビティモニターとシステム環境設定と一致する結果
- **🚀 プロセス分析**: 安全な終了オプション付きでリソースを多く消費するプロセスを特定
- **⚡ スタートアップアプリ管理**: 自動起動アプリケーションの一覧表示と分析
- **🧠 メモリインテリジェンス**: 圧縮率を含む高度なメモリ圧迫分析

## 📦 インストール方法

### 方法1: 直接インストール（推奨）

1. 上のボタンまたは[リリースページ](https://github.com/nobita2041/macos-system-monitor-dxt/releases)から最新の`.dxt`ファイルをダウンロード
2. `.dxt`ファイルをダブルクリックしてClaude Desktopにインストール
3. 完了！拡張機能が使用可能になります。

### 方法2: ソースから

```bash
# リポジトリをクローン
git clone https://github.com/nobita2041/macos-system-monitor-dxt.git
cd macos-system-monitor-dxt

# 依存関係をインストール
npm install

# 拡張機能をビルド
npm run build

# DXT CLIツールをインストール（まだインストールしていない場合）
npm install -g @anthropic-ai/dxt

# .dxtパッケージを作成
dxt pack

# 生成された.dxtファイルをClaude Desktopにインストール
open system-monitor-macos-1.0.0.dxt
```

## 🚀 使用方法

インストール後、Claudeに自然言語で質問することで拡張機能を使用できます：

### 使用例

**基本的なパフォーマンスチェック:**

```
"なぜ今Macが遅いのですか？"
```

**詳細分析:**

```
"技術的な詳細を含む詳細なシステムパフォーマンス分析をお願いします"
```

**プロセス調査:**

```
"最もCPUとメモリを使用しているプロセスは何ですか？"
```

**メモリ分析:**

```
"なぜメモリ使用量が高いのですか？内訳を教えてください"
```

**スタートアップ最適化:**

```
"ログイン時に自動的に起動するアプリは何ですか？"
```

## 🛠️ 利用可能なツール

この拡張機能は包括的なシステム分析のための以下のツールを提供します：

### 1. `diagnose_performance`

- **目的**: 「なぜMacが遅いのか？」に答えるメイン診断ツール
- **出力**: 具体的な推奨事項を含む包括的なパフォーマンス分析
- **パラメータ**:
  - `detailed` (オプション): 技術的な詳細を含める
  - `timeframe` (オプション): 分析時間枠（秒）

### 2. `get_system_snapshot`

- **目的**: 現在のシステムリソース使用状況
- **出力**: CPU、メモリ、ディスク、ネットワーク統計

### 3. `analyze_processes`

- **目的**: リソースを多く消費するプロセスの特定
- **出力**: 影響分析を含むCPUとメモリ使用量上位プロセス

### 4. `kill_process`

- **目的**: 問題のあるプロセスの安全な終了
- **パラメータ**:
  - `pid`: 終了するプロセスID
  - `name`: 確認用のプロセス名

### 5. `get_startup_apps`

- **目的**: 自動起動アプリケーションの一覧表示
- **出力**: 最適化提案を含むログイン時に起動するアプリケーション

## ⚙️ 設定

拡張機能はClaude Desktopの拡張機能設定を通じてユーザー設定をサポートします：

- **監視間隔**: パフォーマンスチェックの頻度（30-3600秒、デフォルト: 60）
- **CPU閾値**: CPU使用率のアラート閾値（50-95%、デフォルト: 80%）
- **メモリ閾値**: メモリ使用率のアラート閾値（70-95%、デフォルト: 85%）

## 🎯 精度・互換性

この拡張機能はmacOS専用に設計されており、以下と一致する結果を提供します：

- **アクティビティモニター**: CPU、メモリ、プロセス情報
- **システム環境設定 > ストレージ**: ディスク使用量と分類
- **ターミナルツール**: `vm_stat`、`memory_pressure`、`system_profiler`

### システム要件

- **プラットフォーム**: macOS（Darwin）のみ
- **アーキテクチャ**: Intel（x64）およびApple Silicon（arm64）
- **Node.js**: バージョン18.0.0以上
- **Claude Desktop**: バージョン0.7.0以上

## 🔒 プライバシー・セキュリティ

- **ローカル処理**: すべての分析はMac上でローカルに実行
- **データ収集なし**: システム情報は外部サービスに送信されません
- **安全な操作**: プロセス終了には安全確認が含まれます
- **最小権限**: システム情報の読み取りのみ、変更は行いません

## 🐛 トラブルシューティング

### 拡張機能がインストールできない

- Claude Desktop 0.7.0以上であることを確認
- macOSで実行していることを確認
- Claude Desktopの再起動を試してください

### ツールが利用できない

- Claude Desktopの拡張機能設定に拡張機能が表示されることを確認
- すべての権限が付与されていることを確認
- 必要に応じてClaude Desktopを再起動

### 不正確な結果

- 拡張機能はアクティビティモニターと同じAPIを使用
- 測定タイミングの違いにより差異が発生する可能性があります
- トラブルシューティングには、ターミナルコマンドと比較してください: `vm_stat`、`top -l 1`

## 📚 技術的詳細

### アーキテクチャ

- **MCPプロトコル**: Claude統合にModel Context Protocolを使用
- **Node.jsランタイム**: システムアクセス用にsysteminformationライブラリで構築
- **DXT形式**: ワンクリックインストール用のDesktop Extensionとしてパッケージ化

### データソース

- **CPU**: `systeminformation`と`top`によるリアルタイム使用量
- **メモリ**: Apple Silicon最適化を含む拡張`vm_stat`解析
- **ディスク**: 正確な容量のための`system_profiler`と`df`コマンド
- **プロセス**: リソース帰属を含むライブプロセス監視

## 🤝 貢献

貢献を歓迎します！ガイドラインについては[CONTRIBUTING.md](CONTRIBUTING.md)をご覧ください。

### 開発環境セットアップ

```bash
# クローンとセットアップ
git clone https://github.com/nobita2041/macos-system-monitor-dxt.git
cd macos-system-monitor-dxt
npm install

# 開発モードで実行
npm run dev

# MCP Inspectorでテスト
npx @modelcontextprotocol/inspector server/index.js
```

## 📄 ライセンス

MIT License - 詳細は[LICENSE](LICENSE)をご覧ください。

## 🙏 謝辞

- **Anthropic**: Claude Desktop Extension フレームワークの提供
- **MCP Community**: Model Context Protocol エコシステムの構築
- **systeminformation**: 包括的なシステム情報アクセスの提供

---

**システムパフォーマンスを理解したいMacユーザーのために❤️で作られました**
