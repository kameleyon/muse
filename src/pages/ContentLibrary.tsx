import React, { useEffect, useMemo, useState } from 'react'; // Added useMemo
import { getAllProjectsAPI, Project } from '@/services/projectService';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { Card, CardContent } from '@/components/ui/Card';
import { LayoutGrid, List, Search } from 'lucide-react'; // Added Search, LayoutGrid, List

// Removed static contentTypeFilters

const dateFilters = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'quarter', label: 'Last 3 Months' },
];


const ContentLibrary: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list'); // Default to list view
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 16;
  // Removed isSidebarExpanded state

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const response = await getAllProjectsAPI({ sortBy: 'created_at', sortOrder: 'desc' });
      if (response && response.projects) {
        setProjects(response.projects);
      }
      setLoading(false);
    };
    fetchProjects();
  }, []);

  // Effect to reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, dateFilter]);

  // Derive dynamic type filters from fetched projects
  const dynamicContentTypeFilters = useMemo(() => {
    if (!projects || projects.length === 0) {
      return [{ value: 'all', label: 'All Types' }];
    }
    // Use project_type for dynamic filters
    const uniqueTypes = [...new Set(projects.map(p => p.project_type).filter(Boolean) as string[])];
    const typeOptions = uniqueTypes.map(type => ({
      value: type, // Use the actual project_type value
      // Simple capitalization, adjust formatting as needed
      label: type.charAt(0).toUpperCase() + type.slice(1)
    }));
    // Sort alphabetically by label, keeping 'All Types' first
    typeOptions.sort((a, b) => a.label.localeCompare(b.label));
    return [{ value: 'all', label: 'All Types' }, ...typeOptions];
  }, [projects]);


  // Filtering logic now uses local state and project_type
  const filteredProjects = useMemo(() => {
      return projects.filter((project) => {
      // Filter by project_type
      if (typeFilter && typeFilter !== 'all' && project.project_type !== typeFilter) return false;
      if (search && !project.name.toLowerCase().includes(search.toLowerCase())) return false;
      // TODO: Implement date filtering based on dateFilter state
      return true;
    });
  }, [projects, search, typeFilter, dateFilter]); // Added dateFilter dependency


  // Pagination Calculations
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Removed toggleSidebar function

  return (
    <div className="flex bg-neutral-lightest">
      {/* Sidebar - Fixed width */}
      <aside className="w-64 mt-6 rounded-xl flex-shrink-0 border-r border-neutral-light bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 ">
           <h2 className="text-lg p-3 font-semibold border-b border-neutral-light text-neutral-dark">Search Project</h2>
        </div>
        {/* Filters Section */}
        <div className="p-4 space-y-4 flex-grow">
            {/* Search Input */}
            <Input
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="h-5 w-5 text-neutral-muted" />} // Use Search icon
            />

            {/* View Toggle */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-neutral-dark block mb-1">View</label>
              <div className="flex items-center space-x-2">
                 <Button
                   variant={viewMode === 'list' ? 'default' : 'outline'}
                   size="icon"
                   onClick={() => setViewMode('list')}
                   title="List View"
                 >
                   <List className="h-4 w-4" />
                 </Button>
                 <Button
                   variant={viewMode === 'grid' ? 'default' : 'outline'}
                   size="icon"
                   onClick={() => setViewMode('grid')}
                   title="Grid View"
                 >
                   <LayoutGrid className="h-4 w-4" />
                 </Button>
              </div>
            </div>


            {/* Type Filter (Dynamic) */}
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type..." />
              </SelectTrigger>
              <SelectContent>
                {dynamicContentTypeFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Date Filter */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by date..." />
              </SelectTrigger>
              <SelectContent>
                {dateFilters.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
        </div>

        {/* Removed old View Toggle & Collapse Toggle section */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 pl-6 pr-0 pt-6 overflow-auto flex flex-col  ">
        {loading ? (
          <div className="flex-grow flex items-center justify-center text-neutral-medium">Loading projects...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-neutral-medium">No projects found.</div>
        ) : (
          <div className="flex-grow">
            {/* Conditional Rendering based on viewMode */}
            {viewMode === 'list' ? (
              // List View (Table)
              <Card className=" border-neutral-light bg-white mb-2 shadow-sm shadow-black/40 rounded-2xl ">
                <CardContent className="p-0">
                  <div> {/* Added wrapper div for header */}
                    <h2 className="text-lg font-semibold border-b p-2 border-neutral-light text-neutral-dark">My Projects</h2>
                  </div>
                  <div className="overflow-x-auto mt-8">
                    <table className="min-w-full divide-y divide-neutral-light">
                      <thead className="bg-neutral-lightest">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-dark uppercase tracking-wider">Title</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-dark uppercase tracking-wider">Date</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-dark uppercase tracking-wider">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-semibold text-neutral-dark uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className=" divide-neutral-light">
                        {paginatedProjects.map((project) => (
                          <tr key={project.id} className="hover:bg-neutral-lightest">
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-neutral-dark">{project.name}</td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-neutral-medium">{new Date(project.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-neutral-100 text-neutral-700 capitalize">
                                {project.status ? project.status.toLowerCase() : 'draft'}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium">
                              <a href={`/projects/${project.id}/edit`} className="text-accent-teal hover:text-accent-teal-dark">
                                Edit
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {/* Pagination Controls - Moved inside main content area */}
        {totalPages > 1 && !loading && filteredProjects.length > 0 && (
          <div className="mt-8  border-neutral-light border-t pt-6 flex items-center justify-between px-4 pb-4 "> {/* Added padding */}
            <Button
              variant="outline"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-neutral-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
        {/* Start New Project Button - Placed outside the conditional rendering */}
                </CardContent>
              </Card>
            ) : (
              // Grid View - Improved Styling
              <Card className=" border-neutral-light bg-white mb-2 shadow-sm shadow-black/20 rounded-2xl ">
              <CardContent className="p-0 ">
                  <div> {/* Added wrapper div for header */}
                    <h2 className="text-lg font-semibold border-b p-2 border-neutral-light text-neutral-dark">My Projects</h2>
                  </div>
              <div className="grid mt-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedProjects.map((project) => (
                  <Card key={project.id} className="flex flex-col overflow-hidden shadow-0 border border-neutral-light">
                    <CardContent className="flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-base mb-1 truncate" title={project.name}>{project.name}</h3>
                        <p className="text-xs text-neutral-medium mb-2">
                          {new Date(project.created_at).toLocaleDateString()} - {project.status || 'Draft'}
                        </p>
                        {/* Display content snippet */}
                        <p className="text-sm text-neutral-dark mt-2 line-clamp-3">
                          {project.description || 'No description available.'} {/* Assuming project.description exists */}
                        </p>
                      </div>
                    </CardContent>
                    {/* Footer with Edit button */}
                    <div className="border-t border-neutral-light bg-neutral-lightest flex justify-end">
                       <Button variant="link" size="sm" className="text-accent-teal hover:text-accent-teal-dark p-0 h-auto mt-2" asChild>
                         <a href={`/projects/${project.id}/edit`}>Edit</a>
                       </Button>
                    </div>
                  </Card>
                ))}
              </div>
              {/* Pagination Controls - Moved inside main content area */}
        {totalPages > 1 && !loading && filteredProjects.length > 0 && (
          <div className="mt-8 flex items-center justify-between pt-8 border-neutral-light border-t px-4 pb-4"> {/* Added padding */}
            <Button
              variant="outline"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-neutral-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
        {/* Start New Project Button - Placed outside the conditional rendering */}
              </CardContent></Card>
              
            )}

            
            
          </div>
        )}

        
        {/* Start New Project Button - Placed outside the conditional rendering */}
        
      </main>
    </div>
  );
};

export default ContentLibrary;
