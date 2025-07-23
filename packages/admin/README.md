# @care-package/admin

> **ケアパッケージ運営側管理サイト**  
> React SPA + TypeScript による運営者向け管理ダッシュボード

## 📋 概要

個人店向け集客支援Webアプリ「ケアパッケージ」の運営側管理サイトです。
システム全体の管理、ユーザー・店舗管理、売上分析などの運営業務を効率的に行うためのWebアプリケーションです。

### 主な機能

- 🏠 **ダッシュボード**: システム全体の利用状況・売上概要
- 👥 **ユーザー管理**: 店舗経営者アカウントの管理
- 🏪 **店舗管理**: 登録店舗の情報管理・承認
- 📊 **分析・レポート**: 利用状況分析・売上レポート
- ⚙️ **システム設定**: 各種設定・メンテナンス機能
- 💳 **課金管理**: 料金プラン設定・売上管理

## 🛠️ 技術スタック

- **フレームワーク**: React 19 + TypeScript
- **ビルドツール**: Vite 7.0
- **ルーティング**: React Router v7
- **状態管理**: React Context API
- **UIライブラリ**: Tailwind CSS 4.1 + Radix UI
- **HTTP クライアント**: Axios
- **認証**: JWT ベース認証

## 🚀 開発環境セットアップ

### 前提条件

- Node.js 18+
- pnpm 8+
- APIサーバー（`@care-package/api`）が起動済み

### 初回セットアップ

```bash
# プロジェクトルートで依存関係インストール
pnpm install

# 開発サーバー起動
pnpm --filter=@care-package/admin dev

# または、このディレクトリで直接実行
cd packages/admin
pnpm dev
```

### アクセス

- **開発サーバー**: http://localhost:3000
- **管理者ログイン**: 
  - Email: `admin@example.com`
  - Password: （APIの.envで設定したパスワード）

## 💻 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# プレビュー（ビルド後の確認）
pnpm preview

# 型チェック
pnpm type-check

# コード品質管理
pnpm lint          # Lintチェック
pnpm check         # Lint + Format チェック
pnpm format        # フォーマット実行
```

## 🎨 UIコンポーネント

### デザインシステム

- **カラーパレット**: Tailwind CSS カスタムテーマ
- **コンポーネント**: モダンで直感的なインターフェース
- **レスポンシブ**: デスクトップ・タブレット対応

### 主要コンポーネント

```typescript
// レイアウト
import { Layout } from './components/Layout/Layout'
import { Header } from './components/Layout/Header'
import { Sidebar } from './components/Layout/Sidebar'

// 認証
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthContext } from './contexts/AuthContext'
```

### ページ構成

```
pages/
├── LoginPage.tsx         # ログイン画面
├── DashboardPage.tsx     # ダッシュボード
├── UsersPage.tsx         # ユーザー管理
└── StoresPage.tsx        # 店舗管理
```

## 🔐 認証フロー

### ログイン処理

```typescript
// AuthContext.tsx
const login = async (email: string, password: string) => {
  const response = await api.post('/auth/admin/login', {
    email,
    password
  })
  
  const { token, user } = response.data
  localStorage.setItem('token', token)
  setUser(user)
}
```

### 認証済みルート保護

```typescript
// App.tsx
<ProtectedRoute>
  <Layout>
    <Routes>
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/users" element={<UsersPage />} />
      <Route path="/stores" element={<StoresPage />} />
    </Routes>
  </Layout>
</ProtectedRoute>
```

## 📊 データ管理

### APIクライアント

```typescript
// lib/api.ts
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// 認証トークン自動付与
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### データフェッチング例

```typescript
// UsersPage.tsx
const [users, setUsers] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data)
    } catch (error) {
      console.error('ユーザー取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }
  
  fetchUsers()
}, [])
```

## 🌐 画面一覧

### 🏠 ダッシュボード（`/dashboard`）
- システム全体の利用状況
- 売上サマリー
- 新規登録・アクティブユーザー数
- 最近のアクティビティ

### 👥 ユーザー管理（`/users`）
- 店舗経営者一覧・検索
- ユーザー詳細情報・編集
- アカウント状態管理（有効/無効）
- 招待・削除機能

### 🏪 店舗管理（`/stores`）
- 登録店舗一覧・検索
- 店舗詳細情報・編集
- 店舗承認・却下
- 契約状況管理

### ⚙️ システム設定
- アプリケーション設定
- メンテナンスモード
- 通知設定

## 🔧 プロジェクト構成

```
src/
├── App.tsx               # アプリケーションルート
├── main.tsx             # エントリーポイント
├── index.css            # グローバルスタイル
├── components/          # 再利用可能コンポーネント
│   ├── Layout/
│   │   ├── Layout.tsx   # メインレイアウト
│   │   ├── Header.tsx   # ヘッダー
│   │   └── Sidebar.tsx  # サイドバー
│   └── ProtectedRoute.tsx
├── contexts/            # React Context
│   └── AuthContext.tsx  # 認証状態管理
├── hooks/               # カスタムフック
├── lib/                 # ライブラリ・ユーティリティ
│   └── api.ts           # API クライアント
├── pages/               # ページコンポーネント
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── UsersPage.tsx
│   └── StoresPage.tsx
└── types/               # TypeScript 型定義
```

## 🚨 トラブルシューティング

### APIサーバー接続エラー

```bash
# APIサーバーが起動しているか確認
curl http://localhost:8000/health

# APIサーバー起動
cd ../api && pnpm dev
```

### 認証エラー

```bash
# ローカルストレージのトークンをクリア
localStorage.removeItem('token')

# ブラウザの開発者ツールでNetwork タブを確認
# 401 Unauthorizedエラーの場合は再ログイン
```

### ビルドエラー

```bash
# 型チェック実行
pnpm type-check

# shared パッケージの型更新
cd ../shared && pnpm build

# 再ビルド
pnpm build
```

## 🎨 UI/UX ガイドライン

### カラーパレット
- **プライマリー**: ブルー系（信頼感・プロフェッショナル）
- **アクセント**: グリーン系（成功・アクション）
- **警告**: オレンジ・レッド系（注意・エラー）

### レスポンシブ対応
- **デスクトップ**: 1200px以上（メイン対象）
- **タブレット**: 768px-1199px
- **モバイル**: 768px未満（基本非対応、管理者向けのため）

## 🔗 関連ドキュメント

- [プロジェクト概要](../../README.md)
- [開発貢献ガイド](../../CONTRIBUTING.md)
- [システム構成](../../docs/2_architecture/system_overview.md)
- [APIサーバー](../api/README.md)

## 📈 今後の予定

- **Phase 3**: 店舗経営者管理機能強化
- **Phase 4**: 分析・レポート機能追加
- **Phase 5**: 課金管理機能実装
- **Phase 6**: 高度な分析・ダッシュボード

---

**効率的な運営業務を支援する、モダンで使いやすい管理ダッシュボード** 📊