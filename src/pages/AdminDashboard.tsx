import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Check, X, Calendar, DollarSign, Users, User, ShoppingBag, Clock, TrendingUp, AlertCircle, BarChart3, Award, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { user } = useAuth();

  const stats = {
    totalProjects: 45,
    pendingApproval: 8,
    totalSales: 2540,
    totalUsers: 156,
    monthlyGrowth: 24,
    avgRating: 4.8
  };

  const recentActivity = [
    { id: 1, action: 'New project submitted', user: 'John Doe', time: '2 hours ago', type: 'project', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: 2, action: 'Project approved', user: 'Sarah Wilson', time: '5 hours ago', type: 'approval', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: 3, action: 'New user registered', user: 'Mike Johnson', time: '1 day ago', type: 'user', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: 4, action: 'Payment processed', user: 'Emma Davis', time: '2 days ago', type: 'payment', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100' },
    { id: 5, action: 'Project rejected', user: 'Alex Brown', time: '3 days ago', type: 'rejection', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100' }
  ];

  const salesData = [
    { month: 'Jan', sales: 1200, projects: 15 },
    { month: 'Feb', sales: 1800, projects: 22 },
    { month: 'Mar', sales: 2200, projects: 28 },
    { month: 'Apr', sales: 1900, projects: 24 },
    { month: 'May', sales: 2540, projects: 32 },
    { month: 'Jun', sales: 2800, projects: 35 }
  ];

  const projects = [
    {
      id: 1,
      title: 'E-commerce Web Application',
      seller: 'John Doe',
      category: 'React',
      price: 29,
      originalPrice: 49,
      status: 'approved',
      dateSubmitted: '2024-01-15',
      sales: 23,
      rating: 4.9,
      thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 2,
      title: 'Hospital Management System',
      seller: 'Sarah Wilson',
      category: 'Java',
      price: 45,
      originalPrice: 65,
      status: 'approved',
      dateSubmitted: '2024-01-10',
      sales: 18,
      rating: 4.8,
      thumbnail: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 3,
      title: 'Social Media Dashboard',
      seller: 'Mike Johnson',
      category: 'Python',
      price: 35,
      originalPrice: 55,
      status: 'pending',
      dateSubmitted: '2024-01-08',
      sales: 0,
      rating: 0,
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 4,
      title: 'Task Management App',
      seller: 'Emma Davis',
      category: 'React',
      price: 22,
      originalPrice: 35,
      status: 'pending',
      dateSubmitted: '2024-01-05',
      sales: 0,
      rating: 0,
      thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

  const users = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@studystack.com',
      role: 'student',
      joinedDate: '2023-09-15',
      projectsOwned: 3,
      totalSpent: 109,
      status: 'active',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 2,
      name: 'Sarah Wilson',
      email: 'sarah@studystack.com',
      role: 'student',
      joinedDate: '2023-10-20',
      projectsOwned: 2,
      totalSpent: 74,
      status: 'active',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@studystack.com',
      role: 'student',
      joinedDate: '2023-11-05',
      projectsOwned: 1,
      totalSpent: 35,
      status: 'active',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100'
    }
  ];

  const transactions = [
    {
      id: 1,
      project: 'E-commerce Web Application',
      buyer: 'Alice Johnson',
      amount: 29,
      date: '2024-01-20',
      status: 'completed'
    },
    {
      id: 2,
      project: 'Hospital Management System',
      buyer: 'Bob Smith',
      amount: 45,
      date: '2024-01-19',
      status: 'completed'
    },
    {
      id: 3,
      project: 'Social Media Dashboard',
      buyer: 'Carol Brown',
      amount: 35,
      date: '2024-01-18',
      status: 'completed'
    },
    {
      id: 4,
      project: 'E-commerce Web Application',
      buyer: 'David Wilson',
      amount: 29,
      date: '2024-01-17',
      status: 'completed'
    }
  ];

  const handleApprove = (id: number) => {
    alert(`Project ${id} approved!`);
  };

  const handleReject = (id: number) => {
    alert(`Project ${id} rejected!`);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      alert(`Project ${id} deleted!`);
    }
  };

  const AddProjectModal = () => (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Add New Project</h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Project Title</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter project title"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>React</option>
                <option>Java</option>
                <option>Python</option>
                <option>PHP</option>
                <option>Mobile</option>
                <option>Node.js</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Price ($)</label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Project description"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">YouTube Video URL</label>
            <input
              type="url"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Project Files</label>
            <input
              type="file"
              accept=".zip,.rar"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
            >
              Add Project
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 bg-white/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">Admin Dashboard</h1>
              <p className="text-gray-600 text-lg">Welcome back, {user?.name}! Here's your platform overview.</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Last login</div>
              <div className="text-xl font-bold text-gray-900">Today, 9:30 AM</div>
              <div className="text-sm text-green-600 font-semibold">+{stats.monthlyGrowth}% growth</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Projects</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
                <p className="text-sm text-green-600 font-semibold">+12% this month</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending Approval</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingApproval}</p>
                <p className="text-sm text-orange-600 font-semibold">Needs attention</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Sales</p>
                <p className="text-3xl font-bold text-green-600">${stats.totalSales}</p>
                <p className="text-sm text-green-600 font-semibold">+18% this month</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                <DollarSign className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Users</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalUsers}</p>
                <p className="text-sm text-purple-600 font-semibold">+24% this month</p>
              </div>
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Users className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'analytics', label: 'Analytics' },
                { id: 'projects', label: 'Manage Projects' },
                { id: 'users', label: 'User Management' },
                { id: 'approval', label: 'Pending Approval' },
                { id: 'transactions', label: 'Transactions' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-6 px-2 border-b-2 font-semibold text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div>
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
                      <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <Clock className="w-6 h-6 text-blue-600" />
                        Recent Activity
                      </h3>
                      <div className="space-y-4">
                        {recentActivity.map((activity) => (
                          <div key={activity.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-4">
                              <img 
                                src={activity.avatar} 
                                alt={activity.user}
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-100"
                              />
                              <div className={`w-3 h-3 rounded-full ${
                                activity.type === 'project' ? 'bg-blue-500' :
                                activity.type === 'approval' ? 'bg-green-500' :
                                activity.type === 'user' ? 'bg-purple-500' :
                                activity.type === 'payment' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`} />
                              <div>
                                <span className="text-gray-900 font-semibold">{activity.action}</span>
                                <div className="text-sm text-gray-600">by {activity.user}</div>
                              </div>
                            </div>
                            <span className="text-sm text-gray-500 font-medium">{activity.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        Quick Stats
                      </h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">Today's Sales</span>
                          <span className="text-2xl font-bold text-green-600">$127</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">New Users</span>
                          <span className="text-2xl font-bold text-blue-600">3</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">Avg Rating</span>
                          <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="text-2xl font-bold text-purple-600">{stats.avgRating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
                      <h3 className="text-xl font-bold mb-6">Popular Categories</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">React</span>
                          <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full font-semibold">15 projects</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">Java</span>
                          <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full font-semibold">12 projects</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">Python</span>
                          <span className="text-sm text-gray-600 bg-blue-100 px-3 py-1 rounded-full font-semibold">10 projects</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <BarChart3 className="w-7 h-7 text-blue-600" />
                  Analytics & Reports
                </h2>
                
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  {/* Sales Chart */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
                    <h3 className="text-xl font-bold mb-6">Monthly Sales</h3>
                    <div className="space-y-4">
                      {salesData.map((data, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-700 font-semibold">{data.month}</span>
                          <div className="flex items-center gap-4">
                            <div className="w-32 bg-gray-200 rounded-full h-3">
                              <div 
                                className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full" 
                                style={{ width: `${(data.sales / 3000) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm font-bold text-gray-900 w-20">${data.sales}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Project Performance */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100">
                    <h3 className="text-xl font-bold mb-6">Top Performing Projects</h3>
                    <div className="space-y-4">
                      {projects.filter(p => p.status === 'approved').slice(0, 5).map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                          <div className="flex items-center gap-3">
                            <img 
                              src={project.thumbnail} 
                              alt={project.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{project.title}</div>
                              <div className="text-sm text-gray-500">{project.category}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{project.sales} sales</div>
                            <div className="text-sm text-green-600 font-semibold">${project.price * project.sales}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Additional Analytics */}
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-3">Average Project Price</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-2">$34.50</div>
                    <div className="text-sm text-green-600 font-semibold">↑ 8.2% from last month</div>
                  </div>
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-3">User Retention</h4>
                    <div className="text-3xl font-bold text-green-600 mb-2">78%</div>
                    <div className="text-sm text-green-600 font-semibold">↑ 3.1% from last month</div>
                  </div>
                  <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                    <h4 className="font-bold text-gray-900 mb-3">Revenue Growth</h4>
                    <div className="text-3xl font-bold text-purple-600 mb-2">+24%</div>
                    <div className="text-sm text-green-600 font-semibold">↑ 12% from last month</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Manage Projects</h2>
                  <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Add Project
                  </button>
                </div>
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Project</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Seller</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sales</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {projects.filter(p => p.status === 'approved').map((project) => (
                          <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={project.thumbnail} 
                                  alt={project.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className="font-semibold text-gray-900">{project.title}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                              {project.seller}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                                {project.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                              ${project.price}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                              {project.sales}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-green-100 text-green-800">
                                {project.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(project.id)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <div className="flex gap-4">
                    <select className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option>All Users</option>
                      <option>Students</option>
                      <option>Admins</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Search users..."
                      className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Projects</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Total Spent</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <img 
                                  src={user.avatar} 
                                  alt={user.name}
                                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
                                />
                                <div>
                                  <div className="font-semibold text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-600">{user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                              {new Date(user.joinedDate).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                              {user.projectsOwned}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                              ${user.totalSpent}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-green-100 text-green-800">
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors">
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'approval' && (
              <div>
                <h2 className="text-2xl font-bold mb-8 text-gray-900">Pending Approval</h2>
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Project</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Seller</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Price</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Submitted</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {projects.filter(p => p.status === 'pending').map((project) => (
                          <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={project.thumbnail} 
                                  alt={project.title}
                                  className="w-12 h-12 rounded-lg object-cover"
                                />
                                <div className="font-semibold text-gray-900">{project.title}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                              {project.seller}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                                {project.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                              ${project.price}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                              {new Date(project.dateSubmitted).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleApprove(project.id)}
                                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleReject(project.id)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div>
                <h2 className="text-2xl font-bold mb-8 text-gray-900">Transaction History</h2>
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Project</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Buyer</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900">{transaction.project}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                              {transaction.buyer}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-gray-900">
                              ${transaction.amount}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-green-100 text-green-800">
                                {transaction.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {isAddModalOpen && <AddProjectModal />}
    </div>
  );
};

export default AdminDashboard;