import { useState } from 'react';
import type { ScreenType } from '../types';
import './CreateConsolidationScreen.css';

interface CreateConsolidationScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

function CreateConsolidationScreen({ onNavigate }: CreateConsolidationScreenProps) {
  const [step, setStep] = useState(1);
  
  // Данные шага 1
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  // Данные шага 2
  const [deliveryType, setDeliveryType] = useState('');
  const [warehouse, setWarehouse] = useState('');
  
  // Данные шага 3
  const [recipient, setRecipient] = useState('');
  const [address, setAddress] = useState('');

  // Валидация для каждого шага
  const isStep1Valid = name.trim() !== '' && description.trim() !== '';
  const isStep2Valid = deliveryType !== '' && warehouse !== '';
  const isStep3Valid = recipient.trim() !== '' && address.trim() !== '';

  const handleNext = () => {
    if (step === 1 && isStep1Valid) {
      setStep(2);
    } else if (step === 2 && isStep2Valid) {
      setStep(3);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStep3Valid) {
      alert('Объединение создано!');
      onNavigate('consolidations');
    }
  };

  return (
    <div className="create-consolidation-screen">
      <h1 className="screen-title">Создать объединение</h1>
      
      <div className="steps-indicator">
        <div className={`step-dot ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`step-dot ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`step-dot ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>

      <form onSubmit={handleSubmit} className="consolidation-form">
        {step === 1 && (
          <div className="form-step">
            <h2 className="step-title">Шаг 1: Основная информация</h2>
            
            <div className="form-group">
              <label>Название объединения</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Например: Заказ №1"
                required
              />
            </div>

            <div className="form-group">
              <label>Описание</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Опишите что вы заказали"
                rows={3}
                required
              />
            </div>

            <button 
              type="button" 
              className="btn-primary"
              onClick={handleNext}
              disabled={!isStep1Valid}
            >
              Далее
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="form-step">
            <h2 className="step-title">Шаг 2: Доставка</h2>
            
            <div className="form-group">
              <label>Тип доставки</label>
              <select
                value={deliveryType}
                onChange={(e) => setDeliveryType(e.target.value)}
                required
              >
                <option value="">Выберите тип</option>
                <option value="air">Авиа</option>
                <option value="sea">Море</option>
                <option value="train">Поезд</option>
              </select>
            </div>

            <div className="form-group">
              <label>Склад в Китае</label>
              <select
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                required
              >
                <option value="">Выберите склад</option>
                <option value="guangzhou">Гуанчжоу</option>
                <option value="yiwu">Иу</option>
                <option value="shenzhen">Шэньчжэнь</option>
              </select>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setStep(1)}
              >
                Назад
              </button>
              <button 
                type="button" 
                className="btn-primary"
                onClick={handleNext}
                disabled={!isStep2Valid}
              >
                Далее
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="form-step">
            <h2 className="step-title">Шаг 3: Получатель</h2>
            
            <div className="form-group">
              <label>Получатель</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="ФИО получателя"
                required
              />
            </div>

            <div className="form-group">
              <label>Адрес доставки</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Полный адрес доставки"
                rows={3}
                required
              />
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setStep(2)}
              >
                Назад
              </button>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={!isStep3Valid}
              >
                Создать
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default CreateConsolidationScreen;
