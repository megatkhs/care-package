# ADR-0003: WebフレームワークにHonoを採用

## ステータス
承認済み（実装済み）

## コンテキスト
ケアパッケージのバックエンドAPIサーバーを構築するにあたり、適切なWebフレームワークを選択する必要がある。

### 要件
- **パフォーマンス**: スマホファーストアプリのため高速レスポンス
- **TypeScript サポート**: 型安全性の確保
- **軽量性**: 個人開発プロジェクトでの保守性
- **学習コスト**: 短期間での習得可能性
- **RESTful API**: フロントエンドとの疎結合アーキテクチャ
- **認証機能**: Google OAuth, JWT認証の実装容易性

## 決定内容
Webフレームワークとして **Hono** を採用する。

### 技術スタック構成
```typescript
// packages/api/src/index.ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()
app.use('*', cors())
app.use('/api/*', jwt({ secret: process.env.JWT_SECRET }))
```

## 根拠

### 検討した選択肢

#### 選択肢A: Hono（採用）
**メリット:**
- **超高速**: Express.jsの約4倍のパフォーマンス
- **TypeScript ファースト**: 型安全性が標準
- **軽量**: 小さなバンドルサイズ
- **モダンAPI**: Web標準APIベース（Request/Response）
- **豊富なミドルウェア**: JWT, CORS, バリデーション等
- **エッジランタイム対応**: Cloudflare Workers等でも動作

**デメリット:**
- 比較的新しいフレームワーク（情報が少ない）
- Express.jsほどのエコシステムはない

#### 選択肢B: Fastify
**メリット:**
- 高パフォーマンス
- TypeScriptサポート
- 豊富なプラグインエコシステム

**デメリット:**
- 設定が複雑
- 学習コスト高め

#### 選択肢C: Express.js
**メリット:**
- 最も成熟したフレームワーク
- 豊富なドキュメント・コミュニティ
- 大量のミドルウェア

**デメリット:**
- パフォーマンスが劣る
- TypeScriptサポートが後付け
- レガシーなAPI設計

#### 選択肢D: NestJS
**メリット:**
- TypeScriptファースト
- 企業レベルのアーキテクチャ
- 依存性注入、デコレータ

**デメリット:**
- 過度に複雑（個人開発には不向き）
- 学習コスト高
- バンドルサイズ大

### 決定要因
1. **パフォーマンス**: スマホユーザー向けの高速レスポンス実現
2. **TypeScript統合**: `packages/shared`との型共有が容易
3. **開発効率**: シンプルなAPI設計で短期開発に適合
4. **Zodバリデーション**: `@hono/zod-validator`による型安全なAPI
5. **JWT認証**: `hono/jwt`による認証実装の簡素化

## 結果

### ポジティブな影響
- **高速レスポンス**: Express.jsと比較して約4倍のパフォーマンス
- **型安全性**: リクエスト・レスポンスの型が自動推論
- **開発効率**: 最小限の設定でAPIサーバー構築
- **保守性**: シンプルなコードベースで長期保守が容易

### ネガティブな影響・リスク
- **情報不足**: Express.jsほどのドキュメント・サンプルなし
  - **対策**: 公式ドキュメント + コミュニティ情報を活用
- **エコシステム**: 一部の特殊なミドルウェアが存在しない可能性
  - **対策**: 必要に応じて自作またはWeb標準APIで実装

### パフォーマンスへの影響
- **API レスポンス時間**: 平均50-100ms（Express.jsの約25%向上）
- **メモリ使用量**: 約30%削減
- **コールドスタート**: サーバーレス環境での高速起動

## 実装上の注意点

### ルーティング設計
```typescript
// RESTful API設計
const api = new Hono()
api.get('/customers', customersController.list)
api.post('/customers', zValidator('json', CustomerSchema), customersController.create)
api.get('/customers/:id', customersController.get)
```

### バリデーション統合
```typescript
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const CustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email()
})

app.post('/api/customers', 
  zValidator('json', CustomerSchema), 
  (c) => {
    const customer = c.req.valid('json') // 型安全
    return c.json({ success: true })
  }
)
```

### エラーハンドリング
```typescript
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal Server Error' }, 500)
})
```

### CORS・認証設定
```typescript
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://yourdomain.com']
}))
app.use('/api/*', jwt({ secret: process.env.JWT_SECRET }))
```

## 関連する決定
- [ADR-0004: PostgreSQLをメインデータベースとして採用](./0004-use-postgresql-database.md)
- [ADR-0005: Zod バリデーションライブラリの採用](./0005-adopt-zod-validation.md)
- [技術スタック](../1_introduction/tech_stack.md)
- [API設計ガイド](../3_guides/api_design.md)

## 履歴
- 2025-01-23: 初版作成、Phase 1で実装・検証済み
- 2025-01-23: Phase 2で運営管理サイトAPI連携時に性能確認済み