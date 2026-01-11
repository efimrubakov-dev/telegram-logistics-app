import { useState } from 'react';
import './ProfileScreen.css';

interface ProfileScreenProps {
  telegramUsername: string;
}

function ProfileScreen({ telegramUsername }: ProfileScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Убираем все нецифровые символы
    
    let formatted = '+7';
    if (value.length > 1) {
      formatted += ' (' + value.substring(1, 4);
    }
    if (value.length >= 5) {
      formatted += ') ' + value.substring(4, 7);
    }
    if (value.length >= 8) {
      formatted += '-' + value.substring(7, 9);
    }
    if (value.length >= 10) {
      formatted += '-' + value.substring(9, 11);
    }
    
    setPhone(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Профиль сохранен!');
  };

  return (
    <div className="profile-screen">
      <h1 className="screen-title">Профиль</h1>
      
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Telegram username</label>
          <input
            type="text"
            value={telegramUsername || '@username'}
            disabled
            className="disabled-input"
          />
          <small className="form-hint">Определяется автоматически</small>
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
          <label>Пол</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                value="male"
                checked={gender === 'male'}
                onChange={(e) => setGender(e.target.value as 'male')}
              />
              <span>Мужской</span>
            </label>
            <label className="radio-label">
              <input
                type="radio"
                value="female"
                checked={gender === 'female'}
                onChange={(e) => setGender(e.target.value as 'female')}
              />
              <span>Женский</span>
            </label>
          </div>
        </div>

        <div className="form-group">
          <label>Телефон</label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder="+7 (___) ___-__-__"
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Сохранить
        </button>
      </form>
    </div>
  );
}

export default ProfileScreen;
