# @care-package/store-site

> **ケアパッケージ店舗サイト**  
> Next.js + TypeScript による顧客向け店舗サイト自動生成システム

## 📋 概要

個人店向け集客支援Webアプリ「ケアパッケージ」の顧客向け店舗サイトです。
各店舗専用のWebサイトを自動生成し、SEO最適化された高品質な店舗サイトを提供します。集客に困っている個人店が検索エンジンで見つけやすくなることを目指します。

### 主な機能（Phase 4-6で実装予定）

- 🌐 **店舗サイト自動生成**: 店舗情報に基づく動的サイト生成
- 🔍 **SEO最適化**: メタタグ・構造化データ・OGP設定
- 📱 **レスポンシブ対応**: スマホ・タブレット・デスクトップ完全対応
- 📢 **お知らせ表示**: 店舗からの最新情報配信
- 📍 **店舗情報表示**: 基本情報・営業時間・アクセス情報
- 🔗 **SNSシェア対応**: Twitter・Facebook・LINE対応
- 📊 **アクセス解析**: Google Analytics連携
- 🗺️ **地図表示**: Google Maps埋め込み

## 🛠️ 技術スタック（予定）

- **フレームワーク**: Next.js 14+ (App Router)
- **言語**: TypeScript
- **レンダリング**: SSR/ISR (静的サイト生成)
- **スタイリング**: Tailwind CSS
- **SEO**: next-seo + 構造化データ
- **地図**: Google Maps Embed API
- **分析**: Google Analytics 4
- **画像最適化**: Next.js Image Optimization
- **フォント**: Google Fonts

## 🚀 開発ステータス

> ⚠️ **現在未実装**  
> Phase 4で実装開始、Phase 6で高度なSEO機能追加予定

### Phase 4: 基本サイト生成（未実装）
- [ ] 動的ルーティング（`/stores/[storeId]`）
- [ ] 店舗情報表示ページ
- [ ] お知らせ一覧・詳細ページ
- [ ] 基本的なSEO対応（メタタグ・OGP）
- [ ] レスポンシブUI

### Phase 5: 機能強化
- [ ] 問い合わせフォーム
- [ ] アクセス解析連携
- [ ] ソーシャルメディア連携

### Phase 6: 高度なSEO・集客機能
- [ ] 構造化データ（JSON-LD）
- [ ] サイトマップ自動生成
- [ ] AMP対応（検討）
- [ ] PWA機能（オフライン対応）

## 🎯 SEO最適化戦略

### 基本的なSEO対応

```typescript
// pages/stores/[storeId]/index.tsx
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const store = await getStore(params.storeId)
  
  return {
    title: `${store.name} - ${store.category} | ケアパッケージ`,
    description: `${store.address}の${store.category}「${store.name}」。${store.description}`,
    keywords: [store.category, store.address, store.name],
    openGraph: {
      title: store.name,
      description: store.description,
      images: [store.mainImage],
      type: 'business.business',
    },
    twitter: {
      card: 'summary_large_image',
      title: store.name,
      description: store.description,
      images: [store.mainImage],
    }
  }
}
```

### 構造化データ（JSON-LD）

```typescript
// components/StructuredData.tsx
const businessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": store.name,
  "description": store.description,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": store.address,
    "addressCountry": "JP"
  },
  "telephone": store.phoneNumber,
  "openingHours": store.businessHours,
  "url": `https://care-package.com/stores/${store.id}`,
  "image": store.images
}
```

## 🌐 サイト構造設計

### URL構造

```
https://care-package.com/stores/
├── [storeId]/                    # 店舗トップページ
├── [storeId]/about              # 店舗について
├── [storeId]/menu               # メニュー・サービス
├── [storeId]/news               # お知らせ一覧
├── [storeId]/news/[newsId]      # お知らせ詳細
├── [storeId]/contact            # お問い合わせ
└── [storeId]/access             # アクセス情報
```

### 動的ルーティング実装例

```typescript
// app/stores/[storeId]/page.tsx
interface Props {
  params: { storeId: string }
}

export default async function StorePage({ params }: Props) {
  const store = await getStore(params.storeId)
  
  if (!store) {
    return notFound()
  }
  
  return (
    <StoreLayout store={store}>
      <StoreHero store={store} />
      <StoreInfo store={store} />
      <StoreNews storeId={store.id} />
      <StoreContact store={store} />
    </StoreLayout>
  )
}

