import React, { useState } from 'react';
import { Download, Star, Calendar, Settings, User, ShoppingBag, Heart, Eye, Award, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('purchased');
  const { user } = useAuth();

  const purchasedProjects = [
    {
      id: 1,
      title: 'E-commerce Web Application',
      category: 'React',
      price: 29,
      originalPrice: 49,
      purchaseDate: '2024-01-15',
      downloadCount: 3,
      rating: 4.9,
      thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'John Doe',
      status: 'completed'
    },
    {
      id: 2,
      title: 'Hospital Management System',
      category: 'Java',
      price: 45,
      originalPrice: 65,
      purchaseDate: '2024-01-10',
      downloadCount: 1,
      rating: 4.8,
      thumbnail: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Sarah Wilson',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Social Media Dashboard',
      category: 'Python',
      price: 35,
      originalPrice: 55,
      purchaseDate: '2024-01-08',
      downloadCount: 2,
      rating: 4.7,
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Mike Johnson',
      status: 'completed'
    }
  ];

  const userProfile = {
    name: user?.name || 'Student User',
    email: user?.email || 'student@studystack.com',
    joinedDate: user?.joinedDate || '2023-09-15',
    totalSpent: 109,
    projectsOwned: 3,
    avatar: user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    level: 'Premium Member',
    completedProjects: 3,
    avgRating: 4.8
  };

  const wishlist = [
    {
      id: 4,
      title: 'Online Learning Platform',
      category: 'PHP',
      price: 55,
      originalPrice: 80,
      rating: 4.9,
      thumbnail: 'https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'David Brown',
      sales: 156
    },
    {
      id: 5,
      title: 'Mobile Banking App',
      category: 'Mobile',
      price: 40,
      originalPrice: 60,
      rating: 4.5,
      thumbnail: 'https://images.pexels.com/photos/4386371/pexels-photo-4386371.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Lisa Anderson',
      sales: 78
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl mb-8 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-blue-100"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {userProfile.level}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{userProfile.name}</h1>
                <p className="text-gray-600 text-lg">{userProfile.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Member since {new Date(userProfile.joinedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-700">{userProfile.avgRating} avg rating</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">${userProfile.totalSpent}</div>
              <div className="text-sm text-gray-600 font-medium">Total Spent</div>
              <div className="text-sm text-green-600 font-semibold mt-1">Saved $67 this month</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Projects Owned</p>
                <p className="text-3xl font-bold text-gray-900">{userProfile.projectsOwned}</p>
                <p className="text-sm text-green-600 font-semibold">+2 this month</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Wishlist Items</p>
                <p className="text-3xl font-bold text-gray-900">{wishlist.length}</p>
                <p className="text-sm text-blue-600 font-semibold">Ready to buy</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <Heart className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Downloads</p>
                <p className="text-3xl font-bold text-gray-900">{purchasedProjects.reduce((sum, p) => sum + p.downloadCount, 0)}</p>
                <p className="text-sm text-purple-600 font-semibold">All time</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <Download className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Avg Rating</p>
                <p className="text-3xl font-bold text-gray-900">{userProfile.avgRating}</p>
                <p className="text-sm text-yellow-600 font-semibold">Excellent</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center">
                <Award className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'purchased', label: 'My Projects', icon: ShoppingBag },
                { id: 'wishlist', label: 'Wishlist', icon: Heart },
                { id: 'profile', label: 'Profile Settings', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 py-6 px-2 border-b-2 font-semibold text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'purchased' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Your Purchased Projects</h2>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{purchasedProjects.length}</span> projects owned
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {purchasedProjects.map((project) => (
                    <div key={project.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
                      <div className="relative">
                        <img 
                          src={project.thumbnail} 
                          alt={project.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Owned
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            {project.category}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-semibold">{project.rating}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">{project.title}</h3>
                        <div className="text-sm text-gray-600 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span>Seller:</span>
                            <span className="font-semibold">{project.seller}</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span>Purchased:</span>
                            <span className="font-semibold">{new Date(project.purchaseDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Downloads:</span>
                            <span className="font-semibold text-green-600">{project.downloadCount}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-gray-900">${project.price}</span>
                            <span className="text-sm text-gray-500 line-through">${project.originalPrice}</span>
                          </div>
                          <span className="text-sm text-green-600 font-semibold">
                            Saved ${project.originalPrice - project.price}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <button className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                          <button className="px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Your Wishlist</h2>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{wishlist.length}</span> items saved
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((project) => (
                    <div key={project.id} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
                      <div className="relative">
                        <img 
                          src={project.thumbnail} 
                          alt={project.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                            <Heart className="w-5 h-5 text-red-500 fill-current" />
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                            {project.category}
                          </span>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-semibold">{project.rating}</span>
                          </div>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">{project.title}</h3>
                        <div className="text-sm text-gray-600 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span>Seller:</span>
                            <span className="font-semibold">{project.seller}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Sales:</span>
                            <span className="font-semibold text-green-600">{project.sales}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-gray-900">${project.price}</span>
                            <span className="text-lg text-gray-500 line-through">${project.originalPrice}</span>
                          </div>
                          <span className="text-sm text-green-600 font-semibold">
                            Save ${project.originalPrice - project.price}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <button className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg">
                            Buy Now
                          </button>
                          <button className="px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h2>
                <div className="max-w-3xl">
                  <div className="space-y-8">
                    <div className="flex items-center gap-8">
                      <div className="relative">
                        <img 
                          src={userProfile.avatar} 
                          alt={userProfile.name}
                          className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          {userProfile.level}
                        </div>
                      </div>
                      <div>
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg">
                          Change Avatar
                        </button>
                        <p className="text-sm text-gray-600 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Full Name</label>
                        <input
                          type="text"
                          defaultValue={userProfile.name}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
                        <input
                          type="email"
                          defaultValue={userProfile.email}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Bio</label>
                      <textarea
                        rows={4}
                        placeholder="Tell us about yourself and your interests..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      />
                    </div>

                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Current Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg">
                        Save Changes
                      </button>
                      <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;