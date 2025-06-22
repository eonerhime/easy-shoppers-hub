"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Shield,
  AlertTriangle,
  Clock,
  User,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";

const TermsOfService = () => {
  const [expandedSections, setExpandedSections] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const sections = [
    {
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <Shield className="w-5 h-5" />,
      content: `By accessing and using this service, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
    },
    {
      id: "description",
      title: "Service Description",
      icon: <User className="w-5 h-5" />,
      content: `Our service provides [describe your service here]. We reserve the right to modify, suspend, or discontinue any part of our service at any time without notice.`,
    },
    {
      id: "user-conduct",
      title: "User Conduct",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `You agree not to use the service to: (a) upload, post, or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable; (b) impersonate any person or entity; (c) interfere with or disrupt the service or servers connected to the service.`,
    },
    {
      id: "privacy",
      title: "Privacy Policy",
      icon: <Shield className="w-5 h-5" />,
      content: `Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection and use of your personal information.`,
    },
    {
      id: "intellectual-property",
      title: "Intellectual Property",
      icon: <User className="w-5 h-5" />,
      content: `The service and its original content, features, and functionality are and will remain the exclusive property of [Company Name] and its licensors. The service is protected by copyright, trademark, and other laws.`,
    },
    {
      id: "termination",
      title: "Termination",
      icon: <Clock className="w-5 h-5" />,
      content: `We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever including without limitation if you breach the Terms.`,
    },
    {
      id: "disclaimer",
      title: "Disclaimer",
      icon: <AlertTriangle className="w-5 h-5" />,
      content: `The information on this service is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms.`,
    },
    {
      id: "limitation",
      title: "Limitation of Liability",
      icon: <Shield className="w-5 h-5" />,
      content: `In no event shall [Company Name], nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, punitive, consequential, or special damages.`,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Back button to previous page */}
      <button
        className="mb-8 flex items-center text-purple-500 hover:text-purple-600 transition-colors duration-300 cursor-pointer"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back
      </button>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-600 text-lg">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <div className="w-24 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
      </div>

      {/* Introduction */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
        <h2 className="text-xl font-semibold text-blue-900 mb-3">
          Welcome to Our Service
        </h2>
        <p className="text-blue-800 leading-relaxed">
          These Terms of Service govern your use of our website and services.
          Please read them carefully as they contain important information about
          your rights and obligations, as well as limitations and exclusions
          that may apply to you.
        </p>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-4 mb-8">
        {sections.map((section) => (
          <div
            key={section.id}
            className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full px-6 py-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="text-blue-600">{section.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h3>
              </div>
              <div className="text-gray-500">
                {expandedSections[section.id] ? (
                  <ChevronDown className="w-5 h-5" />
                ) : (
                  <ChevronRight className="w-5 h-5" />
                )}
              </div>
            </button>

            {expandedSections[section.id] && (
              <div className="px-6 py-4 bg-white border-t border-gray-100">
                <p className="text-gray-700 leading-relaxed">
                  {section.content}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Additional Legal Information */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Additional Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Governing Law</h4>
            <p>
              These Terms shall be interpreted and governed by the laws of [Your
              Jurisdiction].
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Contact Information
            </h4>
            <p>
              For questions about these Terms, please contact us at
              [your-email@company.com].
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">
              Changes to Terms
            </h4>
            <p>
              We reserve the right to modify these terms at any time. Changes
              will be effective immediately upon posting.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Severability</h4>
            <p>
              If any provision is deemed unenforceable, the remainder of these
              Terms will remain in effect.
            </p>
          </div>
        </div>
      </div>

      {/* Acceptance Checkbox */}
      <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="accept-terms"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label
            htmlFor="accept-terms"
            className="text-gray-700 leading-relaxed"
          >
            I have read, understood, and agree to be bound by these Terms of
            Service. I acknowledge that these terms constitute a legally binding
            agreement between myself and the service provider.
          </label>
        </div>

        <div className="mt-6 flex space-x-4">
          <button
            disabled={!acceptedTerms}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              acceptedTerms
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Accept Terms
          </button>
          <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
            Decline
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          © {new Date().getFullYear()} [Your Company Name]. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
