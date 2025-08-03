import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Tag, Flame } from "lucide-react";

interface ProjectCardProps {
  project: any;
  index: number;
}

export const ProjectCard = ({ project, index }: ProjectCardProps) => {
  const discount =
    parseInt(project.originalPrice.replace(/\₹|\$/g, '')) >
    parseInt(project.price.replace(/\₹|\$/g, ''));
  const discountPercent = Math.round(
    (1 -
      parseInt(project.price.replace(/\₹|\$/g, '')) /
        parseInt(project.originalPrice.replace(/\₹|\$/g, ''))) *
      100
  );

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
        className="group bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative block"
      >
        {/* Image */}
        <div className="relative overflow-hidden">
          <motion.img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
            initial={{ scale: 1.2, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.15 + 0.2, duration: 0.6 }}
            viewport={{ once: true }}
          />

          {/* Favorite */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.15 + 0.4, duration: 0.3 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-pink-100 transition z-20 shadow"
            title="Add to favorites"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              // Handle favorite
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

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <motion.div
          className="p-5"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.15 + 0.3, duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              {project.category}
            </span>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="ml-1 text-sm font-semibold text-gray-800">{project.rating}</span>
              <span className="ml-1 text-sm text-gray-500">({project.reviews})</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition">
            {project.title}
          </h3>

          <p className="text-gray-600 text-sm mb-3">
            {project.description ?? `A high-quality, ready-to-use ${project.category} project for students.`}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map((tag: string, i: number) => (
              <span
                key={i}
                className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-800 rounded-full text-xs font-medium"
              >
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-gray-900">{project.price}</span>
              <span className="text-sm text-gray-500 line-through">{project.originalPrice}</span>
            </div>
            <div className="text-sm text-gray-600">{project.sales} sales</div>
          </div>

          <div className="text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block px-5 py-2 bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white rounded-full font-semibold shadow"
            >
              View Details
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};
