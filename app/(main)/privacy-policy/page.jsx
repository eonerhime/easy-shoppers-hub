"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function PrivacyPolicy() {
  const router = useRouter();
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Introduction
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to Easy Shoppers Hub. We respect your privacy and are
            committed to protecting your personal data. This privacy policy
            explains how we collect, use, and protect your information when you
            use our e-commerce platform and services, including when you sign in
            using Facebook Login.
          </p>
        </section>

        {/* Information We Collect */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Information We Collect
          </h2>

          <h3 className="text-xl font-medium text-gray-800 mb-3">
            Information You Provide Directly
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>
              Account registration information (name, email address, phone
              number)
            </li>
            <li>Shipping and billing addresses</li>
            <li>
              Payment information (processed securely by third-party payment
              processors)
            </li>
            <li>Order history and preferences</li>
            <li>Reviews and ratings you submit</li>
            <li>Communications with our customer service team</li>
          </ul>

          <h3 className="text-xl font-medium text-gray-800 mb-3">
            Information from Social Login (Facebook & Google)
          </h3>
          <p className="text-gray-700 mb-2">
            When you choose to sign in with Facebook or Google, we may collect:
          </p>

          <div className="mb-4">
            <p className="font-medium text-gray-800 mb-2">From Facebook:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>
                Your Facebook profile information (name, email address, profile
                picture)
              </li>
              <li>Your Facebook user ID</li>
              <li>
                Any other information you've made publicly available on Facebook
              </li>
            </ul>
          </div>

          <div className="mb-4">
            <p className="font-medium text-gray-800 mb-2">From Google:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
              <li>
                Your Google profile information (name, email address, profile
                picture)
              </li>
              <li>Your Google account ID</li>
              <li>Basic account information from your Google profile</li>
            </ul>
          </div>

          <p className="text-gray-700 text-sm italic">
            Note: We only access information that you have granted permission
            for during the social login process.
          </p>

          <h3 className="text-xl font-medium text-gray-800 mb-3">
            Automatically Collected Information
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              Device information (IP address, browser type, operating system)
            </li>
            <li>Usage data (pages visited, time spent on site, clicks)</li>
            <li>Cookies and similar tracking technologies</li>
            <li>Location data (if you enable location services)</li>
          </ul>
        </section>

        {/* How We Use Your Information */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How We Use Your Information
          </h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Process and fulfill your orders</li>
            <li>Provide customer service and support</li>
            <li>Send order confirmations and shipping notifications</li>
            <li>Personalize your shopping experience</li>
            <li>Improve our website and services</li>
            <li>Send promotional emails (with your consent)</li>
            <li>Prevent fraud and ensure security</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        {/* Social Login Information */}
        <section className="bg-gradient-to-r from-blue-50 to-red-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Social Login Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Facebook Section */}
            <div className="bg-white p-4 rounded-lg border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="#1877F2"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook Login
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>What we access:</strong> Basic profile information
                  that you explicitly grant us permission to access.
                </p>
                <p>
                  <strong>Purpose:</strong> Convenient account creation and
                  authentication without creating a new password.
                </p>
                <p>
                  <strong>Data usage:</strong> Account creation and
                  authentication only. We do not post to your Facebook account.
                </p>
                <p>
                  <strong>Your control:</strong> Revoke access anytime through
                  Facebook Settings → Apps and Websites.
                </p>
              </div>
            </div>

            {/* Google Section */}
            <div className="bg-white p-4 rounded-lg border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google Login
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>
                  <strong>What we access:</strong> Basic profile information
                  (name, email, profile picture) with your consent.
                </p>
                <p>
                  <strong>Purpose:</strong> Streamlined account creation and
                  secure authentication process.
                </p>
                <p>
                  <strong>Data usage:</strong> Account management and
                  personalization. We do not access your Google services data.
                </p>
                <p>
                  <strong>Your control:</strong> Manage permissions through
                  Google Account Settings → Security → Third-party apps.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Important:</strong> Both Facebook and Google logins use
              industry-standard OAuth 2.0 protocol for secure authentication. We
              never store your social media passwords and cannot access your
              private messages or post on your behalf without explicit
              permission.
            </p>
          </div>
        </section>

        {/* Information Sharing */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            How We Share Your Information
          </h2>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or rent your personal information. We may
            share your information in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong>Service Providers:</strong> Third-party companies that
              help us operate our business (payment processors, shipping
              companies, email services)
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to
              protect our rights and safety
            </li>
            <li>
              <strong>Business Transfers:</strong> In the event of a merger,
              acquisition, or sale of assets
            </li>
            <li>
              <strong>With Your Consent:</strong> Any other sharing with your
              explicit permission
            </li>
          </ul>
        </section>

        {/* Data Security */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Data Security
          </h2>
          <p className="text-gray-700 mb-4">
            We implement appropriate security measures to protect your personal
            information:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>SSL encryption for data transmission</li>
            <li>Secure servers and databases</li>
            <li>Regular security audits and updates</li>
            <li>Access restrictions for employee data handling</li>
            <li>
              Secure authentication through trusted providers like Facebook and
              Google
            </li>
          </ul>
        </section>

        {/* Your Rights */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your Rights and Choices
          </h2>
          <p className="text-gray-700 mb-4">
            You have the following rights regarding your personal information:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>
              <strong>Access:</strong> Request a copy of the personal
              information we hold about you
            </li>
            <li>
              <strong>Correction:</strong> Update or correct your personal
              information
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your personal
              information
            </li>
            <li>
              <strong>Opt-out:</strong> Unsubscribe from marketing
              communications
            </li>
            <li>
              <strong>Data Portability:</strong> Request your data in a portable
              format
            </li>
            <li>
              <strong>Social Login Data:</strong> Manage your Facebook and
              Google login permissions through their respective account settings
            </li>
          </ul>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Cookies and Tracking
          </h2>
          <p className="text-gray-700 mb-4">
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Remember your preferences and login status</li>
            <li>Analyze website traffic and usage patterns</li>
            <li>Provide personalized content and advertisements</li>
            <li>Ensure website security and prevent fraud</li>
          </ul>
          <p className="text-gray-700 mt-4">
            You can control cookies through your browser settings, but some
            features may not work properly if cookies are disabled.
          </p>
        </section>

        {/* Data Retention */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Data Retention
          </h2>
          <p className="text-gray-700">
            We retain your personal information for as long as necessary to
            provide our services, comply with legal obligations, resolve
            disputes, and enforce our agreements. When you delete your account,
            we will delete or anonymize your personal information, except where
            we are required to retain it by law.
          </p>
        </section>

        {/* Children's Privacy */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Children's Privacy
          </h2>
          <p className="text-gray-700">
            Easy Shoppers Hub is not intended for children under 13 years of
            age. We do not knowingly collect personal information from children
            under 13. If you believe we have collected information from a child
            under 13, please contact us immediately.
          </p>
        </section>

        {/* Changes to Policy */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Changes to This Privacy Policy
          </h2>
          <p className="text-gray-700">
            We may update this privacy policy from time to time. We will notify
            you of any material changes by posting the new privacy policy on
            this page and updating the "Last updated" date. Your continued use
            of our services after any changes constitutes acceptance of the
            updated policy.
          </p>
        </section>

        {/* Contact Information */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Contact Us
          </h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about this privacy policy or our data
            practices, please contact us:
          </p>
          <div className="text-gray-700 space-y-2">
            <p>
              <strong>Email:</strong> privacy@easyshoppershub.com
            </p>
            <p>
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
            <p>
              <strong>Address:</strong> Easy Shoppers Hub Privacy Team
              <br />
              123 Commerce Street
              <br />
              Shopping City, SC 12345
              <br />
              United States
            </p>
          </div>
        </section>

        {/* Social Media Links */}
        <section className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-800 mb-4">
            Additional Social Media Resources
          </h3>

          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            {/* Facebook Resources */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="#1877F2"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook Resources
              </h4>
              <div className="space-y-2">
                <p>
                  <strong>Facebook Privacy Policy:</strong>
                  <a
                    href="https://www.facebook.com/privacy/policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    facebook.com/privacy/policy
                  </a>
                </p>
                <p>
                  <strong>Manage App Permissions:</strong>
                  <a
                    href="https://www.facebook.com/settings?tab=applications"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Facebook Settings → Apps and Websites
                  </a>
                </p>
              </div>
            </div>

            {/* Google Resources */}
            <div>
              <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google Resources
              </h4>
              <div className="space-y-2">
                <p>
                  <strong>Google Privacy Policy:</strong>
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    policies.google.com/privacy
                  </a>
                </p>
                <p>
                  <strong>Manage App Permissions:</strong>
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    Google Account → Security → Third-party apps
                  </a>
                </p>
                <p>
                  <strong>Google Account Controls:</strong>
                  <a
                    href="https://myaccount.google.com/data-and-privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline ml-1"
                  >
                    myaccount.google.com/data-and-privacy
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
