import { format, formatISO } from 'date-fns';

// APIレスポンス作成ヘルパー
export function createSuccessResponse<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    message
  };
}

export function createErrorResponse(error: string, message?: string) {
  return {
    success: false,
    error,
    message
  };
}

// 日付ユーティリティ
export function formatDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateTime(date: Date): string {
  return formatISO(date);
}

// バリデーションヘルパー
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidPhoneNumber(phone: string): boolean {
  // 日本の電話番号形式をチェック
  const phoneRegex = /^0\d{1,4}-?\d{1,4}-?\d{3,4}$/;
  return phoneRegex.test(phone.replace(/[-\s]/g, ''));
}

// ID生成
export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // フォールバック
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}