// src/components/dashboard/WelcomeSection.tsx
import React, { useEffect, useState, lazy, Suspense } from 'react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import Loading from '@/components/common/Loading';

// Lazy load the modal
const NewProjectModal = lazy(() => import('@/features/project_creation/components/NewProjectModal'));
import {
  ProjectCategory,
  ProjectSubcategory,
  ProjectSection,
  ProjectItem,
} from '@/features/project_creation/data/projectCategories'; // Import types

interface WelcomeSectionProps {
  userName: string;
  draftCount: number;
  publishedCount: number;
  onProjectCreated: (details: { /* Keep details structure consistent */
    category: ProjectCategory;
    subcategory: ProjectSubcategory;
    section: ProjectSection;
    // item: ProjectItem; // Removed item
    projectName: string;
  }) => Promise<string | null>; // Change return type
}

interface DailyQuote {
  text: string;
  author: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({
  userName,
  draftCount,
  publishedCount,
  onProjectCreated, // Destructure the new prop
}) => {
  const [timeOfDay, setTimeOfDay] = useState<string>('');
  const [quote, setQuote] = useState<DailyQuote | null>(null); // Initialize as null
  const [isQuoteLoading, setIsQuoteLoading] = useState(true); // Add loading state for quote
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get the greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setTimeOfDay('Morning');
    } else if (hour >= 12 && hour < 18) {
      setTimeOfDay('Afternoon');
    } else if (hour >= 18 && hour < 22) {
      setTimeOfDay('Evening');
    } else {
      setTimeOfDay('Night');
    }

    // Fetch quote from OpenRouter
    const fetchQuote = async () => {
      setIsQuoteLoading(true);
      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "model": "qwen/qwen-plus",
            "messages": [
              { "role": "user", "content": "Provide a random meaningful quote suitable for a creative professional. Only return the quote text and the author, separated by ' - '. Example: 'Creativity takes courage.' - Henri Matisse" }
            ],
            "max_tokens": 200,
            "temperature": 0.8
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
         // Add check for data.choices
        const quoteContent = data?.choices?.[0]?.message?.content?.trim();

        if (quoteContent) {
          // Attempt to parse the quote and author
          const parts = quoteContent.split(' - ');
          if (parts.length >= 2) {
            const text = parts.slice(0, -1).join(' - ').replace(/^['"]|['"]$/g, ''); // Remove surrounding quotes if any
            const author = parts[parts.length - 1];
            setQuote({ text, author });
          } else {
             // Fallback if parsing fails - use the whole content as text
             console.warn("Could not parse author from quote:", quoteContent);
              setQuote({ text: quoteContent.replace(/^['"]|['"]$/g, ''), author: 'Unknown' });
           }
         } else {
           console.log("OpenRouter Response (Quote):", data); // Log full response
           throw new Error("No quote content received");
         }

      } catch (error) {
        console.error("Failed to fetch quote:", error);
        // Fallback to a default quote on error
        setQuote({
          text: 'The best way to predict the future is to create it.',
          author: 'Abraham Lincoln',
        });
      } finally {
        setIsQuoteLoading(false);
      }
    };

    fetchQuote();

  }, []);

  // Extract first name for greeting
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  // --- Modal Handlers ---
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateProject = async (details: { // Added async keyword here
    category: ProjectCategory;
    subcategory: ProjectSubcategory;
    section: ProjectSection;
    // item: ProjectItem; // Removed item
    projectName: string;
  }): Promise<string | null> => {
    console.log('Creating project with details:', details);
    // TODO: Implement actual project creation logic here (e.g., API call)
    // This might involve dispatching an action or calling a service function.
    // Example: const newProjectId = await dispatch(createProject(details));
    // Removed incorrect call: onProjectCreated(details.projectName);

    try {
      // Simulate successful creation and return a dummy ID
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate async operation
      const newProjectId = `proj_${Date.now()}`;
      console.log(`Simulated creation, got ID: ${newProjectId}`);
      
      handleCloseModal(); // Close modal after handling creation (or on success)
      return newProjectId; // Return the dummy ID
    } catch (error) {
      console.error("Simulated project creation failed:", error);
      handleCloseModal(); // Close modal even on failure
      return null; // Return null on failure
    }
  };
  // --- End Modal Handlers ---

  return (
    <> {/* Use Fragment to wrap component and modal */}
      <div className="mb-8 bg-neutral-white rounded-2xl p-6 border border-neutral-light/40 shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold font-heading text-secondary mb-2">
          Good {timeOfDay}, <span className="inline">{getFirstName(userName)}</span>
          <span className="inline">!</span>
        </h1>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-neutral-medium max-w-xl">
            You have {draftCount} project{draftCount !== 1 ? 's' : ''} in progress and {publishedCount} completed project{publishedCount !== 1 ? 's' : ''}.
          </p>
          <div className="flex gap-2">
            {/* --- Updated New Project Button --- */}
            <Button
              variant="primary"
              className="text-[#faf9f5]"
              onClick={handleOpenModal} // Added onClick handler
              leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              }
            >
              New Project
            </Button>
            {/* --- End Updated Button --- */}

            {/* View All Button - Assuming it links somewhere */}
            <Link to="/projects">
              <Button variant="outline" leftIcon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                </svg>
              }>
                View All
              </Button>
            </Link>
          </div>
        </div>

        {/* Quote of the Day */}
        <div className="mt-4 p-4 bg-neutral-light/30 rounded-xl border border-neutral-light min-h-[80px] flex flex-col justify-center"> {/* Added min-height and flex for loading */}
          {isQuoteLoading ? (
            <p className="text-neutral-medium italic text-center">Fetching inspiration...</p>
          ) : quote ? (
            <>
              <p className="text-neutral-medium italic">"{quote.text}"</p>
              <p className="text-right text-sm text-neutral-medium mt-1">— {quote.author}</p>
            </>
          ) : (
             <p className="text-neutral-medium italic">Could not load quote.</p> // Fallback message if quote is null after loading
          )}
        </div>
      </div>

      {/* --- Render Modal --- */}
      <Suspense fallback={<Loading />}>
        <NewProjectModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onCreateProject={handleCreateProject}
        />
      </Suspense>
      {/* --- End Render Modal --- */}
    </>
  );
};

export default WelcomeSection;
