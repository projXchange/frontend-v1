import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">StudyStack</span>
            </div>
            <p className="text-gray-400 text-sm">
              Empowering Indian students to share knowledge, build skills, and create opportunities in tech.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/browse" className="text-gray-400 hover:text-white transition-colors">Browse Projects</Link></li>
              <li><Link to="/upload" className="text-gray-400 hover:text-white transition-colors">Upload Project</Link></li>
              <li><Link to="/dashboard" className="text-gray-400 hover:text-white transition-colors">Dashboard</Link></li>
              <li><Link to="/categories" className="text-gray-400 hover:text-white transition-colors">Categories</Link></li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/community" className="text-gray-400 hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/refund" className="text-gray-400 hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/guidelines" className="text-gray-400 hover:text-white transition-colors">Community Guidelines</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>support@studystack.in</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Mumbai, India</span>
            </div>
          </div>
          <div className="text-sm text-gray-400 mt-4 md:mt-0">
            © 2024 StudyStack. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;