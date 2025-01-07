import { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    features: '',
    image: null,
    inStock: true
  });

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

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        features: formData.features.split('\n').filter(f => f.trim()),
        price: parseFloat(formData.price)
      };

      if (formData.image) {
        const imageRef = ref(storage, `products/${formData.image.name}`);
        await uploadBytes(imageRef, formData.image);
        productData.image = await getDownloadURL(imageRef);
      }

      if (editingProduct) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }

      setFormData({
        name: '',
        price: '',
        category: '',
        description: '',
        features: '',
        image: null,
        inStock: true
      });
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  }

  async function handleDelete(productId) {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', productId));
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            >
              <option value="">Select a category</option>
              <option value="baking">Baking</option>
              <option value="packaging">Packaging</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
              className="mt-1 block w-full"
              accept="image/*"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Features (one per line)
            </label>
            <textarea
              value={formData.features}
              onChange={(e) => setFormData({...formData, features: e.target.value})}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              placeholder="Enter features, one per line"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-600">In Stock</span>
            </label>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
          >
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>

      <div className="bg-white shadow-sm rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                {/* Table row content */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 