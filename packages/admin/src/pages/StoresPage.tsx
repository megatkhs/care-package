import type React from 'react';
import { useEffect, useState } from 'react';
import { adminApi } from '../lib/api';

interface Store {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  ownerName?: string;
  ownerEmail?: string;
}

const StoresPage: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await adminApi.getStores();
        setStores(response.data.stores);
      } catch (err) {
        setError('店舗情報の取得に失敗しました');
        console.error('Stores fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">読み込み中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="text-red-800">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">店舗管理</h1>
        <p className="mt-2 text-gray-600">登録店舗の一覧と管理</p>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">店舗一覧 ({stores.length}件)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  店舗情報
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  オーナー
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  連絡先
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
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{store.name}</div>
                      {store.description && (
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {store.description}
                        </div>
                      )}
                      {store.address && (
                        <div className="text-xs text-gray-400 max-w-xs truncate">
                          📍 {store.address}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      {store.ownerName && (
                        <div className="text-sm font-medium text-gray-900">{store.ownerName}</div>
                      )}
                      {store.ownerEmail && (
                        <div className="text-sm text-gray-500">{store.ownerEmail}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {store.phone && <div>📞 {store.phone}</div>}
                      {store.email && <div>✉️ {store.email}</div>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(store.isActive)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(store.createdAt).toLocaleDateString('ja-JP')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {stores.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">店舗が見つかりません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoresPage;
