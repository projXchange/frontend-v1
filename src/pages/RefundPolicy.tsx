import React from 'react';
import { motion } from 'framer-motion';

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">Refund Policy</h1>
            <p className="text-blue-100">Last updated: {new Date().toLocaleDateString()}</p>
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
          >
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-8 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">1. Refund Eligibility</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  We offer refunds within 7 days of purchase if:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>The project does not match the description provided</li>
                  <li>The project files are corrupted or incomplete</li>
                  <li>The project has significant technical issues that prevent its use</li>
                  <li>The seller fails to provide promised support or documentation</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">2. Non-Refundable Situations</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  Refunds will not be provided if:
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>You have downloaded and used the project files</li>
                  <li>The refund request is made after 7 days of purchase</li>
                  <li>You changed your mind about the purchase</li>
                  <li>You lack the technical skills to use the project</li>
                  <li>The project works as described but doesn't meet your specific needs</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">3. How to Request a Refund</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  To request a refund:
                </p>
                <ol className="list-decimal list-inside text-gray-600 dark:text-gray-300 space-y-2">
                  <li>Contact our support team at <a href="mailto:help.projxchange@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">help.projxchange@gmail.com</a></li>
                  <li>Provide your order number and reason for refund</li>
                  <li>Include any relevant screenshots or documentation</li>
                  <li>Wait for our team to review your request (usually within 2-3 business days)</li>
                </ol>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">4. Refund Processing</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Once your refund is approved, it will be processed within 5-7 business days. The refund will be credited to your original payment method. Please note that it may take additional time for your bank or payment provider to process the refund.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">5. Partial Refunds</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  In some cases, we may offer partial refunds if only certain aspects of the project are problematic. This will be determined on a case-by-case basis.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">6. Dispute Resolution</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  If you're not satisfied with our refund decision, you can escalate the matter to our dispute resolution team. We'll work with both parties to reach a fair solution.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">7. Seller Protection</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We also protect sellers from fraudulent refund requests. All refund requests are thoroughly reviewed to ensure fairness to both buyers and sellers.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">8. Contact Us</h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  For any questions about our refund policy, please contact us at help.projxchange@gmail.com
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default RefundPolicy;
