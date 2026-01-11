import { useState, useEffect } from 'react';
import type { ScreenType } from '../types';
import './RecipientsScreen.css';

interface Recipient {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  birthDate: string;
  passportSeries: string;
  passportNumber: string;
  passportIssueDate: string;
  inn: string;
  createdAt: string;
}

interface RecipientsScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

function RecipientsScreen({ onNavigate }: RecipientsScreenProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);

  useEffect(() => {
    // Загружаем получателей из localStorage
    const storedRecipients = JSON.parse(localStorage.getItem('recipients') || '[]');
    setRecipients(storedRecipients);
  }, []);

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого получателя?')) {
      const updatedRecipients = recipients.filter(r => r.id !== id);
      setRecipients(updatedRecipients);
      localStorage.setItem('recipients', JSON.stringify(updatedRecipients));
    }
  };

  const handleEdit = (id: string) => {
    // Сохраняем ID редактируемого получателя в localStorage
    localStorage.setItem('editingRecipientId', id);
    onNavigate('create-recipient');
  };

  return (
    <div className="recipients-screen">
      <h1 className="screen-title">Получатели</h1>
      
      <button 
        className="create-btn"
        onClick={() => {
          localStorage.removeItem('editingRecipientId');
          onNavigate('create-recipient');
        }}
      >
        + Добавить получателя
      </button>

      {recipients.length > 0 && (
        <div className="recipients-count">
          {recipients.length} {recipients.length === 1 ? 'получатель' : recipients.length < 5 ? 'получателя' : 'получателей'}
        </div>
      )}

      {recipients.length === 0 ? (
        <div className="empty-state">
          <p>У вас пока нет получателей</p>
          <p className="empty-subtitle">Добавьте получателей для быстрого оформления заказов</p>
        </div>
      ) : (
        <div className="recipients-list">
          {recipients.map((recipient) => (
            <div key={recipient.id} className="recipient-card">
              <div className="recipient-card-content">
                <div className="recipient-name">{recipient.name}</div>
                <div className="recipient-status">
                  <span className="status-icon">✓</span>
                  <span className="status-text">Получатель подтвержден</span>
                </div>
              </div>
              <div className="recipient-actions">
                <button
                  className="action-btn edit-btn"
                  onClick={() => handleEdit(recipient.id)}
                  title="Редактировать"
                >
                  ✏️
                </button>
                <button
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(recipient.id)}
                  title="Удалить"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecipientsScreen;
