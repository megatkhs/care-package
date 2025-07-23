---
tags:
  - 開発環境
  - セットアップ
  - 新規参画者
type: ガイド
status: 作成中
created: 2025-01-23
updated: 2025-01-23
---

# 新規参画者向け開発環境セットアップ

> [!info] このガイドについて
> ケアパッケージプロジェクトの開発に初めて参加する方向けの環境構築手順です。

## 📋 前提条件

### 必要なソフトウェア

| ソフトウェア | バージョン | 用途 |
|-------------|-----------|------|
| **Node.js** | 18.x以上 | JavaScript実行環境 |
| **pnpm** | 8.x以上 | パッケージマネージャー |
| **Docker** | 20.x以上 | コンテナ仮想化 |
| **Docker Compose** | 2.x以上 | 複数コンテナ管理 |
| **Git** | 2.x以上 | バージョン管理 |

### 推奨ツール

| ツール | 用途 | 備考 |
|--------|------|------|
| **VS Code** | エディタ | TypeScript拡張推奨 |
| **Postman/Insomnia** | API テスト | REST API確認用 |
| **pgAdmin/DBeaver** | DB管理 | PostgreSQL管理用 |

## 🚀 セットアップ手順

### 1. Node.js のインストール

```bash
# Node.js 18.x LTS版をインストール
# 公式サイト: https://nodejs.org/

# バージョン確認
node --version  # v18.x.x 以上
npm --version   # 9.x.x 以上
```

### 2. pnpm のインストール

```bash
# pnpm をグローバルインストール
npm install -g pnpm@latest

# バージョン確認
pnpm --version  # 8.x.x 以上
```

### 3. Docker のインストール

```bash
# Docker Desktop をインストール
# 公式サイト: https://www.docker.com/products/docker-desktop

# バージョン確認
docker --version         # Docker version 20.x.x 以上
docker-compose --version # Docker Compose version 2.x.x 以上
```

### 4. リポジトリのクローン

```bash
# プロジェクトリポジトリをクローン
git clone <repository-url>
cd care-package

# ブランチ確認
git branch  # main ブランチにいることを確認
```

### 5. 依存関係のインストール

```bash
# 全パッケージの依存関係をインストール
pnpm install

# インストール成功確認
pnpm list --depth=0
```

### 6. 環境変数の設定

```bash
# APIサーバーの環境変数ファイルを作成
cp packages/api/.env.example packages/api/.env

# 環境変数を編集（重要な設定項目）
vim packages/api/.env
```

#### 重要な環境変数

```bash
# データベース接続
DATABASE_URL="postgresql://postgres:password@localhost:5432/care_package_dev"

# JWT設定
JWT_SECRET="your-super-secret-jwt-key-here"

# 管理者アカウント（初期設定用）
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="secure-password"

# Google OAuth（Phase 3で必要）
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 7. データベースの起動

```bash
# Docker Compose でPostgreSQLを起動
docker-compose up -d

# コンテナ状況確認
docker-compose ps

# ログ確認（問題があれば）
docker-compose logs db
```

### 8. データベースマイグレーション

```bash
# APIディレクトリに移動
cd packages/api

# マイグレーション実行
pnpm db:migrate

# 成功メッセージを確認
# ✅ Migration completed successfully
```

### 9. 開発サーバーの起動

```bash
# プロジェクトルートに戻る
cd ../..

# 全パッケージの開発サーバーを起動
pnpm dev
```

### 10. 動作確認

以下のURLにアクセスして正常に表示されることを確認：

| アプリケーション | URL | 確認内容 |
|-----------------|-----|----------|
| **運営管理サイト** | http://localhost:3000 | ログイン画面が表示される |
| **API サーバー** | http://localhost:8000/health | `{"status":"ok"}` が返却される |
| **Drizzle Studio** | http://localhost:4983 | データベース管理画面 |

## 🔧 開発ツールのセットアップ

### VS Code 拡張機能

推奨する拡張機能をインストール：

```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Git 設定

```bash
# Git ユーザー情報設定
git config user.name "Your Name"
git config user.email "your.email@example.com"

# 改行コード設定（Windows の場合）
git config core.autocrlf true
```

## 📊 初回データ投入

### 開発用データ作成

```bash
# APIディレクトリで実行
cd packages/api

# シードデータ投入（開発用）
pnpm db:seed

# 管理者アカウント作成
pnpm create:admin
```

### 動作テスト

```bash
# 運営管理サイトにログイン
# URL: http://localhost:3000
# Email: admin@example.com
# Password: （.envで設定したパスワード）
```

## 🐛 トラブルシューティング

### よくある問題と解決策

#### 1. `pnpm install` が失敗する

```bash
# npm キャッシュクリア
npm cache clean --force

# pnpm ストアクリア
pnpm store prune

# 再インストール
rm -rf node_modules
pnpm install
```

#### 2. Docker が起動しない

```bash
# Docker Desktop が起動していることを確認
# システムトレイ/メニューバーでDocker アイコンを確認

# ポート競合の確認
lsof -i :5432  # PostgreSQL
lsof -i :6379  # Redis

# 競合するプロセスを終了
sudo kill -9 <PID>
```

#### 3. データベース接続エラー

```bash
# データベースコンテナの状態確認
docker-compose ps

# データベース再起動
docker-compose restart db

# ログ確認
docker-compose logs db
```

#### 4. 型エラーが解決しない

```bash
# TypeScript キャッシュクリア
rm -rf node_modules/.cache
rm -rf packages/*/node_modules/.cache

# 再インストール
pnpm install
```

#### 5. 開発サーバーが起動しない

```bash
# ポート使用状況確認
lsof -i :3000  # フロントエンド
lsof -i :8000  # API

# プロセス終了
kill -9 <PID>

# 再起動
pnpm dev
```

## 📚 次のステップ

環境構築が完了したら、以下のドキュメントを参照してください：

- [[development_rules]] - 開発・コーディング規約
- [[api_design]] - API設計ガイド
- [[../2_architecture/system_overview]] - システム構成の理解
- [[../../CONTRIBUTING.md]] - 開発貢献ガイド

## 🆘 サポート

問題が解決しない場合：

1. **Gemini MCP** による技術調査・エラー分析
2. **プロジェクト担当者** への相談
3. **GitHub Issues** での質問投稿

---

**環境構築お疲れさまでした！これで開発を開始できます 🚀**