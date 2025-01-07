import { useState } from 'react';

export default function ProductCard({ product, onAddToCart, onWhatsAppClick, onClick }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="product-card cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(product)}
    >
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image"
        />
        {!product.inStock && (
          <div className="out-of-stock-badge">Out of Stock</div>
        )}
      </div>
      <div className="product-info">
        <h2>{product.name}</h2>
        <p className="price">₦{(product.price * 1300).toLocaleString()}</p>
        <p className="description">{product.description}</p>
        <div className="features-list">
          {product.features.map((feature, index) => (
            <span key={index} className="feature-tag">{feature}</span>
          ))}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onAddToCart(product)}
            disabled={!product.inStock}
            className={`flex-1 px-4 py-2 rounded-md text-white ${
              product.inStock 
                ? 'bg-primary hover:bg-primary/90' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Add to Cart
          </button>
          <button
            onClick={() => onWhatsAppClick(product)}
            className="px-4 py-2 rounded-md text-white bg-accent hover:bg-accent/90"
          >
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
} 