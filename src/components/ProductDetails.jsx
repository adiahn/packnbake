import { Dialog } from '@headlessui/react';
import ProductGallery from './ProductGallery';
import Reviews from './Reviews';

export default function ProductDetails({ product, isOpen, onClose, onAddToCart, onWhatsAppClick, onAddReview }) {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-4xl w-full bg-white rounded-lg shadow-xl overflow-y-auto max-h-[90vh]">
          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProductGallery mainImage={product.image} images={product.additionalImages} />

              <div className="space-y-6">
                <div>
                  <Dialog.Title className="text-2xl font-bold text-gray-900">
                    {product.name}
                  </Dialog.Title>
                  <p className="text-3xl font-bold text-primary mt-2">
                    ₦{(product.price * 1300).toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Description</h3>
                  <p className="mt-2 text-gray-600">{product.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900">Features</h3>
                  <ul className="mt-2 space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 h-5 w-5 text-primary">✓</span>
                        <span className="ml-2 text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onClose();
                    }}
                    disabled={!product.inStock}
                    className={`flex-1 px-6 py-3 rounded-md text-white ${
                      product.inStock 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                  <button
                    onClick={() => {
                      onWhatsAppClick(product);
                      onClose();
                    }}
                    className="px-6 py-3 rounded-md text-white bg-accent hover:bg-accent/90"
                  >
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t pt-8">
              <Reviews
                reviews={product.reviews || []}
                onAddReview={(review) => onAddReview(product.id, review)}
              />
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 