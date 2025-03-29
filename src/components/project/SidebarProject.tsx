import React, { useState } from 'react';
import { Card } from '@/components/ui/Card'; // Assuming Card component is reusable
import { projectMenuItems, ProjectMenuItem, ProjectSubItem } from './data/projectMenuItems'; // Import from .tsx
import { ChevronUp, ChevronDown } from 'lucide-react';
import '@/styles/SidebarProject.css'; // Keep existing CSS import

// Define props if needed in the future, for now empty
interface SidebarProjectProps {}

const SidebarProject: React.FC<SidebarProjectProps> = () => {
  // State to manage active menu item and sub-item
  const [activeItem, setActiveItem] = useState<string>(projectMenuItems[0]?.id || ''); // Default to first item
  const [activeSubItem, setActiveSubItem] = useState<string>('');
  const [mobileMenuExpanded, setMobileMenuExpanded] = useState(false); // For mobile responsiveness

  // Function to handle main item clicks
  const handleItemClick = (itemId: string, subItems?: ProjectSubItem[]) => {
    setActiveItem(itemId);
    // If the item has sub-items, activate the first one by default, otherwise clear sub-item selection
    setActiveSubItem(subItems && subItems.length > 0 ? subItems[0].id : '');
    if (window.innerWidth < 1024) { // Assuming lg breakpoint is 1024px
      setMobileMenuExpanded(false); // Collapse mobile menu on selection
    }
    // TODO: Add logic here to update the main ProjectArea content based on selection
    console.log(`Selected item: ${itemId}, subItem: ${activeSubItem}`);
  };

  // Function to handle sub-item clicks
  const handleSubItemClick = (subItemId: string) => {
    setActiveSubItem(subItemId);
    if (window.innerWidth < 1024) {
      setMobileMenuExpanded(false);
    }
    // TODO: Add logic here to update the main ProjectArea content based on selection
    console.log(`Selected item: ${activeItem}, subItem: ${subItemId}`);
  };

  // Toggle mobile menu visibility
  const toggleMobileMenu = () => {
    setMobileMenuExpanded(!mobileMenuExpanded);
  };

  return (
    <Card className="sidebar-project-menu shadow-sm sm:shadow-md hover:shadow-lg transition-shadow mb-4 lg:mb-6 sticky top-0"> {/* Adjust top offset if needed */}
      <div className="p-3 sm:p-4 border-b border-neutral-light/40 bg-white/5 flex items-center justify-between">
        <h2 className="text-lg sm:text-xl font-comfortaa text-[#1a1918]">Project Menu</h2>
        <button
          className="lg:hidden text-[#ae5630]"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuExpanded ? "Collapse menu" : "Expand menu"}
        >
          {mobileMenuExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>
      <div className={`p-3 sm:p-4 ${mobileMenuExpanded ? 'block' : 'hidden lg:block'}`}>
        <nav>
          <ul className="space-y-1">
            {projectMenuItems.map((item: ProjectMenuItem) => (
              <li key={item.id}>
                <button
                  className={`settings-menu-item w-full text-left ${ // Use settings class
                    activeItem === item.id ? 'active' : '' // Add active class conditionally
                  }`}
                  onClick={() => handleItemClick(item.id, item.subItems)}
                >
                  <span className="flex-shrink-0 w-5 h-5">{item.icon}</span>
                  <span className="text-xs sm:text-sm md:text-base flex-grow">{item.label}</span>
                   {/* Optional: Add chevron if item has subItems and is active */}
                   {item.subItems && activeItem === item.id && (
                     <ChevronDown size={16} className="ml-auto transition-transform duration-200" />
                   )}
                </button>

                {/* Show sub-items if item is active and has sub-items */}
                {activeItem === item.id && item.subItems && (
                  <ul className="project-submenu mt-1 space-y-1 pl-6 border-l border-neutral-light ml-3"> {/* Indentation and border */}
                    {item.subItems.map((subItem: ProjectSubItem) => (
                      <li key={subItem.id}>
                        <button
                          className={`settings-submenu-item w-full text-left ${ // Use settings class
                            activeSubItem === subItem.id ? 'active' : '' // Add active class conditionally
                          }`}
                          onClick={() => handleSubItemClick(subItem.id)}
                        >
                          <span className="flex-shrink-0 w-4 h-4">{subItem.icon}</span>
                          <span className="text-xs sm:text-sm flex-grow">{subItem.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </Card>
  );
};

export default SidebarProject;