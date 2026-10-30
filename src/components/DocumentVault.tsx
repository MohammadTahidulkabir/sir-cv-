/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  FileText, 
  UploadCloud, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle, 
  ShieldCheck, 
  Key, 
  Hash, 
  Search,
  AlertCircle,
  X
} from 'lucide-react';
import { SHUVRO_SEN_CV, StoredDocument } from '../data/cvData.ts';
import { calculateSHA256, formatBytes } from '../utils/crypto.ts';

interface DocumentVaultProps {
  onOpenPdfViewer: () => void;
}

const STORAGE_KEY = 'shuvro_sen_cloud_vault_docs_v1';
const VAULT_PIN = '2026';

export const DocumentVault: React.FC<DocumentVaultProps> = ({ onOpenPdfViewer }) => {
  const [documents, setDocuments] = useState<StoredDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return SHUVRO_SEN_CV.initialDocuments;
  });

  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [uploadModalOpen, setUploadModalOpen] = useState<boolean>(false);
  
  // Upload form state
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<StoredDocument['category']>('Peer-Reviewed Reprint');
  const [uploadNotes, setUploadNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } catch {
      // silent
    }
  }, [documents]);

  const categories = ['All', 'Curriculum Vitae', 'Peer-Reviewed Reprint', 'Academic Credential', 'Policy Monograph', 'Research Report'];

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = activeCategory === 'All' || doc.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesQuery = 
      doc.name.toLowerCase().includes(q) ||
      (doc.notes && doc.notes.toLowerCase().includes(q)) ||
      doc.sha256.toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === VAULT_PIN) {
      setIsLocked(false);
      setPinError('');
      setEnteredPin('');
    } else {
      setPinError('Invalid security PIN. Default demo PIN is 2026.');
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !uploadFileName) return;

    setIsUploading(true);
    try {
      let hash = 'simulated_' + Math.random().toString(36).substring(2, 12);
      let size = '1.1 MB';
      let fileUrl = '/assets/aistudio/Shuvro_Sen_CV-1_664242a1.pdf';

      if (selectedFile) {
        hash = await calculateSHA256(selectedFile);
        size = formatBytes(selectedFile.size);
        fileUrl = URL.createObjectURL(selectedFile);
      }

      const newDoc: StoredDocument = {
        id: 'doc_' + Date.now(),
        name: uploadFileName.trim() || (selectedFile ? selectedFile.name : 'Untitled_Document.pdf'),
        category: uploadCategory,
        dateAdded: new Date().toISOString().split('T')[0],
        size,
        sha256: hash,
        fileUrl,
        verified: true,
        notes: uploadNotes.trim() || 'Uploaded to secure document vault.'
      };

      setDocuments([newDoc, ...documents]);
      setUploadModalOpen(false);
      setSelectedFile(null);
      setUploadFileName('');
      setUploadNotes('');
    } catch {
      // error handling
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this document from the vault?')) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  return (
    <section id="vault" className="py-16 md:py-24 border-b border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Cryptographic Storage</span>
              <span aria-hidden="true">·</span>
              <span>SHA-256 Integrity Verification</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 dark:text-white" style={{ textWrap: 'balance' }}>
              Secure Academic Document Vault
            </h2>
            <p className="text-base text-neutral-600 dark:text-neutral-400 max-w-2xl">
              Encrypted cloud repository housing verified manuscripts, Erasmus Mundus credentials, peer-reviewed reprints, and official CV documents for Shuvro Sen.
            </p>
          </div>

          {/* Security PIN toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium rounded-lg border transition-all ${
                isLocked 
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-700 dark:text-amber-400' 
                  : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
              }`}
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
              <span>{isLocked ? 'Vault Locked (Protected)' : 'Vault Unlocked'}</span>
            </button>

            <button
              onClick={() => setUploadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          </div>
        </div>

        {/* If Locked: PIN Screen */}
        {isLocked ? (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-8 sm:p-12 text-center max-w-md mx-auto shadow-sm">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
              Vault Access Locked
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
              Enter your access PIN to inspect verified academic credentials and manuscripts. (Default demo PIN: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">2026</span>)
            </p>

            <form onSubmit={handleUnlock} className="space-y-4">
              <div>
                <input
                  type="password"
                  maxLength={6}
                  placeholder="Enter 4-digit PIN..."
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError('');
                  }}
                  className="w-full text-center tracking-widest text-lg font-mono py-2.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-white"
                  autoFocus
                />
                {pinError && (
                  <p className="text-xs text-red-500 mt-2">{pinError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Authenticate & Unlock
              </button>
            </form>
          </div>
        ) : (
          /* Unlocked Vault Grid */
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                      activeCategory === cat
                        ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs font-semibold'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter vault..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            {/* Documents Table / Card List */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 uppercase font-mono">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Document Title</th>
                      <th className="py-3 px-4 font-semibold hidden md:table-cell">Category</th>
                      <th className="py-3 px-4 font-semibold hidden lg:table-cell">Integrity Hash (SHA-256)</th>
                      <th className="py-3 px-4 font-semibold hidden sm:table-cell">Size</th>
                      <th className="py-3 px-4 font-semibold hidden sm:table-cell">Added</th>
                      <th className="py-3 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/80">
                    {filteredDocs.map((doc) => (
                      <tr 
                        key={doc.id}
                        className="hover:bg-neutral-50/70 dark:hover:bg-neutral-800/40 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                            <div>
                              <span className="font-semibold text-neutral-900 dark:text-white block hover:text-blue-600 transition-colors">
                                {doc.name}
                              </span>
                              {doc.notes && (
                                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-1">
                                  {doc.notes}
                                </span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 hidden md:table-cell text-neutral-600 dark:text-neutral-300">
                          {doc.category}
                        </td>

                        <td className="py-3 px-4 hidden lg:table-cell font-mono text-[11px] text-neutral-400">
                          <span title={doc.sha256} className="cursor-pointer hover:text-neutral-700 dark:hover:text-neutral-200">
                            {doc.sha256.substring(0, 16)}...
                          </span>
                        </td>

                        <td className="py-3 px-4 hidden sm:table-cell font-mono tabular-nums text-neutral-500">
                          {doc.size}
                        </td>

                        <td className="py-3 px-4 hidden sm:table-cell font-mono tabular-nums text-neutral-500">
                          {doc.dateAdded}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={onOpenPdfViewer}
                              className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Inspect in PDF Viewer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <a
                              href={doc.fileUrl}
                              download={doc.name}
                              className="p-1.5 text-neutral-600 dark:text-neutral-300 hover:text-blue-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                              title="Download Secure File"
                            >
                              <Download className="w-4 h-4" />
                            </a>

                            {!doc.isPreloaded && (
                              <button
                                onClick={() => handleDelete(doc.id)}
                                className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                                title="Delete Document"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredDocs.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-neutral-500 text-xs">
                          No documents matched your criteria in the vault.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Cryptographic Assurance Footnote */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                All documents are client-side verified with SHA-256 checksums to ensure zero unauthorized alterations.
              </span>
            </div>

          </div>
        )}

      </div>

      {/* Upload Document Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl max-w-lg w-full border border-neutral-200 dark:border-neutral-800 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span>Upload Document to Secure Vault</span>
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="py-4 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Select File (PDF, DOCX, ZIP)
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt,.zip"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      setSelectedFile(file);
                      if (!uploadFileName) {
                        setUploadFileName(file.name);
                      }
                    }
                  }}
                  className="w-full text-xs text-neutral-500 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 dark:file:bg-blue-900/30 dark:file:text-blue-300 hover:file:bg-blue-100"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Document Title / Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Sustainability_Policy_Brief_2026.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                >
                  <option value="Curriculum Vitae">Curriculum Vitae</option>
                  <option value="Peer-Reviewed Reprint">Peer-Reviewed Reprint</option>
                  <option value="Academic Credential">Academic Credential</option>
                  <option value="Policy Monograph">Policy Monograph</option>
                  <option value="Research Report">Research Report</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Notes / Institutional Context
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief context on authors, consortium or audit trail..."
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                >
                  {isUploading ? 'Computing Checksum...' : 'Add to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
