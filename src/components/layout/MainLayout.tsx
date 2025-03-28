import React, { useState, useEffect, lazy, Suspense } from 'react'; // Added useState, useEffect, lazy, Suspense
import { useSelector, useDispatch } from 'react-redux'; // Added useDispatch
import { RootState } from '@/store/store';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { completeLogout } from '@/utils/clearCache';
import { getUserProfile, updateUserProfile } from '@/services/supabase'; // Added profile functions
import { addToast } from '@/store/slices/uiSlice'; // Added addToast

// Lazy load OnboardingModal
const OnboardingModal = lazy(() => import('@/features/onboarding/components/OnboardingModal'));
import { OnboardingData } from '@/features/onboarding/components/OnboardingModal'; // Import type

import LandingFooter from '@/components/landing/LandingFooter';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import NavigationMenu from '@/components/dashboard/NavigationMenu';
import SidebarProject from '@/components/project/SidebarProject'; // Added import
import ProjectArea from '@/components/project/ProjectArea'; // Added import
import {
  Home,
  FolderOpen,
  FileText,
  Bookmark,
  Users,
  Bell,
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Added navigate
  const location = useLocation(); // Added location

  const [profile, setProfile] = useState<any>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [showProjectView, setShowProjectView] = useState(false); // State for project view

  // Handler to switch to project view
  const handleProjectCreationSuccess = () => {
    console.log("Switching to project view...");
    setShowProjectView(true);
  };

  // Fetch profile and check onboarding status
  useEffect(() => {
    const fetchProfileAndCheckOnboarding = async () => {
      if (user?.id) {
        setIsLoadingProfile(true);
        try {
          const { data: userProfile, error } = await getUserProfile(user.id);
          if (error) throw error;

          setProfile(userProfile);

          // Check if onboarding is needed (e.g., primary_content_purpose is missing)
          // Adjust this condition based on which fields signify completed onboarding
          if (!userProfile?.primary_content_purpose) {
             // Don't show onboarding immediately on auth pages or if modal is already managed elsewhere
             if (!location.pathname.startsWith('/auth')) {
                console.log("Onboarding needed, showing modal.");
                setShowOnboarding(true);
             }
          } else {
            console.log("Onboarding already completed.");
            setShowOnboarding(false);
          }
        } catch (error: any) {
          console.error('Failed to fetch user profile:', error);
          dispatch(addToast({ type: 'error', message: 'Could not load user profile.' }));
          // Decide how to handle profile load failure - maybe redirect?
        } finally {
          setIsLoadingProfile(false);
        }
      } else {
        // No user ID, clear profile and hide onboarding
        setProfile(null);
        setShowOnboarding(false);
        setIsLoadingProfile(false);
      }
    };

    fetchProfileAndCheckOnboarding();
  }, [user?.id, dispatch, location.pathname]); // Rerun if user ID changes or location changes


  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!user?.id) return;
    console.log("Onboarding complete handler called with data:", data);
    try {
      // The OnboardingModal already saves the data via its internal service call.
      // Here, we just need to hide the modal and potentially refresh the profile state.
      setShowOnboarding(false);
      dispatch(addToast({ type: 'success', message: 'Preferences saved!' }));

      // Optionally re-fetch profile to confirm update, or update local state directly
      const { data: updatedProfile, error } = await getUserProfile(user.id);
      if (error) throw error;
      setProfile(updatedProfile); // Update local profile state

    } catch (error: any) {
      console.error('Error finalizing onboarding:', error);
      dispatch(addToast({ type: 'error', message: 'Could not finalize onboarding.' }));
      // Keep modal open or handle error appropriately
    }
  };

  const handleOnboardingSkip = async () => {
     if (!user?.id) return;
     console.log("Onboarding skip handler called.");
     try {
        // Optionally mark profile as skipped onboarding if needed
        // await updateUserProfile(user.id, { onboarding_skipped: true });
        setShowOnboarding(false);
        dispatch(addToast({ type: 'info', message: 'Onboarding skipped. You can update preferences in Settings.' }));
     } catch (error: any) {
        console.error('Error skipping onboarding:', error);
        dispatch(addToast({ type: 'error', message: 'Could not skip onboarding.' }));
     }
  };


  // Use profile name if available, otherwise fallback
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const displayInitial = displayName[0]?.toUpperCase() || 'U';


  const navigationItems = [
    { path: '/dashboard', label: 'Home', icon: <Home size={20} color="#3d3d3a" /> },
    { path: '/projects', label: 'My Projects', icon: <FolderOpen size={20} color="#3d3d3a" /> },
    { path: '/templates', label: 'Templates', icon: <FileText size={20} color="#3d3d3a" /> },
    { path: '/bookmarks', label: 'Bookmarks', icon: <Bookmark size={20} color="#3d3d3a" /> },
    { path: '/team', label: 'Team', icon: <Users size={20} color="#3d3d3a" /> },
    { path: '/notifications', label: 'Notifications', icon: <Bell size={20} color="#3d3d3a" /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} color="#3d3d3a" /> },
    { path: '/logout', label: 'Logout', icon: <LogOut size={20} color="#3d3d3a" /> }
  ];
  
  // Sample project stats - in a real app these would be fetched from an API
  const draftCount = 3;
  const publishedCount = 8;
  
  return (
    <div className="bg-[#EDEAE2] min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-[#1a1918]/80 text-white px-6 py-3 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center">
            <img src="/mmlogolight.png" alt="MagicMuse Logo" className="h-8 w-auto mr-3" />
            <span className="text-3xl font-comfortaa hidden md:inline">magicmuse</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          {/* Profile Link */}
          <Link to="/profile" className="flex items-center gap-2 group">
             <span className="text-sm font-questrial inline group-hover:text-primary transition-colors">{displayName}</span>
             <div className="w-8 h-8 rounded-full bg-[#ae5630] flex items-center justify-center group-hover:ring-2 group-hover:ring-primary transition-all">
               {profile?.avatar_url ? (
                 <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full object-cover" />
               ) : (
                 <span className="text-sm font-medium text-white">{displayInitial}</span>
               )}
             </div>
          </Link>
          {/* Removed extra closing div here */}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-grow">
        <div className="px-4 sm:px-6 py-14 max-w-7xl mx-auto w-full"> {/* Added w-full */}
          {/* Welcome Section - Pass displayName */}
          <WelcomeSection
            userName={displayName}
            draftCount={draftCount}
            publishedCount={publishedCount}
            onProjectCreated={handleProjectCreationSuccess} // Pass handler down
          />
          
          {/* Navigation Menu */}
          <NavigationMenu items={navigationItems} />
          
          {/* Page Content */}
          <main>
            {showProjectView ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6"> {/* Added mt-6 for spacing */}
                <div className="lg:col-span-3">
                  <SidebarProject />
                </div>
                <div className="lg:col-span-9">
                  <ProjectArea />
                </div>
              </div>
            ) : (
              children // Render the original page content (e.g., Dashboard)
            )}
          </main>
        </div>
      </div>
      
      {/* Footer */}
      <LandingFooter />

      {/* Onboarding Modal */}
      {showOnboarding && (
        <Suspense fallback={<div>Loading Onboarding...</div>}>
          <OnboardingModal
            onComplete={handleOnboardingComplete}
            onSkip={handleOnboardingSkip}
          />
        </Suspense>
      )}
    </div>
  );
};

export default MainLayout;
