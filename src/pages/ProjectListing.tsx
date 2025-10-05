import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChevronDown, Zap } from 'lucide-react';
import { Project } from '../types/Project';
import { ProjectCard } from '../components/ProjectCard';

const ProjectListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState([0, 1000]); // Increased max price range
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Fetching projects data...');
        const res = await fetch('https://projxchange-backend-v1.vercel.app/projects?status=approved', {
          method: 'GET',
        });

        if (!res.ok) {
          console.error('Projects API response not ok:', res.status, res.statusText);
          throw new Error(`Failed to fetch projects: ${res.status}`);
        }

        const data = await res.json();
        console.log('Projects API response:', data);

        // Handle both possible response structures
        const projectsData = data.data || data;

        if (Array.isArray(projectsData)) {
          setProjects(projectsData);
          console.log('Projects loaded:', projectsData.length);
        } else {
          console.error('Unexpected data structure:', data);
          setProjects([]);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('Could not load projects. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Updated categories to match backend categories
  const categories = [
    'all',
    'web_development',
    'mobile_development',
    'desktop_application',
    'data_science',
    'machine_learning',
    'api_backend',
    'other'
  ];

  // Map category display names
  const getCategoryDisplayName = (category: string) => {
    const categoryMap = {
      'all': 'All Categories',
      'web_development': 'Web Development',
      'mobile_development': 'Mobile Development',
      'desktop_application': 'Desktop Application',
      'data_science': 'Data Science',
      'machine_learning': 'Machine Learning',
      'api_backend': 'API & Backend',
      'other': 'Other'
    };
    return categoryMap[category as keyof typeof categoryMap] || category;
  };

  const allTags = ['React', 'Node.js', 'MongoDB', 'Stripe', 'Java', 'Spring Boot', 'MySQL', 'Python', 'Django', 'PostgreSQL', 'Chart.js', 'Firebase', 'Material-UI', 'PHP', 'Laravel', 'Bootstrap', 'React Native', 'Swing'];

  const filteredProjects = useMemo(() => {
    console.log('Filtering projects:', projects.length, 'total projects');

    let filtered = projects.filter(project => {
      // Search filter
      const matchesSearch = !searchTerm ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tech_stack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;

      // Price filter - make sure to handle sale_price correctly
      const matchesPrice = project.pricing?.sale_price ? project.pricing.sale_price >= priceRange[0] && project.pricing.sale_price <= priceRange[1] : true;

      // Tags filter
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => project.tech_stack.includes(tag));

      console.log('Project filter check:', {
        title: project.title,
        matchesSearch,
        matchesCategory,
        matchesPrice,
        matchesTags,
        category: project.category,
        selectedCategory,
          price: project.pricing?.sale_price || 0,
        priceRange
      });

      return matchesSearch && matchesCategory && matchesPrice && matchesTags;
    });

    console.log('Filtered projects:', filtered.length);

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'price-low':
          return (a.pricing?.sale_price || 0) - (b.pricing?.sale_price || 0);
        case 'price-high':
          return (b.pricing?.sale_price || 0) - (a.pricing?.sale_price || 0);
        case 'popular':
          return b.purchase_count - a.purchase_count;
        case 'trending':
          return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [projects, searchTerm, selectedCategory, priceRange, selectedTags, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-teal-500/30" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slideInUp">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Discover Amazing Projects
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Explore thousands of high-quality projects from talented developers worldwide
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto animate-slideInUp" style={{ animationDelay: '200ms' }}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                placeholder="Search projects, technologies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300/50 focus:border-blue-300 transition-all duration-300 text-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 animate-slideInUp" style={{ animationDelay: '400ms' }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{projects.length}+</div>
              <div className="text-blue-200 font-medium">Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">{categories.length}+</div>
              <div className="text-blue-200 font-medium">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1000+</div>
              <div className="text-blue-200 font-medium">Developers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">24/7</div>
              <div className="text-blue-200 font-medium">Support</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">


        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-2xl mb-12 border border-white/30 animate-slideInUp">
          <div className="grid md:grid-cols-4 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none cursor-pointer font-medium"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryDisplayName(category)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Sort Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Sort By</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none cursor-pointer font-medium"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[0]}
                  onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>

            {/* View Mode
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">View</label>
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all duration-300 ${viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  <Grid className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg font-medium transition-all duration-300 ${viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-md scale-105'
                      : 'text-gray-600 hover:text-gray-800'
                    }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
              </div>
            </div> */}
          </div>

          {/* Technology Tags */}
          <div className="mt-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">Filter by Technology</label>
            <div className="flex flex-wrap gap-3">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105 ${selectedTags.includes(tag)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Active Filters */}
          {(selectedTags.length > 0 || selectedCategory !== 'all' || searchTerm) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map(tag => (
                    <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                      {tag}
                      <button onClick={() => toggleTag(tag)} className="hover:text-purple-900">×</button>
                    </span>
                  ))}
                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {getCategoryDisplayName(selectedCategory)}
                      <button onClick={() => setSelectedCategory('all')} className="hover:text-blue-900">×</button>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setSelectedTags([]);
                    setSelectedCategory('all');
                    setSearchTerm('');
                    setPriceRange([0, 1000]);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading amazing projects...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="w-12 h-12 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Projects</h3>
            <p className="text-gray-600 text-lg mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Try Again
            </button>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-slideInUp">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Projects Found</h3>
            <p className="text-gray-600 text-lg mb-6">
              We couldn't find any projects matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={() => {
                setSelectedTags([]);
                setSelectedCategory('all');
                setSearchTerm('');
                setPriceRange([0, 1000]);
              }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Load More Button */}
        {filteredProjects.length > 0 && filteredProjects.length >= 6 && (
          <div className="text-center mt-12 animate-slideInUp" style={{ animationDelay: '400ms' }}>
            <button className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto">
              <Zap className="w-5 h-5" />
              Load More Projects
            </button>
          </div>
        )}
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInUp { animation: slideInUp 0.8s cubic-bezier(.4,0,.2,1) both; }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          cursor: pointer;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          cursor: pointer;
          border: none;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default ProjectListing;