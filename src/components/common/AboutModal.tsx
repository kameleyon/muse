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


interface AboutModalProps {
  trigger: React.ReactNode; // Allow custom trigger elements
}

const AboutModal: React.FC<AboutModalProps> = ({ trigger }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      {/* Further reduced width (especially for mobile) and height */}
{/* Removed font-comfortaa from DialogContent */}
<div className="scrollbar-wrapper">
<DialogContent className="max-w-[92%] w-[600px] sm:max-w-[600px] max-h-[75vh] flex flex-col ">
        <DialogHeader className="px-6 pt-6 pb-2"> {/* Added padding */}
          {/* Increased title size */}
          {/* Increased title size further */}
          {/* Substantially larger title with additional styling */}
          {/* Use font-heading from tailwind config */}
          <DialogTitle className="text-6xl tracking-tight leading-tight font-bold text-[#1a1918] font-heading">
            About <span className="text-[#ae5630]">MagicMuse</span>
          </DialogTitle>
          {/* Optional: Add a subtitle if desired */}
          <p className="text-2xl">Transforming Ideas into Impactful Content</p>
          {/* <DialogDescription>
            Our story, mission, and vision.
          </DialogDescription> */}
        </DialogHeader>
        {/* Using exact ChatPanel scrollbar styling with 60% height from CSS file */}
        {/* Use font-body from tailwind config */}
        <div
            className="overflow-y-auto px-6 pb-2 text-[#3d3d3a] flex-grow modal-scrollable-content rounded-scrollbar font-body text-sm"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.1)'
            }}
          >
          {/* Content replaced with full text from docs/aboutus.md */}
          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Our Story</h2>
            <p className="mb-3 text-sm break-words">
              MagicMuse was born from a simple yet powerful belief: that everyone deserves the tools to express their ideas with clarity, creativity, and impact. In a world where effective communication is increasingly essential across all aspects of life, we recognized that AI technology could democratize access to high-quality writing and content creation.
            </p>
            <p className="mb-3 text-sm break-words">
              Our journey began when a team of linguists, technology innovators, and creative professionals came together with a shared vision: to harness the power of artificial intelligence to amplify human creativity rather than replace it. We observed that while AI was rapidly advancing, many platforms treated content creation as a mechanical process rather than the deeply human art form it truly is.
            </p>
            <p className="text-sm break-words">
              The result is MagicMuse – an AI-powered writing companion designed to understand, enhance, and elevate your unique voice across all forms of written expression.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Our Mission</h2>
            <p className="mb-3 text-sm break-words">
              MagicMuse exists to empower individuals and organizations to communicate with unprecedented effectiveness by providing intuitive, intelligent, and ethical AI-powered writing tools that adapt to each user's unique voice, purpose, and audience.
            </p>
            <p className="mb-2 text-sm">We accomplish this by:</p>
            <ul className="list-disc space-y-2 ml-5 text-sm"> {/* Adjusted margin-left */}
              <li className="break-words">Democratizing access to professional-quality content creation across diverse industries and purposes</li>
              <li className="break-words">Constantly advancing our AI capabilities while maintaining the irreplaceable human element in writing</li>
              <li className="break-words">Building technology that adapts to your voice rather than imposing a generic style</li>
              <li className="break-words">Upholding the highest standards of data privacy, transparency, and ethical AI use</li>
              <li className="break-words">Creating an inclusive platform that serves writers of all backgrounds, industries, and skill levels</li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Our Vision</h2>
            <p className="text-sm break-words">
              We envision a world where technology eliminates barriers to effective communication, allowing everyone to express their ideas with clarity, creativity, and authenticity. MagicMuse aims to be the global leader in AI-enhanced content creation, setting new standards for how technology can amplify human expression rather than diminish it.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">What Sets Us Apart</h2>

            <div className="mb-4"> {/* Added margin-bottom */}
              <h3 className="text-base font-semibold mb-1 text-secondary">Human-Centered AI</h3> {/* Adjusted styling */}
              <p className="text-sm break-words">
                Unlike platforms that treat content generation as a purely technical challenge, MagicMuse is built on the understanding that great writing comes from the fusion of human creativity and technological capability. Our sophisticated AI doesn't just produce generic text – it learns your preferences, adapts to your unique voice, and becomes an extension of your creative process.
              </p>
            </div>

            <div className="mb-4"> {/* Added margin-bottom */}
              <h3 className="text-base font-semibold mb-1 text-secondary">Comprehensive Content Ecosystem</h3> {/* Adjusted styling */}
              <p className="text-sm break-words mb-2">
                MagicMuse supports your entire content journey with a holistic approach to writing assistance. From brainstorming and outlining to drafting, editing, and optimization, our platform provides intelligent tools for every stage of content creation across diverse purposes:
              </p>
              <ul className="list-disc space-y-1 ml-5 text-sm"> {/* Adjusted margin-left */}
                <li className="break-words"><strong>Professional Writing</strong>: Business documents, marketing content, digital media, and specialized industry materials</li>
                <li className="break-words"><strong>Creative Expression</strong>: Fiction, screenwriting, poetry, and experimental formats</li>
                <li className="break-words"><strong>Academic & Educational</strong>: Research papers, instructional materials, and learning content</li>
                <li className="break-words"><strong>Technical & Specialized</strong>: Documentation, legal writing, medical content, and industry-specific formats</li>
              </ul>
            </div>

            <div className="mb-4"> {/* Added margin-bottom */}
              <h3 className="text-base font-semibold mb-1 text-secondary">Quality-First Approach</h3> {/* Adjusted styling */}
              <p className="text-sm break-words">
                We believe that AI should elevate content quality, not simply generate more text. MagicMuse employs advanced algorithms for fact verification, stylistic consistency, plagiarism prevention, and ethical content standards. Our platform doesn't just help you write more – it helps you write better.
              </p>
            </div>

            <div className="mb-4"> {/* Added margin-bottom */}
              <h3 className="text-base font-semibold mb-1 text-secondary">Privacy and Ethics by Design</h3> {/* Adjusted styling */}
              <p className="text-sm break-words">
                Your ideas are your own. MagicMuse is built with rigorous privacy protections and transparent data practices. We don't train our models on your content without explicit permission, and we provide clear controls over how your information is used and stored.
              </p>
            </div>

             <div className="mb-4"> {/* Added margin-bottom */}
              <h3 className="text-base font-semibold mb-1 text-secondary">Continuous Evolution</h3> {/* Adjusted styling */}
              <p className="text-sm break-words">
                The world of content doesn't stand still, and neither do we. MagicMuse continuously learns and improves through responsible AI research, user feedback, and adaptation to emerging communication trends. Our platform grows alongside you, adding new capabilities and refining existing ones to meet evolving needs.
              </p>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Our Values</h2>
            <div className="flex flex-col gap-3">
              <div className="border-l-2 border-[#ae5630] pl-3"> {/* Adjusted padding */}
                <h3 className="text-lg font-semibold mb-1 text-secondary">Empowerment</h3> {/* Adjusted styling */}
                <p className="text-sm break-words">We believe that technology should expand human potential, not replace it. Every feature we build aims to give you greater capability to express your ideas effectively.</p>
              </div>
              <div className="border-l-2 border-[#ae5630] pl-3"> {/* Adjusted padding */}
                <h3 className="text-lg font-semibold mb-1 text-secondary">Inclusivity</h3> {/* Adjusted styling */}
                <p className="text-sm break-words">Great writing shouldn't be the exclusive domain of specialists or those with privileged access to resources. MagicMuse is designed to be accessible, adaptable, and useful for diverse users across cultures, industries, and backgrounds.</p>
              </div>
              <div className="border-l-2 border-[#ae5630] pl-3"> {/* Adjusted padding */}
                <h3 className="text-lg font-semibold mb-1 text-secondary">Integrity</h3> {/* Adjusted styling */}
                <p className="text-sm break-words">We approach AI development with a deep commitment to ethical practices, including responsible data usage, transparent operations, and honest communication about both the capabilities and limitations of our technology.</p>
              </div>
              <div className="border-l-2 border-[#ae5630] pl-3"> {/* Adjusted padding */}
                <h3 className="text-lg font-semibold mb-1 text-secondary">Innovation</h3> {/* Adjusted styling */}
                <p className="text-sm break-words">We constantly push the boundaries of what's possible in AI-enhanced content creation while remaining grounded in the practical needs of real writers and communicators.</p>
              </div>
              <div className="border-l-2 border-[#ae5630] pl-3"> {/* Adjusted padding */}
                <h3 className="text-lg font-semibold mb-1 text-secondary">Excellence</h3> {/* Adjusted styling */}
                <p className="text-sm break-words">From our code to our content templates, we strive for the highest quality in everything we create, fostering a culture of continuous improvement and refinement.</p>
              </div>
            </div>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-semibold mb-3 text-[#ae5630]">Join the MagicMuse Community</h2>
            <p className="mb-3 text-sm break-words">
              MagicMuse isn't just a product – it's a growing community of writers, professionals, creators, and communicators who are exploring the future of AI-enhanced writing together. Whether you're drafting corporate reports, crafting marketing campaigns, writing creative fiction, or developing educational content, you'll find tools, resources, and support within our ecosystem.
            </p>
            <p className="text-sm break-words">
              We're building MagicMuse for you – the thinkers, creators, and communicators who understand that in a world of algorithms, the human element of writing matters more than ever. Join us in transforming how the world creates meaningful content.
            </p>
          </section>

          <footer className="text-center italic text-xs text-[#ae5630] mt-4">
            <p><em>Ready to transform your writing experience? Explore MagicMuse today and discover what happens when advanced AI meets your unique creative voice.</em></p>
          </footer>
        </div>
      </DialogContent>
      </div>
    </Dialog>
  );
};

export default AboutModal;
