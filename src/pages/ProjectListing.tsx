import { useState, useEffect, useRef } from 'react';
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
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [techDropdownOpen, setTechDropdownOpen] = useState(false);
  const [techSearchTerm, setTechSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setTechDropdownOpen(false);
        setTechSearchTerm('');
      }
    };

    if (techDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [techDropdownOpen]);

  // Debounce price range input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 500);
    return () => clearTimeout(handler);
  }, [priceRange]);

  useEffect(() => {
    if (!projects || projects.length === 0) return;

    // --- Categories ---
    const categoryMap: { [key: string]: string } = {}; // key = lowercase, value = original
    projects.forEach(p => {
      if (p.category) {
        const key = p.category.toLowerCase();
        if (!categoryMap[key]) categoryMap[key] = p.category;
      }
    });
    setAvailableCategories(['all', ...Object.values(categoryMap)]);

    // --- Tags ---
    const tagMap: { [key: string]: string } = {};
    projects.forEach(p => {
      (p.tech_stack || []).forEach(tag => {
        if (tag) {
          const key = tag.toLowerCase();
          if (!tagMap[key]) tagMap[key] = tag;
        }
      });
    });
    setAvailableTags(Object.values(tagMap));

  }, [projects]);


  // Fetch projects
  const fetchProjects = async (page = 1, append = false) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const params = new URLSearchParams();
      params.append('status', 'approved');
      params.append('page', page.toString());
      params.append('limit', '6');

      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (selectedTags.length > 0) params.append('tech_stack', selectedTags.join(','));
      if (debouncedPriceRange[0] > 0) params.append('min_price', debouncedPriceRange[0].toString());
      if (debouncedPriceRange[1] < 1000) params.append('max_price', debouncedPriceRange[1].toString());
      if (searchTerm) params.append('search', searchTerm);

      const sortMap: { [key: string]: { sort_by: string; sort_order: string } } = {
        newest: { sort_by: 'created_at', sort_order: 'desc' },
        oldest: { sort_by: 'created_at', sort_order: 'asc' },
        'price-low': { sort_by: 'price', sort_order: 'asc' },
        'price-high': { sort_by: 'price', sort_order: 'desc' },
        popular: { sort_by: 'purchase_count', sort_order: 'desc' },
        trending: { sort_by: 'view_count', sort_order: 'desc' },
      };
      const sortConfig = sortMap[sortBy] || sortMap['newest'];
      params.append('sort_by', sortConfig.sort_by);
      params.append('sort_order', sortConfig.sort_order);

      const res = await fetch(`https://projxchange-backend-v1.vercel.app/projects?${params.toString()}`);
      if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
      const data = await res.json();

      const newProjects = data.data || data || [];
      setProjects(prev => append ? [...prev, ...newProjects] : newProjects);

      // Use pagination data from API response
      const pagination = data.pagination || {};
      setTotalPages(pagination.pages || 1);
      setCurrentPage(pagination.page || page);
    } catch (err) {
      console.error(err);
      setError('Could not load projects. Please try again later.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
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

  const getCategoryDisplayName = (category: string) => {
    const map: { [key: string]: string } = {
      'all': 'All Categories',
      'web_development': 'Web Development',
      'mobile_development': 'Mobile Development',
      'desktop_application': 'Desktop Application',
      'data_science': 'Data Science',
      'machine_learning': 'Machine Learning',
      'api_backend': 'API & Backend',
      'other': 'Other'
    };
    return map[category] || category;
  };

  // Remove client-side filtering since API already handles it
  const filteredProjects = projects;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
    setTechDropdownOpen(false);
    setTechSearchTerm('');
  };

  // Filter and sort technologies for dropdown
  const filteredTechnologies = availableTags
    .filter(tag => tag.toLowerCase().includes(techSearchTerm.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

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
              <div className="text-3xl font-bold text-white mb-2">{availableCategories.length}+</div>
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
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl mb-10 border border-white/30 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 overflow-visible">
            {/* Filter by Technology Dropdown */}
            <div ref={dropdownRef} className="relative z-20">
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Filter by Technology</label>
              <div className="relative">
                <button
                  onClick={() => setTechDropdownOpen(!techDropdownOpen)}
                  className="w-full p-2 sm:p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 cursor-pointer font-medium text-left flex items-center justify-between"
                >
                  <span className="text-gray-700 truncate">
                    {selectedTags.length > 0 ? `${selectedTags.length} selected` : 'Select Technologies'}
                  </span>
                  <ChevronDown className={`text-gray-400 w-4 h-4 sm:w-5 sm:h-5 transition-transform flex-shrink-0 ${techDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {techDropdownOpen && (
                  <div className="absolute left-0 right-0 z-[9999] mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gray-200 bg-white">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search technologies..."
                          value={techSearchTerm}
                          onChange={(e) => setTechSearchTerm(e.target.value)}
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Technology List */}
                    <div className="max-h-60 overflow-y-auto">
                      {filteredTechnologies.length > 0 ? (
                        filteredTechnologies.map(tag => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`w-full text-left px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm ${selectedTags.includes(tag) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{tag}</span>
                              {selectedTags.includes(tag) && (
                                <span className="text-blue-600 font-bold">✓</span>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-500 text-sm text-center">
                          No technologies found
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Price Range (INR)</label>
              <div className="flex items-center gap-2 sm:gap-3">
                <input
                  type="text"
                  onChange={e => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  placeholder="Min ₹"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">to</span>
                <input
                  type="text"
                  onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                  placeholder="Max ₹"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Selected Technologies Tags */}
          {selectedTags.length > 0 && (
            <div className="mt-4 sm:mt-6">
              <div className="flex items-center gap-2 mb-2">
                <label className="text-sm font-semibold text-gray-700">Selected Technologies:</label>
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedTags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium"
                  >
                    {tag}
                    <button
                      onClick={() => toggleTag(tag)}
                      className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Category Tags */}
          <div className="mt-6 sm:mt-8">
            <label className="block text-sm font-semibold text-gray-700 mb-3 sm:mb-4">Category</label>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {availableCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-300 hover:scale-105 ${selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {getCategoryDisplayName(category)}
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
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))}
            </div>

            {/* Loading More Skeleton */}
            {loadingMore && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-6 sm:mt-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No Projects Found</h3>
            <p className="text-gray-600 text-lg">Try changing filters or search keywords to find projects.</p>
          </div>
        )}

        {/* Load More */}
        {!loading && currentPage < totalPages && (
          <div className="mt-10 text-center">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
            >
              {loadingMore ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Loading...
                </>
              ) : (
                'Load More Projects'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectListing;
