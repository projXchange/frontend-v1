import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "General",
      questions: [
        {
          question: "What is ProjXchange?",
          answer: "ProjXchange is a marketplace platform that connects students, freelancers, and developers with those seeking quality projects. Anyone can upload their projects to earn money, while others can purchase well-documented projects to learn and accelerate their journey."
        },
        {
          question: "Who can use ProjXchange?",
          answer: "ProjXchange is designed for students, freelancers, developers, and anyone interested in professional development projects. Whether you're looking to monetize your work or find quality projects to learn from, our platform is open to all."
        },
        {
          question: "Is ProjXchange free to use?",
          answer: "Creating an account and browsing projects is completely free. We only charge a small commission when you successfully sell a project on our platform."
        }
      ]
    },
    {
      category: "Buying Projects",
      questions: [
        {
          question: "How do I purchase a project?",
          answer: "Simply browse our project catalog, select the project you want, add it to your cart, and proceed to checkout. After payment, you'll get instant access to download the project files and documentation."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets. All payments are processed securely through our payment gateway partners."
        },
        {
          question: "Can I get a refund?",
          answer: "Yes, we offer refunds within 7 days of purchase if the project doesn't match the description or has significant issues. Please refer to our Refund Policy for detailed terms."
        },
        {
          question: "Do I get lifetime access to purchased projects?",
          answer: "Yes! Once you purchase a project, you have lifetime access to download and use it. You'll also receive any updates the seller makes to the project."
        }
      ]
    },
    {
      category: "Selling Projects",
      questions: [
        {
          question: "How do I upload a project?",
          answer: "After creating an account, click on 'Upload Project' in the navigation menu. Fill in the project details, upload your files, set your price, and submit for review. Once approved, your project will be live on the marketplace for buyers to discover."
        },
        {
          question: "What commission does ProjXchange charge?",
          answer: "We charge a 15% commission on each sale. This helps us maintain the platform, provide customer support, and continue improving our services."
        },
        {
          question: "How do I receive payments?",
          answer: "Payments are transferred to your registered bank account or UPI ID within 7 business days after a successful sale. You can track all your earnings in your dashboard."
        },
        {
          question: "What types of projects can I sell?",
          answer: "You can sell any development project including web applications, mobile apps, machine learning models, data analysis projects, APIs, and more. Projects must be original work and include proper documentation."
        }
      ]
    },
    {
      category: "Account & Security",
      questions: [
        {
          question: "How do I reset my password?",
          answer: "Click on 'Forgot Password' on the login page, enter your email address, and we'll send you a password reset link. Follow the instructions in the email to set a new password."
        },
        {
          question: "Is my payment information secure?",
          answer: "Absolutely! We use industry-standard encryption and never store your complete payment details. All transactions are processed through PCI-DSS compliant payment gateways."
        },
        {
          question: "Can I delete my account?",
          answer: "Yes, you can delete your account from your profile settings. Please note that this action is permanent and you'll lose access to all purchased projects and earnings history."
        }
      ]
    }
  ];

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const index = categoryIndex * 100 + questionIndex;
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600 text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-blue-100">
              Find answers to common questions about ProjXchange
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                {category.category}
              </h2>

              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const index = categoryIndex * 100 + questionIndex;
                  const isOpen = openIndex === index;

                  return (
                    <div
                      key={questionIndex}
                      className="bg-white dark:bg-slate-900 rounded-xl shadow-md border border-gray-100 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 pr-4">
                          {faq.question}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="px-6 pb-5"
                        >
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-gray-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Still have questions?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              We're here to help! Reach out to our support team
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Contact Us
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
