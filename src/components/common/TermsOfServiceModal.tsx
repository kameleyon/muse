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

interface TermsOfServiceModalProps {
  trigger: React.ReactNode; // Allow custom trigger elements
}

const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <div className="scrollbar-wrapper">
      <DialogContent className="max-w-[92%] w-[600px] sm:max-w-[600px] max-h-[75vh] flex flex-col ">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-6xl tracking-tight leading-tight font-bold text-[#1a1918] font-heading">
              Terms <p>of Service</p>
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
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">1. Introduction and Acceptance of Terms</h2>
              <p className="mb-3 break-words">
                Welcome to MagicMuse, an AI-powered writing companion application ("MagicMuse," "we," "our," or "us"). By accessing or using our website, applications, services, or products (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms"). Please read these Terms carefully before using the Services.
              </p>
              <p className="mb-3 break-words">
                These Terms constitute a legally binding agreement between you and MagicMuse governing your access to and use of the Services. If you do not agree with any part of these Terms, you must not access or use our Services.
              </p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">1.1 Eligibility</h3>
              <p className="mb-3 break-words">
                To use the Services, you must be at least 18 years old, or the age of legal majority in your jurisdiction if that is higher than 18. If you are accessing the Services on behalf of a company, organization, or other legal entity, you represent and warrant that you have the authority to bind that entity to these Terms, in which case "you" shall refer to that entity.
              </p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">1.2 Changes to Terms</h3>
              <p className="mb-3 break-words">
                We reserve the right to modify these Terms at any time at our sole discretion. If we make material changes to these Terms, we will provide notice through the Services, via email, or by other means to provide you the opportunity to review the changes before they become effective. If you continue to use the Services after the changes have become effective, you will be deemed to have accepted the changes. If you do not agree with any of the changes, you must stop using the Services.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">2. Service Description</h2>
              <p className="mb-3 break-words">
                MagicMuse is an AI-powered writing companion that provides various writing assistance features across multiple content categories.
              </p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">2.1 Key Features</h3>
              <p className="mb-3 break-words">MagicMuse offers various content generation, enhancement, and editing features, including but not limited to:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Professional writing assistance (business documents, marketing content, etc.)</li>
                <li>Creative writing development (fiction, screenwriting, poetry, etc.)</li>
                <li>Academic and educational content support</li>
                <li>Technical and specialized writing tools</li>
                <li>Content refinement and optimization</li>
              </ul>

              <h3 className="text-lg font-semibold mb-2 text-secondary">2.2 Service Limitations</h3>
              <p className="mb-3 break-words">While we strive to provide high-quality AI-powered writing assistance, you acknowledge and agree that:</p>
              <ol type="a" className="list-[lower-alpha] space-y-1 ml-5 mb-3 break-words">
                <li>The Services may not always generate content that meets your specific requirements or expectations.</li>
                <li>The Services utilize artificial intelligence technology which has inherent limitations and may occasionally produce inaccurate, incomplete, or inappropriate content.</li>
                <li>MagicMuse is not designed to substitute for professional advice in specialized fields such as law, medicine, finance, or other regulated industries, and content generated should not be relied upon as such.</li>
                <li>We do not guarantee continuous, uninterrupted access to the Services, and operation may be interfered with by numerous factors outside our control.</li>
                <li>The availability and functionality of certain features may vary depending on your subscription level, device, location, or other factors.</li>
              </ol>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">3. User Accounts</h2>
              <h3 className="text-lg font-semibold mb-2 text-secondary">3.1 Account Creation and Security</h3>
              <p className="mb-3 break-words">To access certain features of our Services, you may need to create an account. When you create an account, you agree to:</p>
              <ol type="a" className="list-[lower-alpha] space-y-1 ml-5 mb-3 break-words">
                <li>Provide accurate, current, and complete information.</li>
                <li>Maintain and promptly update your account information.</li>
                <li>Keep your account credentials confidential and not share them with any third party.</li>
                <li>Be solely responsible for all activities that occur under your account.</li>
                <li>Notify us immediately of any unauthorized use of your account or any other security breach.</li>
              </ol>
              <p className="mb-3 break-words">We reserve the right to disable any user account at any time if, in our opinion, you have failed to comply with these Terms or if we suspect fraudulent or abusive activity.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">3.2 Account Tiers and Subscription</h3>
              <p className="mb-3 break-words">MagicMuse offers different account tiers, including free and premium subscription options. The specific features, usage limitations, and pricing for each tier are described on our website and are subject to change. By selecting a premium subscription, you agree to the payment terms outlined in Section 7.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">4. User Responsibilities and Prohibited Uses</h2>
              <h3 className="text-lg font-semibold mb-2 text-secondary">4.1 Acceptable Use</h3>
              <p className="mb-3 break-words">You agree to use the Services only for lawful purposes and in accordance with these Terms. You are responsible for all content you input into the Services and all content you generate, modify, or export using the Services.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">4.2 Prohibited Uses</h3>
              <p className="mb-3 break-words">You agree not to use the Services to:</p>
              <ol type="a" className="list-[lower-alpha] space-y-1 ml-5 mb-3 break-words">
                <li>Violate any applicable law, regulation, or third-party rights.</li>
                <li>Generate, upload, or distribute content that is illegal, fraudulent, defamatory, obscene, pornographic, invasive of privacy, harmful to minors, or otherwise objectionable.</li>
                <li>Generate, upload, or distribute content that infringes upon or violates the intellectual property rights or other rights of any third party.</li>
                <li>Impersonate any person or entity or misrepresent your affiliation with a person or entity.</li>
                <li>Engage in any activity that could disable, overburden, damage, or impair the Services or interfere with any other party's use of the Services.</li>
                <li>Attempt to gain unauthorized access to the Services, other user accounts, or computer systems or networks connected to the Services.</li>
                <li>Use the Services to generate spam, unsolicited communications, or bulk content for marketing purposes without proper authorization.</li>
                <li>Use the Services to develop, train, or improve any other AI model or system.</li>
                <li>Use the Services to generate content that may be used to harm, deceive, or exploit others, including but not limited to creating deepfakes, misinformation, or content designed to manipulate or defraud.</li>
                <li>Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code or underlying algorithms of the Services.</li>
              </ol>
              <p className="mb-3 break-words">We reserve the right to terminate or suspend your access to the Services immediately, without prior notice or liability, for any breach of these Terms or any conduct we reasonably believe is inappropriate or harmful.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">5. Content and Intellectual Property Rights</h2>
              <h3 className="text-lg font-semibold mb-2 text-secondary">5.1 User Content</h3>
              <p className="mb-3 break-words">"User Content" refers to any information, data, text, or other materials that you input or upload to the Services or generate using the Services. You retain ownership of your User Content, subject to the licenses granted below.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">5.2 Licenses Granted by Users</h3>
              <p className="mb-3 break-words">By submitting User Content to the Services, you grant MagicMuse a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your User Content in connection with providing and improving the Services. This license includes the right to:</p>
              <ol type="a" className="list-[lower-alpha] space-y-1 ml-5 mb-3 break-words">
                <li>Process your User Content to provide the Services to you.</li>
                <li>Store your User Content on our servers.</li>
                <li>Use aggregated, anonymized data derived from your User Content to improve our algorithms and Services.</li>
                <li>Incorporate your feedback into the Services.</li>
              </ol>
              <p className="mb-3 break-words">This license continues even if you stop using our Services, solely with respect to User Content that remains on our systems or is needed to provide the Services to other users.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">5.3 AI-Generated Content</h3>
              <p className="mb-3 break-words">For content generated by our AI systems in response to your inputs ("AI-Generated Content"):</p>
              <ol type="a" className="list-[lower-alpha] space-y-1 ml-5 mb-3 break-words">
                <li>You receive a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, distribute, and display the AI-Generated Content for any purpose, subject to these Terms and any applicable subscription limitations.</li>
                <li>While we do not claim ownership of AI-Generated Content, we cannot guarantee that such content is completely original or free from third-party intellectual property rights.</li>
                <li>You are solely responsible for reviewing, editing, and ensuring the appropriateness and legality of any AI-Generated Content that you use or publish.</li>
                <li>We recommend that you disclose the use of AI assistance when publishing or distributing AI-Generated Content, particularly in professional, academic, or commercial contexts.</li>
              </ol>

              <h3 className="text-lg font-semibold mb-2 text-secondary">5.4 MagicMuse Intellectual Property</h3>
              <p className="mb-3 break-words">All intellectual property rights in the Services, including but not limited to software, features, designs, algorithms, databases, text, graphics, logos, and trademarks, are owned by MagicMuse or our licensors. Nothing in these Terms transfers any such rights to you.</p>
              <p className="mb-3 break-words">You may not use, copy, adapt, modify, prepare derivative works based upon, distribute, license, sell, transfer, publicly display, publicly perform, transmit, broadcast, or otherwise exploit the Services or any portion thereof, except as expressly permitted in these Terms.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">5.5 Feedback</h3>
              <p className="mb-3 break-words">If you provide feedback, ideas, or suggestions regarding the Services ("Feedback"), you hereby grant MagicMuse a worldwide, perpetual, irrevocable, royalty-free license to use and incorporate such Feedback into our Services without any obligation to compensate you.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">6. Privacy and Data Protection</h2>
              <h3 className="text-lg font-semibold mb-2 text-secondary">6.1 Privacy Policy</h3>
              <p className="mb-3 break-words">Our Privacy Policy, which is incorporated by reference into these Terms, explains how we collect, use, and disclose information about you when you use the Services. By using the Services, you consent to our collection, use, and disclosure of information as described in our Privacy Policy.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">6.2 Data Security</h3>
              <p className="mb-3 break-words">We implement reasonable security measures to protect your personal information and User Content. However, no method of transmission over the Internet or electronic storage is 100% secure. Therefore, while we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">6.3 Content Storage and Retention</h3>
              <p className="mb-3 break-words">We may retain your User Content for a reasonable period after you stop using the Services to comply with legal obligations, resolve disputes, and enforce our agreements. We are not obligated to store or maintain your User Content indefinitely.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">7. Payment Terms</h2>
              <h3 className="text-lg font-semibold mb-2 text-secondary">7.1 Subscription and Fees</h3>
              <p className="mb-3 break-words">Certain features of the Services are available only with a paid subscription. By choosing a paid subscription, you agree to pay all applicable fees. We may change the fees for our Services at any time with advance notice. Unless otherwise stated, all fees are in U.S. dollars.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">7.2 Billing and Renewals</h3>
              <p className="mb-3 break-words">For subscription-based Services:</p>
              <ol type="a" className="list-[lower-alpha] space-y-1 ml-5 mb-3 break-words">
                <li>You authorize us to charge the payment method you provide to us for all applicable fees.</li>
                <li>Subscriptions automatically renew at the end of each subscription period unless you cancel before the renewal date.</li>
                <li>You are responsible for all charges incurred under your account, including applicable taxes.</li>
              </ol>

              <h3 className="text-lg font-semibold mb-2 text-secondary">7.3 Refunds</h3>
              <p className="mb-3 break-words">Refunds are provided in accordance with our Refund Policy, which is available on our website. Generally, we do not provide refunds for partial subscription periods or for subscriptions that have been active for more than our specified refund period.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">7.4 Free Trial</h3>
              <p className="mb-3 break-words">We may offer a free trial of our paid Services. At the end of the free trial, you will be automatically charged for the subscription unless you cancel before the end of the trial period. You may be required to provide payment information to access the free trial.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">8. Termination</h2>
              <h3 className="text-lg font-semibold mb-2 text-secondary">8.1 Termination by You</h3>
              <p className="mb-3 break-words">You may terminate your account at any time by following the instructions on our website or by contacting us at <a href="mailto:legal@magicmuse.io" className="text-[#ae5630] hover:underline">legal@magicmuse.io</a>. If you terminate a paid subscription, you will not receive a refund for any fees already paid, and you will continue to have access to the Services until the end of your current subscription period.</p> {/* Updated Email */}

              <h3 className="text-lg font-semibold mb-2 text-secondary">8.2 Termination by MagicMuse</h3>
              <p className="mb-3 break-words">We may terminate or suspend your account and access to the Services immediately, without prior notice or liability, for any reason, including if:</p>
              <ol type="a" className="list-[lower-alpha] space-y-1 ml-5 mb-3 break-words">
                <li>You breach any provision of these Terms.</li>
                <li>You fail to pay any fees when due.</li>
                <li>We suspect fraudulent, abusive, or illegal activity under your account.</li>
                <li>We believe termination is necessary to protect the Services, our users, or the public.</li>
                <li>Your use of the Services creates risk or potential legal exposure for us.</li>
                <li>We are unable to verify or authenticate any information you provide to us.</li>
              </ol>

              <h3 className="text-lg font-semibold mb-2 text-secondary">8.3 Effect of Termination</h3>
              <p className="mb-3 break-words">Upon termination of your account:</p>
              <ol type="a" className="list-[lower-alpha] space-y-1 ml-5 mb-3 break-words">
                <li>Your right to access and use the Services will immediately cease.</li>
                <li>We may delete or archive your User Content according to our data retention practices.</li>
                <li>Any outstanding payment obligations will become immediately due.</li>
                <li>Sections of these Terms that by their nature should survive termination shall survive, including but not limited to provisions regarding intellectual property, disclaimers, limitations of liability, and dispute resolution.</li>
              </ol>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">9. Disclaimers and Warranties</h2>
              <h3 className="text-lg font-semibold mb-2 text-secondary">9.1 Service Provided "As Is"</h3>
              <p className="mb-3 break-words">THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED. WITHOUT LIMITING THE FOREGOING, WE EXPLICITLY DISCLAIM ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT, OR NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING OR USAGE OF TRADE.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">9.2 AI-Generated Content Disclaimer</h3>
              <p className="mb-3 break-words">We make no representations or warranties about the accuracy, completeness, reliability, legality, or appropriateness of AI-Generated Content. You are solely responsible for evaluating and verifying any information, content, or advice generated through the Services before relying on or using it.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">9.3 No Professional Advice</h3>
              <p className="mb-3 break-words">The Services are not intended to provide professional, legal, medical, financial, or other specialized advice. Any content generated through the Services should not be considered a substitute for professional advice on any subject matter. We are not responsible for any actions you take based on content generated by the Services.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">9.4 Availability and Functionality</h3>
              <p className="mb-3 break-words">We do not warrant that the Services will be available at all times, uninterrupted, or error-free, or that defects will be corrected. We reserve the right to modify, suspend, or discontinue the Services or any part thereof at any time without notice.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">10. Limitation of Liability</h2>
              <h3 className="text-lg font-semibold mb-2 text-secondary">10.1 Limitation of Liability</h3>
              <p className="mb-3 break-words">TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL MAGICMUSE, ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:</p>
              <ol type="a" className="list-[lower-alpha] space-y-1 ml-5 mb-3 break-words">
                <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES;</li>
                <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES;</li>
                <li>ANY CONTENT OBTAINED FROM THE SERVICES; AND</li>
                <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT,</li>
              </ol>
              <p className="mb-3 break-words">WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">10.2 Cap on Liability</h3>
              <p className="mb-3 break-words">IN JURISDICTIONS THAT DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, OUR LIABILITY SHALL BE LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW. IN NO EVENT SHALL OUR TOTAL LIABILITY TO YOU FOR ALL DAMAGES, LOSSES, OR CAUSES OF ACTION EXCEED THE AMOUNT YOU HAVE PAID TO MAGICMUSE IN THE LAST SIX (6) MONTHS, OR, IF GREATER, ONE HUNDRED DOLLARS ($100).</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">10.3 Essential Purpose</h3>
              <p className="mb-3 break-words">THE LIMITATIONS OF DAMAGES SET FORTH ABOVE ARE FUNDAMENTAL ELEMENTS OF THE BASIS OF THE BARGAIN BETWEEN MAGICMUSE AND YOU. SOME JURISDICTIONS DO NOT ALLOW THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL DAMAGES, SO THE ABOVE LIMITATION MAY NOT APPLY TO YOU.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">11. Indemnification</h2>
              <p className="mb-3 break-words">You agree to defend, indemnify, and hold harmless MagicMuse, its officers, directors, employees, and agents, from and against any claims, liabilities, damages, losses, and expenses, including, without limitation, reasonable legal and accounting fees, arising out of or in any way connected with:</p>
              <ol type="a" className="list-[lower-alpha] space-y-1 ml-5 mb-3 break-words">
                <li>Your access to or use of the Services;</li>
                <li>Your violation of these Terms;</li>
                <li>Your violation of any third-party right, including without limitation any intellectual property right, publicity, confidentiality, property, or privacy right; or</li>
                <li>Any claim that your User Content or your use of the Services caused damage to a third party.</li>
              </ol>
              <p className="mb-3 break-words">We reserve the right, at our own expense, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will cooperate with us in asserting any available defenses.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">12. Dispute Resolution</h2>
              <h3 className="text-lg font-semibold mb-2 text-secondary">12.1 Governing Law</h3>
              <p className="mb-3 break-words">These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">12.2 Arbitration Agreement</h3>
              <p className="mb-3 break-words">Except for disputes that qualify for small claims court, any dispute, claim, or controversy arising out of or relating to these Terms or the Services shall be determined by binding arbitration. The arbitration will be conducted by JAMS under its applicable rules. The arbitration shall take place in San Francisco, California, unless you and MagicMuse agree otherwise.</p>
              <p className="mb-3 break-words">The arbitrator shall have exclusive authority to resolve any dispute relating to the interpretation, applicability, or enforceability of these Terms, including this arbitration agreement. The arbitrator's award shall be final and binding on the parties.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">12.3 Class Action Waiver</h3>
              <p className="mb-3 break-words">YOU AND MAGICMUSE AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">12.4 Exceptions</h3>
              <p className="mb-3 break-words">Notwithstanding the foregoing, either party may seek injunctive or other equitable relief in any court of competent jurisdiction to protect its intellectual property rights pending completion of the arbitration.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">13. AI Training and Data Use</h2>
              <h3 className="text-lg font-semibold mb-2 text-secondary">13.1 Data Use for Service Improvement</h3>
              <p className="mb-3 break-words">We may use anonymized and aggregated data derived from your use of the Services to maintain, improve, and develop our Services, including training and fine-tuning our AI models.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">13.2 Opt-Out Options</h3>
              <p className="mb-3 break-words">You may have the option to opt out of having your data used for AI training purposes. Details on how to opt out, if available, can be found in our Privacy Policy or through your account settings.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">13.3 Training Data Limitations</h3>
              <p className="mb-3 break-words">We implement reasonable measures to ensure that personal information and confidential content are not inadvertently disclosed through our AI systems. However, we cannot guarantee that AI-Generated Content will never resemble content provided by other users or available in our training data.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">14. Disclosing AI-Generated Content</h2>
              <p className="mb-3 break-words">We recommend that you appropriately disclose when content has been created or substantially modified using our AI Services, particularly in professional, academic, educational, or commercial contexts. You are responsible for complying with any applicable disclosure requirements in your field or industry regarding the use of AI-generated content.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">15. Export Control and International Use</h2>
              <p className="mb-3 break-words">The Services may be subject to U.S. export control laws and regulations. You agree to comply with all such laws and regulations and acknowledge that you are responsible for obtaining any licenses or approvals required to use the Services under such laws and regulations.</p>
              <p className="mb-3 break-words">The Services may not be available or appropriate for use in all countries. If you access the Services from outside the United States, you are responsible for compliance with local laws, if and to the extent local laws are applicable.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">16. General Provisions</h2>
              <h3 className="text-lg font-semibold mb-2 text-secondary">16.1 Entire Agreement</h3>
              <p className="mb-3 break-words">These Terms, together with our Privacy Policy and any other legal notices or additional terms and conditions or policies published by MagicMuse on the Services, shall constitute the entire agreement between you and MagicMuse concerning the Services.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">16.2 No Waiver</h3>
              <p className="mb-3 break-words">No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term, and our failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">16.3 Severability</h3>
              <p className="mb-3 break-words">If any provision of these Terms is held to be invalid, illegal, or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent necessary, and the remaining provisions of the Terms will continue in full force and effect.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">16.4 Assignment</h3>
              <p className="mb-3 break-words">You may not assign or transfer these Terms, by operation of law or otherwise, without MagicMuse's prior written consent. Any attempt by you to assign or transfer these Terms without such consent will be null and void. MagicMuse may freely assign or transfer these Terms without restriction.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">16.5 Notice</h3>
              <p className="mb-3 break-words">We may provide notices to you by posting them on our website, sending them to an email address or physical address associated with your account, or by other means. Notices shall be effective when posted or sent.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">16.6 Force Majeure</h3>
              <p className="mb-3 break-words">We shall not be liable for any failure to perform our obligations under these Terms where such failure results from any cause beyond our reasonable control, including but not limited to, mechanical, electronic, or communications failure or degradation, acts of God, terrorist acts, public health emergencies, or government restrictions.</p>

              <h3 className="text-lg font-semibold mb-2 text-secondary">16.7 Relationship of Parties</h3>
              <p className="mb-3 break-words">Nothing in these Terms shall be construed as creating a partnership, joint venture, agency, or employment relationship between you and MagicMuse.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">17. Contact Information</h2>
              <p className="mb-3 break-words">If you have any questions about these Terms, please contact us at:</p>
              <p className="mb-1 break-words"><strong>MagicMuse, Inc.</strong></p>
              <p className="mb-1 break-words"><strong>Email</strong>: <a href="mailto:legal@magicmuse.io" className="text-[#ae5630] hover:underline">legal@magicmuse.io</a></p> {/* Updated Email */}
              <p className="mb-1 break-words"><strong>Address</strong>:<br />
                POBox 78931<br />
                Lawrenceville, GA 30044<br /> {/* Updated Address */}
                USA
              </p>
            </section>

            <footer className="text-center italic text-xs text-[#ae5630] mt-4">
              <p><em>Thank you for using MagicMuse!</em></p>
            </footer>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default TermsOfServiceModal;
