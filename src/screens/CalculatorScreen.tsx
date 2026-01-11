import { useState, useEffect } from 'react';
import './CalculatorScreen.css';

function CalculatorScreen() {
  const [weight, setWeight] = useState('');
  const [volume, setVolume] = useState('');
  const [city, setCity] = useState('');
  const [showCityList, setShowCityList] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState('');
  const [riskProtection, setRiskProtection] = useState(false);
  const [result, setResult] = useState<number | null>(null);

  const cities = [
    'Москва',
    'Санкт-Петербург',
    'Новосибирск',
    'Екатеринбург',
    'Казань',
    'Нижний Новгород',
    'Челябинск',
    'Самара',
    'Омск',
    'Ростов-на-Дону',
  ];

  // Автоматическая активация чекбокса при вводе оценочной стоимости
  useEffect(() => {
    if (estimatedCost && parseFloat(estimatedCost) > 0) {
      setRiskProtection(true);
    }
  }, [estimatedCost]);

  const handleCitySelect = (selectedCity: string) => {
    setCity(selectedCity);
    setShowCityList(false);
  };

  const calculateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight) || 0;
    const v = parseFloat(volume) || 0;
    const cost = parseFloat(estimatedCost) || 0;
    
    let basePrice = w * 150 + v * 1000;
    
    if (riskProtection && cost > 0) {
      basePrice += cost * 0.05;
    }
    
    setResult(Math.round(basePrice));
  };

  return (
    <div className="calculator-screen">
      <h1 className="screen-title">Калькулятор доставки</h1>
      
      <form onSubmit={calculateShipping} className="calculator-form">
        <div className="form-group">
          <label>Вес (кг)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Введите вес"
            min="0"
            step="0.1"
            required
          />
        </div>

        <div className="form-group">
          <label>Объем (м³)</label>
          <input
            type="number"
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            placeholder="Введите объем"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Населенный пункт</label>
          <div className="city-selector">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onFocus={() => setShowCityList(true)}
              placeholder="Выберите город"
              required
            />
            {showCityList && (
              <div className="city-list">
                {cities
                  .filter(c => c.toLowerCase().includes(city.toLowerCase()))
                  .map((c, idx) => (
                    <div 
                      key={idx}
                      className="city-item"
                      onClick={() => handleCitySelect(c)}
                    >
                      {c}
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label>Оценочная стоимость (¥)</label>
          <input
            type="number"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
            placeholder="Введите стоимость"
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={riskProtection}
              onChange={(e) => setRiskProtection(e.target.checked)}
            />
            <span>Защита от рисков</span>
          </label>
          <small className="form-hint">
            Автоматически активируется при вводе оценочной стоимости
          </small>
        </div>

        <button type="submit" className="btn-primary">
          Рассчитать
        </button>

        {result !== null && (
          <div className="result-card">
            <div className="result-label">Стоимость доставки:</div>
            <div className="result-value">{result} ₽</div>
          </div>
        )}
      </form>
    </div>
  );
}

export default CalculatorScreen;
