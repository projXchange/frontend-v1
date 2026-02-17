import { motion } from 'framer-motion';
import { FileText, CheckCircle, Clock, MessageSquare } from 'lucide-react';
import EnquiryForm from '../components/EnquiryForm';

const EnquiryPage = () => {
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
              Start Your Custom Project
            </h1>
            <p className="text-xl text-blue-100">
              Tell us about your project requirements and we'll help bring your vision to life
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Submit your project enquiry and we'll guide you through the process
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: FileText,
                title: 'Submit Details',
                description: 'Fill out the form with your project requirements',
                color: 'blue',
              },
              {
                icon: Clock,
                title: 'Quick Review',
                description: 'Our team reviews your enquiry within 24 hours',
                color: 'teal',
              },
              {
                icon: MessageSquare,
                title: 'Get in Touch',
                description: 'We reach out to discuss your project in detail',
                color: 'purple',
              },
              {
                icon: CheckCircle,
                title: 'We Start Building',
                description: 'Begin your custom project development journey',
                color: 'green',
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-${step.color}-100 dark:bg-${step.color}-900/30 rounded-2xl flex items-center justify-center`}>
                  <step.icon className={`w-8 h-8 text-${step.color}-600 dark:text-${step.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <EnquiryForm />
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900/20 dark:to-teal-900/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Why Choose Us?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Expert Team',
                description: 'Work with experienced developers who understand your needs',
              },
              {
                title: 'Quality Assurance',
                description: 'Every project goes through rigorous testing and quality checks',
              },
              {
                title: 'Timely Delivery',
                description: 'We respect deadlines and deliver projects on time',
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-slate-700"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default EnquiryPage;
