import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Code, Database, Globe, Smartphone, Star, ArrowRight, Users, Award, TrendingUp, Clock, BookOpen, Brain, DollarSign } from 'lucide-react';
import LoginForm from '../components/LoginForm';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogin, setShowLogin] = useState(false);

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
        className="relative mx-4 sm:mx-8 lg:mx-20 mt-5 bg-cover bg-center rounded-3xl overflow-hidden text-white"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/70" />

        {/* Dot Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Content */}
            <div>
              <p className="text-sm uppercase tracking-widest text-white/70 mb-3 font-medium">
                Empowering student innovation
              </p>

              <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                <Star className="w-4 h-4 mr-2 text-yellow-400" />
                Trusted by 10,000+ students worldwide
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
                Explore & Contribute to
                <span className="block bg-gradient-to-r from-blue-500 to-teal-300 bg-clip-text text-transparent">
                  Real Academic Projects
                </span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl mb-10 text-blue-100 leading-relaxed max-w-2xl">
                Discover high-quality student projects, learn from expert code, and accelerate your academic journey with our curated marketplace.
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-10">
                <div className="relative w-full max-w-2xl">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for projects, tech stacks, or keywords..."
                    className="block w-full pl-14 pr-36 py-4 text-base sm:text-lg border-0 rounded-2xl bg-white/90 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/20 shadow-2xl"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Search className="w-4 h-4" />
                      Search
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Right CTA Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
              <Link to="/projects" className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:scale-105">
                Browse Projects <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link to="/upload" className="inline-flex items-center justify-center px-8 py-4 border border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-900 transition-all duration-200 hover:shadow-xl hover:scale-105">
                Upload Yours 🚀
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 mt-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-16">
            Everything students need in one place
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 mt-20">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">
                  <feature.icon className="w-10 h-10 text-gray-800" />
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {feature.subtitle}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center">
            <button
              onClick={() => setShowLogin(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300"
            >
              🚀 Join Projxchange Now
            </button>
          </div>
        </div>
      </section>
      <LoginForm
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onSwitchToSignup={() => {
          setShowLogin(false);
          // Optional: open signup modal if you have it
        }}
        onSuccess={() => setShowLogin(false)}
      />

      {/* Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title */}
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Start Exploring & Building
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover trending technologies and real-world projects to level up your skills
            </p>
          </div>

          {/* Technologies Grid */}
          <div className="mb-20">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link key={category.name}to={`/projects?category=${category.name.toLowerCase()}`}className="group bg-white rounded-2xl p-6 text-center hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100">
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
              ))}
            </div>
          </div>

          {/* Featured Projects */}
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Projects
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hand-picked projects to inspire your next build
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
  {featuredProjects.map((project, idx) => (
    <Link
      key={project.id}
      to={`/project/${project.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-100 relative"
    >
      {/* Discount Badge */}
      {parseInt(project.originalPrice.replace(/\₹/g, '')) > parseInt(project.price.replace(/\₹/g, '')) && (
        <span className="absolute top-4 left-4 z-20 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-bounce">
          {Math.round((1 - parseInt(project.price.replace(/\$/g, '')) / parseInt(project.originalPrice.replace(/\$/g, ''))) * 100)}% OFF
        </span>
      )}
      {/* Best Seller Badge */}
      {idx === 0 && (
        <span className="absolute top-4 right-4 z-20 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
          Best Seller
        </span>
      )}

      <div className="relative">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Favorite Button */}
        <button
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
        </button>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-6">
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
      </div>
    </Link>
  ))}
</div>

        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">
              What Students Say
            </h2>
            <p className="text-lg text-gray-600 mt-2 max-w-2xl mx-auto">
              Trusted by thousands of learners to showcase real, impactful project experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 mr-1 ${i < testimonial.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                        }`}
                    />
                  ))}
                </div>

                {/* Testimonial */}
                <p className="text-gray-700 leading-relaxed mb-6">
                  {testimonial.text}
                </p>

                {/* Student Info */}
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border border-gray-200 shadow-sm mr-4 object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                    <p className="text-sm text-blue-600">{testimonial.university}</p>
                  </div>
                </div>

                {/* Project Info */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">
                    Worked on:{" "}
                    <span className="text-gray-700 font-medium">
                      {testimonial.project}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100 leading-relaxed">
            Join thousands of students who have already transformed their academic experience with StudyStack
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-900 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-200 shadow-xl hover:shadow-2xl transform hover:scale-105">
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/projects" className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-blue-900 transition-all duration-200">
              Browse Projects
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold mb-2">24/7</div>
              <div className="text-blue-200 text-sm">Support Available</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">100%</div>
              <div className="text-blue-200 text-sm">Money Back Guarantee</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">500+</div>
              <div className="text-blue-200 text-sm">Quality Projects</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">10k+</div>
              <div className="text-blue-200 text-sm">Happy Students</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;