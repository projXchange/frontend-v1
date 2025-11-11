import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Code, Database, Globe, Smartphone, Star, ArrowRight, Users, Award, TrendingUp, Clock, BookOpen, Brain, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { ProjectCard } from '../components/ProjectCard';
import { Project } from '../types/Project';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [topprojects, setTopProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);
  const { openAuthModal, user } = useAuth();
  const navigate = useNavigate();

  const handleJoinClick = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      openAuthModal(false); // open signup/login modal
    }
  };
  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch('https://projxchange-backend-v1.vercel.app/projects/home', {
          method: 'GET',
          headers,
        });
        const data = await response.json();

        setProjects(data.featured_projects || []);
        setTopProjects(data.top_rated_projects)

        console.log('Home data:', data);

        // Process categories from API
        const categoryIcons = {
          'Java': Code,
          'Python': Database,
          'PHP': Globe,
          'React': Code,
          'Node.js': Database,
          'Mobile': Smartphone,
          'JavaScript': Code,
          'TypeScript': Code,
          'Angular': Code,
          'Vue.js': Code,
          'Django': Database,
          'Flask': Database,
          'Laravel': Globe,
          'Express.js': Database,
          'MongoDB': Database,
          'MySQL': Database,
          'PostgreSQL': Database,
          'Firebase': Database,
          'AWS': Globe,
          'Docker': Globe
        };

        if (data.categories && data.categories.length > 0) {
          const generatedCategories = data.categories.map((cat: any) => ({
            name: cat.category,
            icon: categoryIcons[cat.category as keyof typeof categoryIcons] || Code,
            color: getRandomGradient(),
            count: cat.count,
            growth: `+${Math.floor(Math.random() * 20) + 5}%`
          }));
          setCategories(generatedCategories.slice(0, 6)); // Limit to 6 categories
        } else {
          // Fallback to default categories
          setCategories([
            { name: 'Java', icon: Code, color: 'bg-gradient-to-br from-orange-500 to-red-500', count: 45, growth: '+12%' },
            { name: 'Python', icon: Database, color: 'bg-gradient-to-br from-blue-500 to-indigo-600', count: 38, growth: '+8%' },
            { name: 'PHP', icon: Globe, color: 'bg-gradient-to-br from-purple-500 to-pink-500', count: 32, growth: '+15%' },
            { name: 'React', icon: Code, color: 'bg-gradient-to-br from-cyan-500 to-blue-500', count: 28, growth: '+20%' },
            { name: 'Node.js', icon: Database, color: 'bg-gradient-to-br from-green-500 to-emerald-500', count: 25, growth: '+18%' },
            { name: 'Mobile', icon: Smartphone, color: 'bg-gradient-to-br from-pink-500 to-rose-500', count: 22, growth: '+10%' },
          ]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Fallback to default categories
        setCategories([
          { name: 'Java', icon: Code, color: 'bg-gradient-to-br from-orange-500 to-red-500', count: 45, growth: '+12%' },
          { name: 'Python', icon: Database, color: 'bg-gradient-to-br from-blue-500 to-indigo-600', count: 38, growth: '+8%' },
          { name: 'PHP', icon: Globe, color: 'bg-gradient-to-br from-purple-500 to-pink-500', count: 32, growth: '+15%' },
          { name: 'React', icon: Code, color: 'bg-gradient-to-br from-cyan-500 to-blue-500', count: 28, growth: '+20%' },
          { name: 'Node.js', icon: Database, color: 'bg-gradient-to-br from-green-500 to-emerald-500', count: 25, growth: '+18%' },
          { name: 'Mobile', icon: Smartphone, color: 'bg-gradient-to-br from-pink-500 to-rose-500', count: 22, growth: '+10%' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Helper function to get random gradient colors
  const getRandomGradient = () => {
    const gradients = [
      'bg-gradient-to-br from-orange-500 to-red-500',
      'bg-gradient-to-br from-blue-500 to-indigo-600',
      'bg-gradient-to-br from-purple-500 to-pink-500',
      'bg-gradient-to-br from-cyan-500 to-blue-500',
      'bg-gradient-to-br from-green-500 to-emerald-500',
      'bg-gradient-to-br from-pink-500 to-rose-500',
      'bg-gradient-to-br from-yellow-500 to-orange-500',
      'bg-gradient-to-br from-indigo-500 to-purple-500',
      'bg-gradient-to-br from-teal-500 to-cyan-500',
      'bg-gradient-to-br from-red-500 to-pink-500'
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };



  const testimonials = [
    {
      name: 'Demo Patil',
      role: 'BTech',
      university: 'D Y Patil University, Pune',
      text: 'ProjXchange saved me weeks of development time. The projects are incredibly well-documented and the sellers are super responsive!',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
      project: 'React E-commerce App'
    },
    {
      name: 'Test Patil',
      role: 'Software Engineering Student',
      university: 'Pune University',
      text: 'The quality of projects here is outstanding. I learned so much from the code structure and implementation patterns.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      project: 'Java Spring Boot API'
    },
    {
      name: 'Demo Pardeshi',
      role: 'MCA Student',
      university: 'UC Berkeley',
      text: 'Perfect for students on a budget. The projects are affordable and come with excellent documentation and support.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100',
      project: 'Python ML Dashboard'
    }
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  const features = [
    {
      icon: BookOpen,
      title: "Access curated content",
      subtitle: "across subjects and courses",
    },
    {
      icon: Users,
      title: "Connect with mentors",
      subtitle: "for guidance and career support",
    },
    {
      icon: Brain,
      title: "Smart learning tools",
      subtitle: "including flashcards and quizzes",
    },
    {
      icon: DollarSign,
      title: "Affordable & student-friendly",
      subtitle: "only pay if you're satisfied",
    },
  ];
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to projects page with search term
    window.location.href = `/projects?search=${encodeURIComponent(searchTerm)}`;
  };


  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section
        className="relative mx-2 sm:mx-4 lg:mx-8 xl:mx-20 mt-2 sm:mt-4 bg-cover bg-center rounded-xl sm:rounded-2xl overflow-hidden text-white min-h-[450px] sm:min-h-[550px] lg:min-h-[650px]"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="https://fiverr-res.cloudinary.com/video/upload/f_auto:video,q_auto:best/v1/video-attachments/generic_asset/asset/18ad23debdc5ce914d67939eceb5fc27-1738830703211/Desktop%20Header%20new%20version" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">

            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="animate-slideInDown">
                <p className="text-xs sm:text-sm uppercase tracking-widest text-white/70 mb-3 font-medium">
                  Empowering student innovation
                </p>

                <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-yellow-400" />
                  Trusted by 10,000+ students worldwide
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-4 sm:mb-6 leading-tight tracking-tight">
                  <span className="block animate-fadeIn">Explore & Contribute to</span>
                  <span className="block bg-gradient-to-r from-blue-400 via-teal-300 to-green-300 bg-clip-text text-transparent animate-slideInLeft" style={{ animationDelay: '0.5s' }}>
                    Real Academic Projects
                  </span>
                </h1>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-10 text-blue-100 leading-relaxed max-w-2xl mx-auto lg:mx-0 animate-slideInUp" style={{ animationDelay: '1s' }}>
                  Discover high-quality student projects, learn from expert code, and accelerate your academic journey with our curated marketplace.
                </p>
              </div>
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-slideInUp" style={{ animationDelay: '2s' }}>
                <Link
                  to="/projects"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-900 rounded-xl font-semibold text-base sm:text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105 group"
                >
                  Browse Projects
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/upload"
                  className="inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white rounded-xl font-semibold text-base sm:text-lg hover:bg-white hover:text-blue-900 transition-all duration-200 hover:shadow-xl hover:scale-105"
                >
                  Upload Yours 🚀
                </Link>
              </div>
            </div>

            {/* Right Side - Floating Cards */}
            <div className="hidden lg:flex flex-col space-y-6 animate-slideInRight" style={{ animationDelay: '1s' }}>
              {/* Floating Project Card */}
              {topprojects.length > 0 && (
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl float-animation">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <Code className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{topprojects[0].title.length > 20 ? `${topprojects[0].title.substring(0, 20)}...` : topprojects[0].title}</h3>
                      <p className="text-blue-200 text-sm">{topprojects[0].category} project</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-white">₹{topprojects[0].pricing?.sale_price || 0}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">4.8</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Floating Stats Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl float-animation" style={{ animationDelay: '0.5s' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">10K+</div>
                    <div className="text-blue-200 text-sm">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{projects.length}+</div>
                    <div className="text-blue-200 text-sm">Projects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monetize Your Skills Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Monetize Your Skills, Build Your Future
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Turn your academic projects into a source of income.{' '}
              <span className="text-blue-600 font-semibold">projXchange</span>{' '}
              empowers you to showcase or talent and earn from your creations.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16"
          >
            {/* Card 1 - Earn from Your Projects */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <DollarSign className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Earn from Your Projects
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Get paid for the hard work you put into academic assignments and side projects.
              </p>
            </motion.div>

            {/* Card 2 - Global Exposure */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Globe className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Global Exposure
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Reach or worldwide audience of potential employers looking innovative solutions.
              </p>
            </motion.div>

            {/* Card 3 - Build Your Portfolio */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Award className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Build Your Portfolio
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Enhance resume with real-world and positive feedback.
              </p>
            </motion.div>

            {/* Card 4 - Flexible Income */}
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Clock className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
                Flexible Income
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                Work on own terms and set or own prices.
              </p>
            </motion.div>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/how-it-works"
              className="inline-flex items-center justify-center px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Learn How It Works
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Start Exploring & Building
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover trending technologies and real-world projects to level up your skills
            </p>
          </motion.div>

          {/* Technologies Grid */}
          <div className="mb-20">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {loading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 sm:p-6 text-center border border-gray-100 animate-pulse"
                  >
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-xl mx-auto mb-3 sm:mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-5 bg-gray-200 rounded"></div>
                  </div>
                ))
              ) : (
                categories.map((category) => (
                  <motion.div
                    key={category.name}
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.5 * 0.1,
                      ease: "easeOut",
                    }}
                    viewport={{ once: true }}
                    whileHover={{
                      scale: 1.05,
                      transition: { duration: 0.2 },
                    }}
                  >
                    <Link
                      to={`/projects?category=${category.name.toLowerCase()}`}
                      className="group bg-white rounded-2xl p-4 sm:p-6 text-center hover:shadow-xl transition-all duration-300 border border-gray-100 block h-full"
                    >
                      <div
                        className={`w-12 h-12 sm:w-16 sm:h-16 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 transition-transform group-hover:scale-110`}
                      >
                        <category.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 mb-1 overflow-hidden text-ellipsis whitespace-normal sm:whitespace-normal break-words">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm break-words">
                        {category.count} projects
                      </p>
                      <div className="mt-2 inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-[10px] sm:text-xs font-medium">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {category.growth}
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </div>


          {/* Featured Projects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hand-picked projects to inspire your next build
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-pulse">
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : projects.length > 0 ? (
              projects.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx} />
              ))
            ) : (
              // No projects message
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg mb-4">No projects available at the moment</div>
                <p className="text-gray-400">Check back soon for new projects!</p>
              </div>
            )}
          </div>
          {/* Top Rated Projects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center mb-14 mt-24"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top Rated Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Projects that received the highest ratings from our community
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md border border-gray-100 animate-pulse"
                >
                  <div className="h-56 bg-gray-200"></div>
                  <div className="p-5">
                    <div className="h-4 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))
            ) : topprojects.length > 0 ? (
              topprojects.map((project, idx) => (
                <ProjectCard key={project.id} project={project} index={idx} />
              ))
            ) : (
              // No projects message
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 text-lg mb-4">
                  No top rated projects available right now
                </div>
                <p className="text-gray-400">
                  Check back soon for more highly rated projects!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>



      {/* Testimonials */}
      <section className="py-10 bg-white">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}

            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900">What Students Say</h2>
            <p className="text-lg text-gray-600 mt-3 max-w-2xl mx-auto">
              Trusted by thousands of learners to showcase real, impactful project experience.
            </p>
          </motion.div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 mr-1 ${idx < testimonial.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 italic leading-relaxed mb-6">
                  “{testimonial.text}”
                </p>

                {/* Student Info */}
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border border-gray-200 shadow-sm mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-blue-600">{testimonial.university}</p>
                  </div>
                </div>

                {/* Project Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Worked on:{' '}
                    <span className="text-gray-800 font-medium">
                      {testimonial.project}
                    </span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Everything Students Need Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
              Everything students need in one place
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of students who are already accelerating their learning journey
            </p>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.15 } },
            }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 mt-12 sm:mt-20"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                viewport={{ once: true }}
                className="text-center group hover:scale-105 transition-all duration-300"
              >
                <div className="mb-6 flex justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <feature.icon className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                  </div>
                </div>
                <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </div>
                <div className="text-sm sm:text-base text-gray-600">
                  {feature.subtitle}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 1 }}
            viewport={{ once: true }}
            className="mt-16 sm:mt-20 text-center"
          >
            <button

              onClick={handleJoinClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300"
            >
              🚀 Join Projxchange Now
            </button>
          </motion.div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-10 sm:py-14 bg-white text-gray-900 overflow-hidden">

        {/* Light Dotted Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(0,0,0,0.03)_1px,_transparent_1px)] bg-[length:40px_40px] pointer-events-none" />

        {/* Card Container */}
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white rounded-3xl shadow-2xl px-8 sm:px-16 py-20 border border-blue-700">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-center leading-tight"
            >
              🚀 Start Your Journey <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-teal-300 via-blue-300 to-indigo-400 text-transparent bg-clip-text">
                Build, Share & Grow
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
              className="text-lg sm:text-xl text-blue-100 mb-10 max-w-2xl mx-auto text-center leading-relaxed"
            >
              Join thousands of students transforming their future with&nbsp;
              <strong className="text-white font-semibold">projXchange</strong> — one project at a time.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row justify-center gap-5 mb-14"
            >
              <button
                onClick={() => openAuthModal(false)}
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 rounded-xl font-semibold text-lg hover:bg-blue-100 shadow-md transition transform hover:scale-105"
              >
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              <Link
                to="/projects"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-900 transition"
              >
                Browse Projects
              </Link>
            </motion.div>

            {/* Feature Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-4xl mx-auto text-center"
            >
              {[
                { label: '24/7', sub: 'Expert Support' },
                { label: '100%', sub: 'Money-back Guarantee' },
                { label: '500+', sub: 'Verified Projects' },
                { label: '10K+', sub: 'Happy Learners' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-white">{item.label}</div>
                  <div className="text-sm text-blue-100 mt-1">{item.sub}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;