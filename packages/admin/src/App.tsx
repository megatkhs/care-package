import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-8 py-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Care Package</h1>
          <p className="text-lg text-gray-600">運営管理システム</p>
        </header>

        <main>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">ダッシュボード</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">総ユーザー数</h3>
                <p className="text-3xl font-bold text-gray-900">42</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">総店舗数</h3>
                <p className="text-3xl font-bold text-gray-900">18</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">アクティブ店舗</h3>
                <p className="text-3xl font-bold text-green-600">15</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">月次売上</h3>
                <p className="text-3xl font-bold text-blue-600">¥125,000</p>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">メニュー</h2>
            <nav className="flex flex-wrap gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200">
                ユーザー管理
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200">
                店舗管理
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200">
                システム設定
              </button>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors duration-200">
                分析・レポート
              </button>
            </nav>
          </section>

          <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">動作確認テスト</h3>
            <button 
              onClick={() => setCount((count) => count + 1)}
              className="px-4 py-2 bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 transition-colors duration-200 mb-4"
            >
              count is {count}
            </button>
            <p className="text-sm text-gray-600">
              React + TypeScript + Vite + Tailwind CSS 動作確認
            </p>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;