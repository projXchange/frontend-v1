
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Star, Tag, Flame, Heart, ShoppingCart, Sparkles } from "lucide-react"
import type { Project } from "../types/Project"
import { useWishlist } from "../contexts/WishlistContext"
import { useCart } from "../contexts/CartContext"
import { useAuth } from "../contexts/AuthContext"
import toast from "react-hot-toast"

interface ProjectCardProps {
  project: Project
  index: number
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToCart, isInCart, removeFromCart } = useCart()
  const { isAuthenticated, openAuthModal } = useAuth()
  // Calculate discount from consolidated project data
  const discount =
    project.pricing?.original_price && project.pricing?.sale_price
      ? project.pricing.original_price > project.pricing.sale_price
      : false
  const discountPercent =
    discount && project.pricing?.original_price && project.pricing?.sale_price
      ? Math.round((1 - project.pricing.sale_price / project.pricing.original_price) * 100)
      : 0

  // Generate a placeholder image based on category
  const getPlaceholderImage = (category: string) => {
    const images = {
      React: "https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=400",
      Java: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=400",
      Python: "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400",
      PHP: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=400",
      "Node.js": "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400",
      Mobile: "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=400",
    }
    return images[category as keyof typeof images] || images["React"]
  }

  return (
    <motion.div
      key={project.id}
      initial={{ opacity: 0, y: 60, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.04 }}
    >
      <Link
        to={`/project/${project.id}`}
        className="group bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl dark:shadow-slate-900/50 transition-all duration-300 border border-gray-100 dark:border-slate-700 relative flex flex-col w-full h-full min-h-[500px]"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <motion.img
            src={project.thumbnail || getPlaceholderImage(project.category)}
            alt={project.title}
            className="w-full h-40 sm:h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            initial={{ scale: 1.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.15 + 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          />

          {/* Demo Badge */}
          {project.isDemo && (
            <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg z-10">
              <Sparkles className="w-3 h-3" />
              DEMO
            </div>
          )}

          {/* Discount Badge */}
          {discount && (
            <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              -{discountPercent}%
            </div>
          )}

          {/* Featured Badge */}
          {project.is_featured && (
            <div className="absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Flame className="w-3 h-3" />
              <span className="hidden sm:inline">Featured</span>
            </div>
          )}

          {/* Wishlist Button */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.15 + 0.4, duration: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: project.isDemo ? 1 : 1.1 }}
            whileTap={{ scale: project.isDemo ? 1 : 0.95 }}
            disabled={project.isDemo}
            className={`absolute bottom-2 sm:bottom-3 md:bottom-4 right-2 sm:right-3 md:right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 transition z-20 shadow ${
              project.isDemo 
                ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500" 
                : isInWishlist(project.id) 
                  ? "hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 dark:text-red-400" 
                  : "hover:bg-pink-100 dark:hover:bg-pink-900/30 text-pink-500 dark:text-pink-400"
            }`}
            title={project.isDemo ? "Demo project - view only" : (isInWishlist(project.id) ? "Remove from wishlist" : "Add to wishlist")}
            type="button"
            onClick={(e) => {
              e.preventDefault()
              
              // Prevent actions on demo projects
              if (project.isDemo) {
                toast.error("🎁 Demo projects are for preview only. Browse our full catalog!")
                return
              }
              
              if (!isAuthenticated) {
                openAuthModal(true)
                return
              }
              if (isInWishlist(project.id)) {
                removeFromWishlist(project.id)
              } else {
                addToWishlist(project)
              }
            }}
          >
            <Heart className={`w-4 sm:w-5 h-4 sm:h-5 ${isInWishlist(project.id) && !project.isDemo ? "fill-current" : ""}`} />
          </motion.button>

          {/* Cart Button */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.15 + 0.5, duration: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: project.isDemo ? 1 : 1.1 }}
            whileTap={{ scale: project.isDemo ? 1 : 0.95 }}
            disabled={project.isDemo}
            className={`absolute bottom-2 sm:bottom-3 md:bottom-4 right-14 sm:right-16 md:right-16 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-full p-1.5 sm:p-2 transition z-20 shadow ${
              project.isDemo 
                ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-500" 
                : isInCart(project.id) 
                  ? "hover:bg-green-100 dark:hover:bg-green-900/30 text-green-500 dark:text-green-400" 
                  : "hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-500 dark:text-blue-400"
            }`}
            title={project.isDemo ? "Demo project - view only" : (isInCart(project.id) ? "Remove from cart" : "Add to cart")}
            type="button"
            onClick={(e) => {
              e.preventDefault()
              
              // Prevent actions on demo projects
              if (project.isDemo) {
                toast.error("🎁 Demo projects are for preview only. Explore our full catalog to purchase!")
                return
              }
              
              if (!isAuthenticated) {
                openAuthModal(true)
                return
              }

              if (isInCart(project.id)) {
                removeFromCart(project.id)
              } else {
                addToCart(project)
              }
            }}
          >
            <ShoppingCart className={`w-4 sm:w-5 h-4 sm:h-5 ${isInCart(project.id) && !project.isDemo ? "fill-current" : ""}`} />
          </motion.button>

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <motion.div
          className="p-3 sm:p-4 md:p-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 mb-2 sm:mb-3">
            <span className="px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium w-fit">
              {project.category}
            </span>
            <div className="flex items-center text-xs sm:text-sm">
              <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 font-semibold text-gray-800 dark:text-gray-200">{project.rating?.average_rating || 0.0}</span>
              <span className="ml-1 text-gray-500 dark:text-gray-400">
                ({project.rating?.total_ratings || 0} {(project.rating?.total_ratings || 0) === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition line-clamp-2">
            {project.title}
          </h3>
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
            {project.tech_stack.slice(0, 3).map((tech: string, i: number) => (
              <span
                key={i}
                className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-xs font-medium"
              >
                <Tag className="w-3 h-3" /> <span className="hidden sm:inline">{tech}</span>
              </span>
            ))}
            {project.tech_stack.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 rounded-full text-xs">
                +{project.tech_stack.length - 3}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 sm:mb-4 gap-2">
            <div className="flex items-center space-x-2">
              {project.isDemo ? (
                <span className="text-base sm:text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  FREE
                </span>
              ) : (
                <>
                  <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">₹{project.pricing?.sale_price || 0}</span>
                  {discount && project.pricing?.original_price && (
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">₹{project.pricing.original_price}</span>
                  )}
                </>
              )}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{project.purchase_count} sales</div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2">
            {project.description.length > 100 ? `${project.description.substring(0, 100)}...` : project.description}
          </p>
          <div className="text-center">

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block px-4 sm:px-5 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-teal-500 dark:from-blue-500 dark:to-teal-400 hover:from-blue-700 hover:to-teal-600 dark:hover:from-blue-600 dark:hover:to-teal-500 text-white rounded-full text-sm sm:text-base font-semibold shadow"
            >
              View Details
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
