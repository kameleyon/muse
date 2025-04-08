import React from 'react';
import '../../styles/modal.css'; // Import custom modal styles using relative path
import '../../styles/index.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/Dialog";

interface CookiePolicyModalProps {
  trigger: React.ReactNode; // Allow custom trigger elements
}

const CookiePolicyModal: React.FC<CookiePolicyModalProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <div className="scrollbar-wrapper">
        <DialogContent className="max-w-[92%] w-[600px] sm:max-w-[600px] max-h-[75vh] flex flex-col ">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-6xl tracking-tight leading-tight font-bold text-[#1a1918] font-heading">
              Cookie <p>Policy</p>
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Last Updated: April 7, 2025</p> {/* Updated Date */}
          </DialogHeader>
          <div
            className="overflow-y-auto px-6 pb-2 text-[#3d3d3a] flex-grow modal-scrollable-content rounded-scrollbar font-body text-sm"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)'
            }}
          >
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">1. Introduction</h2>
              <p className="mb-3 break-words">
                Welcome to MagicMuse ("we," "our," or "us"). This Cookies Policy explains how MagicMuse uses cookies and similar technologies to recognize you when you visit our website and application at <a href="https://www.magicmuse.io" target="_blank" rel="noopener noreferrer" className="text-[#ae5630] hover:underline">www.magicmuse.io</a> ("Platform"). It explains what these technologies are and why we use them, as well as your rights to control our use of them.
              </p>
              <p className="mb-3 break-words">
                This Cookies Policy should be read together with our Privacy Policy and Terms of Service. By using our Platform, you are agreeing to the use of cookies as described in this policy.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">2. What Are Cookies?</h2>
              <p className="mb-3 break-words">
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
              <p className="mb-3 break-words">
                Cookies set by the website owner (in this case, MagicMuse) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics). The parties that set these third-party cookies can recognize your device both when it visits the website in question and also when it visits certain other websites.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">3. Why Do We Use Cookies?</h2>
              <p className="mb-3 break-words">
                We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our Platform to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our Platform and provide personalized content and features. Third parties serve cookies through our Platform for analytics, personalization, and marketing purposes.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">4. Types of Cookies We Use</h2>
              <p className="mb-4 break-words">The specific types of first and third-party cookies served through our Platform and the purposes they perform are described below:</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">4.1 Essential Cookies</h3>
              <p className="mb-3 break-words">These cookies are strictly necessary to provide you with services available through our Platform and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the Platform, you cannot refuse them without impacting how our Platform functions.</p>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Cookie Name</th>
                      <th className="border px-4 py-2 text-left">Provider</th>
                      <th className="border px-4 py-2 text-left">Purpose</th>
                      <th className="border px-4 py-2 text-left">Expiration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border px-4 py-2">session_id</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Authenticates users and maintains session state</td><td className="border px-4 py-2">Session</td></tr>
                    <tr><td className="border px-4 py-2">csrf_token</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Prevents cross-site request forgery attacks</td><td className="border px-4 py-2">Session</td></tr>
                    <tr><td className="border px-4 py-2">auth_token</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Maintains authenticated user status</td><td className="border px-4 py-2">30 days</td></tr>
                    <tr><td className="border px-4 py-2">preferences</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Stores user interface preferences</td><td className="border px-4 py-2">1 year</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-secondary">4.2 Performance and Analytics Cookies</h3>
              <p className="mb-3 break-words">These cookies collect information that is used either in aggregate form to help us understand how our Platform is being used or how effective our marketing campaigns are, or to help us customize our Platform for you to enhance your experience.</p>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Cookie Name</th>
                      <th className="border px-4 py-2 text-left">Provider</th>
                      <th className="border px-4 py-2 text-left">Purpose</th>
                      <th className="border px-4 py-2 text-left">Expiration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border px-4 py-2">_ga</td><td className="border px-4 py-2">Google Analytics</td><td className="border px-4 py-2">Registers a unique ID that is used to generate statistical data on how you use the Platform</td><td className="border px-4 py-2">2 years</td></tr>
                    <tr><td className="border px-4 py-2">_gid</td><td className="border px-4 py-2">Google Analytics</td><td className="border px-4 py-2">Registers a unique ID that is used to generate statistical data on how you use the Platform</td><td className="border px-4 py-2">24 hours</td></tr>
                    <tr><td className="border px-4 py-2">_gat</td><td className="border px-4 py-2">Google Analytics</td><td className="border px-4 py-2">Used to throttle request rate</td><td className="border px-4 py-2">1 minute</td></tr>
                    <tr><td className="border px-4 py-2">amplitude_id</td><td className="border px-4 py-2">Amplitude</td><td className="border px-4 py-2">Tracks user behavior to improve Platform experience</td><td className="border px-4 py-2">2 years</td></tr>
                    <tr><td className="border px-4 py-2">hotjar_id</td><td className="border px-4 py-2">Hotjar</td><td className="border px-4 py-2">Collects information about user behavior for heatmaps and recordings</td><td className="border px-4 py-2">1 year</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-secondary">4.3 Functional Cookies</h3>
              <p className="mb-3 break-words">These cookies enable the Platform to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our Platform. If you do not allow these cookies, then some or all of these services may not function properly.</p>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Cookie Name</th>
                      <th className="border px-4 py-2 text-left">Provider</th>
                      <th className="border px-4 py-2 text-left">Purpose</th>
                      <th className="border px-4 py-2 text-left">Expiration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border px-4 py-2">language</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Remembers language preference</td><td className="border px-4 py-2">1 year</td></tr>
                    <tr><td className="border px-4 py-2">ui_theme</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Stores user interface theme preference</td><td className="border px-4 py-2">1 year</td></tr>
                    <tr><td className="border px-4 py-2">recent_projects</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Tracks recently accessed projects for quick access</td><td className="border px-4 py-2">30 days</td></tr>
                    <tr><td className="border px-4 py-2">editor_settings</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Stores editor customization settings</td><td className="border px-4 py-2">1 year</td></tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold mb-2 text-secondary">4.4 Targeting and Advertising Cookies</h3>
              <p className="mb-3 break-words">These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.</p>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Cookie Name</th>
                      <th className="border px-4 py-2 text-left">Provider</th>
                      <th className="border px-4 py-2 text-left">Purpose</th>
                      <th className="border px-4 py-2 text-left">Expiration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border px-4 py-2">_fbp</td><td className="border px-4 py-2">Facebook</td><td className="border px-4 py-2">Used by Facebook to deliver advertisements</td><td className="border px-4 py-2">3 months</td></tr>
                    <tr><td className="border px-4 py-2">_gcl_au</td><td className="border px-4 py-2">Google</td><td className="border px-4 py-2">Used by Google AdSense for experimenting with advertisement efficiency</td><td className="border px-4 py-2">3 months</td></tr>
                    <tr><td className="border px-4 py-2">ads_prefs</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Stores advertising preferences</td><td className="border px-4 py-2">1 year</td></tr>
                    <tr><td className="border px-4 py-2">conversion_tracking</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Tracks conversion events</td><td className="border px-4 py-2">30 days</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">5. AI and Writing Assistant Technology Cookies</h2>
              <p className="mb-3 break-words">As an AI-powered writing platform, MagicMuse employs specialized cookies to enhance our core functionality in content generation, analysis, and personalization:</p>
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border border-gray-300 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border px-4 py-2 text-left">Cookie Name</th>
                      <th className="border px-4 py-2 text-left">Provider</th>
                      <th className="border px-4 py-2 text-left">Purpose</th>
                      <th className="border px-4 py-2 text-left">Expiration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="border px-4 py-2">ai_model_preference</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Stores your preferred AI model selection</td><td className="border px-4 py-2">1 year</td></tr>
                    <tr><td className="border px-4 py-2">content_history</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Maintains history of content interactions for improved suggestions</td><td className="border px-4 py-2">90 days</td></tr>
                    <tr><td className="border px-4 py-2">writing_style</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Remembers your writing style preferences for better AI assistance</td><td className="border px-4 py-2">1 year</td></tr>
                    <tr><td className="border px-4 py-2">prompt_history</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Tracks frequently used prompts to improve recommendations</td><td className="border px-4 py-2">60 days</td></tr>
                    <tr><td className="border px-4 py-2">generation_settings</td><td className="border px-4 py-2">MagicMuse</td><td className="border px-4 py-2">Stores custom generation parameters</td><td className="border px-4 py-2">1 year</td></tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">6. How Can You Control Cookies?</h2>
              <p className="mb-3 break-words">You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager accessible via the "Cookie Settings" button in the footer of our Platform.</p>
              <p className="mb-3 break-words">If you choose to reject cookies, you may still use our Platform though your access to some functionality and areas may be restricted. You may also set or amend your web browser controls to accept or refuse cookies.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">6.1 Browser Controls</h3>
              <p className="mb-3 break-words">The specific method for controlling cookies through your web browser controls varies from browser to browser. Please visit your browser's help menu for more information:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Chrome: <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-[#ae5630] hover:underline">https://support.google.com/chrome/answer/95647</a></li>
                <li>Firefox: <a href="https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences" target="_blank" rel="noopener noreferrer" className="text-[#ae5630] hover:underline">https://support.mozilla.org/en-US/kb/enable-and-disable-cookies-website-preferences</a></li>
                <li>Safari: <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-[#ae5630] hover:underline">https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac</a></li>
                <li>Edge: <a href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-[#ae5630] hover:underline">https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09</a></li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">6.2 Third-Party Opt-Out Tools</h3>
              <p className="mb-3 break-words">In addition, most advertising networks offer you a way to opt out of targeted advertising. If you would like to find out more information, please visit:</p>
              <ul className="list-disc space-y-1 ml-5 break-words">
                <li>Digital Advertising Alliance: <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#ae5630] hover:underline">https://www.aboutads.info/choices/</a></li>
                <li>Digital Advertising Alliance of Canada: <a href="https://youradchoices.ca/" target="_blank" rel="noopener noreferrer" className="text-[#ae5630] hover:underline">https://youradchoices.ca/</a></li>
                <li>European Interactive Digital Advertising Alliance: <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-[#ae5630] hover:underline">https://www.youronlinechoices.eu/</a></li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">7. Do Not Track Signals</h2>
              <p className="mb-3 break-words">
                Some browsers have a "Do Not Track" feature that signals to websites that you visit that you do not want to have your online activity tracked. Given that there is not a uniform standard for "Do Not Track" signals, our Platform does not currently respond to "Do Not Track" signals. However, you can manage your preferences regarding tracking activity in the section titled "How Can You Control Cookies?" above.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">8. Data Retention</h2>
              <p className="mb-3 break-words">Different cookies have different retention periods. The typical retention periods for cookies we use are:</p>
              <ol className="list-decimal space-y-1 ml-5 mb-3 break-words">
                <li><strong>Session Cookies</strong>: These are temporary and expire once you close your browser.</li>
                <li><strong>Persistent Cookies</strong>: These remain on your device until you erase them or they expire. Expiration periods range from hours to years depending on the cookie's purpose.</li>
              </ol>
              <p className="mb-3 break-words">The specific retention period for each cookie is detailed in the tables provided in Section 4 of this Policy.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">9. Cross-Border Data Transfers</h2>
              <p className="mb-3 break-words">
                Information that we collect may be transferred, stored, and processed in any country where we have operations or where we engage service providers. By using our Platform, you consent to the transfer of information to countries outside your country of residence, including the United States, which may have different data protection rules than in your country.
              </p>
              <p className="mb-3 break-words">
                We ensure appropriate safeguards are in place to protect your personal data when transferred internationally, in compliance with applicable data protection laws.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">10. Children's Privacy</h2>
              <p className="mb-3 break-words">
                Our Platform is not directed at individuals under the age of 16. We do not knowingly collect personal information from children under 16. If you become aware that a child has provided us with personal information without appropriate parental consent, please contact us at <a href="mailto:legal@magicmuse.io" className="text-[#ae5630] hover:underline">legal@magicmuse.io</a>. If we become aware that we have collected personal information from a child under 16 without verification of parental consent, we will take steps to remove that information from our servers. {/* Updated Email */}
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">11. Changes to Our Cookies Policy</h2>
              <p className="mb-3 break-words">
                We may update this Cookies Policy from time to time to reflect changes in technology, regulation, our business operations, or for other legitimate reasons. If we make material changes to this Policy, we will provide notice through our Platform or by other means to provide you with the opportunity to review the changes before they become effective. Your continued use of our Platform after we publish or send a notice about our changes to this Policy means that you are consenting to the updated Policy.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">12. Cookie Consent Tool</h2>
              <p className="mb-3 break-words">Our Platform uses a cookie consent management tool that allows you to:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>View the categories of cookies we use</li>
                <li>Accept or decline non-essential cookies</li>
                <li>Review and modify your consent settings at any time</li>
                <li>Access a detailed list of specific cookies used</li>
              </ul>
              <p className="mb-3 break-words">This tool is accessible by clicking "Cookie Settings" in the footer of our Platform.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">13. Legal Basis for Processing Personal Information (EU/EEA Users Only)</h2>
              <p className="mb-3 break-words">
                If you are located in the European Union or European Economic Area, our legal basis for collecting and using personal information described in this Cookies Policy depends on the personal information concerned and the specific context in which we collect it.
              </p>
              <p className="mb-3 break-words">We will normally collect personal information from you only where:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>We need the personal information to perform a contract with you</li>
                <li>The processing is in our legitimate interests and not overridden by your rights</li>
                <li>We have your consent to do so</li>
                <li>We need to comply with a legal obligation</li>
              </ul>
              <p className="mb-3 break-words">
                If we collect and use your personal information in reliance on our legitimate interests (or those of any third party), this interest will normally be to operate our Platform and communicate with you as necessary to provide our services and for our legitimate commercial interest. These legitimate interests include, for example, responding to your queries, improving our Platform, undertaking marketing, or detecting or preventing illegal activities.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">14. Cookie Categorization Under GDPR</h2>
              <p className="mb-3 break-words">Under the General Data Protection Regulation (GDPR), cookies are categorized as follows:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li><strong>Strictly Necessary Cookies</strong>: Required for core functionality and exempt from consent requirements</li>
                <li><strong>Preference Cookies</strong>: Store user choices but are not essential for functionality</li>
                <li><strong>Statistics/Analytics Cookies</strong>: Collect anonymous information about site usage</li>
                <li><strong>Marketing Cookies</strong>: Track users across websites for advertising purposes</li>
              </ul>
              <p className="mb-3 break-words">Our Cookie Consent Manager allows EU users to provide granular consent according to these categories.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">15. Contact Us</h2>
              <p className="mb-3 break-words">If you have any questions about our use of cookies or this Cookies Policy, please contact us at:</p>
              <p className="mb-1 break-words"><strong>Email</strong>: <a href="mailto:legal@magicmuse.io" className="text-[#ae5630] hover:underline">legal@magicmuse.io</a></p> {/* Updated Email */}
              <p className="mb-1 break-words"><strong>Postal Address</strong>:<br />
                MagicMuse, Inc.<br />
                POBox 78931<br />
                Lawrenceville, GA 30044<br /> {/* Updated Address */}
                United States
              </p>
              {/* Phone number removed as per update */}
              <p className="mb-3 break-words">We aim to respond to all inquiries within 30 days.</p>
            </section>

            <footer className="text-center italic text-xs text-[#ae5630] mt-4">
              <p><em>This Cookies Policy has been crafted to provide you with clear, comprehensive information about how we use cookies at MagicMuse. We are committed to transparency and to protecting your privacy while delivering an exceptional AI-powered writing experience.</em></p>
            </footer>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default CookiePolicyModal;
