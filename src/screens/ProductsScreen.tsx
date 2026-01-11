import './ProductsScreen.css';

function ProductsScreen() {
  return (
    <div className="products-screen">
      <h1 className="screen-title">Товары</h1>
      
      <div className="placeholder-content">
        <div className="placeholder-icon">📦</div>
        <p className="placeholder-text">Раздел в разработке</p>
        <p className="placeholder-subtitle">
          Здесь будет отображаться каталог товаров
        </p>
      </div>
    </div>
  );
}

export default ProductsScreen;
