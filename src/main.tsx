import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// Error Boundary компонент
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Ошибка в приложении:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          backgroundColor: '#ffffff',
          color: '#000000',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <h1>Произошла ошибка</h1>
          <p>Пожалуйста, обновите страницу</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2f5fa8',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            Обновить
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Инициализация приложения с обработкой ошибок
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const root = createRoot(rootElement);
  root.render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
} catch (error) {
  console.error('Критическая ошибка при инициализации:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center; background-color: #ffffff; color: #000000; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
      <h1>Ошибка загрузки приложения</h1>
      <p>Пожалуйста, обновите страницу</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; background-color: #2f5fa8; color: white; border: none; border-radius: 8px; cursor: pointer; margin-top: 20px;">
        Обновить
      </button>
    </div>
  `;
}
