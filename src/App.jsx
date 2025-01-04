import { useState } from 'react'
import { products, categories } from './data/products'

function App() {
  const whatsappNumber = "2348027127594"
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)

  const handleWhatsAppClick = (product) => {
    const message = `Hi! I'm interested in ${product.name} priced at ₦${(product.price * 1300).toLocaleString()}`
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary">Pack and Bake Tools</h1>
            <a 
              href="https://wa.me/2348027127594"
              className="flex items-center gap-2 text-accent hover:text-accent/80"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
              </svg>
              <span>Contact Us</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Professional Baking Tools
          </h2>
          <p className="text-xl text-gray-100 mb-12 max-w-2xl mx-auto">
            Discover our premium collection of baking and packaging solutions for your business
          </p>
          <div className="max-w-3xl mx-auto flex gap-4 flex-wrap justify-center bg-white/10 backdrop-blur-sm p-4 rounded-xl">
            <input
              type="text"
              placeholder="Search for baking tools, packaging solutions..."
              className="flex-1 min-w-[300px] px-6 py-3 rounded-lg border-2 border-transparent focus:border-accent focus:outline-none text-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              className="px-6 py-3 rounded-lg bg-white border-2 border-transparent focus:border-accent focus:outline-none text-gray-800"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id} 
              className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-56 object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                {!product.inStock && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    Out of Stock
                  </span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <p className="text-white p-4">Click to view details</p>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-lg font-bold text-green-600">
                    ₦{(product.price * 1300).toLocaleString()}
                  </p>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-3">{product.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  {product.features.slice(0, 2).map((feature, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                  {product.features.length > 2 && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      +{product.features.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Product Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full h-72 object-cover"
              />
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedProduct.name}</h2>
                  <p className="text-gray-600">{selectedProduct.description}</p>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  ₦{(selectedProduct.price * 1300).toLocaleString()}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-800 mb-2">Features:</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleWhatsAppClick(selectedProduct)}
                disabled={!selectedProduct.inStock}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
                  ${selectedProduct.inStock 
                    ? 'bg-accent hover:bg-accent/90' 
                    : 'bg-gray-300 cursor-not-allowed'
                  }`}
              >
                {selectedProduct.inStock ? 'Contact via WhatsApp' : 'Out of Stock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Pack and Bake Tools</h3>
              <p className="text-gray-300">
                Quality baking and packaging solutions for your business needs.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map(cat => (
                  <li key={cat.id}>
                    <button 
                      onClick={() => setSelectedCategory(cat.id)}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <a 
                href="https://wa.me/2348027127594"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 1.856.001 3.598.723 4.907 2.034 1.31 1.311 2.031 3.054 2.03 4.908-.001 3.825-3.113 6.938-6.937 6.938z"/>
                </svg>
                <span>WhatsApp: +234 802 712 7594</span>
              </a>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-gray-300">
            <p>© 2024 Pack and Bake Tools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
