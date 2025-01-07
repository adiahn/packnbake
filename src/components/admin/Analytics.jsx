import { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Sales Data',
    },
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
};

export default function Analytics() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topProducts: [],
    recentOrders: [],
    salesByCategory: {},
    dailySales: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    try {
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const orders = ordersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate total sales and orders
      const totalSales = orders.reduce((sum, order) => sum + order.total * 1300, 0);
      const averageOrderValue = totalSales / orders.length;

      // Get sales by category
      const salesByCategory = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          salesByCategory[item.category] = (salesByCategory[item.category] || 0) + (item.price * item.quantity * 1300);
        });
      });

      // Get top products
      const productSales = {};
      orders.forEach(order => {
        order.items.forEach(item => {
          productSales[item.id] = (productSales[item.id] || 0) + item.quantity;
        });
      });

      const topProducts = Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      // Get daily sales for the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const dailySales = orders
        .filter(order => new Date(order.createdAt) >= thirtyDaysAgo)
        .reduce((acc, order) => {
          const date = new Date(order.createdAt).toLocaleDateString();
          acc[date] = (acc[date] || 0) + order.total * 1300;
          return acc;
        }, {});

      setStats({
        totalSales,
        totalOrders: orders.length,
        averageOrderValue,
        topProducts,
        recentOrders: orders.slice(-5),
        salesByCategory,
        dailySales: Object.entries(dailySales).map(([date, amount]) => ({
          date,
          amount
        }))
      });
      setLoading(false);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="text-2xl font-bold text-gray-900">₦{stats.totalSales.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
          <p className="text-2xl font-bold text-gray-900">₦{stats.averageOrderValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales Trend</h3>
          <div className="h-64">
            <Line
              options={options}
              data={{
                labels: stats.dailySales.map(item => item.date),
                datasets: [{
                  label: 'Daily Sales',
                  data: stats.dailySales.map(item => item.amount),
                  borderColor: '#2c3e50',
                  tension: 0.4
                }]
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Category</h3>
          <div className="h-64">
            <Doughnut
              options={{
                responsive: true,
                maintainAspectRatio: false
              }}
              data={{
                labels: Object.keys(stats.salesByCategory),
                datasets: [{
                  data: Object.values(stats.salesByCategory),
                  backgroundColor: [
                    '#2c3e50',
                    '#3498db',
                    '#e74c3c',
                    '#2ecc71',
                    '#f1c40f'
                  ]
                }]
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer?.name || 'Anonymous'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₦{(order.total * 1300).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 