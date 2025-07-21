# ケアパッケージ - 個人店向け集客支援Webアプリ

## プロジェクト概要
最寄り駅から離れた位置に店舗を構えている集客に困っている個人店の経営者向けの、スマホで完結する集客支援ツール

## 主要機能

### 店舗経営者向け管理サイト
- **MEO対策機能**: GoogleMapやAppleMapなどのMEO機能
- **店舗情報管理**: 基本情報、営業時間、メニュー等の更新
- **Googleマイビジネス連携**: Googleマイビジネスの情報を更新できる機能
- **口コミ管理**: 口コミの管理機能
- **お知らせ投稿**: 店舗サイトへのお知らせ配信
- **プラン・課金管理**: サブスクリプション契約状況確認

### 運営側管理サイト
- **ユーザー管理**: 店舗経営者アカウント管理
- **店舗管理**: 全店舗の情報管理
- **システム設定**: 各種設定管理
- **分析・レポート**: 利用状況分析
- **課金管理**: 料金プラン設定、売上管理
- **決済管理**: 支払い状況、未払い管理

### 店舗サイト (顧客向け)
- **店舗情報表示**: 基本情報、営業時間、アクセス
- **お知らせ表示**: 最新情報の配信
- **SEO対応**: 検索エンジン最適化
- **SNSシェア対応**: OGP設定

## 技術スタック

### フロントエンド（3つのアプリケーション）
1. **店舗経営者向け管理サイト**: React SPA (TypeScript)
2. **運営側管理サイト**: React SPA (TypeScript)
3. **店舗サイト**: Next.js (TypeScript) - SEO重視
- レスポンシブデザイン（スマホ最適化）

### バックエンド
- **Node.js** (TypeScript)
- **Hono** (軽量・高速なWeb framework)
- RESTful API設計（フロントエンドと疎結合）

### データベース
- **PostgreSQL** (リレーショナルDB、スケーラブル)
- または **MongoDB** (NoSQL、柔軟なスキーマ)

### 認証
- **Google OAuth 2.0** (パスワード不要、スマホユーザー向け)

### 決済システム
- **PAY.JP** (日本特化、個人事業主向け)
- クレジットカード決済対応
- サブスクリプション課金機能

### 外部API連携
- Google Maps API
- Google My Business API
- Apple Maps API（将来的に）
- PAY.JP API（決済処理）

## 開発環境
- **Turborepo** モノリポジトリ管理
- **Docker** コンテナ化
- **Git** バージョン管理
- **ESLint/Prettier** コード品質管理

## 推奨アーキテクチャ
```mermaid
graph TB
    A[店舗経営者管理サイト<br/>React SPA] --> D[Backend API<br/>Hono]
    B[運営側管理サイト<br/>React SPA] --> D
    C[店舗サイト<br/>Next.js SSR] --> D
    
    D --> E[Database<br/>PostgreSQL]
    D --> F[Google Maps API]
    D --> G[Google My Business API]
    D --> H[Apple Maps API]
    D --> I[PAY.JP API]
    
    subgraph "External APIs"
        F
        G
        H
        I
    end
    
    subgraph "Frontend Applications"
        A
        B
        C
    end
    
    subgraph "Backend Services"
        D
        E
    end
```

## 開発フェーズ
1. **Phase 1**: 共通バックエンド構築・基本認証
2. **Phase 2**: 店舗経営者向け管理サイト（基本機能）
3. **Phase 3**: 運営側管理サイト（ユーザー管理）
4. **Phase 4**: 決済機能（PAY.JP連携）
5. **Phase 5**: 店舗サイト（Next.js、SEO対応）
6. **Phase 6**: Google Maps API連携・MEO機能
7. **Phase 7**: Googleマイビジネス連携
8. **Phase 8**: 口コミ管理機能

## 運用方針
- スモールスタートでMVP開発
- 段階的な機能追加
- スマホファーストなUX/UI設計
- 個人店経営者の使いやすさを重視
- 日本国内向けサービス
- サブスクリプション課金モデル
- モノリポジトリで統一管理

## プロジェクト構成
```
care-package/
├── packages/
│   ├── shared/          # 共通ライブラリ・型定義
│   ├── api/             # Honoバックエンド
│   ├── store-admin/     # 店舗経営者向け管理サイト
│   ├── admin/           # 運営側管理サイト
│   └── store-site/      # 店舗サイト（Next.js）
├── docker-compose.yml
├── package.json
├── turbo.json
└── README.md
```

## 推奨パッケージ
### フロントエンド共通
- React Router (SPA routing - 管理サイト用)
- Axios (API通信)
- Material-UI または Tailwind CSS (UI components)
- React Hook Form (フォーム管理)

