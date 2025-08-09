import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Check, X, Calendar, DollarSign, Users, User, ShoppingBag, Clock, TrendingUp, AlertCircle, BarChart3, Award, Star, Activity, Zap, Target, Filter, Search, ChevronDown, Bell, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { user } = useAuth();

  const stats = {
    totalProjects: 45,
    pendingApproval: 8,
    totalSales: 2540,
    totalUsers: 156,
    monthlyGrowth: 24,
    avgRating: 4.8,
    activeUsers: 89,
    revenue: 12450,
    conversionRate: 3.2
  };

  const recentActivity = [
    { id: 1, action: 'New project submitted', user: 'John Doe', time: '2 hours ago', type: 'project', avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100', status: 'pending' },
    { id: 2, action: 'Project approved', user: 'Sarah Wilson', time: '5 hours ago', type: 'approval', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100', status: 'approved' },
    { id: 3, action: 'New user registered', user: 'Mike Johnson', time: '1 day ago', type: 'user', avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100', status: 'active' },
    { id: 4, action: 'Payment processed', user: 'Emma Davis', time: '2 days ago', type: 'payment', avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100', status: 'completed' },
    { id: 5, action: 'Project rejected', user: 'Alex Brown', time: '3 days ago', type: 'rejection', avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100', status: 'rejected' }
  ];

  const salesData = [
    { month: 'Jan', sales: 1200, projects: 15, users: 45 },
    { month: 'Feb', sales: 1800, projects: 22, users: 67 },
    { month: 'Mar', sales: 2200, projects: 28, users: 89 },
    { month: 'Apr', sales: 1900, projects: 24, users: 102 },
    { month: 'May', sales: 2540, projects: 32, users: 134 },
    { month: 'Jun', sales: 2800, projects: 35, users: 156 }
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
      thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=100',
      featured: true,
      trending: true
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
      thumbnail: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=100',
      featured: false,
      trending: false
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
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=100',
      featured: false,
      trending: true
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
      thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=100',
      featured: false,
      trending: false
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
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
      lastActive: '2024-01-20'
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
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
      lastActive: '2024-01-19'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@studystack.com',
      role: 'student',
      joinedDate: '2023-11-05',
      projectsOwned: 1,
      totalSpent: 35,
      status: 'inactive',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
      lastActive: '2024-01-10'
    }
  ];

  const transactions = [
    {
      id: 1,
      project: 'E-commerce Web Application',
      buyer: 'Alice Johnson',
      seller: 'John Doe',
      amount: 29,
      commission: 2.9,
      date: '2024-01-20',
      status: 'completed'
    },
    {
      id: 2,
      project: 'Hospital Management System',
      buyer: 'Bob Smith',
      seller: 'Sarah Wilson',
      amount: 45,
      commission: 4.5,
      date: '2024-01-19',
      status: 'completed'
    },
    {
      id: 3,
      project: 'Social Media Dashboard',
      buyer: 'Carol Brown',
      seller: 'Mike Johnson',
      amount: 35,
      commission: 3.5,
      date: '2024-01-18',
      status: 'pending'
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

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend, onClick }: any) => (
    <div 
      className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          <p className={`text-sm font-semibold ${color}`}>{subtitle}</p>
        </div>
        <div className={`w-14 h-14 bg-gradient-to-br ${color.replace('text-', 'from-').replace('-600', '-500')} to-${color.split('-')[1]}-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
          <span className="text-sm text-green-600 font-semibold">{trend}</span>
        </div>
      )}
    </div>
  );

  const AddProjectModal = () => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slideInUp">
        <h2 className="text-3xl font-bold mb-8 text-gray-900">Add New Project</h2>
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Project Title</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow duration-200"
              placeholder="Enter project title"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
              <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow duration-200">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow duration-200"
                placeholder="0"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
            <textarea
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow duration-200 resize-none"
              placeholder="Project description"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">YouTube Video URL</label>
            <input
              type="url"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow duration-200"
              placeholder="https://youtube.com/watch?v=..."
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Project Files</label>
            <input
              type="file"
              accept=".zip,.rar"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow duration-200"
            />
          </div>
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              Add Project
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 hover:scale-105 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="animate-slideInLeft">
              <h1 className="text-4xl font-bold mb-3">Admin Dashboard</h1>
              <p className="text-blue-100 text-lg">Welcome back, {user?.name}! Manage your platform with ease.</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-green-300" />
                  <span className="text-sm">System Status: Healthy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-300" />
                  <span className="text-sm">{stats.activeUsers} Active Users</span>
                </div>
              </div>
            </div>
            <div className="text-right animate-slideInRight">
              <div className="text-3xl font-bold">${stats.revenue.toLocaleString()}</div>
              <div className="text-blue-200 text-sm">Monthly Revenue</div>
              <div className="text-sm text-green-300 font-semibold mt-1">
                +{stats.monthlyGrowth}% growth
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-16 relative z-10">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            subtitle="+12% this month"
            icon={ShoppingBag}
            color="text-blue-600"
            trend="+5 new projects"
            onClick={() => setActiveTab('projects')}
          />
          <StatCard
            title="Pending Approval"
            value={stats.pendingApproval}
            subtitle="Needs attention"
            icon={AlertCircle}
            color="text-orange-600"
            onClick={() => setActiveTab('approval')}
          />
          <StatCard
            title="Total Sales"
            value={`$${stats.totalSales}`}
            subtitle="+18% this month"
            icon={DollarSign}
            color="text-green-600"
            trend="+$450 today"
            onClick={() => setActiveTab('transactions')}
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            subtitle="+24% this month"
            icon={Users}
            color="text-purple-600"
            trend="+12 new users"
            onClick={() => setActiveTab('users')}
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30 mb-8 animate-slideInUp">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
              <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                <Bell className="w-4 h-4" />
                Notifications
              </button>
              <button className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white px-4 py-2 rounded-xl font-semibold hover:from-gray-700 hover:to-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8 overflow-x-auto">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'analytics', label: 'Analytics', icon: TrendingUp },
                { id: 'projects', label: 'Projects', icon: ShoppingBag },
                { id: 'users', label: 'Users', icon: Users },
                { id: 'approval', label: 'Pending', icon: AlertCircle },
                { id: 'transactions', label: 'Transactions', icon: DollarSign }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 py-6 px-2 border-b-2 font-semibold text-sm transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 scale-105'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:scale-105'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                  {tab.id === 'approval' && stats.pendingApproval > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                      {stats.pendingApproval}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="animate-slideInUp">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Platform Overview</h2>
                
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                        <Activity className="w-6 h-6 text-blue-600" />
                        Recent Activity
                      </h3>
                      <div className="space-y-4">
                        {recentActivity.map((activity, index) => (
                          <div key={activity.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all duration-300 animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
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
                            <div className="text-right">
                              <span className="text-sm text-gray-500 font-medium">{activity.time}</span>
                              <div className={`text-xs px-2 py-1 rounded-full mt-1 ${
                                activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                activity.status === 'approved' ? 'bg-green-100 text-green-700' :
                                activity.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                activity.status === 'active' ? 'bg-purple-100 text-purple-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {activity.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
                      <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Today's Metrics
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">New Signups</span>
                          <span className="text-2xl font-bold text-blue-900">12</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Projects Sold</span>
                          <span className="text-2xl font-bold text-blue-900">8</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Revenue</span>
                          <span className="text-2xl font-bold text-blue-900">$450</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                      <h4 className="font-bold text-purple-900 mb-4">Platform Health</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-purple-700">Server Uptime</span>
                            <span className="font-semibold">99.9%</span>
                          </div>
                          <div className="w-full bg-purple-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '99.9%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-purple-700">User Satisfaction</span>
                            <span className="font-semibold">{stats.avgRating}/5.0</span>
                          </div>
                          <div className="w-full bg-purple-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: `${(stats.avgRating / 5) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="animate-slideInUp">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <BarChart3 className="w-7 h-7 text-blue-600" />
                  Analytics & Reports
                </h2>
                
                <div className="grid lg:grid-cols-2 gap-8 mb-8">
                  {/* Sales Chart */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                    <h3 className="text-xl font-bold mb-6">Monthly Performance</h3>
                    <div className="space-y-4">
                      {salesData.map((data, index) => (
                        <div key={index} className="animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-700 font-semibold">{data.month}</span>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-green-600 font-bold">${data.sales}</span>
                              <span className="text-blue-600">{data.projects} projects</span>
                              <span className="text-purple-600">{data.users} users</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-1000" 
                              style={{ width: `${(data.sales / 3000) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Top Categories */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 shadow-lg">
                    <h3 className="text-xl font-bold mb-6">Popular Categories</h3>
                    <div className="space-y-4">
                      {[
                        { name: 'React', projects: 15, sales: '$1,250', color: 'from-blue-500 to-blue-600' },
                        { name: 'Java', projects: 12, sales: '$980', color: 'from-orange-500 to-red-600' },
                        { name: 'Python', projects: 10, sales: '$850', color: 'from-green-500 to-emerald-600' },
                        { name: 'PHP', projects: 8, sales: '$640', color: 'from-purple-500 to-indigo-600' }
                      ].map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:scale-105 transition-all duration-300 animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${category.color}`} />
                            <span className="font-semibold text-gray-900">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-gray-900">{category.projects} projects</div>
                            <div className="text-sm text-green-600 font-semibold">{category.sales}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* KPI Cards */}
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <h4 className="font-bold text-gray-900 mb-3">Conversion Rate</h4>
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stats.conversionRate}%</div>
                    <div className="text-sm text-green-600 font-semibold">↑ 0.3% from last month</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <h4 className="font-bold text-gray-900 mb-3">Avg Order Value</h4>
                    <div className="text-3xl font-bold text-green-600 mb-2">$34.50</div>
                    <div className="text-sm text-green-600 font-semibold">↑ $2.10 from last month</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <h4 className="font-bold text-gray-900 mb-3">User Retention</h4>
                    <div className="text-3xl font-bold text-purple-600 mb-2">78%</div>
                    <div className="text-sm text-green-600 font-semibold">↑ 5% from last month</div>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                    <h4 className="font-bold text-gray-900 mb-3">Active Sellers</h4>
                    <div className="text-3xl font-bold text-orange-600 mb-2">24</div>
                    <div className="text-sm text-green-600 font-semibold">↑ 3 new this month</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="animate-slideInUp">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Manage Projects</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      <option value="all">All Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <Plus className="w-5 h-5" />
                      Add Project
                    </button>
                  </div>
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
                        {projects.filter(p => p.status === 'approved').map((project, index) => (
                          <tr key={project.id} className="hover:bg-gray-50 transition-colors animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={project.thumbnail} 
                                  alt={project.title}
                                  className="w-12 h-12 rounded-lg object-cover shadow-sm"
                                />
                                <div>
                                  <div className="font-semibold text-gray-900">{project.title}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    {project.featured && (
                                      <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Featured</span>
                                    )}
                                    {project.trending && (
                                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Trending</span>
                                    )}
                                  </div>
                                </div>
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
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900">${project.price}</span>
                                <span className="text-xs text-gray-500 line-through">${project.originalPrice}</span>
                              </div>
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
                                <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(project.id)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
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
              <div className="animate-slideInUp">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                  <div className="flex gap-4">
                    <select className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                      <option>All Users</option>
                      <option>Students</option>
                      <option>Admins</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                      />
                    </div>
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
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Spent</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {users.map((user, index) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-4">
                                <img 
                                  src={user.avatar} 
                                  alt={user.name}
                                  className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 shadow-sm"
                                />
                                <div>
                                  <div className="font-semibold text-gray-900">{user.name}</div>
                                  <div className="text-sm text-gray-600">{user.email}</div>
                                  <div className="text-xs text-gray-500">Last active: {user.lastActive}</div>
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
                            <td className="px-6 py-4 text-sm font-bold text-green-600">
                              ${user.totalSpent}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                                user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110">
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110">
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
              <div className="animate-slideInUp">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <AlertCircle className="w-7 h-7 text-orange-600" />
                  Pending Approval
                  <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full animate-pulse">
                    {projects.filter(p => p.status === 'pending').length}
                  </span>
                </h2>
                
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-orange-50 to-yellow-50">
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
                        {projects.filter(p => p.status === 'pending').map((project, index) => (
                          <tr key={project.id} className="hover:bg-orange-50 transition-colors animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={project.thumbnail} 
                                  alt={project.title}
                                  className="w-12 h-12 rounded-lg object-cover shadow-sm"
                                />
                                <div>
                                  <div className="font-semibold text-gray-900">{project.title}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">Pending Review</span>
                                    {project.trending && (
                                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">Trending</span>
                                    )}
                                  </div>
                                </div>
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
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-gray-900">${project.price}</span>
                                <span className="text-xs text-gray-500 line-through">${project.originalPrice}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                              {new Date(project.dateSubmitted).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110">
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleApprove(project.id)}
                                  className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-all duration-200 hover:scale-110"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => handleReject(project.id)}
                                  className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
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
              <div className="animate-slideInUp">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <DollarSign className="w-7 h-7 text-green-600" />
                  Transaction History
                </h2>
                
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-green-50 to-emerald-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Project</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Buyer</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Seller</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Amount</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Commission</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {transactions.map((transaction, index) => (
                          <tr key={transaction.id} className="hover:bg-green-50 transition-colors animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900">{transaction.project}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                              {transaction.buyer}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                              {transaction.seller}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-green-600">
                              ${transaction.amount}
                            </td>
                            <td className="px-6 py-4 text-sm font-bold text-blue-600">
                              ${transaction.commission}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                              {new Date(transaction.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${
                                transaction.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
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