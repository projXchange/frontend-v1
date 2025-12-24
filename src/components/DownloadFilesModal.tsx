import type React from "react"
import { X, Download, FileText, Package } from 'lucide-react'

interface FileItem {
  url: string
  name?: string
}

interface DownloadFilesModalProps {
  isOpen: boolean
  onClose: () => void
  sourceFiles?: FileItem[] | string[]
  documentationFiles?: FileItem[] | string[]
  onDownload: (fileUrl: string, fileName: string) => Promise<void>
  isDownloading?: boolean
}

export const DownloadFilesModal: React.FC<DownloadFilesModalProps> = ({
  isOpen,
  onClose,
  sourceFiles = [],
  documentationFiles = [],
  onDownload,
  isDownloading = false,
}) => {
  if (!isOpen) return null

  const normalizeFiles = (files: (FileItem | string)[]): FileItem[] => {
    return files.map(file => 
      typeof file === 'string' ? { url: file } : file
    )
  }

  const normalizedSourceFiles = normalizeFiles(sourceFiles as (FileItem | string)[])
  const normalizedDocFiles = normalizeFiles(documentationFiles as (FileItem | string)[])

  const handleDownloadClick = async (fileUrl: string, fileName: string) => {
    try {
      await onDownload(fileUrl, fileName)
    } catch (error) {
      console.error("Download error:", error)
    }
  }

  const hasFiles = normalizedSourceFiles.length > 0 || normalizedDocFiles.length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 pt-24 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-slate-700 animate-slideInUp transform transition-all duration-500 scrollbar-hide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="download-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 px-6 py-6 flex items-center justify-between z-10">
          <div>
            <h2 id="download-modal-title" className="text-2xl font-bold text-gray-900 dark:text-white">
              Download Files
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {normalizedSourceFiles.length + normalizedDocFiles.length} file{normalizedSourceFiles.length + normalizedDocFiles.length === 1 ? "" : "s"} available
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex-shrink-0 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-8">
          {!hasFiles ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Files Available</h3>
              <p className="text-gray-600 dark:text-gray-400">There are no files available for download at the moment.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Source Files Section */}
              {normalizedSourceFiles.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Source Code</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Project source files and code</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {normalizedSourceFiles.map((file, index) => (
                      <button
                        key={`source-${index}`}
                        onClick={() => handleDownloadClick(file.url, `source-code-${index + 1}.zip`)}
                        disabled={isDownloading}
                        className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-md hover:scale-[1.02] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 dark:group-hover:bg-green-900/60 transition-colors">
                          <Download className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">Source Code {index + 1}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Click to download</p>
                        </div>
                        <div className="text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform flex-shrink-0">
                          <Download className="w-4 h-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Documentation Files Section */}
              {normalizedDocFiles.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Documentation</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Setup guides and references</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {normalizedDocFiles.map((file, index) => (
                      <button
                        key={`doc-${index}`}
                        onClick={() => handleDownloadClick(file.url, `documentation-${index + 1}.pdf`)}
                        disabled={isDownloading}
                        className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md hover:scale-[1.02] transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/60 transition-colors">
                          <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate">Documentation {index + 1}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Click to download</p>
                        </div>
                        <div className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform flex-shrink-0">
                          <Download className="w-4 h-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-slate-700 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes slideInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slideInUp { animation: slideInUp 0.3s cubic-bezier(.4,0,.2,1) both; }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  )
}
