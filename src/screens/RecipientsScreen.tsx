import { useState, useEffect } from 'react';
import type { ScreenType } from '../types';
import { recipientsStorage } from '../services/storage';
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

  const loadRecipients = async () => {
    try {
      const storedRecipients = await recipientsStorage.getAll();
      // Преобразуем формат данных из API в формат компонента
      const formattedRecipients = storedRecipients.map((recipient: any) => ({
        ...recipient,
        id: recipient.id.toString(),
        firstName: recipient.first_name || recipient.firstName,
        lastName: recipient.last_name || recipient.lastName,
        middleName: recipient.middle_name || recipient.middleName,
        birthDate: recipient.birth_date || recipient.birthDate,
        passportSeries: recipient.passport_series || recipient.passportSeries,
        passportNumber: recipient.passport_number || recipient.passportNumber,
        passportIssueDate: recipient.passport_issue_date || recipient.passportIssueDate
      }));
      setRecipients(formattedRecipients);
    } catch (error) {
      console.error('Ошибка загрузки получателей:', error);
      setRecipients([]);
    }
  };

  useEffect(() => {
    loadRecipients();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить этого получателя?')) {
      try {
        await recipientsStorage.delete(id);
        await loadRecipients(); // Перезагружаем список
      } catch (error) {
        console.error('Ошибка удаления получателя:', error);
        alert('Ошибка при удалении получателя');
      }
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
