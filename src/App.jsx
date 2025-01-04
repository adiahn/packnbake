import { useState } from 'react'
import { products, categories } from './data/products'

function App() {
  const whatsappNumber = "2348027127594"
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pack and Bake Tools
          </h1>
          <p className="text-xl text-gray-100 mb-8">
            Quality Baking and Packaging Solutions
          </p>
          <div className="max-w-xl mx-auto flex gap-4 flex-wrap justify-center">
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border-2 border-transparent focus:border-accent focus:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select 
              className="px-4 py-2 rounded-lg bg-white border-2 border-transparent focus:border-accent focus:outline-none"
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

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-48 object-cover"
                />
                {!product.inStock && (
                  <span className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    Out of Stock
                  </span>
                )}
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                  <p className="text-lg font-bold text-green-600">
                    ₦{(product.price * 1300).toLocaleString()}
                  </p>
                </div>
                
                <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <button 
                  onClick={() => handleWhatsAppClick(product)}
                  disabled={!product.inStock}
                  className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors
                    ${product.inStock 
                      ? 'bg-accent hover:bg-accent/90' 
                      : 'bg-gray-300 cursor-not-allowed'
                    }`}
                >
                  {product.inStock ? 'Contact via WhatsApp' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 Pack and Bake Tools. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
