import React, { useEffect, useState, useCallback } from 'react';
import { Plus, Edit, Trash2, Eye, Check, X, Calendar, DollarSign, Users, ShoppingBag, Clock, TrendingUp, AlertCircle, BarChart3, Award, Star, Activity, Zap, Target, Filter, Search, ChevronDown, Bell, Settings, FileText, Tag, Upload, IndianRupee, Video, Image, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { User, UsersApiResponse } from '../types/User';
import { Project, ProjectResponse } from '../types/Project';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import UserDetailsModal from '../components/UserDetailsModal';
import { useNavigate } from 'react-router-dom';
import { Transaction, TransactionsApiResponse } from '../types/Transaction';
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [updatingProject, setUpdatingProject] = useState<string | null>(null);
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [fetchingUserDetails, setFetchingUserDetails] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const navigate = useNavigate();
  const [projectUpdateData, setProjectUpdateData] = useState({
    status: '',
    is_featured: false
  });
  const [updatingProjectStatus, setUpdatingProjectStatus] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pendingProjects, setPendingProjects] = useState<Project[]>([]); // new state

  
const fetchAllStats = async () => {
  setLoading(true);
  setError('');
  const token = localStorage.getItem("token");

  try {
    // Fetch in parallel for efficiency
    const [usersRes, projectsRes, transactionsRes, pendingProjectsRes] = await Promise.all([
      fetch('https://projxchange-backend-v1.vercel.app/admin/users', {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }),
      fetch('https://projxchange-backend-v1.vercel.app/projects', {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }),
      fetch('https://projxchange-backend-v1.vercel.app/admin/transactions/recent', {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }),
      fetch('https://projxchange-backend-v1.vercel.app/projects?status=pending_review', {
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      }),
    ]);

    if (!usersRes.ok || !projectsRes.ok || !transactionsRes.ok || !pendingProjectsRes.ok) {
      throw new Error('Failed to fetch one or more resources');
    }

    // Parse JSON in parallel
    const [usersData, projectsData, transactionsData, pendingProjectsData] = await Promise.all([
      usersRes.json(),
      projectsRes.json(),
      transactionsRes.json(),
      pendingProjectsRes.json(),
    ]);

    setUsers(usersData.users);
    setProjects(projectsData.data || []);
    setTransactions(transactionsData.transactions);
    setPendingProjects(pendingProjectsData.data || []); // ✅ store pending projects

  } catch (err) {
    console.error(err);
    setError('Could not load dashboard stats. Please try again later.');
  } finally {
    setLoading(false);
  }
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

  const stats = {
  totalProjects: projects.length,
  pendingApproval: pendingProjects.length,
  totalSales: transactions.length, // or derive from transactions
  totalUsers: users.length,
  monthlyGrowth: 24, // could be derived later
  avgRating: 4.8,   // placeholder for now
  activeUsers: users.filter(u => u.status === 'active').length,
  revenue: transactions.reduce((sum, tx) => sum + Number(tx.amount || 0), 0),
  conversionRate: 3.2
};


  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem("token");
    try {
      const res = await fetch('https://projxchange-backend-v1.vercel.app/admin/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch users');

      const data: UsersApiResponse = await res.json();
      setUsers(data.users);
    } catch (err) {
      console.error(err);
      setError('Could not load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem("token");
    try {
      const res = await fetch('https://projxchange-backend-v1.vercel.app/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch projects');

      const data: ProjectResponse = await res.json();
      setProjects(data.data || []);
    } catch (err) {
      console.error(err);
      setError('Could not load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingProjects = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem("token");
    try {
      const res = await fetch('https://projxchange-backend-v1.vercel.app/projects?status=pending_review', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch pending projects');

      const data: ProjectResponse = await res.json();
      setPendingProjects(data.data || []);
    } catch (err) {
      console.error(err);
      setError('Could not load pending projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // API function to update project status
  const updateProjectStatus = async (projectId: string, status: string, isFeatured: boolean) => {
    setUpdatingProject(projectId);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://projxchange-backend-v1.vercel.app/admin/projects/${projectId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: status,
          is_featured: isFeatured
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update project status');
      }

      const data = await response.json();

      // Update the project in the local state
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === projectId
            ? { ...project, status: data.project.status, is_featured: data.project.is_featured }
            : project
        )
      );

      alert(`Project ${status === 'approved' ? 'approved' : status === 'suspended' ? 'suspended' : 'updated'} successfully!`);
    } catch (error) {
      console.error('Error updating project status:', error);
      alert('Failed to update project status. Please try again.');
    } finally {
      setUpdatingProject(null);
    }
  };

  // API function to update user status
  const updateUserStatus = async (userId: string, verificationStatus: string, emailVerified: boolean) => {
    setUpdatingUser(userId);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://projxchange-backend-v1.vercel.app/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          verification_status: verificationStatus,
          email_verified: emailVerified
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to update user status');
      }

      const data = await response.json();

      // Update the user in the local state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId
            ? { ...user, verification_status: verificationStatus }
            : user
        )
      );
      alert(`User status updated successfully!`);
      setIsUserModalOpen(false);
    } catch (error) {
      console.error('Error updating user status:', error);
      alert(`Failed to update user status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setUpdatingUser(null);
    }
  };

  // API function to delete user
  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://projxchange-backend-v1.vercel.app/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      const data = await response.json();

      // Remove the user from the local state
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

      alert('User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  // API function to fetch user details
  const fetchUserDetails = async (userId: string) => {
    setFetchingUserDetails(true);
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`https://projxchange-backend-v1.vercel.app/admin/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      setSelectedUser(data.user);
      setIsUserModalOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Failed to fetch user details. Please try again.');
    } finally {
      setFetchingUserDetails(false);
    }
  };

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setProjectUpdateData({
      status: project.status,
      is_featured: project.is_featured
    });
    setIsProjectModalOpen(true);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem("token");
    try {
      const res = await fetch('https://projxchange-backend-v1.vercel.app/admin/transactions/recent', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch transactions');

      const data: TransactionsApiResponse = await res.json();
      setTransactions(data.transactions);
    } catch (err) {
      console.error(err);
      setError('Could not load transactions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectStatusUpdate = async () => {
    if (!selectedProject) return;

    setUpdatingProjectStatus(true);
    const token = localStorage.getItem("token");

    // Check if token exists
    if (!token) {
      alert('Authentication token not found. Please login again.');
      setUpdatingProjectStatus(false);
      return;
    }

    // Debug logging
    console.log('Updating project:', selectedProject.id);
    console.log('Project ID type:', typeof selectedProject.id);
    console.log('Update data:', projectUpdateData);
    console.log('API URL:', `https://projxchange-backend-v1.vercel.app/admin/projects/${selectedProject.id}/status`);
    console.log('Token exists:', !!token);

    // Check if project ID is valid
    if (!selectedProject.id || selectedProject.id.trim() === '') {
      alert('Invalid project ID');
      setUpdatingProjectStatus(false);
      return;
    }

    try {
      const requestBody = {
        status: projectUpdateData.status,
        is_featured: projectUpdateData.is_featured
      };

      console.log('Request body:', requestBody);
      console.log('Request body JSON:', JSON.stringify(requestBody));

      const response = await fetch(`https://projxchange-backend-v1.vercel.app/admin/projects/${selectedProject.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to update project status: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // Update the project in the local state
      setProjects(prevProjects =>
        prevProjects.map(project =>
          project.id === selectedProject.id
            ? { ...project, status: data.project.status, is_featured: data.project.is_featured }
            : project
        )
      );

      alert('Project status updated successfully!');
      setIsProjectModalOpen(false);
      setSelectedProject(null);

      // Refresh the projects list
      if (activeTab === 'approval') {
        fetchPendingProjects();
      } else if (activeTab === 'projects') {
        fetchProjects();
      }
    } catch (error) {
      console.error('Error updating project status:', error);
      alert('Failed to update project status. Please try again.');
    } finally {
      setUpdatingProjectStatus(false);
    }
  };

 

  const handleReject = (id: string) => {
    updateProjectStatus(id, 'suspended', false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      // Note: There's no delete project API provided, so this will just show an alert
      alert(`Project ${id} deleted!`);
    }
  };

  const handleToggleFeatured = (id: string, currentFeatured: boolean) => {
    const project = projects.find(p => p.id === id);
    if (project) {
      updateProjectStatus(id, project.status, !currentFeatured);
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
 // fetchAllStats will load everything once when dashboard mounts
useEffect(() => {
  fetchAllStats();
}, []);

// tab-specific fetching (only when you want fresh detail view)
useEffect(() => {
  if (activeTab === 'users') {
    fetchUsers();
  } else if (activeTab === 'projects') {
    fetchProjects();
  } else if (activeTab === 'approval') {
    fetchPendingProjects();
  } else if (activeTab === 'transactions') {
    fetchTransactions();
  }
}, [activeTab]);



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
              <p className="text-blue-100 text-lg">Welcome back, {user?.full_name}! Manage your platform with ease.</p>
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
                onClick={() => navigate("/upload")}
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
                  className={`flex items-center gap-3 py-6 px-2 border-b-2 font-semibold text-sm transition-all duration-300 whitespace-nowrap ${activeTab === tab.id
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
                              <div className={`w-3 h-3 rounded-full ${activity.type === 'project' ? 'bg-blue-500' :
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
                              <div className={`text-xs px-2 py-1 rounded-full mt-1 ${activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
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
                      <option value="pending_review">Pending Review</option>
                      <option value="published">Published</option>
                      <option value="suspended">Suspended</option>
                      <option value="archived">Archived</option>
                    </select>

                  </div>
                </div>

                {loading ? (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading projects...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Author ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sales</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {projects
                            .filter(p => filterStatus === 'all' || p.status === filterStatus)
                            .filter(p => searchTerm === '' || p.title.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map((project, index) => (
                              <tr key={project.id} className="hover:bg-gray-50 transition-colors animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                                      <span className="text-white font-bold text-lg">{project.title.charAt(0)}</span>
                                    </div>
                                    <div>
                                      <div className="font-semibold text-gray-900">{project.title}</div>
                                      <div className="flex items-center gap-2 mt-1">
                                        {project.is_featured && (
                                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">Featured</span>
                                        )}
                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{project.difficulty_level}</span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                  {project.author_id}
                                </td>
                                <td className="px-6 py-4">
                                  <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                                    {project.category}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold text-gray-900">₹{project.pricing.sale_price}</span>
                                    <span className="text-xs text-gray-500 line-through">₹{project.pricing.original_price}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                  {project.purchase_count}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${project.status === 'approved' ? 'bg-green-100 text-green-800' :
                                    project.status === 'pending_review' ? 'bg-yellow-100 text-yellow-800' :
                                      project.status === 'published' ? 'bg-blue-100 text-blue-800' :
                                        project.status === 'suspended' ? 'bg-red-100 text-red-800' :
                                          project.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                                            'bg-gray-100 text-gray-800'
                                    }`}>
                                    {project.status.replace('_', ' ')}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={() => openProjectModal(project)}
                                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleToggleFeatured(project.id, project.is_featured)}
                                      disabled={updatingProject === project.id}
                                      className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${project.is_featured
                                        ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                        }`}
                                    >
                                      <Star className={`w-4 h-4 ${project.is_featured ? 'fill-current' : ''}`} />
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
                )}
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

                {loading ? (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading users...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Joined</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {users.map((user, index) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">{user.full_name.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900">{user.full_name}</div>
                                    <div className="text-sm text-gray-600">{user.email}</div>
                                    <div className="text-xs text-gray-500">Last active: {new Date(user.updated_at).toLocaleDateString()}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${user.user_type === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                  }`}>
                                  {user.user_type}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                {new Date(user.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full ${user.verification_status === 'verified' ? 'bg-green-100 text-green-800' :
                                  user.verification_status === 'rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                  {user.verification_status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => fetchUserDetails(user.id)}
                                    disabled={fetchingUserDetails}
                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                                  >
                                    {fetchingUserDetails ? (
                                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <Eye className="w-4 h-4" />
                                    )}
                                  </button>

                                  <button
                                    onClick={() => deleteUser(user.id)}
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
                )}
              </div>
            )}

            {activeTab === 'approval' && (
              <div className="animate-slideInUp">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <AlertCircle className="w-7 h-7 text-orange-600" />
                  Pending Approval
                  <span className="bg-orange-500 text-white text-sm px-3 py-1 rounded-full animate-pulse">
                    {pendingProjects.length}
                  </span>
                </h2>

                {loading ? (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading pending projects...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-to-r from-orange-50 to-yellow-50">
                          <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Project</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Author ID</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Submitted</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {pendingProjects.map((project, index) => (
                            <tr key={project.id} className="hover:bg-orange-50 transition-colors animate-slideInUp" style={{ animationDelay: `${index * 100}ms` }}>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">{project.title.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900">{project.title}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold">Pending Review</span>
                                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{project.difficulty_level}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                {project.author_id}
                              </td>
                              <td className="px-6 py-4">
                                <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-blue-100 text-blue-800">
                                  {project.category}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-bold text-gray-900">₹{project.pricing.sale_price}</span>
                                  <span className="text-xs text-gray-500 line-through">₹{project.pricing.original_price}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                                {new Date(project.created_at).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => openProjectModal(project)}
                                    className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 hover:scale-110"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </button>

                                  <button
                                    onClick={() => handleReject(project.id)}
                                    disabled={updatingProject === project.id}
                                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                                  >
                                    {updatingProject === project.id ? (
                                      <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                    ) : (
                                      <X className="w-4 h-4" />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="animate-slideInUp">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                  <DollarSign className="w-7 h-7 text-green-600" />
                  Transaction History
                </h2>

                {loading ? (
                  <div className="text-center text-gray-500">Loading transactions...</div>
                ) : error ? (
                  <div className="text-center text-red-500">{error}</div>
                ) : transactions.length === 0 ? (
                  <div className="bg-white rounded-2xl p-8 text-center">
                    <div className="text-gray-500 text-lg mb-4">No transactions found</div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-gray-600">
                      <thead className="bg-gray-50 text-gray-700 font-semibold">
                        <tr>
                          <th className="px-6 py-4">Transaction ID</th>
                          <th className="px-6 py-4">Project</th>
                          <th className="px-6 py-4">Buyer</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-t">
                            <td className="px-6 py-4 font-mono">{tx.transaction_id}</td>
                            <td className="px-6 py-4 flex items-center gap-3">
                              <img src={tx.project.thumbnail} alt={tx.project.title} className="w-8 h-8 rounded" />
                              {tx.project.title}
                            </td>
                            <td className="px-6 py-4">
                              <div>{tx.buyer.full_name}</div>
                              <div className="text-xs text-gray-400">{tx.buyer.email}</div>
                            </td>
                            <td className="px-6 py-4 font-semibold">
                              {tx.amount} {tx.currency}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${tx.status === 'success'
                                    ? 'bg-green-100 text-green-600'
                                    : tx.status === 'pending'
                                      ? 'bg-yellow-100 text-yellow-600'
                                      : 'bg-red-100 text-red-600'
                                  }`}
                              >
                                {tx.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">{new Date(tx.created_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>


      {isUserModalOpen && <UserDetailsModal
        isOpen={isUserModalOpen}
        user={selectedUser}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUser(null);
        }}
        onUpdateUserStatus={updateUserStatus}
        updatingUser={updatingUser}
      />}
      {isProjectModalOpen && (
        <ProjectDetailsModal
          isOpen={isProjectModalOpen}
          onClose={() => {
            setIsProjectModalOpen(false);
            setSelectedProject(null);
          }}
          project={selectedProject}
          projectUpdateData={projectUpdateData}
          onUpdateDataChange={setProjectUpdateData}
          onUpdate={handleProjectStatusUpdate}
          updatingProjectStatus={updatingProjectStatus}
        />
      )}
    </div>
  );
};

export default AdminDashboard;