/** biome-ignore-all assist/source/organizeImports: データベースの依存関係を考慮した順序を保つため */
// 全てのスキーマを統合・エクスポート
// 順序を考慮してインポート・エクスポート

// 基本テーブル（依存関係なし）
export * from './admin';

// 顧客テーブル（adminを参照）
export * from './customer';

// 契約テーブル（customerを参照）
export * from './contract';

// 店舗テーブル（customerを参照）
export * from './store';

// 招待テーブル（admin, customer, store, contractを参照）
export * from './invitation';

// ユーザーテーブル（customer, invitationを参照）
// 循環参照回避のため、invitationIdの外部キー制約は後から追加
import { foreignKey } from 'drizzle-orm/pg-core';
import { invitations } from './invitation';
import { users } from './user';
export { users } from './user';
export type { User, NewUser } from './user';

export const userInvitationFK = foreignKey({
  columns: [users.invitationId],
  foreignColumns: [invitations.id],
});
