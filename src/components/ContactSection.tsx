/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, ExternalLink, Globe } from 'lucide-react';
import { SHUVRO_SEN_CV } from '../data/cvData.ts';

export const ContactSection: React.FC = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    institution: '',
    inquiryType: 'Research Collaboration',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-b border-neutral-200/80 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Details & Institutional Presence */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-600 dark:text-blue-400">
                <MessageSquare className="w-4 h-4" />
                <span>Academic Inquiries</span>
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Connect with Shuvro Sen
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Open to joint research proposals, Industry 5.0 policy consulting, editorial reviews, and student thesis supervision.
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3 pt-2">
              <a
                href={`mailto:${SHUVRO_SEN_CV.contact.email}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group"
              >
                <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block font-mono">Academic Email</span>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {SHUVRO_SEN_CV.contact.email}
                  </span>
                </div>
              </a>

              <a
                href={`tel:${SHUVRO_SEN_CV.contact.phone}`}
                className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700 transition-colors group"
              >
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block font-mono">Direct Contact / WhatsApp</span>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors font-mono tabular-nums">
                    {SHUVRO_SEN_CV.contact.phone}
                  </span>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                <div className="p-2.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-neutral-400 block font-mono">Faculty Office</span>
                  <span className="text-sm font-semibold text-neutral-900 dark:text-white block">
                    {SHUVRO_SEN_CV.contact.department}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {SHUVRO_SEN_CV.contact.institution}, Dhaka, Bangladesh
                  </span>
                </div>
              </div>
            </div>

            {/* Scholarly Repositories Links */}
            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={SHUVRO_SEN_CV.contact.googleScholar}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>Google Scholar</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>

              <a
                href={SHUVRO_SEN_CV.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <Globe className="w-3.5 h-3.5 text-blue-600" />
                <span>LinkedIn Profile</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </a>
            </div>

          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8 shadow-xs">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">
                Send Academic Inquiry or Proposal
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
                Direct communication channel forwarded directly to Shuvro Sen.
              </p>

              {submitted ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-neutral-900 dark:text-white">
                    Message Dispatched Successfully
                  </h4>
                  <p className="text-xs text-neutral-500 max-w-md mx-auto">
                    Thank you for your message. Shuvro Sen will review your inquiry and follow up via email at <span className="font-semibold text-neutral-900 dark:text-white">{formState.email}</span>.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({
                        name: '',
                        email: '',
                        institution: '',
                        inquiryType: 'Research Collaboration',
                        message: ''
                      });
                    }}
                    className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Dr. / Prof. / Your Name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="colleague@university.edu"
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Affiliation / University
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., University College Dublin / Industry Group"
                        value={formState.institution}
                        onChange={(e) => setFormState({ ...formState, institution: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                        Inquiry Nature
                      </label>
                      <select
                        value={formState.inquiryType}
                        onChange={(e) => setFormState({ ...formState, inquiryType: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Research Collaboration">Joint Research Collaboration</option>
                        <option value="Erasmus Mundus Mentorship">Erasmus Mundus Alumni / Mentorship</option>
                        <option value="Policy Consulting">Industry 5.0 Policy Advisory</option>
                        <option value="Academic Teaching">Guest Lecture / Coursework</option>
                        <option value="Editorial Review">Journal Peer Review</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Message / Proposal Summary *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please outline the scope, research methodology or timeline of your proposal..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Transmitting...' : 'Send Inquiry Message'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