### Next.js (店舗サイト用)
- Next.js App Router
- next-seo (SEO最適化)
- SWR または TanStack Query (データフェッチ)

### バックエンド
- Hono (Web framework)
- Hono OAuth middleware (OAuth認証)
- Zod (バリデーション・Honoとの相性良い)
- dotenv (環境変数管理)
- @hono/cors (CORS設定)
- payjp (PAY.JP決済API)

### 開発ツール
- Turborepo (モノリポジトリ管理)
- Vite (フロントエンドビルド)
- Nodemon (バックエンド開発)
- Jest (テスト)
- Docker Compose (開発環境)
- Prisma または Drizzle ORM (データベース管理)

## 開発の進め方

### 作業フロー
1. **GitHub Issue作成**: 作業計画を記載してレビューを受ける
2. **作業ブランチ作成**: `feature/issue-番号-作業内容` 形式
3. **開発作業**: 適宜コミットを行う
4. **Pull Request作成**: 作業概要を記載してレビューを受ける
5. **レビュー完了後**: mainブランチにマージ

### 遵守すべきルール
- 応答は必ず日本語ですること
- コミットメッセージは日本語で端的に書くこと
- コード内のコメントは必要な場合にのみ書くこと
  - コードをひと目見てわかるようなコメントはしない

## 開発中に指示された軌道修正・注意事項

### パッケージ管理に関する指示
1. **パッケージマネージャー指定**: pnpmを利用
2. **依存関係のバージョン固定**: 依存関係をインストールする際は、バージョン範囲（^, ~）を使わず、正確なバージョン番号を指定すること
   - インストールするときは、 `-E` フラグを使うこと

### 開発フローに関する指示
1. **作業フロー遵守**: GitHub Issueの作業計画をレビューしてから作業を開始すること
2. **コミット頻度**: 1タスクごとにコミットすること
3. **ファイル管理**: 
   - ファイルを一気にステージングせず、適切に分割してコミットすること
      - 連続していくつかの作業をした場合の話であり、単一の作業をしている場合を除く(ステージし忘れがないように気をつけること)
   - 変更内容に応じて適切なコミットメッセージを書くこと

### 動作確認に関する指示
1. **設定変更後の確認**: 設定ファイルを作成・変更した後は、必ず動作確認を行ってからコミットすること
2. **依存関係追加後の確認**: 新しい依存関係を追加した後は、実際に動作するか確認すること

### Issue・PR管理に関する指示
1. **進捗更新**: 作業の進捗に応じてIssueの内容を更新すること
2. **整合性確認**: PRとIssueの内容が整合しているか確認すること
3. **適切なマージ**: 作業完了後はPRをマージし、対応するIssueをクローズすること
4. **PR作成時の注意**:
   - 対応するIssue番号を必ず概要に含めること（例：`Closes #4`）
   - 依存関係は適切なパッケージにインストールすること（ルートではなく必要なパッケージに）

### 開発プロセスに関する指示
1. **作業ブランチ作成**: Phase開始時は必ず作業ブランチを作成すること
2. **PRコメント対応**:
   - 修正は観点ごとに分けてコミットすること
   - 修正内容とコミットIDを併記してコメントに返信すること
3. **動作確認後の処理**: 開発サーバー等のプロセスを起動した場合は、動作確認後に必ずkillすること
4. **最新バージョンインストール**: 最新バージョンをインストールする際はバージョン指定せず`-E`フラグのみ使用
5. **技術選定**: 不明確な部分については憶測で対応せず、必ず人間に確認を求めること

### コード品質管理
Biomeを使用したコード品質管理コマンドが利用可能です：

**ワークスペース全体での実行**:
```bash
pnpm lint        # 全パッケージでlintチェック
pnpm check       # 全パッケージでlint + formatチェック
pnpm format      # 全パッケージでフォーマット実行
```

**個別パッケージでの実行**:
```bash
# 例：adminパッケージのみ
pnpm --filter=@care-package/admin lint
pnpm --filter=@care-package/admin check
pnpm --filter=@care-package/admin format

# 例：apiパッケージのみ
pnpm --filter=@care-package/api lint
```

**各パッケージ内での実行**:
```bash
cd packages/admin
pnpm lint       # Biome lintチェック
pnpm check      # Biome check（lint + format）
pnpm format     # Biome フォーマット
```

**開発時の推奨フロー**:
1. コード変更後、必ず `pnpm check` でlint/formatチェック
2. エラーがある場合は `pnpm format` で自動修正
3. 手動修正が必要な場合は適切に対応
4. コミット前に再度 `pnpm check` で確認

