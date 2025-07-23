# 開発貢献ガイド - CONTRIBUTING

ケアパッケージプロジェクトへの開発参加に関するガイドラインです。

## 📋 目次

- [開発フロー](#-開発フロー)
- [ブランチ戦略](#-ブランチ戦略)  
- [コミット規約](#-コミット規約)
- [Pull Request](#-pull-request)
- [コード品質管理](#-コード品質管理)
- [開発環境構築](#-開発環境構築)
- [パッケージ管理](#-パッケージ管理)

## 🔄 開発フロー

### 基本的な作業の流れ

1. **📝 仕様策定**
   - 実装する機能の仕様を `/docs` にドキュメント化
   - Obsidian形式に準じて統一

2. **📋 作業計画立案**
   - 作業計画を `/docs/backlog` にドキュメント化
   - ファイル名: `YYYY-MM-DD_{作業内容}.md`
   - **必須**: 作業計画策定後、Geminiと人間のレビューを受ける

3. **🌿 作業ブランチ作成**
   - ブランチ名: `feature/YYYY-MM-DD_作業内容`
   - メインブランチ（`main`）から分岐

4. **💻 開発作業**
   - 一連の作業を工程ごとに区切って実行
   - 工程ごとに静的解析・型チェックを実施
   - 工程ごとにコミット実行

5. **🔄 Pull Request作成**
   - PR概要に実装内容を詳細記載
   - 人間によるレビューを受ける

6. **✅ マージ実行**
   - 人間からの承認後にマージ

### ⚠️ 重要な注意事項

- **技術選定時**: 経験則で実装せず、必ずGeminiや人間に壁打ちしてから実装
- **ディレクトリ移動**: `cd`コマンド使用時は現在ディレクトリを確認
- **動作確認**: 設定変更・依存関係追加後は必ず動作確認してからコミット

## 🌿 ブランチ戦略

### ブランチ命名規約

```
feature/YYYY-MM-DD_機能名         # 新機能開発
fix/YYYY-MM-DD_修正内容          # バグ修正
docs/YYYY-MM-DD_ドキュメント名    # ドキュメント更新
```

### 例

```bash
feature/2025-01-23_google-oauth-integration
fix/2025-01-23_database-connection-error  
docs/2025-01-23_api-documentation-update
```

### ブランチ運用

- **メインブランチ**: `main` - 本番環境デプロイ用
- **作業ブランチ**: 上記命名規約に従って作成
- **直接push禁止**: メインブランチへの直接pushは禁止

## 📝 コミット規約

### コミットメッセージ

- **言語**: 日本語で記述
- **形式**: 端的で分かりやすく
- **頻度**: 1タスクごとにコミット

### 良いコミットメッセージの例

```bash
Google OAuth認証フローを実装
ユーザー管理APIエンドポイントを追加
データベーススキーマにstoresテーブルを追加
フロントエンドのログイン画面UIを修正
```

### コミット単位

- **適切な分割**: ファイルを一気にステージングせず、変更内容に応じて分割
- **整合性確保**: 各コミットが動作する状態を維持
- **ステージし忘れ注意**: 単一作業時もファイル追加し忘れに注意

## 🔄 Pull Request

### PR作成時のチェックリスト

- [ ] **Issue番号を記載** - `Closes #4` 形式で対応Issue番号を明記
- [ ] **変更内容の説明** - 実装した機能・修正内容を詳細記載
- [ ] **テスト実行** - 関連するテストが通ることを確認
- [ ] **静的解析クリア** - `pnpm check`でlint/formatエラーがないことを確認
- [ ] **動作確認** - 実装した機能が期待通り動作することを確認

### PRテンプレート

```markdown
## 概要
<!-- 実装した機能・修正内容の概要 -->

## 変更内容
<!-- 具体的な変更点をリスト形式で -->
- 
- 

## 関連Issue
Closes #

## テスト
<!-- 実行したテスト内容 -->
- [ ] ユニットテスト
- [ ] 動作確認
- [ ] 静的解析クリア

## その他
<!-- 特記事項があれば記載 -->
```

## ⚡ コード品質管理

### Biomeによる品質管理

プロジェクトでは **Biome** を使用してコード品質を統一管理しています。

#### 全体実行コマンド
```bash
pnpm lint        # 全パッケージでlintチェック
pnpm check       # 全パッケージでlint + formatチェック  
pnpm format      # 全パッケージでフォーマット実行
```

#### 個別パッケージ実行
```bash
pnpm --filter=@care-package/admin lint    # admin パッケージのみ
pnpm --filter=@care-package/api check     # api パッケージのみ
```

#### 各パッケージ内での実行
```bash
cd packages/admin
pnpm lint       # Biome lintチェック
pnpm check      # Biome check（lint + format）
pnpm format     # Biome フォーマット
```

### 推奨開発フロー

1. **コード変更後**: `pnpm check` でlint/formatチェック
2. **エラー修正**: `pnpm format` で自動修正 → 手動修正
3. **コミット前**: 再度 `pnpm check` で最終確認

### コードスタイル

- **TypeScript**: 型安全性を重視、`any`型の使用を避ける
- **命名規約**: camelCase（変数・関数）、PascalCase（型・コンポーネント）
- **コメント**: 必要最小限、見て分かるコメントは不要
- **インポート順序**: Biome設定に従う（外部ライブラリ → 内部モジュール）

## 🚀 開発環境構築

### 前提条件

```bash
Node.js: 18.x以上
pnpm: 8.x以上  
Docker: 20.x以上
Docker Compose: 2.x以上
PostgreSQL: 15.x以上
```

### セットアップ手順

```bash
# 1. リポジトリクローン
git clone <repository-url>
cd care-package

# 2. 依存関係インストール
pnpm install

# 3. 環境変数設定
cp packages/api/.env.example packages/api/.env
# .envファイルを適切に編集

# 4. データベース起動
docker-compose up -d

# 5. マイグレーション実行
cd packages/api
pnpm db:migrate

# 6. 開発サーバー起動
cd ../..
pnpm dev
```

### 各アプリケーションアクセス

- **運営管理サイト**: http://localhost:3000
- **API サーバー**: http://localhost:8000  
- **Drizzle Studio**: http://localhost:4983
- **PostgreSQL**: localhost:5432

## 📦 パッケージ管理

### パッケージマネージャー

- **使用ツール**: `pnpm` （npm, yarnは使用禁止）
- **モノリポ管理**: `Turborepo`

### 依存関係インストール規約

```bash
# バージョン固定インストール（必須）
pnpm add -E <package-name>

# 最新版インストール
pnpm add -E <package-name>@latest

# 開発依存関係
pnpm add -DE <package-name>
```

### ⚠️ 重要事項

- **バージョン範囲禁止**: `^`, `~` を使わず正確なバージョン番号指定
- **適切なパッケージ配置**: 依存関係は必要なパッケージに直接インストール（ルート避ける）
- **インストール後確認**: 依存関係追加後は必ず動作確認

### パッケージ構成

```
packages/
├── shared/          # 共通ライブラリ・型定義
├── api/             # Honoバックエンド  
├── admin/           # 運営側管理サイト
├── store-admin/     # 店舗経営者向け管理サイト（未実装）
└── store-site/      # 店舗サイト（未実装）
```

## 🔍 トラブルシューティング

### よくある問題

#### 1. 型エラーが解決しない
```bash
# TypeScriptキャッシュクリア
rm -rf node_modules/.cache
pnpm install
```

#### 2. データベース接続エラー
```bash
# Docker コンテナ再起動
docker-compose down
docker-compose up -d
```

#### 3. pnpmコマンドが動かない
```bash
# pnpm バージョン確認・更新
pnpm --version
npm install -g pnpm@latest
```

## 🤝 質問・相談

- **技術的質問**: Gemini MCPを活用して技術調査・実装確認
- **プロジェクト方針**: 人間への確認・相談
- **エラー解決**: Geminiによるエラー分析・解決策提案

## 📚 関連ドキュメント

- [README.md](./README.md) - プロジェクト概要
- [プロジェクト概要](./docs/プロジェクト概要.md) - 詳細な機能仕様
- [技術スタック](./docs/技術スタック.md) - 技術選定理由  
- [データベース設計](./docs/データベース設計.md) - DB設計詳細

---

**このガイドラインに従って、品質の高い開発を進めていきましょう！** 🚀