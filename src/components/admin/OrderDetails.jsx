import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { db } from '../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function OrderDetails({ order, isOpen, onClose, onUpdate }) {
  const [status, setStatus] = useState(order.status);
  const [trackingInfo, setTrackingInfo] = useState(order.trackingInfo || {
    carrier: '',
    trackingNumber: '',
    estimatedDelivery: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateDoc(doc(db, 'orders', order.id), {
        status,
        trackingInfo,
        lastUpdated: new Date().toISOString()
      });
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl w-full bg-white rounded-lg shadow-xl">
          <div className="p-6 space-y-6">
            <div className="border-b pb-4">
              <Dialog.Title className="text-2xl font-bold text-gray-900">
                Order Details
              </Dialog.Title>
              <p className="text-sm text-gray-500">Order ID: {order.id}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h3>
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="text-sm text-gray-900">{order.customer?.name || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Email</dt>
                    <dd className="text-sm text-gray-900">{order.customer?.email || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="text-sm text-gray-900">{order.customer?.phone || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Address</dt>
                    <dd className="text-sm text-gray-900">{order.customer?.address || 'N/A'}</dd>
                  </div>
                </dl>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                <ul className="space-y-3">
                  {order.items.map((item, index) => (
                    <li key={index} className="flex justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                      <p className="text-sm text-gray-900">
                        ₦{(item.price * item.quantity * 1300).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">₦{(order.total * 1300).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Order Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Shipping Carrier</label>
                <input
                  type="text"
                  value={trackingInfo.carrier}
                  onChange={(e) => setTrackingInfo({ ...trackingInfo, carrier: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
                <input
                  type="text"
                  value={trackingInfo.trackingNumber}
                  onChange={(e) => setTrackingInfo({ ...trackingInfo, trackingNumber: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Estimated Delivery</label>
                <input
                  type="date"
                  value={trackingInfo.estimatedDelivery}
                  onChange={(e) => setTrackingInfo({ ...trackingInfo, estimatedDelivery: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={trackingInfo.notes}
                  onChange={(e) => setTrackingInfo({ ...trackingInfo, notes: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 bg-primary text-white rounded-md ${
                    loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary/90'
                  }`}
                >
                  {loading ? 'Updating...' : 'Update Order'}
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 