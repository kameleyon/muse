import React from 'react';
import '../../styles/modal.css'; // Import custom modal styles using relative path
import '../../styles/index.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";

interface PrivacyPolicyModalProps {
  trigger: React.ReactNode; // Allow custom trigger elements
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <div className="scrollbar-wrapper">
      <DialogContent className="max-w-[92%] w-[600px] sm:max-w-[600px] max-h-[75vh] flex flex-col ">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-6xl tracking-tight leading-tight font-bold text-[#1a1918] font-heading">
              Privacy <p>Policy</p>
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Effective Date: April 7, 2025</p> {/* Updated Date */}
          </DialogHeader>
          <div
            className="overflow-y-auto px-6 pb-6 text-[#3d3d3a] flex-grow modal-scrollable-content rounded-scrollbar font-body text-sm"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)'
            }}
          >
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">1. Introduction</h2>
              <p className="mb-3 break-words">
                Welcome to MagicMuse ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered writing assistant platform, available through our website, mobile application, and API integrations.
              </p>
              <p className="mb-3 break-words">
                MagicMuse is designed to help you create, enhance, and manage various types of written content through our advanced AI technology. We've developed this Privacy Policy to be transparent about our data practices and to comply with applicable privacy laws and regulations worldwide, including but not limited to the General Data Protection Regulation (GDPR), the California Consumer Privacy Act (CCPA), and other similar regulations that apply to AI services that process personal data.
              </p>
              <p className="mb-3 break-words">
                This Privacy Policy applies to all users of MagicMuse, regardless of how you access our services. By using MagicMuse, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">2. Information We Collect</h2>
              <h3 className="text-lg font-semibold mb-2 text-secondary">2.1 Information You Provide to Us</h3>
              <p className="mb-3 break-words">We collect information you voluntarily provide when you:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Create and manage your account (such as name, email address, password, and billing information)</li>
                <li>Use our services to generate, edit, or store content</li>
                <li>Upload documents or data for processing</li>
                <li>Communicate with our support team</li>
                <li>Participate in surveys, contests, or promotions</li>
                <li>Customize your preferences and settings</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">2.2 Content You Create or Upload</h3>
              <p className="mb-3 break-words">When you use MagicMuse, we collect and process:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Text you input as prompts or instructions</li>
                <li>Documents you upload for processing or analysis</li>
                <li>Content you generate, edit, or store using our platform</li>
                <li>Templates you create, modify, or use</li>
                <li>Projects you organize and manage</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">2.3 Automatically Collected Information</h3>
              <p className="mb-3 break-words">Our AI systems require certain data to function properly, and we automatically collect:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Usage data (features used, interactions with the interface, content generated)</li>
                <li>Device information (browser type, operating system, device type)</li>
                <li>Log data (IP address, access times, pages viewed)</li>
                <li>Location information (based on IP address or GPS with your permission)</li>
                <li>Performance data (response times, errors encountered)</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">2.4 Information From Third Parties</h3>
              <p className="mb-3 break-words">We may receive information about you from:</p>
              <ul className="list-disc space-y-1 ml-5 break-words">
                <li>Third-party services you link to your MagicMuse account</li>
                <li>Payment processors who facilitate your transactions</li>
                <li>Partners with whom we offer co-branded services</li>
                <li>Publicly available sources for enhancing our services</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">3. How We Use Your Information</h2>
              <p className="mb-3 break-words">We use your information for the following purposes:</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">3.1 Providing and Improving Our Services</h3>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Delivering the core functionality of our AI writing assistant</li>
                <li>Processing your requests and generating content</li>
                <li>Personalizing your experience and content suggestions</li>
                <li>Analyzing usage patterns to improve our platform</li>
                <li>Developing new features and capabilities</li>
                <li>Training and fine-tuning our AI models (with your consent, as detailed in Section 3.3)</li>
                <li>Technical troubleshooting and customer support</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">3.2 Business Operations</h3>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Managing your account and subscription</li>
                <li>Processing payments and preventing fraud</li>
                <li>Communicating with you about your account, updates, or policy changes</li>
                <li>Providing customer support and responding to inquiries</li>
                <li>Conducting research and analytics to understand user behavior</li>
                <li>Marketing our services to you (subject to your preferences)</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">3.3 AI Training and Model Improvement</h3>
              <p className="mb-3 break-words">We understand that AI systems require massive datasets that may include categories of personal information protected by data privacy laws. Regarding the use of your data for AI training:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li><strong>Opt-In Approach</strong>: We follow an explicit opt-in approach for AI training, meaning your data is not collected or used for training our AI models unless you affirmatively consent to such collection and use.</li>
                <li><strong>Content Control</strong>: You control whether your content is used to improve our AI models. You can opt-out at any time through your account settings.</li>
                <li><strong>Anonymization</strong>: If you consent to AI training, we anonymize and aggregate your data to remove personally identifiable information.</li>
                <li><strong>Transparency</strong>: We provide clear information about the composition of training data, data sets and their sources, data diversity, and potential privacy implications.</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">3.4 Legal Compliance and Protection</h3>
              <ul className="list-disc space-y-1 ml-5 break-words">
                <li>Complying with applicable laws and regulations</li>
                <li>Responding to legal requests and preventing harm</li>
                <li>Enforcing our Terms of Service and other policies</li>
                <li>Protecting the rights, property, or safety of MagicMuse, our users, or others</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">4. How We Share Your Information</h2>
              <p className="mb-3 break-words">We may share your information in the following circumstances:</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">4.1 With Your Consent</h3>
              <p className="mb-3 break-words">We share your information when you direct us to do so, such as when you choose to share content with collaborators or integrate with third-party services.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">4.2 Service Providers</h3>
              <p className="mb-3 break-words">We engage trusted third-party companies and individuals to facilitate our services, including:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Cloud hosting and storage providers</li>
                <li>Payment processors</li>
                <li>Analytics services</li>
                <li>Customer support platforms</li>
                <li>Communications services</li>
              </ul>
              <p className="mb-3 break-words">These service providers have access to your information only to perform specific tasks on our behalf and are obligated to protect your information in line with this Privacy Policy.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">4.3 Business Transfers</h3>
              <p className="mb-3 break-words">If MagicMuse is involved in a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you before your information becomes subject to a different privacy policy.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">4.4 Legal Requirements</h3>
              <p className="mb-3 break-words">We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">4.5 Protection of Rights</h3>
              <p className="mb-3 break-words">We may disclose your information to:</p>
              <ul className="list-disc space-y-1 ml-5 break-words">
                <li>Enforce our Terms of Service</li>
                <li>Protect and defend our rights or property</li>
                <li>Prevent or investigate possible wrongdoing in connection with our services</li>
                <li>Protect the personal safety of users or the public</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">5. Data Security</h2>
              <p className="mb-3 break-words">We implement robust security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. Our security infrastructure includes:</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">5.1 Technical Safeguards</h3>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Encryption of data in transit and at rest using industry-standard protocols</li>
                <li>Secure network architecture with firewalls and intrusion detection systems</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Multi-factor authentication for account access</li>
                <li>Secure development practices and code reviews</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">5.2 Organizational Measures</h3>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Employee access controls and least privilege principles</li>
                <li>Regular security training for all staff</li>
                <li>Background checks for employees with access to sensitive systems</li>
                <li>Documented incident response procedures</li>
                <li>Vendor security assessment and management</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">5.3 Compliance and Certifications</h3>
              <p className="mb-3 break-words">MagicMuse maintains industry-standard security certifications, including SOC 2 and ISO 27001, and complies with regulations like GDPR and CCPA. We regularly review and update our security measures to ensure they remain effective against evolving threats.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">6. Data Retention</h2>
              <p className="mb-3 break-words">We retain your information for as long as your account is active or as needed to provide you with our services. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">6.1 User-Generated Content</h3>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Content you create and store within MagicMuse remains available until you delete it or close your account.</li>
                <li>Deleted content may remain in our backup systems for a limited time before being permanently removed.</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">6.2 Account Information</h3>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Account information is retained while your account is active.</li>
                <li>If you close your account, we will delete or anonymize your account information within 30 days unless:
                  <ul className="list-circle space-y-1 ml-5 mt-1">
                    <li>We are required to retain it to comply with applicable laws</li>
                    <li>We need to retain it to resolve disputes or enforce our agreements</li>
                    <li>We need to retain limited information for legitimate business purposes</li>
                  </ul>
                </li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">6.3 Usage Data</h3>
              <p className="mb-3 break-words">Usage data and analytics may be retained in an aggregated, anonymized format for up to 18 months to help us improve our services.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">7. Your Rights and Choices</h2>
              <p className="mb-3 break-words">We respect your right to control your personal information. Depending on your location, you may have certain rights regarding your data.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">7.1 Access and Portability</h3>
              <p className="mb-3 break-words">You can access and export your account information and generated content through your account settings.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">7.2 Correction and Deletion</h3>
              <p className="mb-3 break-words">You can update or correct your account information at any time through your account settings. You can also request the deletion of your data by contacting us.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">7.3 AI Training Preferences</h3>
              <p className="mb-3 break-words">As mentioned in Section 3.3, you control whether your content is used for AI training. You can manage these preferences in your account settings.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">7.4 Marketing Preferences</h3>
              <p className="mb-3 break-words">You can opt out of marketing communications by using the unsubscribe link in our emails or by updating your communication preferences in your account settings.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">7.5 Cookie Preferences</h3>
              <p className="mb-3 break-words">You can manage your cookie preferences through our cookie banner or browser settings. See our Cookie Policy for more details.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">7.6 Regional Privacy Rights</h3>
              <h4 className="text-md font-semibold mb-1 text-tertiary">European Economic Area (GDPR)</h4>
              <p className="mb-3 break-words">If you are in the European Economic Area, you have the right to:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Access your personal data</li>
                <li>Rectify inaccurate personal data</li>
                <li>Request erasure of your personal data</li>
                <li>Restrict or object to processing of your personal data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
                <li>Lodge a complaint with a supervisory authority</li>
              </ul>

              <h4 className="text-md font-semibold mb-1 text-tertiary">California (CCPA/CPRA)</h4>
              <p className="mb-3 break-words">Under the CCPA, businesses have an obligation to notify how personal data is being used and the purposes of processing, including AI training purposes. If you are a California resident, you have the right to:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Know what personal information is collected, used, shared, or sold</li>
                <li>Delete personal information held by businesses</li>
                <li>Opt-out of the sale of personal information</li>
                <li>Non-discrimination for exercising your CCPA rights</li>
                <li>Access your personal information</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">7.7 Exercising Your Rights</h3>
              <p className="mb-3 break-words">To exercise any of these rights, please contact us at <a href="mailto:legal@magicmuse.io" className="text-[#ae5630] hover:underline">legal@magicmuse.io</a>. We will respond to your request within the timeframe required by applicable law. We may need to verify your identity before fulfilling your request.</p> {/* Updated Email */}
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">8. Automated Decision-Making and Profiling</h2>
              <p className="mb-3 break-words">MagicMuse employs AI systems that may engage in automated decision-making to generate content and provide recommendations. We are committed to transparency in how our AI functions.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">8.1 How We Use Automated Systems</h3>
              <p className="mb-3 break-words">Our automated systems are used to:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Generate content based on your inputs and preferences</li>
                <li>Recommend templates and styles based on your past usage</li>
                <li>Optimize content for specific purposes (SEO, readability, tone)</li>
                <li>Identify potential improvements to your writing</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">8.2 Your Rights Regarding Automated Processing</h3>
              <p className="mb-3 break-words">You have the right to opt out of automated processing of personal data that produces legal or similarly significant effects. While most of our automated processing does not produce such effects, you can:</p>
              <ul className="list-disc space-y-1 ml-5 break-words">
                <li>Request human review of any automated content generation</li>
                <li>Opt out of personalized recommendations</li>
                <li>Limit the use of your data for profiling purposes</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">9. Children's Privacy</h2>
              <p className="mb-3 break-words">
                MagicMuse is not directed to persons under the age of 16. We do not knowingly collect personal information from children under 16. If we learn that we have collected personal information from a child under 16, we will take steps to delete that information.
              </p>
              <p className="mb-3 break-words">
                If you are a parent or guardian and believe that your child has provided us with personal information without your consent, please contact us so that we can take appropriate action.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">10. International Data Transfers</h2>
              <p className="mb-3 break-words">MagicMuse operates globally, which means your information may be transferred to, stored, and processed in countries other than the one in which you reside. These countries may have data protection laws that differ from your country.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">10.1 Data Transfer Mechanisms</h3>
              <p className="mb-3 break-words">When we transfer personal data from the European Economic Area, United Kingdom, or Switzerland to countries that have not received an adequacy decision, we use appropriate safeguards such as:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Standard Contractual Clauses approved by the European Commission</li>
                <li>EU-US Data Privacy Framework</li>
                <li>Binding Corporate Rules</li>
                <li>Your explicit consent (in certain cases)</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">10.2 Cross-Border Data Protection</h3>
              <p className="mb-3 break-words">We take appropriate measures to ensure that your personal information remains protected in accordance with this Privacy Policy, regardless of where it is processed.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">11. Changes to This Privacy Policy</h2>
              <p className="mb-3 break-words">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The updated version will be indicated by an updated "Effective Date" at the top of this Privacy Policy.
              </p>
              <p className="mb-3 break-words">
                If we make material changes to this Privacy Policy, we will notify you by email (if you have provided your email address) or by prominently posting a notice on our website before the changes become effective.
              </p>
              <p className="mb-3 break-words">
                We encourage you to review this Privacy Policy periodically for the latest information on our privacy practices.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">12. AI-Specific Privacy Provisions</h2>
              <h3 className="text-lg font-semibold mb-2 text-secondary">12.1 Content Generation and Analysis</h3>
              <p className="mb-3 break-words">Our AI writing assistant processes and analyzes the text you provide to generate content, provide recommendations, and optimize your writing. This processing may involve:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Natural language processing of your text inputs</li>
                <li>Analysis of content structure and style</li>
                <li>Identification of grammar, spelling, and readability issues</li>
                <li>Generation of alternative phrasing, content expansions, or summaries</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">12.2 Data Processing and Transparency</h3>
              <p className="mb-3 break-words">We are committed to transparent AI data processing, including clarity on data flows, catalog of data collection points, and documentation of business process flows. We provide:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Clear information about how your data is used to power our AI features</li>
                <li>Documentation of the types of data we collect and process</li>
                <li>Explanation of how our AI models function (where possible)</li>
                <li>Regular updates on changes to our AI systems that might affect your privacy</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">12.3 AI Model Information</h3>
              <p className="mb-3 break-words">We understand the importance of transparency about AI models and provide information about the overall composition of training data, data sets and their sources, and data diversity. Our commitment includes:</p>
              <ul className="list-disc space-y-1 ml-5 break-words">
                <li>Being transparent about the types of data used to train our models</li>
                <li>Explaining how our models are evaluated for accuracy and potential bias</li>
                <li>Providing information about how we mitigate potential risks in AI outputs</li>
                <li>Ensuring accountability in our AI development processes</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">13. Contact Us</h2>
              <p className="mb-3 break-words">If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
              <p className="mb-1 break-words"><strong>Email</strong>: <a href="mailto:legal@magicmuse.io" className="text-[#ae5630] hover:underline">legal@magicmuse.io</a></p> {/* Updated Email */}
              <p className="mb-1 break-words"><strong>Postal Address</strong>:<br />
                MagicMuse Privacy Team<br />
                POBox 78931<br />
                Lawrenceville, GA 30044<br /> {/* Updated Address */}
                United States
              </p>
              <p className="mb-1 break-words"><strong>Data Protection Officer</strong>: <a href="mailto:legal@magicmuse.io" className="text-[#ae5630] hover:underline">legal@magicmuse.io</a></p> {/* Updated Email */}
              <p className="mb-3 break-words">For individuals in the European Economic Area, we have appointed a data protection representative who can be contacted at <a href="mailto:legal@magicmuse.io" className="text-[#ae5630] hover:underline">legal@magicmuse.io</a>.</p> {/* Updated Email */}
            </section>

            <footer className="text-center italic text-xs text-[#ae5630] mt-4">
              <p><em>By using MagicMuse, you acknowledge that you have read and understood this Privacy Policy and agree to its terms.</em></p>
            </footer>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default PrivacyPolicyModal;
