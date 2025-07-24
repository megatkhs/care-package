import type React from 'react';
import { useLoaderData } from 'react-router-dom';
import { adminApi } from '../lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const usersLoader = async (): Promise<{ users: User[] }> => {
  try {
    const response = await adminApi.getUsers().json<{ users: User[] }>();
    return { users: response.users };
  } catch (error) {
    console.error('Users fetch error:', error);
    throw new Response('ユーザー情報の取得に失敗しました', { status: 500 });
  }
};

const UsersPage: React.FC = () => {
  const { users } = useLoaderData() as { users: User[] };

  const getRoleBadge = (role: string) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      store_owner: 'bg-blue-100 text-blue-800',
    };

    const labels = {
      admin: '管理者',
      store_owner: '店舗オーナー',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${styles[role as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}
      >
        {labels[role as keyof typeof labels] || role}
      </span>
    );
  };

  const getStatusBadge = (isActive: boolean) => {
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
        }`}
      >
        {isActive ? 'アクティブ' : '無効'}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">ユーザー管理</h1>
        <p className="mt-2 text-gray-600">登録ユーザーの一覧と管理</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">ユーザー一覧 ({users.length}件)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ユーザー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  権限
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ステータス
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  登録日
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(user.isActive)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('ja-JP')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">ユーザーが見つかりません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
