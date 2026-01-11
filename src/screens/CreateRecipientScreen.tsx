import { useState, useRef, useEffect } from 'react';
import type { ScreenType } from '../types';
import { recipientsStorage } from '../services/storage';
import './CreateRecipientScreen.css';

interface CreateRecipientScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

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

function CreateRecipientScreen({ onNavigate }: CreateRecipientScreenProps) {
  const [recipientName, setRecipientName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+7');
  const [birthDate, setBirthDate] = useState('');
  const [passportSeries, setPassportSeries] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportIssueDate, setPassportIssueDate] = useState('');
  const [inn, setInn] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const birthDatePickerRef = useRef<HTMLInputElement>(null);
  const passportDatePickerRef = useRef<HTMLInputElement>(null);

  // Загружаем данные получателя при редактировании
  useEffect(() => {
    const loadEditingRecipient = async () => {
      const editingRecipientId = localStorage.getItem('editingRecipientId');
      if (editingRecipientId) {
        setEditingId(editingRecipientId);
        try {
          const recipient = await recipientsStorage.getById(editingRecipientId);
          if (recipient) {
            setRecipientName(recipient.name || '');
            setFirstName(recipient.first_name || recipient.firstName || '');
            setLastName(recipient.last_name || recipient.lastName || '');
            setMiddleName(recipient.middle_name || recipient.middleName || '');
            setEmail(recipient.email || '');
            setPhone(recipient.phone || '+7');
            setBirthDate(recipient.birth_date || recipient.birthDate || '');
            setPassportSeries(recipient.passport_series || recipient.passportSeries || '');
            setPassportNumber(recipient.passport_number || recipient.passportNumber || '');
            setPassportIssueDate(recipient.passport_issue_date || recipient.passportIssueDate || '');
            setInn(recipient.inn || '');
          }
        } catch (error) {
          console.error('Ошибка загрузки получателя:', error);
        }
      } else {
        // Очищаем форму при создании нового
        setEditingId(null);
        setRecipientName('');
        setFirstName('');
        setLastName('');
        setMiddleName('');
        setEmail('');
        setPhone('+7');
        setBirthDate('');
        setPassportSeries('');
        setPassportNumber('');
        setPassportIssueDate('');
        setInn('');
      }
    };
    loadEditingRecipient();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Получаем существующих получателей из localStorage
    const existingRecipients: Recipient[] = JSON.parse(localStorage.getItem('recipients') || '[]');
    
    if (editingId) {
      // Обновляем существующего получателя
      const updatedRecipients = existingRecipients.map((r) => 
        r.id === editingId 
          ? {
              ...r,
              name: recipientName,
              firstName,
              lastName,
              middleName,
              email,
              phone,
              birthDate,
              passportSeries,
              passportNumber,
              passportIssueDate,
              inn
            }
          : r
      );
      localStorage.setItem('recipients', JSON.stringify(updatedRecipients));
      localStorage.removeItem('editingRecipientId');
    } else {
      // Создаем нового получателя
      const recipient: Recipient = {
        id: Date.now().toString(),
        name: recipientName,
        firstName,
        lastName,
        middleName,
        email,
        phone,
        birthDate,
        passportSeries,
        passportNumber,
        passportIssueDate,
        inn,
        createdAt: new Date().toISOString()
      };
      
      existingRecipients.push(recipient);
      localStorage.setItem('recipients', JSON.stringify(existingRecipients));
    }
    
    onNavigate('recipients');
  };

  return (
    <div className="create-recipient-screen">
      <h1 className="screen-title">{editingId ? 'Редактировать получателя' : 'Создать получателя'}</h1>
      
      <p className="info-text">
        По закону всем частным транспортным компаниям для доставки международной посылки требуются действующие паспортные данные получателя.
      </p>
      
      <form onSubmit={handleSubmit} className="recipient-form">
        <div className="form-group">
          <label>Название получателя</label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            placeholder="Получатель 1234"
            required
          />
        </div>

        <div className="form-group">
          <label>Имя</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Введите имя"
            required
          />
        </div>

        <div className="form-group">
          <label>Фамилия</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Введите фамилию"
            required
          />
        </div>

        <div className="form-group">
          <label>Отчество</label>
          <input
            type="text"
            value={middleName}
            onChange={(e) => setMiddleName(e.target.value)}
            placeholder="Введите отчество"
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите email"
            required
          />
        </div>

        <div className="form-group">
          <label>Телефон</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => {
              let value = e.target.value;
              // Убираем все кроме цифр и +
              value = value.replace(/[^\d+]/g, '');
              // Убеждаемся, что начинается с +7
              if (!value.startsWith('+7')) {
                value = '+7' + value.replace(/[^\d]/g, '');
              }
              // Оставляем только цифры после +7
              const digits = value.replace(/[^\d]/g, ''); // все цифры включая 7
              // Максимум 11 цифр всего (7 + еще 10)
              if (digits.length <= 11) {
                const afterSeven = digits.slice(1); // цифры после 7
                setPhone('+7' + afterSeven);
              }
            }}
            placeholder="+7"
            maxLength={12}
            inputMode="numeric"
            required
          />
        </div>

        <div className="form-group">
          <label>Дата рождения</label>
          <div className="date-input-wrapper">
            <input
              type="text"
              value={birthDate}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 8) {
                  if (value.length > 2) {
                    value = value.slice(0, 2) + '.' + value.slice(2);
                  }
                  if (value.length > 5) {
                    value = value.slice(0, 5) + '.' + value.slice(5);
                  }
                  setBirthDate(value);
                }
              }}
              placeholder="дд.мм.гггг"
              maxLength={10}
              pattern="\d{2}\.\d{2}\.\d{4}"
              required
            />
            <input
              type="date"
              ref={birthDatePickerRef}
              onChange={(e) => {
                const dateValue = e.target.value;
                if (dateValue) {
                  const date = new Date(dateValue);
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = date.getFullYear();
                  setBirthDate(`${day}.${month}.${year}`);
                }
              }}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="calendar-btn"
              onClick={() => {
                if (birthDatePickerRef.current) {
                  birthDatePickerRef.current.showPicker();
                }
              }}
              title="Выбрать дату"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M3 8h14" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M13 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="7" cy="12" r="0.5" fill="currentColor"/>
                <circle cx="10" cy="12" r="0.5" fill="currentColor"/>
                <circle cx="13" cy="12" r="0.5" fill="currentColor"/>
                <circle cx="7" cy="15" r="0.5" fill="currentColor"/>
                <circle cx="10" cy="15" r="0.5" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

        <h2 className="section-title">Паспортные данные (информация для таможни)</h2>

        <div className="form-row">
          <div className="form-group form-group-half">
            <label>Серия паспорта</label>
            <input
              type="text"
              value={passportSeries}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, ''); // Убираем все кроме цифр
                // Максимум 4 цифры
                if (value.length <= 4) {
                  // Добавляем пробел после двух цифр
                  if (value.length > 2) {
                    value = value.slice(0, 2) + ' ' + value.slice(2);
                  }
                  setPassportSeries(value);
                }
              }}
              placeholder="XX XX"
              maxLength={5}
              inputMode="numeric"
              required
            />
          </div>
          <div className="form-group form-group-half">
            <label>Номер паспорта</label>
            <input
              type="text"
              value={passportNumber}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Убираем все кроме цифр
                if (value.length <= 6) {
                  setPassportNumber(value);
                }
              }}
              placeholder="Введите номер паспорта"
              maxLength={6}
              inputMode="numeric"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Когда выдан паспорт</label>
          <div className="date-input-wrapper">
            <input
              type="text"
              value={passportIssueDate}
              onChange={(e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 8) {
                  if (value.length > 2) {
                    value = value.slice(0, 2) + '.' + value.slice(2);
                  }
                  if (value.length > 5) {
                    value = value.slice(0, 5) + '.' + value.slice(5);
                  }
                  setPassportIssueDate(value);
                }
              }}
              placeholder="дд.мм.гггг"
              maxLength={10}
              pattern="\d{2}\.\d{2}\.\d{4}"
              required
            />
            <input
              type="date"
              ref={passportDatePickerRef}
              onChange={(e) => {
                const dateValue = e.target.value;
                if (dateValue) {
                  const date = new Date(dateValue);
                  const day = String(date.getDate()).padStart(2, '0');
                  const month = String(date.getMonth() + 1).padStart(2, '0');
                  const year = date.getFullYear();
                  setPassportIssueDate(`${day}.${month}.${year}`);
                }
              }}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="calendar-btn"
              onClick={() => {
                if (passportDatePickerRef.current) {
                  passportDatePickerRef.current.showPicker();
                }
              }}
              title="Выбрать дату"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M3 8h14" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M7 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M13 2v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <circle cx="7" cy="12" r="0.5" fill="currentColor"/>
                <circle cx="10" cy="12" r="0.5" fill="currentColor"/>
                <circle cx="13" cy="12" r="0.5" fill="currentColor"/>
                <circle cx="7" cy="15" r="0.5" fill="currentColor"/>
                <circle cx="10" cy="15" r="0.5" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>ИНН</label>
          <input
            type="text"
            value={inn}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              if (value.length <= 12) {
                setInn(value);
              }
            }}
            placeholder="Введите ИНН"
            maxLength={12}
            pattern="[0-9]{12}"
            inputMode="numeric"
            required
          />
        </div>

        <p className="consent-text">
          Сохраняя паспортные данные, вы подтверждаете согласие на использование предоставленной информации в целях таможенного оформления посылок.
        </p>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => onNavigate('recipients')}>
            Отмена
          </button>
          <button type="submit" className="btn-primary">
            {editingId ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateRecipientScreen;
