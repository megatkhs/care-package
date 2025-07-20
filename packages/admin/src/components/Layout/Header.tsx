import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            運営管理システム
          </h2>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* ユーザー情報 */}
          <div className="flex items-center space-x-3">
            {user?.picture && (
              <img
                src={user.picture}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div className="text-sm">
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;