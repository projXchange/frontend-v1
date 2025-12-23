import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Heart, Users, AlertCircle } from 'lucide-react';

const CommunityGuidelines = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Community Guidelines</h1>
            <p className="text-blue-100">Building a respectful and supportive community</p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Heart, title: "Be Respectful", color: "from-red-500 to-pink-500" },
                { icon: Users, title: "Be Collaborative", color: "from-blue-500 to-cyan-500" },
                { icon: Shield, title: "Be Honest", color: "from-green-500 to-teal-500" },
                { icon: AlertCircle, title: "Be Responsible", color: "from-orange-500 to-yellow-500" }
              ].map((value, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg text-center">
                  <div className={`w-14 h-14 bg-gradient-to-br ${value.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                    <value.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 dark:text-gray-100">{value.title}</h3>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">1. Respect Others</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Treat all community members with respect and kindness:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>No harassment, bullying, or hate speech</li>
                  <li>Respect different opinions and perspectives</li>
                  <li>Be constructive in your criticism</li>
                  <li>Use appropriate language</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">2. Original Content Only</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Upload only projects that you have created:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Do not plagiarize or copy others' work</li>
                  <li>Give proper credit when using third-party libraries</li>
                  <li>Respect intellectual property rights</li>
                  <li>Do not upload copyrighted material without permission</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">3. Accurate Descriptions</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Provide honest and accurate information:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Describe your projects truthfully</li>
                  <li>Include all relevant technical details</li>
                  <li>Disclose any limitations or known issues</li>
                  <li>Use appropriate tags and categories</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">4. Quality Standards</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Maintain high-quality standards:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Provide well-documented code</li>
                  <li>Include setup instructions</li>
                  <li>Test your projects before uploading</li>
                  <li>Respond to buyer questions promptly</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">5. Fair Pricing</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Set reasonable prices for your projects. Consider the complexity, quality, and value provided. Avoid price manipulation or unfair practices.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">6. Prohibited Content</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  The following content is strictly prohibited:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Malicious code or malware</li>
                  <li>Projects that violate laws or regulations</li>
                  <li>Adult or inappropriate content</li>
                  <li>Spam or misleading information</li>
                  <li>Projects designed to harm or exploit others</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">7. Reporting Violations</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  If you encounter content or behavior that violates these guidelines, please report it to our moderation team at <a href="mailto:help.projxchange@gmail.com" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">help.projxchange@gmail.com</a>. We take all reports seriously and will investigate promptly.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">8. Consequences</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Violations of these guidelines may result in:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Warning or temporary suspension</li>
                  <li>Removal of content</li>
                  <li>Permanent account termination</li>
                  <li>Legal action in severe cases</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong className="text-gray-900 dark:text-gray-100">Remember:</strong> Our community thrives when everyone contributes positively. By following these guidelines, you help create a safe, supportive, and productive environment for all members.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default CommunityGuidelines;
