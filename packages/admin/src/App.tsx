import { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Care Package - 運営管理システム</h1>
      <div style={{ marginBottom: '2rem' }}>
        <h2>ダッシュボード</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>総ユーザー数</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>42</p>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>総店舗数</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>18</p>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>アクティブ店舗</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>15</p>
          </div>
          <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h3>月次売上</h3>
            <p style={{ fontSize: '2rem', margin: 0 }}>¥125,000</p>
          </div>
        </div>
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>メニュー</h2>
        <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button style={{ padding: '0.5rem 1rem', border: '1px solid #007acc', background: '#007acc', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
            ユーザー管理
          </button>
          <button style={{ padding: '0.5rem 1rem', border: '1px solid #007acc', background: '#007acc', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
            店舗管理
          </button>
          <button style={{ padding: '0.5rem 1rem', border: '1px solid #007acc', background: '#007acc', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
            システム設定
          </button>
          <button style={{ padding: '0.5rem 1rem', border: '1px solid #007acc', background: '#007acc', color: 'white', borderRadius: '4px', cursor: 'pointer' }}>
            分析・レポート
          </button>
        </nav>
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
        <h3>カウンターテスト</h3>
        <button 
          onClick={() => setCount((count) => count + 1)}
          style={{ padding: '0.5rem 1rem', border: '1px solid #007acc', background: '#007acc', color: 'white', borderRadius: '4px', cursor: 'pointer' }}
        >
          count is {count}
        </button>
        <p style={{ marginTop: '1rem', color: '#666' }}>
          React + TypeScript + Vite 動作確認
        </p>
      </div>
    </div>
  );
}

export default App;