import './CheckScreen.css';

function CheckScreen() {
  return (
    <div className="check-screen">
      <h1 className="screen-title">Проверить</h1>
      
      <div className="placeholder-content">
        <div className="placeholder-icon">🔍</div>
        <p className="placeholder-text">Раздел в разработке</p>
        <p className="placeholder-subtitle">
          Здесь вы сможете проверить статус вашего заказа
        </p>
      </div>
    </div>
  );
}

export default CheckScreen;
