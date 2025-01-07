import { useState } from 'react';
import ProductManager from './ProductManager';
import OrderManager from './OrderManager';
import { useAuth } from '../../contexts/AuthContext';
import Analytics from './Analytics';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('analytics');
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`${
                    activeTab === 'analytics'
                      ? 'border-primary text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Analytics
                </button>
                <button
                  onClick={() => setActiveTab('products')}
                  className={`${
                    activeTab === 'products'
                      ? 'border-primary text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Products
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`${
                    activeTab === 'orders'
                      ? 'border-primary text-gray-900'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                >
                  Orders
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {activeTab === 'analytics' ? <Analytics /> :
         activeTab === 'products' ? <ProductManager /> :
         <OrderManager />}
      </div>
    </div>
  );
} 