import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import ProductCard from './ProductCard';
import Cart from './Cart';
import CheckoutForm from './CheckoutForm';
import { useToast } from '../contexts/ToastContext';
import ProductDetails from './ProductDetails';

export default function StoreFront() {
  const whatsappNumber = "2348027127594";
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const querySnapshot = await getDocs(collection(db, 'products'));
      const productsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  }

  const handleWhatsAppClick = (product) => {
    const message = `Hi! I'm interested in ${product.name} priced at ₦${(product.price * 1300).toLocaleString()}`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showToast(`${product.name} added to cart`);
  };

  const handleCheckout = async (customerData) => {
    try {
      const order = {
        items: cart,
        total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'pending',
        createdAt: new Date().toISOString(),
        customer: customerData
      };
      
      await addDoc(collection(db, 'orders'), order);
      setCart([]);
      setShowCheckoutForm(false);
      showToast('Order placed successfully!', 'success');
    } catch (error) {
      console.error('Error placing order:', error);
      showToast('Failed to place order. Please try again.', 'error');
    }
  };

  const handleAddReview = async (productId, review) => {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, {
        reviews: arrayUnion(review)
      });
      
      // Refresh products to show the new review
      await loadProducts();
      showToast('Review submitted successfully!');
    } catch (error) {
      console.error('Error adding review:', error);
      showToast('Failed to submit review. Please try again.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Pack and Bake Tools</h1>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Categories</option>
                <option value="baking">Baking</option>
                <option value="packaging">Packaging</option>
              </select>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto py-8">
        <div className="products-grid">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600">No products found.</p>
            </div>
          ) : (
            products
              .filter(product => {
                const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
                const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                   product.description.toLowerCase().includes(searchQuery.toLowerCase());
                return matchesCategory && matchesSearch;
              })
              .map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onWhatsAppClick={handleWhatsAppClick}
                  onClick={setSelectedProduct}
                />
              ))
          )}
        </div>
      </main>

      {cart.length > 0 && (
        <Cart 
          cart={cart} 
          setCart={setCart} 
          onCheckout={() => setShowCheckoutForm(true)} 
        />
      )}

      {showCheckoutForm && (
        <CheckoutForm
          cart={cart}
          onSubmit={handleCheckout}
          onCancel={() => setShowCheckoutForm(false)}
        />
      )}

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          isOpen={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
          onWhatsAppClick={handleWhatsAppClick}
          onAddReview={handleAddReview}
        />
      )}
    </div>
  );
} 