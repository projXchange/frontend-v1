import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Download, Play, Lock, ShoppingCart, Heart, Share2, Eye, Calendar, User, Award, Clock, Shield, CheckCircle } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const [isPurchased, setIsPurchased] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // Mock project data - in real app, fetch based on ID
  const project = {
    id: parseInt(id || '1'),
    title: 'E-commerce Web Application',
    category: 'React',
    price: 29,
    originalPrice: 49,
    rating: 4.9,
    reviews: 45,
    thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=800',
    seller: {
      name: 'John Doe',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      rating: 4.9,
      totalProjects: 12,
      joinedDate: '2023-06-15',
      level: 'Top Rated',
      responseTime: '1 hour',
      completionRate: '98%'
    },
    description: 'A complete e-commerce solution built with React and Node.js. This project includes everything you need to build a modern online store with user authentication, shopping cart, payment integration, and admin dashboard.',
    features: [
      'User Registration & Authentication',
      'Product Catalog with Categories',
      'Shopping Cart & Checkout',
      'Payment Integration (Stripe)',
      'Admin Dashboard',
      'Order Management',
      'Responsive Design',
      'Email Notifications',
      'Search & Filtering',
      'Product Reviews & Ratings'
    ],
    techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Stripe', 'JWT', 'Bootstrap'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    deliveryTime: '2 days',
    revisions: '3 revisions',
    sales: 89,
    instructions: isPurchased ? `
# E-commerce Web Application Setup

## Prerequisites
- Node.js 16+ installed
- MongoDB installed and running
- Stripe account for payment processing

## Installation Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd ecommerce-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   \`\`\`

3. **Environment Setup**
   Create .env file in backend directory:
   \`\`\`
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your-jwt-secret
   STRIPE_SECRET_KEY=your-stripe-secret
   \`\`\`

4. **Run the application**
   \`\`\`bash
   # Backend (port 5000)
   cd backend
   npm start
   
   # Frontend (port 3000)
   cd frontend
   npm start
   \`\`\`

## Features Overview

### User Features
- User registration and login
- Browse products by category
- Add products to cart
- Secure checkout with Stripe
- Order history and tracking

### Admin Features
- Add/Edit/Delete products
- Manage orders
- View analytics
- User management

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### Products
- GET /api/products
- GET /api/products/:id
- POST /api/products (admin only)
- PUT /api/products/:id (admin only)
- DELETE /api/products/:id (admin only)

### Orders
- POST /api/orders
- GET /api/orders/user/:userId
- GET /api/orders (admin only)

## Database Schema

### User Model
\`\`\`javascript
{
  name: String,
  email: String,
  password: String,
  role: String, // 'user' or 'admin'
  createdAt: Date
}
\`\`\`

### Product Model
\`\`\`javascript
{
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  createdAt: Date
}
\`\`\`

### Order Model
\`\`\`javascript
{
  user: ObjectId,
  items: [{
    product: ObjectId,
    quantity: Number,
    price: Number
  }],
  totalAmount: Number,
  status: String,
  createdAt: Date
}
\`\`\`

## Customization Guide

### Styling
- CSS files are located in \`src/styles/\`
- Bootstrap classes are used throughout
- Custom variables in \`src/styles/variables.css\`

### Adding New Features
1. Create new components in \`src/components/\`
2. Add routes in \`src/App.js\`
3. Update API endpoints in \`src/services/\`

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check connection string in .env

2. **Stripe Payment Fails**
   - Verify Stripe keys in .env
   - Check Stripe webhook configuration

3. **CORS Issues**
   - Update CORS settings in backend/server.js

## Support
For questions or issues, please contact the seller through the StudyStack platform.
    ` : 'Purchase this project to unlock detailed setup instructions and documentation.',
    screenshots: [
      'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    dateAdded: '2024-01-15',
    views: 324,
    likes: 67
  };

  const handlePurchase = () => {
    // Mock purchase logic
    setIsPurchased(true);
    alert('Project purchased successfully! You can now access all files and instructions.');
  };

  const relatedProjects = [
    {
      id: 2,
      title: 'React Task Manager',
      price: 22,
      originalPrice: 35,
      rating: 4.6,
      thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=300'
    },
    {
      id: 3,
      title: 'Social Media Dashboard',
      price: 35,
      originalPrice: 55,
      rating: 4.7,
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=300'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-8 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 animate-slideInDown">
          <nav className="flex text-sm text-gray-500">
            <Link to="/" className="hover:text-blue-600 transition-colors duration-200">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/projects" className="hover:text-blue-600 transition-colors duration-200">Projects</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{project.title}</span>
          </nav>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Header */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl mb-10 border border-white/30 animate-slideInLeft">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-700 rounded-full text-sm font-bold shadow-sm animate-slideInUp">
                    {project.category}
                  </span>
                  <span className="px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 rounded-full text-sm font-bold flex items-center shadow-sm animate-slideInUp" style={{ animationDelay: '100ms' }}>
                    <Award className="w-3 h-3 mr-1" />
                    Featured
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-500 transition-all duration-200 rounded-xl hover:bg-red-50 hover:scale-105 animate-slideInUp" style={{ animationDelay: '200ms' }}>
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">{project.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-blue-500 transition-all duration-200 rounded-xl hover:bg-blue-50 hover:scale-105 animate-slideInUp" style={{ animationDelay: '300ms' }}>
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Share</span>
                  </button>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-6 animate-slideInUp" style={{ animationDelay: '400ms' }}>{project.title}</h1>
              <div className="flex flex-wrap items-center gap-8 text-sm text-gray-600 mb-8 animate-slideInUp" style={{ animationDelay: '500ms' }}>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-bold text-lg">{project.rating}</span>
                  <span className="font-medium">({project.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">{project.views} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Added {new Date(project.dateAdded).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-medium">{project.sales} sales</span>
                </div>
              </div>
              {/* Video */}
              <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-8 shadow-2xl animate-slideInUp hover:shadow-3xl transition-shadow duration-300" style={{ animationDelay: '600ms' }}>
                <iframe
                  src={project.videoUrl}
                  title="Project Demo"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-8 animate-slideInUp" style={{ animationDelay: '700ms' }}>
                <nav className="flex space-x-8">
                  {['description', 'features', 'instructions', 'screenshots'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-2 border-b-2 font-semibold text-sm transition-colors animate-fadeInUp ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600 scale-105'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:scale-105'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>
              {/* Tab Content */}
              <div className="min-h-[400px] animate-slideInUp" style={{ animationDelay: '800ms' }}>
                {activeTab === 'description' && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 animate-slideInUp">About This Project</h3>
                    <p className="text-gray-700 leading-relaxed mb-8 text-lg animate-slideInUp" style={{ animationDelay: '100ms' }}>{project.description}</p>
                    <h4 className="text-xl font-bold mb-4 animate-slideInUp" style={{ animationDelay: '200ms' }}>Tech Stack</h4>
                    <div className="flex flex-wrap gap-3">
                      {project.techStack.map((tech, index) => (
                        <span key={index} className="px-4 py-2 bg-gradient-to-r from-blue-100 to-teal-100 text-blue-800 rounded-xl text-sm font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 animate-slideInUp" style={{ animationDelay: `${300 + index * 80}ms` }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'features' && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 animate-slideInUp">Key Features</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {project.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl border border-blue-100 hover:shadow-md hover:scale-105 transition-all duration-200 animate-slideInUp" style={{ animationDelay: `${100 + index * 80}ms` }}>
                          <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full animate-pulse" />
                          <span className="text-gray-800 font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeTab === 'instructions' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold animate-slideInUp">Setup Instructions</h3>
                      {!isPurchased && (
                        <div className="flex items-center gap-2 text-gray-500 bg-gray-100 px-4 py-2 rounded-xl animate-slideInUp">
                          <Lock className="w-5 h-5" />
                          <span className="font-medium">Purchase to unlock</span>
                        </div>
                      )}
                    </div>
                    <div className={`${!isPurchased ? 'filter blur-sm' : ''} animate-slideInUp transition-all duration-300`} style={{ animationDelay: '100ms' }}>
                      <div className="bg-gray-900 rounded-2xl p-8 font-mono text-sm shadow-2xl hover:shadow-3xl transition-shadow duration-300">
                        <pre className="whitespace-pre-wrap text-green-400">
                          {project.instructions}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
                {activeTab === 'screenshots' && (
                  <div>
                    <h3 className="text-2xl font-bold mb-6 animate-slideInUp">Project Screenshots</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      {project.screenshots.map((screenshot, index) => (
                        <div key={index} className="aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 animate-slideInUp" style={{ animationDelay: `${100 + index * 100}ms` }}>
                          <img 
                            src={screenshot} 
                            alt={`Screenshot ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Sidebar */}
          <div className="space-y-8">
            {/* Purchase Card */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl sticky top-8 border border-white/30 animate-slideInRight">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4 animate-slideInUp">
                  <div className="text-4xl font-bold text-gray-900">${project.price}</div>
                  <div className="text-2xl text-gray-500 line-through">${project.originalPrice}</div>
                </div>
                <div className="text-sm text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full inline-block animate-pulse">
                  Save ${project.originalPrice - project.price}
                </div>
              </div>
              <div className="space-y-4 mb-8 animate-slideInUp" style={{ animationDelay: '200ms' }}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Delivery Time
                  </span>
                  <span className="font-semibold text-gray-900">{project.deliveryTime}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Revisions</span>
                  <span className="font-semibold text-gray-900">{project.revisions}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Sales</span>
                  <span className="font-semibold text-gray-900">{project.sales}</span>
                </div>
              </div>
              {!isPurchased ? (
                <button
                  onClick={handlePurchase}
                  className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-300 flex items-center justify-center gap-3 mb-6 shadow-lg hover:shadow-xl transform hover:scale-105 animate-slideInUp" style={{ animationDelay: '300ms' }}
                >
                  <ShoppingCart className="w-6 h-6" />
                  Continue (${project.price})
                </button>
              ) : (
                <div className="space-y-4 mb-6">
                  <div className="text-center text-green-600 font-bold text-lg mb-4 bg-green-100 py-3 rounded-xl animate-slideInUp">
                    ✅ Project Purchased
                  </div>
                  <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105 animate-slideInUp">
                    <Download className="w-6 h-6" />
                    Download Files
                  </button>
                </div>
              )}
              <div className="space-y-3 text-center text-sm text-gray-600 animate-slideInUp" style={{ animationDelay: '400ms' }}>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Source code included</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span>Documentation provided</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Money-back guarantee</span>
                </div>
              </div>
            </div>
            {/* Seller Info */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-white/30 animate-slideInRight" style={{ animationDelay: '200ms' }}>
              <h3 className="text-xl font-bold mb-6">About the Seller</h3>
              <div className="flex items-center gap-4 mb-6 animate-slideInUp">
                <img 
                  src={project.seller.avatar} 
                  alt={project.seller.name}
                  className="w-16 h-16 rounded-full object-cover ring-4 ring-blue-100 hover:ring-blue-200 transition-all duration-300"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{project.seller.name}</h4>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{project.seller.rating}</span>
                  </div>
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 rounded-full text-xs font-bold animate-pulse">
                    {project.seller.level}
                  </span>
                </div>
              </div>
              <div className="space-y-3 text-sm animate-slideInUp" style={{ animationDelay: '100ms' }}>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Projects</span>
                  <span className="font-semibold text-gray-900">{project.seller.totalProjects}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold text-gray-900">{project.seller.responseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold text-green-600">{project.seller.completionRate}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold text-gray-900">{new Date(project.seller.joinedDate).toLocaleDateString()}</span>
                </div>
              </div>
              <button className="w-full mt-6 bg-gray-100 text-gray-800 py-3 rounded-xl font-semibold hover:bg-gray-200 hover:scale-105 transition-all duration-200 animate-slideInUp" style={{ animationDelay: '200ms' }}>
                Contact Seller
              </button>
            </div>
            {/* Related Projects */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-white/30 animate-slideInRight" style={{ animationDelay: '400ms' }}>
              <h3 className="text-xl font-bold mb-6">Related Projects</h3>
              <div className="space-y-6">
                {relatedProjects.map((relatedProject, idx) => (
                  <Link 
                    key={relatedProject.id}
                    to={`/project/${relatedProject.id}`}
                    className="flex gap-4 p-4 rounded-xl hover:bg-blue-50 hover:scale-105 transition-all duration-300 group animate-slideInUp"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    <img 
                      src={relatedProject.thumbnail} 
                      alt={relatedProject.title}
                      className="w-20 h-16 object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm mb-2 group-hover:text-blue-600 transition-colors duration-300">{relatedProject.title}</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-600 font-medium">{relatedProject.rating}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">${relatedProject.price}</span>
                          <span className="text-xs text-gray-500 line-through">${relatedProject.originalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Animations */}
      <style>{`
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInUp { animation: slideInUp 0.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes slideInDown {
          0% { opacity: 0; transform: translateY(-40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInDown { animation: slideInDown 0.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes slideInLeft {
          0% { opacity: 0; transform: translateX(-50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInLeft { animation: slideInLeft 0.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes slideInRight {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInRight { animation: slideInRight 0.8s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out both; }
      `}</style>
    </div>
  );
};

export default ProjectDetail;