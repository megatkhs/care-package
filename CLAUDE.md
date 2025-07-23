# ケアパッケージ - 個人店向け集客支援Webアプリ

> [!important] 開発者向けクイックリファレンス
> 詳細仕様・技術情報は`docs`ディレクトリを参照。このファイルは開発時の要点をまとめたリファレンス。

## プロジェクトドキュメント参照指示
**必ず`docs`ディレクトリ内のドキュメントを参照してから作業を開始すること**

### 主要ドキュメント
- `docs/1_introduction/` - プロジェクト概要・開発フェーズ・ユーザーフロー・技術スタック
- `docs/2_architecture/` - システム構成・データベース設計  
- `docs/3_guides/` - 開発環境セットアップ手順
- `docs/4_specs/` - 各種仕様書（今後追加予定）
- `docs/5_decisions/` - アーキテクチャ決定記録（ADR）
- `docs/backlog/` - 作業計画・バックログ

### ドキュメント形式
- **Obsidian形式**：`[[リンク記法]]`で相互参照
- **Front Matter**：YAML形式のメタデータ
- **Callout記法**：`> [!info]`等の情報ボックス

## 現在の開発状況
- ✅ **Phase 1-2 完了**: 運営管理サイト・API・DB基盤
- 🚧 **Phase 3 進行中**: 店舗経営者管理サイト基盤（Google OAuth・基本機能）
- ❌ **Phase 4以降未着手**: 店舗サイト・決済・高度機能

### パッケージ構成
```
packages/
├── shared/          # 共通ライブラリ・型定義 ✅
├── api/             # Honoバックエンド ✅
├── admin/           # 運営側管理サイト ✅
├── store-admin/     # 店舗経営者向け管理サイト ❌
└── store-site/      # 店舗サイト（Next.js） ❌
```

## 開発の進め方

## [MUST] 実装時に遵守すべき事項
- 作業フローを守ること
- ドキュメントを必ず参照すること

### 基本作業フロー
1. **仕様策定** → `/docs`にObsidian形式でドキュメント化
2. **作業計画** → `/docs/backlog/YYYY-MM-DD_{作業内容}.md`で管理、Gemini壁打ち
3. **ブランチ作成** → `feature/YYYY-MM-DD_作業内容`
4. **開発実行** → 工程ごとに静的解析・型チェック・コミット
5. **PR作成・レビュー** → Issue番号記載、人間承認後マージ

### 開発ルール
- **パッケージ管理**: pnpm使用、`-E`フラグでバージョン固定
- **コミット**: 1タスク1コミット、日本語メッセージ、工程ごとに静的解析
- **動作確認**: 設定変更・依存追加後は必ず確認してからコミット
- **技術選定**: 不明点は憶測せず人間・Geminiに確認
- **リスク管理**: 開発サーバー起動後は必ずkill

### 品質管理コマンド (Biome)
```bash
# 全体
pnpm lint / check / format

# 個別パッケージ
pnpm --filter=@care-package/admin lint

# 推奨フロー: コード変更後 → pnpm check → 自動修正 → 再確認
```

### DB設計 (Drizzle ORM)
> [!info] 詳細は`docs/2_architecture/database.md`参照

**原則**: テーブル単位分割、ENUM型ステータス管理、関心分離
**実装済み**: customers/contracts/invitations/stores/users/admins

