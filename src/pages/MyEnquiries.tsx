import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Calendar,
  Clock,
  DollarSign,
  Code,
  MessageSquare,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { getUserEnquiries } from '../services/enquiries.service';
import toast from 'react-hot-toast';

interface Enquiry {
  id: string;
  user_id: string;
  project_title: string;
  project_description: string;
  budget_range: string | null;
  timeline: string | null;
  tech_preferences: string[];
  additional_requirements: string | null;
  status: 'pending' | 'reviewing' | 'contacted' | 'closed';
  created_at: string;
  updated_at: string;
}

const STATUS_CONFIG = {
  pending: { 
    label: 'Pending', 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    description: 'Your enquiry is waiting to be reviewed'
  },
  reviewing: { 
    label: 'Under Review', 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    description: 'We are reviewing your project requirements'
  },
  contacted: { 
    label: 'Contacted', 
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
    description: 'We have reached out to you regarding this enquiry'
  },
  closed: { 
    label: 'Closed', 
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    description: 'This enquiry has been completed or closed'
  },
};

const MyEnquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const data = await getUserEnquiries();
      setEnquiries(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch your enquiries');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const config = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
    return (
      <div className="flex flex-col items-start gap-1">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
          {config.label}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {config.description}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 dark:from-blue-500 dark:to-teal-500 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                My Project Enquiries
              </h1>
              <p className="text-blue-100 dark:text-blue-200 text-sm sm:text-base">
                Track the status of your project requests
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-slate-700">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{enquiries.length}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-slate-700">
            <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {enquiries.filter(e => e.status === 'pending').length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-slate-700">
            <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Reviewing</p>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {enquiries.filter(e => e.status === 'reviewing').length}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-slate-700">
            <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Contacted</p>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {enquiries.filter(e => e.status === 'contacted').length}
            </p>
          </div>
        </div>

        {/* Enquiries List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-12 shadow-lg border border-gray-100 dark:border-slate-700 text-center">
            <FileText className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Enquiries Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You haven't submitted any project enquiries yet.
            </p>
            <a
              href="/submit-project"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all"
            >
              <FileText className="w-5 h-5" />
              Submit New Enquiry
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {enquiries.map((enquiry) => (
              <div
                key={enquiry.id}
                className="bg-white dark:bg-slate-900 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Main Content */}
                  <div className="flex-1 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {enquiry.project_title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {enquiry.project_description}
                        </p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                      {enquiry.budget_range && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {enquiry.budget_range}
                            </p>
                          </div>
                        </div>
                      )}
                      {enquiry.timeline && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Timeline</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {enquiry.timeline}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Submitted</p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(enquiry.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Tech Stack */}
                    {enquiry.tech_preferences.length > 0 && (
                      <div className="flex items-start gap-2">
                        <Code className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-1" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Tech Preferences</p>
                          <div className="flex flex-wrap gap-2">
                            {enquiry.tech_preferences.map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Additional Requirements */}
                    {enquiry.additional_requirements && (
                      <div className="flex items-start gap-2">
                        <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-1" />
                        <div className="flex-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Additional Requirements</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {enquiry.additional_requirements}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="lg:w-48 flex flex-col justify-between">
                    {getStatusBadge(enquiry.status)}
                    
                    {enquiry.status === 'pending' && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                          <p className="text-xs text-blue-700 dark:text-blue-300">
                            We'll review your enquiry and get back to you soon!
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {enquiry.status === 'contacted' && (
                      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-purple-600 dark:text-purple-400 mt-0.5" />
                          <p className="text-xs text-purple-700 dark:text-purple-300">
                            Check your email for our response!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                About Your Enquiries
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Once you submit an enquiry, our team will review it and contact you via email or phone. 
                You can track the status of your enquiries here. If you have any questions, feel free to reach out to us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEnquiries;
