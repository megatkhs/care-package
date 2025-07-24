import type React from 'react';
import { useLoaderData } from 'react-router-dom';
import { adminApi } from '../lib/api';

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  activeStores: number;
  newUsersThisMonth: number;
}

interface RecentActivity {
  type: string;
  message: string;
  timestamp: string;
}

interface DashboardData {
  stats: DashboardStats;
  recentActivity: RecentActivity[];
}

export const dashboardLoader = async (): Promise<DashboardData> => {
  try {
    const response = await adminApi
      .getDashboard()
      .json<{ stats: DashboardStats; recentActivity: RecentActivity[] }>();
    return {
      stats: response.stats,
      recentActivity: response.recentActivity,
    };
  } catch (error) {
    console.error('Dashboard fetch error:', error);
    throw new Response('ダッシュボードデータの取得に失敗しました', { status: 500 });
  }
};

const DashboardPage: React.FC = () => {
  const { stats, recentActivity } = useLoaderData() as DashboardData;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="mt-2 text-gray-600">システム全体の統計情報と最近のアクティビティ</p>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">総ユーザー数</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">👥</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">総店舗数</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalStores || 0}</p>
            </div>
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">🏪</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">アクティブ店舗</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.activeStores || 0}</p>
            </div>
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">✅</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">今月の新規ユーザー</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.newUsersThisMonth || 0}</p>
            </div>
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">📈</span>
            </div>
          </div>
        </div>
      </div>

      {/* 最近のアクティビティ */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">最近のアクティビティ</h2>
        </div>
        <div className="p-6">
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div
                  key={`${activity.type}-${activity.timestamp}-${index}`}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString('ja-JP')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">最近のアクティビティはありません</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
