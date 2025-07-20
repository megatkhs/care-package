import { DashboardIcon, ExitIcon, GearIcon, HomeIcon, PersonIcon } from '@radix-ui/react-icons';
import type React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    {
      path: '/dashboard',
      label: 'ダッシュボード',
      icon: DashboardIcon,
    },
    {
      path: '/users',
      label: 'ユーザー管理',
      icon: PersonIcon,
    },
    {
      path: '/stores',
      label: '店舗管理',
      icon: HomeIcon,
    },
    {
      path: '/settings',
      label: '設定',
      icon: GearIcon,
    },
  ];

  return (
    <div className="w-64 h-full bg-gray-900 text-white flex flex-col">
      {/* ロゴ・タイトル */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold">Care Package</h1>
        <p className="text-sm text-gray-400">運営管理</p>
      </div>

      {/* メニュー */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ログアウト */}
      <div className="p-4 border-t border-gray-700">
        <button
          type="button"
          onClick={logout}
          className="flex items-center px-4 py-3 w-full text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors"
        >
          <ExitIcon className="w-5 h-5 mr-3" />
          ログアウト
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
