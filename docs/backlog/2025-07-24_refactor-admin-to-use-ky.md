---
tags:
  - バックログ
  - リファクタリング
  - 技術的負債
  - admin
  - ky
type: 作業計画
status: 提案
created: 2025-07-24
updated: 2025-07-24
---

# バックログ: `packages/admin` を `axios` から `ky` へ移行

> [!info] 概要
> プロジェクト全体のHTTPクライアントライブラリを `ky` に統一するため、既存の `packages/admin` で使用されている `axios` を `ky` に置き換えるリファクタリング作業。

## 🎯 目標
- `packages/admin` から `axios` への依存を完全に排除する。
- すべてのAPIリクエストを `ky` を使って実行するように書き換える。
- バンドルサイズを削減し、エラーハンドリングをモダンな `Promise` ベースに統一する。

## 📜 背景

プロジェクトの標準HTTPクライアントとして、`fetch` APIベースで軽量な `ky` を採用することが決定された。（参照: `docs/1_introduction/tech_stack.md`）
この決定に伴い、既存の `admin` パッケージで使われている `axios` を `ky` に移行し、技術スタックの一貫性を保つ必要がある。

## 📋 タスク一覧

### 1. 依存関係の更新
- [ ] `packages/admin` の `package.json` から `axios` を削除する。
  - `pnpm remove axios --filter @care-package/admin`
- [ ] `packages/admin` に `ky` を追加する。
  - `pnpm add ky --filter @care-package/admin`

### 2. APIクライアントの書き換え
- [ ] `axios` のインスタンスを作成している部分を、`ky.create` を使った設定に置き換える。
- [ ] `axios` のインターセプター (`interceptors`) を `ky` の `hooks` （`beforeRequest`, `afterResponse`など）を使った同等の処理に移行する。
  - 例: 認証トークンをヘッダーに付与する処理など。

### 3. 各APIリクエストの置換
- [ ] `axios.get`, `axios.post` などを使用している箇所を、`ky.get`, `ky.post` に書き換える。
- [ ] レスポンスデータの受け取り方を修正する (`res.data` から `await res.json()` へ)。

### 4. エラーハンドリングの修正
- [ ] `axios` のエラーオブジェクト (`error.response`) を参照している箇所を、`ky` の `HTTPError` を `catch` する方式に修正する。
  - `const errorData = await err.response.json();` のような形式になる。

### 5. 動作確認とテスト
- [ ] `admin` サイトのすべての機能が以前と同様に動作することを確認する。
- [ ] 型チェック (`tsc --noEmit`) とリント (`biome check`) を実行し、エラーがないことを確認する。

## ✅ 成功基準
- `packages/admin` のソースコード内に `axios` の記述が残っていない。
- `admin` サイトのすべてのAPI通信が `ky` によって行われている。
- 移行前と機能的なデグレードがない。

## ⚠️ リスク
- `axios` のインターセプターで複雑な処理を行っている場合、`ky` の `hooks` への移行に時間がかかる可能性がある。
- エラーハンドリングの微妙な違いにより、予期せぬバグが発生する可能性があるため、慎重なテストが必要。
