import React from 'react';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Award, TrendingUp, Github, Twitter, Linkedin } from 'lucide-react';

const Community = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Join Our Community
            </h1>
            <p className="text-xl text-blue-100">
              Connect with thousands of student developers worldwide
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { icon: Users, label: "Growing", desc: "Active Members" },
              { icon: MessageSquare, label: "Active", desc: "Discussions" },
              { icon: Award, label: "Quality", desc: "Projects Shared" },
              { icon: TrendingUp, label: "Expanding", desc: "Daily" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg text-center"
              >
                <stat.icon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{stat.label}</div>
                <div className="text-gray-600 dark:text-gray-300 dark:text-gray-400">{stat.desc}</div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Connect With Us</h2>
            <div className="flex justify-center gap-6">
              {[
                { icon: Github, label: "GitHub", color: "hover:bg-gray-800", url: "#" },
                { icon: Twitter, label: "Twitter", color: "hover:bg-blue-400", url: "#" },
                { icon: Linkedin, label: "LinkedIn", color: "hover:bg-blue-700", url: "https://www.linkedin.com/company/projxchange" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-14 h-14 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center transition-all duration-300 ${social.color} hover:text-white hover:scale-110`}
                  aria-label={social.label}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Community;
