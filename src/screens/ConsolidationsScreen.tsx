import type { ScreenType } from '../types';
import './ConsolidationsScreen.css';

interface ConsolidationsScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

function ConsolidationsScreen({ onNavigate }: ConsolidationsScreenProps) {
  return (
    <div className="consolidations-screen">
      <h1 className="screen-title">Объединения</h1>
      
      <button 
        className="create-btn"
        onClick={() => onNavigate('create-consolidation')}
      >
        + Создать объединение
      </button>

      <div className="empty-state">
        <p>У вас пока нет объединений</p>
        <p className="empty-subtitle">Объедините несколько заказов для экономии на доставке</p>
      </div>
    </div>
  );
}

export default ConsolidationsScreen;
