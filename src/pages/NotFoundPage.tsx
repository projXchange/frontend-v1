import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Home, Compass } from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl w-full text-center bg-gradient-to-br from-blue-950/60 via-blue-900/60 to-teal-800/60 backdrop-blur-xl border border-blue-700 rounded-3xl shadow-2xl px-10 py-20 text-white"
      >
        {/* 404 Heading */}
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-8xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-blue-300 to-indigo-400"
        >
          404
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold mb-4"
        >
          Oops! Page Not Found
        </motion.h2>

        {/* Message */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-blue-100 mb-10 max-w-xl mx-auto text-lg leading-relaxed"
        >
          The page you’re looking for doesn’t exist or has been moved.  
          Let’s get you back where you belong!
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-center gap-5"
        >
          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-800 text-blue-900 dark:text-gray-100 rounded-xl font-semibold text-lg hover:bg-blue-100 dark:hover:bg-slate-700 shadow-md transition transform hover:scale-105"
          >
            <Home className="mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </button>

          <Link
            to="/projects"
            className="group inline-flex items-center justify-center px-8 py-4 border-2 border-white dark:border-slate-600 text-white rounded-xl font-semibold text-lg hover:bg-white dark:hover:bg-slate-800 hover:text-blue-900 dark:hover:text-gray-100 transition transform hover:scale-105"
          >
            <Compass className="mr-2 w-5 h-5 transition-transform group-hover:rotate-12" />
            Explore Projects
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
