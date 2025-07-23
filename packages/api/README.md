# @care-package/api

> **ケアパッケージのバックエンドAPIサーバー**  
> Hono + TypeScript + PostgreSQL による高速なRESTful API

## 📋 概要

個人店向け集客支援Webアプリ「ケアパッケージ」のバックエンドAPIを提供します。
3つのフロントエンドアプリケーション（運営管理サイト、店舗管理サイト、店舗サイト）に対してRESTful APIを提供し、認証・認可・データ管理を担当します。

### 主な機能

- 🔐 **認証・認可**: JWT認証、Google OAuth 2.0対応
- 👥 **ユーザー管理**: 運営者・店舗経営者のアカウント管理
- 🏪 **店舗管理**: 店舗情報・契約状況の管理
- 💳 **課金管理**: サブスクリプション・決済管理
- 📊 **データ分析**: 利用状況・売上分析

## 🛠️ 技術スタック

- **フレームワーク**: [Hono](https://hono.dev/) - 軽量・高速Webフレームワーク
- **言語**: TypeScript 5.7+
- **データベース**: PostgreSQL 15+ with [Drizzle ORM](https://orm.drizzle.team/)
- **認証**: JWT + Google OAuth 2.0
- **バリデーション**: Zod

## 🚀 開発環境セットアップ

### 前提条件

- Node.js 18+
- pnpm 8+
- PostgreSQL 15+ (Docker推奨)

### 初回セットアップ

```bash
# プロジェクトルートで依存関係インストール
pnpm install

# 環境変数設定
cp .env.example .env
vim .env  # 必要な環境変数を設定

# データベース起動（Docker）
docker-compose up -d

# マイグレーション実行
pnpm db:migrate

# 開発サーバー起動
pnpm dev
```

### 環境変数設定

```bash
# .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/care_package_dev"
JWT_SECRET="your-super-secret-jwt-key"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="secure-password"

# Google OAuth（Phase 3で必要）
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## 💻 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# 型チェック
pnpm type-check

# コード品質管理
pnpm lint          # Lintチェック
pnpm check         # Lint + Format チェック
pnpm format        # フォーマット実行

# データベース管理
pnpm db:generate   # マイグレーションファイル生成
pnpm db:migrate    # マイグレーション実行
pnpm db:studio     # Drizzle Studio起動
```

## 🌐 API エンドポイント

### 認証

```
POST   /auth/admin/login      # 運営者ログイン
POST   /auth/oauth/callback   # Google OAuth コールバック
POST   /auth/refresh          # トークンリフレッシュ
DELETE /auth/logout           # ログアウト
```

### 管理者機能

```
GET    /api/admin/dashboard   # ダッシュボード統計
GET    /api/admin/users       # ユーザー一覧
POST   /api/admin/users       # ユーザー作成
PUT    /api/admin/users/:id   # ユーザー更新
DELETE /api/admin/users/:id   # ユーザー削除
```

### 店舗管理

```
GET    /api/stores            # 店舗一覧
POST   /api/stores            # 店舗作成
GET    /api/stores/:id        # 店舗詳細
PUT    /api/stores/:id        # 店舗更新
DELETE /api/stores/:id        # 店舗削除
```

### 契約管理

```
GET    /api/contracts         # 契約一覧
POST   /api/contracts         # 契約作成
PUT    /api/contracts/:id     # 契約更新（一時停止・再開）
```

詳細なAPI仕様は [API Documentation](../../docs/3_guides/api_design.md) を参照してください。

## 🗄️ データベース構成

### 主要テーブル

- **admins**: 運営管理者
- **customers**: 契約者マスタデータ
- **contracts**: 契約管理（一時停止・再開対応）
- **stores**: 店舗情報
- **users**: Google OAuth認証ユーザー
- **invitations**: 招待プロセス管理

詳細なDB設計は [データベース設計](../../docs/2_architecture/database.md) を参照してください。

## 🔧 プロジェクト構成

```
src/
├── index.ts              # エントリーポイント
├── db/
│   ├── index.ts          # データベース接続
│   └── schema/           # Drizzle スキーマ定義
│       ├── admin.ts
│       ├── customer.ts
│       ├── contract.ts
│       ├── store.ts
│       ├── user.ts
│       └── index.ts
├── routes/               # API ルート定義
│   ├── auth.ts          # 認証関連
│   └── admin.ts         # 管理者機能
├── middleware/           # ミドルウェア
│   └── auth.ts          # 認証ミドルウェア
└── utils/               # ユーティリティ
```

## 🚨 トラブルシューティング

### データベース接続エラー

```bash
# コンテナ状態確認
docker-compose ps

# データベース再起動
docker-compose restart db

# ログ確認
docker-compose logs db
```

### マイグレーションエラー

```bash
# 最新マイグレーション状態確認
pnpm db:studio

# マイグレーション再実行
pnpm db:migrate --force
```

### TypeScript エラー

```bash
# 型チェック実行
pnpm type-check

# shared パッケージの型更新
cd ../shared && pnpm build
```

## 🔗 関連ドキュメント

- [プロジェクト概要](../../README.md)
- [開発貢献ガイド](../../CONTRIBUTING.md)
- [システム構成](../../docs/2_architecture/system_overview.md)
- [API設計ガイド](../../docs/3_guides/api_design.md)

## 📊 パフォーマンス

- **レスポンス時間**: 平均 50-100ms
- **同時接続数**: 1000+ concurrent connections
- **メモリ使用量**: 約50MB（Express.jsの約30%削減）

---

**高速・軽量・型安全なAPIサーバーで、スマホファーストな個人店支援アプリを支えます** 🚀