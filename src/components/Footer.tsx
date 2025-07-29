import React from 'react';
import { Link } from 'react-router-dom';
import {
  Grid3X3, Mail, Phone, MapPin,
  Facebook, Twitter, Instagram, Linkedin, Youtube,
  Star, Shield, Award, Clock
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    categories: [
      { name: 'React Projects', href: '/projects?category=react' },
      { name: 'Java Projects', href: '/projects?category=java' },
      { name: 'Python Projects', href: '/projects?category=python' },
      { name: 'PHP Projects', href: '/projects?category=php' },
      { name: 'Mobile Apps', href: '/projects?category=mobile' },
      { name: 'Node.js Projects', href: '/projects?category=nodejs' }
    ],
    about: [
      { name: 'How it Works', href: '/how-it-works' },
      { name: 'Trust & Safety', href: '/trust-safety' },
      { name: 'Quality Guide', href: '/quality-guide' },
      { name: 'StudyStack Pro', href: '/pro' }
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact Support', href: '/contact' },
      { name: 'Report Issues', href: '/report' }
    ],
    community: [
      { name: 'Blog', href: '/blog' },
      { name: 'Events', href: '/events' },
      { name: 'Partnerships', href: '/partnerships' }
    ]
  };

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com/studystack' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/studystack' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/studystack' },
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/studystack' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/studystack' }
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Branding */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-teal-600 rounded-xl flex items-center justify-center">
                <Grid3X3 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-white">StudyStack</span>
            </Link>
            <p className="leading-relaxed text-sm text-gray-400">
              The world's largest student project marketplace. Discover, collaborate, and grow together.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                <span>support@studystack.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Columns */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-white font-medium mb-3 capitalize">{section}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="hover:text-white hover:underline">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
          <div>© {currentYear} StudyStack. All rights reserved.</div>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
            <Link to="/cookies" className="hover:text-white">Cookies</Link>
            <Link to="/accessibility" className="hover:text-white">Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
