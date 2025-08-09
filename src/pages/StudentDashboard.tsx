import React, { useState } from 'react';
import { Download, Star, Calendar, Settings, User, ShoppingBag, Heart, Eye, Award, TrendingUp, Clock, BarChart3, Zap, BookOpen, Trophy, Target, Activity, ChevronRight, Plus, Filter, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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
      status: 'completed',
      progress: 100,
      lastAccessed: '2024-01-20'
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
      status: 'completed',
      progress: 100,
      lastAccessed: '2024-01-18'
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
      status: 'in-progress',
      progress: 75,
      lastAccessed: '2024-01-19'
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
    avgRating: 4.8,
    streak: 15,
    points: 2450,
    nextLevelPoints: 3000
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
      sales: 156,
      trending: true
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
      sales: 78,
      trending: false
    }
  ];

  const achievements = [
    { id: 1, title: 'First Purchase', description: 'Made your first project purchase', icon: ShoppingBag, earned: true, date: '2024-01-15' },
    { id: 2, title: 'Tech Explorer', description: 'Purchased projects from 3+ categories', icon: Target, earned: true, date: '2024-01-18' },
    { id: 3, title: 'Code Collector', description: 'Own 5+ projects', icon: BookOpen, earned: false, progress: 60 },
    { id: 4, title: 'Review Master', description: 'Left 10+ helpful reviews', icon: Star, earned: false, progress: 30 }
  ];

  const recentActivity = [
    { id: 1, action: 'Downloaded', project: 'E-commerce Web Application', time: '2 hours ago', type: 'download' },
    { id: 2, action: 'Purchased', project: 'Social Media Dashboard', time: '1 day ago', type: 'purchase' },
    { id: 3, action: 'Added to wishlist', project: 'Online Learning Platform', time: '2 days ago', type: 'wishlist' },
    { id: 4, action: 'Rated', project: 'Hospital Management System', time: '3 days ago', type: 'rating' }
  ];

  const filteredProjects = purchasedProjects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const StatCard = ({ title, value, subtitle, icon: Icon, color, trend }: any) => (
    <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/30 hover:shadow-2xl hover:scale-105 transition-all duration-300 group">
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

  const ProjectCard = ({ project }: any) => (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 group">
      <div className="relative">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
            project.status === 'completed' ? 'bg-green-500 text-white' : 
            project.status === 'in-progress' ? 'bg-blue-500 text-white' : 
            'bg-gray-500 text-white'
          }`}>
            {project.status === 'completed' ? 'Completed' : 
             project.status === 'in-progress' ? 'In Progress' : 'Pending'}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            {project.category}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span>{project.rating}</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <div className="text-sm text-gray-600 mb-4 space-y-2">
          <div className="flex items-center justify-between">
            <span>Seller:</span>
            <span className="font-semibold">{project.seller}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Purchased:</span>
            <span className="font-semibold">{new Date(project.purchaseDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Downloads:</span>
            <span className="font-semibold text-green-600">{project.downloadCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Last Accessed:</span>
            <span className="font-semibold">{new Date(project.lastAccessed).toLocaleDateString()}</span>
          </div>
        </div>
        
        {project.status === 'in-progress' && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-600">Progress</span>
              <span className="font-semibold text-blue-600">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        )}

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
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:scale-105">
            <Download className="w-4 h-4" />
            Download
          </button>
          <button className="px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-200">
            <Eye className="w-4 h-4" />
          </button>
        </div>
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
            <div className="flex items-center gap-6 animate-slideInLeft">
              <div className="relative">
                <img 
                  src={userProfile.avatar} 
                  alt={userProfile.name}
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-white/30"
                />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  {userProfile.level}
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold mb-2">Welcome back, {userProfile.name}!</h1>
                <p className="text-blue-100 text-lg">{userProfile.email}</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Member since {new Date(userProfile.joinedDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm font-semibold">{userProfile.streak} day streak</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right animate-slideInRight">
              <div className="text-3xl font-bold">{userProfile.points}</div>
              <div className="text-blue-200 text-sm">Points</div>
              <div className="w-32 bg-white/20 rounded-full h-2 mt-2">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full"
                  style={{ width: `${(userProfile.points / userProfile.nextLevelPoints) * 100}%` }}
                />
              </div>
              <div className="text-xs text-blue-200 mt-1">
                {userProfile.nextLevelPoints - userProfile.points} to next level
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-16 relative z-10">
          <StatCard
            title="Projects Owned"
            value={userProfile.projectsOwned}
            subtitle="+2 this month"
            icon={ShoppingBag}
            color="text-blue-600"
            trend="+40% growth"
          />
          <StatCard
            title="Total Spent"
            value={`$${userProfile.totalSpent}`}
            subtitle="Saved $67"
            icon={Award}
            color="text-green-600"
            trend="Great savings!"
          />
          <StatCard
            title="Wishlist Items"
            value={wishlist.length}
            subtitle="Ready to buy"
            icon={Heart}
            color="text-pink-600"
          />
          <StatCard
            title="Avg Rating"
            value={userProfile.avgRating}
            subtitle="Excellent"
            icon={Star}
            color="text-yellow-600"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'projects', label: 'My Projects', icon: ShoppingBag },
                { id: 'wishlist', label: 'Wishlist', icon: Heart },
                { id: 'achievements', label: 'Achievements', icon: Trophy },
                { id: 'activity', label: 'Activity', icon: Activity },
                { id: 'profile', label: 'Profile', icon: Settings }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 py-6 px-2 border-b-2 font-semibold text-sm transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 scale-105'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:scale-105'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'overview' && (
              <div className="animate-slideInUp">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Dashboard Overview</h2>
                
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
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                activity.type === 'download' ? 'bg-green-100 text-green-600' :
                                activity.type === 'purchase' ? 'bg-blue-100 text-blue-600' :
                                activity.type === 'wishlist' ? 'bg-pink-100 text-pink-600' :
                                'bg-yellow-100 text-yellow-600'
                              }`}>
                                {activity.type === 'download' && <Download className="w-5 h-5" />}
                                {activity.type === 'purchase' && <ShoppingBag className="w-5 h-5" />}
                                {activity.type === 'wishlist' && <Heart className="w-5 h-5" />}
                                {activity.type === 'rating' && <Star className="w-5 h-5" />}
                              </div>
                              <div>
                                <span className="text-gray-900 font-semibold">{activity.action}</span>
                                <div className="text-sm text-gray-600">{activity.project}</div>
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
                    <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-6 border border-blue-100">
                      <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        This Month
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">New Projects</span>
                          <span className="text-2xl font-bold text-blue-900">2</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Downloads</span>
                          <span className="text-2xl font-bold text-blue-900">8</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-blue-700">Points Earned</span>
                          <span className="text-2xl font-bold text-blue-900">450</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                      <h4 className="font-bold text-purple-900 mb-4">Learning Progress</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-purple-700">React Projects</span>
                            <span className="font-semibold">75%</span>
                          </div>
                          <div className="w-full bg-purple-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '75%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-purple-700">Java Projects</span>
                            <span className="font-semibold">60%</span>
                          </div>
                          <div className="w-full bg-purple-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{ width: '60%' }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="animate-slideInUp">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      <option value="all">All Status</option>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project, index) => (
                    <div key={project.id} style={{ animationDelay: `${index * 100}ms` }}>
                      <ProjectCard project={project} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="animate-slideInUp">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">Wishlist</h2>
                  <div className="text-sm text-gray-600">
                    <span className="font-semibold">{wishlist.length}</span> items saved
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlist.map((project, index) => (
                    <div key={project.id} className="bg-gradient-to-br from-white to-gray-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border border-gray-100 group animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="relative">
                        <img 
                          src={project.thumbnail} 
                          alt={project.title}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            {project.category}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4">
                          <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-lg">
                            <Heart className="w-5 h-5 text-red-500 fill-current" />
                          </button>
                        </div>
                        {project.trending && (
                          <div className="absolute bottom-4 left-4">
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
                              <TrendingUp className="w-3 h-3" />
                              Trending
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-semibold">{project.rating}</span>
                          </div>
                          <span className="text-sm text-gray-600">{project.sales} sales</span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {project.title}
                        </h3>
                        <div className="text-sm text-gray-600 mb-4">
                          <div className="flex items-center justify-between">
                            <span>Seller:</span>
                            <span className="font-semibold">{project.seller}</span>
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
                          <button className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                            Buy Now
                          </button>
                          <button className="px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:scale-105 transition-all duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="animate-slideInUp">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Achievements</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {achievements.map((achievement, index) => (
                    <div key={achievement.id} className={`p-6 rounded-2xl border-2 transition-all duration-500 hover:scale-105 animate-slideInUp ${
                      achievement.earned 
                        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-lg' 
                        : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
                    }`} style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          achievement.earned 
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' 
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          <achievement.icon className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{achievement.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{achievement.description}</p>
                          {achievement.earned ? (
                            <div className="flex items-center gap-2">
                              <span className="text-green-600 font-semibold text-sm">Earned</span>
                              <span className="text-gray-500 text-xs">{achievement.date}</span>
                            </div>
                          ) : (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-semibold">{achievement.progress}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${achievement.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="animate-slideInUp">
                <h2 className="text-2xl font-bold text-gray-900 mb-8">Activity Timeline</h2>
                <div className="space-y-6">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id} className="flex items-start gap-4 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:scale-105 transition-all duration-300 animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        activity.type === 'download' ? 'bg-green-100 text-green-600' :
                        activity.type === 'purchase' ? 'bg-blue-100 text-blue-600' :
                        activity.type === 'wishlist' ? 'bg-pink-100 text-pink-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        {activity.type === 'download' && <Download className="w-6 h-6" />}
                        {activity.type === 'purchase' && <ShoppingBag className="w-6 h-6" />}
                        {activity.type === 'wishlist' && <Heart className="w-6 h-6" />}
                        {activity.type === 'rating' && <Star className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{activity.action}</h3>
                          <span className="text-sm text-gray-500">{activity.time}</span>
                        </div>
                        <p className="text-gray-600">{activity.project}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="animate-slideInUp">
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
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
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
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
                        <input
                          type="email"
                          defaultValue={userProfile.email}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Bio</label>
                      <textarea
                        rows={4}
                        placeholder="Tell us about yourself and your interests..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-shadow duration-200 resize-none"
                      />
                    </div>

                    <div className="border-t border-gray-200 pt-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Current Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-6">
                      <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105">
                        Save Changes
                      </button>
                      <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:scale-105 transition-all duration-200">
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