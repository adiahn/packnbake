import { useState } from 'react';

export default function Cart({ cart, setCart, onCheckout }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const updateQuantity = (productId, newQuantity) => {
    setCart(cart.map(item => 
      item.id === productId 
        ? { ...item, quantity: Math.max(1, newQuantity) }
        : item
    ));
  };

  const removeItem = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity * 1300, 0);

  return (
    <div className="fixed bottom-0 right-0 m-4 bg-white rounded-lg shadow-lg max-w-md w-full">
      <div 
        className="p-4 border-b cursor-pointer flex justify-between items-center"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-bold">Cart ({cart.length} items)</h3>
        <button className="text-gray-500">
          {isExpanded ? '▼' : '▲'}
        </button>
      </div>

      {isExpanded && (
        <div className="p-4">
          <div className="space-y-4 max-h-96 overflow-auto">
            {cart.map(item => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-gray-500">₦{(item.price * 1300).toLocaleString()}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-2 text-red-500"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between font-bold">
              <span>Total:</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <button
              onClick={onCheckout}
              className="mt-4 w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 