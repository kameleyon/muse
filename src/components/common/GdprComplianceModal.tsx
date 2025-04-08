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

interface GdprComplianceModalProps {
  trigger: React.ReactNode; // Allow custom trigger elements
}

const GdprComplianceModal: React.FC<GdprComplianceModalProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <div className="scrollbar-wrapper">
      <DialogContent className="max-w-[92%] w-[600px] sm:max-w-[600px] max-h-[75vh] flex flex-col ">
          <DialogHeader className="px-6 pt-6 pb-2">
            <DialogTitle className="text-6xl tracking-tight leading-tight font-bold text-[#1a1918] font-heading">
              GDPR <p>Compliance</p>
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Last Updated: April 7, 2025</p> {/* Updated Date */}
          </DialogHeader>
          <div
            className="overflow-y-auto px-6 pb-6 text-[#3d3d3a] flex-grow modal-scrollable-content rounded-scrollbar font-body text-sm"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)'
            }}
          >
            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Our Commitment to Your Privacy</h2>
              <p className="mb-3 break-words">
                At MagicMuse, we are committed to protecting your personal data and respecting your privacy rights. This GDPR Compliance Statement explains how we collect, use, and protect your personal information in accordance with the General Data Protection Regulation (GDPR).
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Data Controller Information</h2>
              <p className="mb-3 break-words">
                MagicMuse (operated by MagicMuse, Inc.) acts as the data controller for personal information processed through our AI writing platform. You can contact us regarding data protection matters at:
              </p>
              <p className="mb-1 break-words"><strong>Email:</strong> <a href="mailto:legal@magicmuse.io" className="text-[#ae5630] hover:underline">legal@magicmuse.io</a></p> {/* Updated Email */}
              <p className="mb-1 break-words"><strong>Address:</strong><br />
                POBox 78931<br />
                Lawrenceville, GA 30044<br /> {/* Updated Address */}
                USA
              </p>
              <p className="mb-3 break-words"><strong>Data Protection Officer:</strong> <a href="mailto:legal@magicmuse.io" className="text-[#ae5630] hover:underline">legal@magicmuse.io</a></p> {/* Updated Email */}
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">What Personal Data We Collect</h2>
              <p className="mb-3 break-words">We collect and process the following categories of personal data:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li><strong>Account Information</strong>: Name, email address, username, and password (encrypted)</li>
                <li><strong>Billing Information</strong>: Payment details, subscription information, and transaction history</li>
                <li><strong>Usage Data</strong>: Information about how you use our platform, including generated content, saved templates, and feature usage</li>
                <li><strong>Technical Data</strong>: IP address, browser type, device information, and cookies</li>
                <li><strong>Communication Data</strong>: Customer support interactions and survey responses</li>
                <li><strong>Marketing Preferences</strong>: Your consent choices and communication preferences</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">How We Use Your Personal Data</h2>
              <p className="mb-3 break-words">We process your personal data for the following purposes:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Providing and personalizing our AI writing services</li>
                <li>Managing your account and subscription</li>
                <li>Processing payments and preventing fraud</li>
                <li>Improving and optimizing our platform</li>
                <li>Providing customer support</li>
                <li>Sending service notifications and updates</li>
                <li>Marketing communications (with your consent)</li>
                <li>Complying with legal obligations</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Legal Basis for Processing</h2>
              <p className="mb-3 break-words">We rely on the following legal bases to process your personal data:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li><strong>Contract Performance</strong>: Processing necessary to provide our services and fulfill our contract with you</li>
                <li><strong>Legitimate Interests</strong>: Processing that serves our legitimate business interests while respecting your rights and freedoms</li>
                <li><strong>Legal Obligation</strong>: Processing required to comply with applicable laws</li>
                <li><strong>Consent</strong>: Processing based on your specific consent (e.g., for marketing communications)</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Your Data Protection Rights</h2>
              <p className="mb-3 break-words">Under GDPR, you have the following rights regarding your personal data:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li><strong>Right to Access</strong>: Request a copy of your personal data</li>
                <li><strong>Right to Rectification</strong>: Correct inaccurate or incomplete data</li>
                <li><strong>Right to Erasure</strong>: Request deletion of your personal data</li>
                <li><strong>Right to Restrict Processing</strong>: Limit how we use your data</li>
                <li><strong>Right to Data Portability</strong>: Receive your data in a structured, machine-readable format</li>
                <li><strong>Right to Object</strong>: Object to our processing of your data</li>
                <li><strong>Rights Related to Automated Decision Making</strong>: Request human intervention for decisions based solely on automated processing</li>
              </ul>
              <p className="mb-3 break-words">To exercise any of these rights, please contact us at <a href="mailto:legal@magicmuse.io" className="text-[#ae5630] hover:underline">legal@magicmuse.io</a>. We will respond to your request within one month.</p> {/* Updated Email */}
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">How We Protect Your Data</h2>
              <p className="mb-3 break-words">We implement appropriate technical and organizational measures to protect your personal data, including:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Encryption of sensitive data both in transit and at rest</li>
                <li>Access controls and authentication requirements</li>
                <li>Regular security assessments and penetration testing</li>
                <li>Staff training on data protection and security</li>
                <li>Data protection impact assessments for new processing activities</li>
                <li>Vendor security assessment and contractual safeguards</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Data Retention</h2>
              <p className="mb-3 break-words">We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>As long as you maintain an active account with us</li>
                <li>As required to provide our services and fulfill our contract</li>
                <li>As necessary to comply with legal obligations, resolve disputes, and enforce agreements</li>
              </ul>
              <p className="mb-3 break-words">When your data is no longer needed, we securely delete or anonymize it.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">International Data Transfers</h2>
              <p className="mb-3 break-words">MagicMuse may transfer your personal data to countries outside the European Economic Area (EEA). When we do so, we ensure appropriate safeguards are in place, such as:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>EU Standard Contractual Clauses</li>
                <li>Only transferring to countries with adequate protection as determined by the European Commission</li>
                <li>Implementing supplementary measures where necessary</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Data Processors</h2>
              <p className="mb-3 break-words">We use carefully selected third-party service providers to help deliver our services. These providers act as data processors and only process data according to our instructions. All processors are bound by data processing agreements that comply with GDPR requirements.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Cookies and Tracking Technologies</h2>
              <p className="mb-3 break-words">Our website uses cookies and similar technologies to enhance your experience. You can manage your cookie preferences through our Cookie Management Center. For detailed information about the cookies we use, please see our Cookie Policy.</p> {/* Removed brackets */}
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Children's Privacy</h2>
              <p className="mb-3 break-words">Our services are not intended for children under 16 years of age. We do not knowingly collect personal data from children. If you believe we have collected data from a child, please contact us immediately.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Data Breach Procedures</h2>
              <p className="mb-3 break-words">In the unlikely event of a data breach that risks your rights and freedoms, we will:</p>
              <ul className="list-disc space-y-1 ml-5 mb-3 break-words">
                <li>Notify the relevant supervisory authority within 72 hours</li>
                <li>Inform affected individuals without undue delay</li>
                <li>Document all breaches and remedial actions</li>
                <li>Cooperate fully with authorities</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Changes to This Statement</h2>
              <p className="mb-3 break-words">We may update this GDPR Compliance Statement to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes through our website or via email.</p>
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">How to Contact Us or File a Complaint</h2>
              <p className="mb-3 break-words">If you have questions, concerns, or complaints about how we handle your personal data, please contact our Data Protection Officer at <a href="mailto:legal@magicmuse.io" className="text-[#ae5630] hover:underline">legal@magicmuse.io</a>.</p> {/* Updated Email */}
              <p className="mb-3 break-words">You also have the right to lodge a complaint with your local data protection authority.</p> {/* Removed placeholder lead authority */}
            </section>

            <section className="mb-6">
              <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Additional Resources</h2>
              <ul className="list-disc space-y-1 ml-5 break-words">
                <li>Privacy Policy</li> {/* Removed brackets */}
                <li>Terms of Service</li> {/* Removed brackets */}
                <li>Cookie Policy</li> {/* Removed brackets */}
                {/* Removed Data Subject Rights Request Form placeholder */}
              </ul>
            </section>

          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default GdprComplianceModal;
