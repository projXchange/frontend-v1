import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Filter, 
  Mail, 
  Phone, 
  User, 
  Calendar,
  Clock,
  DollarSign,
  Code,
  MessageSquare,
  CheckCircle,
  XCircle,
  Eye,
  Loader2
} from 'lucide-react';
import { getAllEnquiries, updateEnquiryStatus } from '../../services/enquiries.service';
import toast from 'react-hot-toast';

interface AdminEnquiry {
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
  user_full_name: string | null;
  user_email: string;
  user_phone_number: string | null;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' },
  { value: 'reviewing', label: 'Reviewing', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  { value: 'contacted', label: 'Contacted', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' },
];

const EnquiryManagement: React.FC = () => {
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState<AdminEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdminEnquiry | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    if (statusFilter) {
      setFilteredEnquiries(enquiries.filter(e => e.status === statusFilter));
    } else {
      setFilteredEnquiries(enquiries);
    }
  }, [statusFilter, enquiries]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const data = await getAllEnquiries();
      setEnquiries(data);
      setFilteredEnquiries(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch enquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (enquiryId: string, newStatus: string) => {
    try {
      setUpdatingStatus(enquiryId);
      await updateEnquiryStatus(enquiryId, newStatus);
      toast.success('Status updated successfully');
      
      // Update local state
      setEnquiries(prev => 
        prev.map(e => e.id === enquiryId ? { ...e, status: newStatus as any } : e)
      );
      
      if (selectedEnquiry?.id === enquiryId) {
        setSelectedEnquiry(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(s => s.value === status);
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusOption?.color || 'bg-gray-100 text-gray-800'}`}>
        {statusOption?.label || status}
      </span>
    );
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

  const stats = {
    total: enquiries.length,
    pending: enquiries.filter(e => e.status === 'pending').length,
    reviewing: enquiries.filter(e => e.status === 'reviewing').length,
    contacted: enquiries.filter(e => e.status === 'contacted').length,
    closed: enquiries.filter(e => e.status === 'closed').length,
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Project Enquiries
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Manage and respond to project enquiry requests
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-slate-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-slate-700">
          <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-slate-700">
          <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Reviewing</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.reviewing}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-slate-700">
          <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">Contacted</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.contacted}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-slate-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Closed</p>
          <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.closed}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-lg border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Enquiries List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      ) : filteredEnquiries.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-slate-700 text-center">
          <FileText className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No enquiries found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredEnquiries.map((enquiry) => (
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
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {enquiry.project_title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {enquiry.project_description}
                      </p>
                    </div>
                    {getStatusBadge(enquiry.status)}
                  </div>

                  {/* User Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white font-medium">
                        {enquiry.user_full_name || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <a 
                        href={`mailto:${enquiry.user_email}`}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {enquiry.user_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-sm text-gray-900 dark:text-white">
                        {enquiry.user_phone_number || 'N/A'}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {enquiry.budget_range && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {enquiry.budget_range}
                        </span>
                      </div>
                    )}
                    {enquiry.timeline && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {enquiry.timeline}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 col-span-2">
                      <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {formatDate(enquiry.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Tech Stack */}
                  {enquiry.tech_preferences.length > 0 && (
                    <div className="flex items-start gap-2">
                      <Code className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-1" />
                      <div className="flex flex-wrap gap-2">
                        {enquiry.tech_preferences.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Additional Requirements */}
                  {enquiry.additional_requirements && (
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-1" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                        {enquiry.additional_requirements}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="lg:w-48 flex lg:flex-col gap-2">
                  <button
                    onClick={() => setSelectedEnquiry(enquiry)}
                    className="flex-1 lg:flex-none px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  
                  <select
                    value={enquiry.status}
                    onChange={(e) => handleStatusUpdate(enquiry.id, e.target.value)}
                    disabled={updatingStatus === enquiry.id}
                    className="flex-1 lg:flex-none px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.filter(s => s.value).map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Enquiry Details
                </h2>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Project Title</label>
                  <p className="text-lg text-gray-900 dark:text-white">{selectedEnquiry.project_title}</p>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Description</label>
                  <p className="text-gray-900 dark:text-white">{selectedEnquiry.project_description}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Budget Range</label>
                    <p className="text-gray-900 dark:text-white">{selectedEnquiry.budget_range || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Timeline</label>
                    <p className="text-gray-900 dark:text-white">{selectedEnquiry.timeline || 'Not specified'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Tech Preferences</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedEnquiry.tech_preferences.length > 0 ? (
                      selectedEnquiry.tech_preferences.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">None specified</p>
                    )}
                  </div>
                </div>

                {selectedEnquiry.additional_requirements && (
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Additional Requirements</label>
                    <p className="text-gray-900 dark:text-white">{selectedEnquiry.additional_requirements}</p>
                  </div>
                )}

                <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                  <label className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 block">User Information</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedEnquiry.user_full_name || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <a href={`mailto:${selectedEnquiry.user_email}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                        {selectedEnquiry.user_email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{selectedEnquiry.user_phone_number || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Status</label>
                    <div className="mt-1">{getStatusBadge(selectedEnquiry.status)}</div>
                  </div>
                  <div className="text-right">
                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Submitted</label>
                    <p className="text-sm text-gray-900 dark:text-white">{formatDate(selectedEnquiry.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryManagement;
