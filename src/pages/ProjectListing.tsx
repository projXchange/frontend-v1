import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, ChevronDown, Grid, List, TrendingUp, Award, Clock, Heart } from 'lucide-react';

const ProjectListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [viewMode, setViewMode] = useState('grid');

  const projects = [
    {
      id: 1,
      title: 'E-commerce Web Application',
      category: 'React',
      price: 29,
      originalPrice: 49,
      rating: 4.9,
      reviews: 45,
      thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: {
        name: 'John Doe',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
        level: 'Top Rated',
        rating: 4.9
      },
      description: 'Complete e-commerce solution with cart, payment integration, and admin panel',
      techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      featured: true,
      dateAdded: '2024-01-15',
      deliveryTime: '2 days',
      sales: 89
    },
    {
      id: 2,
      title: 'Hospital Management System',
      category: 'Java',
      price: 45,
      originalPrice: 65,
      rating: 4.8,
      reviews: 32,
      thumbnail: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: {
        name: 'Sarah Wilson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        level: 'Level 2',
        rating: 4.8
      },
      description: 'Complete hospital management with patient records, appointments, and billing',
      techStack: ['Java', 'Spring Boot', 'MySQL', 'JSP'],
      featured: false,
      dateAdded: '2024-01-10',
      deliveryTime: '3 days',
      sales: 67
    },
    {
      id: 3,
      title: 'Social Media Dashboard',
      category: 'Python',
      price: 35,
      originalPrice: 55,
      rating: 4.7,
      reviews: 28,
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: {
        name: 'Mike Johnson',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
        level: 'Top Rated',
        rating: 4.9
      },
      description: 'Analytics dashboard for social media management with real-time data',
      techStack: ['Python', 'Django', 'PostgreSQL', 'Chart.js'],
      featured: true,
      dateAdded: '2024-01-08',
      deliveryTime: '1 day',
      sales: 134
    },
    {
      id: 4,
      title: 'Task Management App',
      category: 'React',
      price: 22,
      originalPrice: 35,
      rating: 4.6,
      reviews: 19,
      thumbnail: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: {
        name: 'Emma Davis',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
        level: 'Level 1',
        rating: 4.6
      },
      description: 'Collaborative task management with team features and notifications',
      techStack: ['React', 'Firebase', 'Material-UI'],
      featured: false,
      dateAdded: '2024-01-05',
      deliveryTime: '2 days',
      sales: 45
    },
    {
      id: 5,
      title: 'Online Learning Platform',
      category: 'PHP',
      price: 55,
      originalPrice: 80,
      rating: 4.9,
      reviews: 67,
      thumbnail: 'https://images.pexels.com/photos/4491461/pexels-photo-4491461.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: {
        name: 'David Brown',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
        level: 'Top Rated',
        rating: 4.9
      },
      description: 'Complete LMS with video streaming, quizzes, and progress tracking',
      techStack: ['PHP', 'Laravel', 'MySQL', 'Bootstrap'],
      featured: true,
      dateAdded: '2024-01-12',
      deliveryTime: '4 days',
      sales: 156
    },
    {
      id: 6,
      title: 'Mobile Banking App',
      category: 'Mobile',
      price: 40,
      originalPrice: 60,
      rating: 4.5,
      reviews: 23,
      thumbnail: 'https://images.pexels.com/photos/4386371/pexels-photo-4386371.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: {
        name: 'Lisa Anderson',
        avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100',
        level: 'Level 2',
        rating: 4.5
      },
      description: 'Secure mobile banking with biometric authentication and transactions',
      techStack: ['React Native', 'Node.js', 'MongoDB'],
      featured: false,
      dateAdded: '2024-01-03',
      deliveryTime: '3 days',
      sales: 78
    }
  ];

  const categories = ['all', 'React', 'Java', 'Python', 'PHP', 'Mobile', 'Node.js'];

  const filteredProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesPrice = project.price >= priceRange[0] && project.price <= priceRange[1];
      
      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
        case 'oldest':
          return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy, priceRange]);

  const ProjectCard = ({ project }: { project: typeof projects[0] }) => (
    <Link 
      to={`/project/${project.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 border border-gray-100 relative animate-cardSlideIn"
      style={{ animationDelay: `${Math.random() * 200}ms` }}
    >
      {/* Discount Badge */}
      {project.originalPrice > project.price && (
        <span className="absolute top-4 left-4 z-20 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
          {Math.round((1 - project.price / project.originalPrice) * 100)}% OFF
        </span>
      )}
      {/* Best Seller/Popular Badge */}
      {project.sales > 100 && (
        <span className="absolute top-4 right-4 z-20 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
          Popular
        </span>
      )}
      <div className="relative">
        <img 
          src={project.thumbnail} 
          alt={project.title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {project.featured && (
          <div className="absolute bottom-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-bounce">
            <Award className="w-3 h-3 inline mr-1" />
            Featured
          </div>
        )}
        {/* Interactive Favorite Button */}
        <button 
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 flex items-center justify-center hover:bg-pink-100 hover:scale-110 transition-all duration-200 z-20 shadow-lg group/fav"
          title="Add to favorites"
          type="button"
          onClick={e => { e.preventDefault(); /* Add favorite logic here */ }}
        >
          <Heart className="w-5 h-5 text-pink-500 group-hover/fav:scale-125 transition-transform" />
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="p-6 flex flex-col h-full bg-gradient-to-b from-white to-gray-50/50">
        <div className="flex items-center justify-between mb-3">
          <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-sm font-semibold shadow-sm">
            {project.category}
          </span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-semibold text-gray-700">{project.rating}</span>
            <span className="ml-1 text-sm text-gray-500">({project.reviews})</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
          {project.title}
        </h3>
        <p className="text-gray-600 mb-3 font-medium line-clamp-2 leading-relaxed">{project.description}</p>
        <div className="flex items-center mb-4">
          <img 
            src={project.seller.avatar} 
            alt={project.seller.name}
            className="w-8 h-8 rounded-full object-cover mr-3 ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300"
          />
          <div>
            <div className="font-semibold text-gray-900 text-sm">{project.seller.name}</div>
            <div className="flex items-center">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                project.seller.level === 'Top Rated' 
                  ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {project.seller.level}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.slice(0, 3).map((tech, index) => (
            <span key={index} className="px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-lg text-xs font-medium shadow-sm hover:shadow-md transition-shadow duration-200">
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="px-2 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg text-xs font-medium shadow-sm">
              +{project.techStack.length - 3} more
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gray-900">${project.price}</span>
            <span className="text-lg text-gray-500 line-through">${project.originalPrice}</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {project.deliveryTime}
            </div>
            <div className="text-sm text-green-600 font-medium">{project.sales} sales</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-auto">
          <Link
            to={`/project/${project.id}`}
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-300 hover:scale-105 text-center"
          >
            View Details
          </Link>
          <button
            className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:scale-105 text-center"
            type="button"
            onClick={e => { e.preventDefault(); /* Add buy logic here */ }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </Link>
  );

  const ProjectListItem = ({ project }: { project: typeof projects[0] }) => (
    <Link 
      to={`/project/${project.id}`}
      className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-1 flex gap-6 border border-gray-100 animate-cardSlideIn"
      style={{ animationDelay: `${Math.random() * 200}ms` }}
    >
      <div className="flex-shrink-0">
        <div className="relative">
          <img 
            src={project.thumbnail} 
            alt={project.title}
            className="w-40 h-32 object-cover rounded-xl group-hover:scale-110 transition-transform duration-300"
          />
          {project.featured && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
              Featured
            </div>
          )}
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-sm font-semibold shadow-sm">
              {project.category}
            </span>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              project.seller.level === 'Top Rated' 
                ? 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {project.seller.level}
            </span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm font-semibold text-gray-700">{project.rating}</span>
            <span className="ml-1 text-sm text-gray-500">({project.reviews})</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
          {project.title}
        </h3>
        <div className="flex items-center mb-3">
          <img 
            src={project.seller.avatar} 
            alt={project.seller.name}
            className="w-8 h-8 rounded-full object-cover mr-3 ring-2 ring-blue-100"
          />
          <span className="font-semibold text-gray-900">{project.seller.name}</span>
        </div>
        <p className="text-gray-600 mb-4 leading-relaxed">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.techStack.map((tech, index) => (
            <span key={index} className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-lg text-sm font-medium shadow-sm hover:shadow-md transition-shadow duration-200">
              {tech}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-3xl font-bold text-gray-900">${project.price}</span>
              <span className="text-xl text-gray-500 line-through">${project.originalPrice}</span>
            </div>
            <div className="text-sm text-gray-600 flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {project.deliveryTime}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-green-600 font-medium">{project.sales} sales</div>
            <span className="text-blue-600 group-hover:text-blue-700 font-semibold flex items-center transition-colors duration-300">
              View Details 
              <TrendingUp className="w-4 h-4 ml-1" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center animate-slideInDown">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find the perfect academic project to accelerate your learning journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-xl mb-8 border border-white/20 animate-slideInUp">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search projects or tech stack..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm shadow-sm focus:shadow-md transition-shadow duration-200"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm focus:shadow-md transition-shadow duration-200"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm focus:shadow-md transition-shadow duration-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="popular">Most Popular</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* View Mode */}
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'grid' ? 'bg-white shadow-lg scale-105' : 'hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  viewMode === 'list' ? 'bg-white shadow-lg scale-105' : 'hover:bg-gray-200 hover:scale-105'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-6 pt-6 border-t border-gray-200 animate-slideInUp">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Price Range:</span>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="w-24"
                />
                <span className="text-sm text-gray-600 font-medium">${priceRange[0]}</span>
                <span className="text-gray-400">-</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-24"
                />
                <span className="text-sm text-gray-600 font-medium">${priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 animate-slideInUp">
          <p className="text-gray-600 text-lg">
            Showing <span className="font-semibold text-gray-900">{filteredProjects.length}</span> of <span className="font-semibold text-gray-900">{projects.length}</span> projects
          </p>
        </div>

        {/* Projects Grid/List */}
        <div className={
          viewMode === 'grid' 
            ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-staggerChildren' 
            : 'flex flex-col gap-6'
        }>
          {filteredProjects.map(project => (
            viewMode === 'grid' 
              ? <ProjectCard key={project.id} project={project} />
              : <ProjectListItem key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 animate-slideInUp">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No projects found</h3>
            <p className="text-gray-600 text-lg mb-6">Try adjusting your search criteria or filters to find more projects.</p>
            <Link
              to="/upload"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              🚀 Upload Your Project
            </Link>
            <div className="mt-4">
              <span className="text-gray-500">Need help? <a href="mailto:support@studystack.com" className="text-blue-600 underline">Contact Support</a></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectListing;