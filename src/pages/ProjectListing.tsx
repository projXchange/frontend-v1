import { useState, useMemo, useEffect } from 'react';
import { Search, Filter, ChevronDown, Zap } from 'lucide-react';
import { Project } from '../types/Project';
import { ProjectCard } from '../components/ProjectCard';

const ProjectListing = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState(priceRange);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce price range input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 500);
    return () => clearTimeout(handler);
  }, [priceRange]);

  // Fetch projects
  const fetchProjects = async (page = 1, append = false) => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('status', 'approved');
      params.append('page', page.toString());
      params.append('limit', '12');

      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedTags.length > 0) params.append('tech_stack', selectedTags.join(','));
      if (debouncedPriceRange[0] > 0) params.append('min_price', debouncedPriceRange[0].toString());
      if (debouncedPriceRange[1] < 1000) params.append('max_price', debouncedPriceRange[1].toString());
      if (searchTerm) params.append('search', searchTerm);

      const sortMap: { [key: string]: { sort_by: string; sort_order: string } } = {
        newest: { sort_by: 'created_at', sort_order: 'desc' },
        oldest: { sort_by: 'created_at', sort_order: 'asc' },
        'price-low': { sort_by: 'sale_price', sort_order: 'asc' },
        'price-high': { sort_by: 'sale_price', sort_order: 'desc' },
        popular: { sort_by: 'purchase_count', sort_order: 'desc' },
        trending: { sort_by: 'is_featured', sort_order: 'desc' },
      };
      const sortConfig = sortMap[sortBy] || sortMap['newest'];
      params.append('sort_by', sortConfig.sort_by);
      params.append('sort_order', sortConfig.sort_order);

      const res = await fetch(`https://projxchange-backend-v1.vercel.app/projects?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
      const data = await res.json();

      const newProjects = data.data || data || [];
      setProjects(prev => append ? [...prev, ...newProjects] : newProjects);
      setTotalPages(data.pagination?.total_pages || 1);
    } catch (err) {
      console.error(err);
      setError('Could not load projects. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    fetchProjects(1, false);
  }, [searchTerm, selectedCategory, sortBy, debouncedPriceRange, selectedTags]);

  const loadMore = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchProjects(nextPage, true);
    }
  };

  const categories = [
    'all','web_development','mobile_development','desktop_application',
    'data_science','machine_learning','api_backend','other'
  ];
  const getCategoryDisplayName = (category: string) => {
    const map: { [key: string]: string } = {
      'all':'All Categories',
      'web_development':'Web Development',
      'mobile_development':'Mobile Development',
      'desktop_application':'Desktop Application',
      'data_science':'Data Science',
      'machine_learning':'Machine Learning',
      'api_backend':'API & Backend',
      'other':'Other'
    };
    return map[category] || category;
  };

  const allTags = ['React','Node.js','MongoDB','Stripe','Java','Spring Boot','MySQL','Python','Django','PostgreSQL','Chart.js','Firebase','Material-UI','PHP','Laravel','Bootstrap','React Native','Swing'];

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = !searchTerm ||
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tech_stack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
      const matchesPrice = project.pricing?.sale_price 
        ? project.pricing.sale_price >= debouncedPriceRange[0] && project.pricing.sale_price <= debouncedPriceRange[1] 
        : true;
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => project.tech_stack.includes(tag));

      return matchesSearch && matchesCategory && matchesPrice && matchesTags;
    });
  }, [projects, searchTerm, selectedCategory, debouncedPriceRange, selectedTags]);

  const toggleTag = (tag: string) => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t!==tag) : [...prev, tag]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white py-16 sm:py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-teal-500/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
            Discover Amazing Projects
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Explore thousands of high-quality projects from talented developers worldwide
          </p>

          <div className="max-w-md sm:max-w-xl mx-auto relative">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
            <input
              type="text"
              placeholder="Search projects, technologies, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-white/95 backdrop-blur-sm border border-white/20 rounded-2xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-300/50 focus:border-blue-300 transition-all duration-300 text-sm sm:text-lg shadow-2xl"
            />
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


      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl mb-10 border border-white/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Category</label>
              <div className="relative">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 sm:p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none cursor-pointer font-medium"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {getCategoryDisplayName(category)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Sort By</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 sm:p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 appearance-none cursor-pointer font-medium"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="trending">Trending</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none" />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Price Range (INR)</label>
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="text"
                  onChange={e => setPriceRange([parseInt(e.target.value)||0, priceRange[1]])}
                  placeholder="Min ₹"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="text"
                  onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)||1000])}
                  placeholder="Max ₹"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div></div> {/* Empty placeholder */}
          </div>

          {/* Technology Tags */}
          <div className="mt-6 sm:mt-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Filter by Technology</label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 sm:px-3 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 ${selectedTags.includes(tag)
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading amazing projects...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <Filter className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Projects</h3>
            <p className="text-gray-600 text-lg mb-6">{error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 sm:px-8 sm:py-3 bg-blue-600 text-white rounded-xl">Try Again</button>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Projects Found</h3>
            <p className="text-gray-600 text-lg">Try changing filters or search keywords to find projects.</p>
          </div>
        )}

        {/* Load More */}
        {currentPage < totalPages && (
          <div className="mt-10 text-center">
            <button
              onClick={loadMore}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Load More Projects
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectListing;