// 静的生成用のパラメータ生成
export async function generateStaticParams() {
  const stores = await getAllStores()
  
  return stores.map((store) => ({
    storeId: store.id
  }))
}
```

## 📱 レスポンシブデザイン

### デザインシステム

```css
/* Tailwind CSS カスタム設定 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* カスタムコンポーネント */
@layer components {
  .store-container {
    @apply max-w-4xl mx-auto px-4 sm:px-6 lg:px-8;
  }
  
  .store-hero {
    @apply relative h-64 sm:h-80 md:h-96 bg-cover bg-center;
  }
  
  .store-card {
    @apply bg-white rounded-lg shadow-md overflow-hidden;
  }
}
```

### ブレークポイント戦略

- **モバイル**: 320px-768px（最優先）
- **タブレット**: 768px-1024px
- **デスクトップ**: 1024px以上

## 🔍 パフォーマンス最適化

### Next.js最適化機能

```typescript
// next.config.js
const nextConfig = {
  // 画像最適化
  images: {
    domains: ['store-images.care-package.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // 実験的機能
  experimental: {
    appDir: true,
    serverActions: true,
  },
  
  // ISR設定
  async rewrites() {
    return [
      {
        source: '/stores/:storeId',
        destination: '/api/stores/:storeId'
      }
    ]
  }
}
```

### Core Web Vitals対応

```typescript
// components/PerformanceOptimized.tsx
import Image from 'next/image'
import { Suspense } from 'react'

// 画像の遅延読み込み
<Image
  src={store.mainImage}
  alt={store.name}
  width={800}
  height={400}
  priority={false}
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>

// コンポーネントの遅延読み込み
<Suspense fallback={<StoreInfoSkeleton />}>
  <StoreInfo storeId={storeId} />
</Suspense>
```

## 📊 アクセス解析統合

### Google Analytics 4

```typescript
// lib/analytics.ts
import { GoogleAnalytics } from '@next/third-parties/google'

// ページビュー計測
export const trackPageView = (url: string, storeId: string) => {
  gtag('config', GA_TRACKING_ID, {
    page_location: url,
    custom_map: {
      custom_parameter_1: 'store_id'
    },
    store_id: storeId
  })
}

// イベント計測
export const trackStoreContact = (storeId: string, method: string) => {
  gtag('event', 'store_contact', {
    event_category: 'Store Interaction',
    event_label: storeId,
    contact_method: method
  })
}
```

## 🗺️ 地図・位置情報機能

### Google Maps埋め込み

```typescript
// components/StoreMap.tsx
interface StoreMapProps {
  address: string
  storeName: string
}

export const StoreMap: React.FC<StoreMapProps> = ({ address, storeName }) => {
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(address)}`
  
  return (
    <iframe
      src={mapUrl}
      width="100%"
      height="300"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={`${storeName}の地図`}
    />
  )
}
```

## 📧 お問い合わせフォーム

### Server Actions活用

```typescript
// app/stores/[storeId]/contact/actions.ts
'use server'

import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, '名前は必須です'),
  email: z.string().email('有効なメールアドレスを入力してください'),
  message: z.string().min(10, 'メッセージは10文字以上で入力してください')
})

export async function submitContact(
  storeId: string, 
  formData: FormData
) {
  const validatedFields = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    message: formData.get('message')
  })

  if (!validatedFields.success) {
    return { error: 'バリデーションエラー' }
  }

  // メール送信処理
  await sendContactEmail(storeId, validatedFields.data)
  
  return { success: true }
}
```

## 🔧 予想されるプロジェクト構成

```
app/
├── stores/
│   └── [storeId]/
│       ├── page.tsx          # 店舗トップ
│       ├── about/
│       │   └── page.tsx      # 店舗について
│       ├── menu/
│       │   └── page.tsx      # メニュー
│       ├── news/
│       │   ├── page.tsx      # お知らせ一覧
│       │   └── [newsId]/
│       │       └── page.tsx  # お知らせ詳細
│       ├── contact/
│       │   ├── page.tsx      # お問い合わせ
│       │   └── actions.ts    # Server Actions
│       └── layout.tsx        # 店舗共通レイアウト
├── components/
│   ├── Store/
│   │   ├── StoreHero.tsx
│   │   ├── StoreInfo.tsx
│   │   ├── StoreMap.tsx
│   │   └── StoreNews.tsx
│   ├── Layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   └── SEO/
│       ├── StructuredData.tsx
│       └── MetaTags.tsx
├── lib/
│   ├── api.ts
│   ├── analytics.ts
│   └── seo.ts
└── styles/
    └── globals.css
```

## 🚨 技術的課題・検討事項

### ISR（Incremental Static Regeneration）
- お知らせ更新時の再生成タイミング
- キャッシュ戦略（店舗情報変更時）
- ビルド時間の最適化

### SEO・パフォーマンス
- ページ読み込み速度（Core Web Vitals）
- 画像最適化・CDN利用
- 検索エンジンクローラビリティ

### スケーラビリティ
- 大量店舗サイトの管理
- サイトマップ自動生成
- メモリ使用量最適化

## 📈 期待される効果

### 集客支援効果
- **検索順位向上**: 適切なSEO対策により検索上位表示
- **地域検索対応**: ローカルSEOによる地域密着集客
- **ユーザビリティ向上**: スマホ最適化による離脱率改善

### 運営効率化
- **自動生成**: 手動作業不要の店舗サイト作成
- **一元管理**: 店舗管理サイトからの情報更新
- **分析データ**: アクセス解析による改善施策

## 🔗 関連ドキュメント

- [プロジェクト概要](../../README.md)
- [開発貢献ガイド](../../CONTRIBUTING.md)
- [システム構成](../../docs/2_architecture/system_overview.md)
- [店舗管理サイト](../store-admin/README.md)
- [APIサーバー](../api/README.md)

## 📅 開発スケジュール

| フェーズ | 期間 | 主要機能 |
|---------|------|----------|
| **Phase 4** | 3-4週間 | 基本サイト生成・SEO基盤 |
| **Phase 5** | 2-3週間 | 問い合わせフォーム・分析 |
| **Phase 6** | 3-4週間 | 高度なSEO・PWA機能 |

---

**SEO最適化された高品質な店舗サイトで、個人店の集客を根本から支援** 🌐