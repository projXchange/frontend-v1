import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Code, Database, Globe, Smartphone, Star, ArrowRight, Users, Award, TrendingUp, Clock, BookOpen, Brain, DollarSign } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import DemoVideo from '../assets/Demo.mp4';


const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { openAuthModal } = useAuth();

  const categories = [
    { name: 'Java', icon: Code, color: 'bg-gradient-to-br from-orange-500 to-red-500', count: 45, growth: '+12%' },
    { name: 'Python', icon: Database, color: 'bg-gradient-to-br from-blue-500 to-indigo-600', count: 38, growth: '+8%' },
    { name: 'PHP', icon: Globe, color: 'bg-gradient-to-br from-purple-500 to-pink-500', count: 32, growth: '+15%' },
    { name: 'React', icon: Code, color: 'bg-gradient-to-br from-cyan-500 to-blue-500', count: 28, growth: '+20%' },
    { name: 'Node.js', icon: Database, color: 'bg-gradient-to-br from-green-500 to-emerald-500', count: 25, growth: '+18%' },
    { name: 'Mobile', icon: Smartphone, color: 'bg-gradient-to-br from-pink-500 to-rose-500', count: 22, growth: '+10%' },
  ];

  const featuredProjects = [
    {
      id: 1,
      title: 'E-commerce Web App',
      category: 'React',
      price: '₹29',
      originalPrice: '₹49',
      rating: 4.9,
      reviews: 127,
      thumbnail: 'https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: {
        name: 'John Doe',
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
        level: 'Top Rated',
        rating: 4.9
      },
      tags: ['React', 'Node.js', 'MongoDB'],
      deliveryTime: '2 days',
      sales: 89
    },
    {
      id: 2,
      title: 'Hospital Management System',
      category: 'Java',
      price: '₹45',
      originalPrice: '₹65',
      rating: 4.8,
      reviews: 94,
      thumbnail: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: {
        name: 'Sarah Wilson',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        level: 'Level 2',
        rating: 4.8
      },
      tags: ['Java', 'Spring', 'MySQL'],
      deliveryTime: '3 days',
      sales: 67
    },
    {
      id: 3,
      title: 'Social Media Dashboard',
      category: 'Python',
      price: '₹35',
      originalPrice: '₹55',
      rating: 4.7,
      reviews: 156,
      thumbnail: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400',
      seller: {
        name: 'Mike Johnson',
        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
        level: 'Top Rated',
        rating: 4.9
      },
      tags: ['Python', 'Django', 'PostgreSQL'],
      deliveryTime: '1 day',
      sales: 134
    }
  ];

  const testimonials = [
    {
      name: 'Emily Chen',
      role: 'Computer Science Student',
      university: 'MIT',
      text: 'StudyStack saved me weeks of development time. The projects are incredibly well-documented and the sellers are super responsive!',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100',
      project: 'React E-commerce App'
    },
    {
      name: 'Alex Rodriguez',
      role: 'Software Engineering Student',
      university: 'Stanford',
      text: 'The quality of projects here is outstanding. I learned so much from the code structure and implementation patterns.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100',
      project: 'Java Spring Boot API'
    },
    {
      name: 'Maria Garcia',
      role: 'Data Science Student',
      university: 'UC Berkeley',
      text: 'Perfect for students on a budget. The projects are affordable and come with excellent documentation and support.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=100',
      project: 'Python ML Dashboard'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Students', icon: Users },
    { number: '500+', label: 'Quality Projects', icon: Award },
    { number: '98%', label: 'Success Rate', icon: TrendingUp },
    { number: '24/7', label: 'Support', icon: Clock }
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative mx-2 sm:mx-4 lg:mx-8 xl:mx-20 mt-3 sm:mt-5 bg-cover bg-center rounded-2xl sm:rounded-3xl overflow-hidden text-white min-h-[600px] sm:min-h-[700px] lg:min-h-[800px]"

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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 xl:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

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

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-6 sm:mb-10 animate-slideInUp" style={{ animationDelay: '1.5s' }}>
                <div className="relative w-full max-w-2xl mx-auto lg:mx-0">
                  <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for projects, tech stacks, or keywords..."
                    className="block w-full pl-12 sm:pl-14 pr-28 sm:pr-36 py-3 sm:py-4 text-sm sm:text-base lg:text-lg border-0 rounded-xl sm:rounded-2xl bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-2xl transition-all duration-300 hover:bg-white focus:bg-white"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:pr-3">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
                    >
                      <Search className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Search</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start animate-slideInUp" style={{ animationDelay: '2s' }}>
                <Link
                  to="/browse"
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
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl float-animation">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">React E-commerce</h3>
                    <p className="text-blue-200 text-sm">Full-stack project</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">₹2,499</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white text-sm">4.9</span>
                  </div>
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-2xl float-animation" style={{ animationDelay: '0.5s' }}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">10K+</div>
                    <div className="text-blue-200 text-sm">Students</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-blue-200 text-sm">Projects</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 mt-12 sm:mt-16 lg:mt-20 bg-white">
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
        onClick={() => openAuthModal(false)}
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300"
      >
        🚀 Join Projxchange Now
      </button>
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <motion.div
                  key={category.name}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.5, delay: 0.5 * 0.1,
                    ease: "easeOut"
                  }}
                  viewport={{ once: true }}
                  whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  <Link to={`/projects?category=${category.name.toLowerCase()}`} className="group bg-white rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300 border border-gray-100 block">
                    <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110`}>
                      <category.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-gray-600 text-sm">{category.count} projects</p>
                    <div className="mt-2 inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {category.growth}
                    </div>
                  </Link>
                </motion.div>
              ))}
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
            {featuredProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.6,
                  delay: idx * 0.15,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.3 }
                }}
              >
                <Link
                  to={`/project/${project.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 relative block"
                >
                  {/* Discount Badge */}
                  {parseInt(project.originalPrice.replace(/\₹/g, '')) > parseInt(project.price.replace(/\₹/g, '')) && (
                    <motion.span
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ delay: idx * 0.15 + 0.3, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="absolute top-4 left-4 z-20 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                    >
                      {Math.round((1 - parseInt(project.price.replace(/\$/g, '')) / parseInt(project.originalPrice.replace(/\$/g, ''))) * 100)}% OFF
                    </motion.span>
                  )}
                  {/* Best Seller Badge */}
                  {idx === 0 && (
                    <motion.span
                      initial={{ scale: 0, rotate: 180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{ delay: idx * 0.15 + 0.4, duration: 0.5 }}
                      viewport={{ once: true }}
                      className="absolute top-4 right-4 z-20 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                    >
                      Best Seller
                    </motion.span>
                  )}

                  <div className="relative overflow-hidden">
                    <motion.img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                      initial={{ scale: 1.2, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.15 + 0.2, duration: 0.6 }}
                      viewport={{ once: true }}
                    />
                    {/* Favorite Button */}
                    <motion.button
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.15 + 0.5, duration: 0.3 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 flex items-center justify-center hover:bg-pink-100 transition z-20 shadow"
                      title="Add to favorites"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        // Add favorite logic here
                      }}
                    >
                      <svg
                        className="w-5 h-5 text-pink-500"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 21.364l-7.682-7.682a4.5 4.5 0 010-6.364z"
                        />
                      </svg>
                    </motion.button>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <motion.div
                    className="p-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 + 0.3, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                        {project.category}
                      </span>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm font-semibold text-gray-700">{project.rating}</span>
                        <span className="ml-1 text-sm text-gray-500">({project.reviews})</span>
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition">
                      {project.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-3">
                      A high-quality, ready-to-use {project.category} project for students.
                    </p>

                    <div className="flex items-center mb-4">
                      <img
                        src={project.seller.avatar}
                        alt={project.seller.name}
                        className="w-8 h-8 rounded-full object-cover mr-3"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{project.seller.name}</div>
                        <div className="flex items-center text-xs text-gray-600">
                          <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                          {project.seller.rating}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-lg text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-gray-900">{project.price}</span>
                        <span className="text-base text-gray-500 line-through">{project.originalPrice}</span>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-600">{project.sales} sales</div>
                        <div className="text-green-600 font-medium">{project.deliveryTime} delivery</div>
                      </div>
                    </div>

                    {/* ✅ Replaced inner Link with div */}
                    <div className="text-center">
                      <div className="inline-block px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-full font-semibold shadow hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 hover:scale-105">
                        View Details
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>


      {/* Testimonials */}
      <section className="py-24 bg-white">
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


      {/* CTA Section */}
      <section className="relative py-28 sm:py-32 bg-white text-gray-900 overflow-hidden">
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
              <strong className="text-white font-semibold">StudyStack</strong> — one project at a time.
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