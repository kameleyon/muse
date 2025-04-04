import React, { useState, useEffect, useMemo } from 'react';
import { getNotificationsAPI, Notification } from '@/services/notificationService';
import { format, parseISO, isSameDay, startOfDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'; // Assuming Card components exist
import { Badge } from '@/components/ui/Badge'; // Assuming Badge component exists
import { Button } from '@/components/ui/Button'; // Assuming Button component exists
import { Checkbox } from '@/components/ui/Checkbox'; // Assuming Checkbox component exists
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'; // Assuming Popover components exist
import { Settings2, BellRing, Info, FileText, Check } from 'lucide-react'; // Icons

// Define filter types
type FilterType = 'All' | 'Announcements' | 'Information' | 'Changelog';

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<FilterType>>(new Set(['All'])); // Default to 'All'

  useEffect(() => {
    const fetchAllNotifications = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch all notifications (no limit)
        const fetchedNotifications = await getNotificationsAPI();
        if (fetchedNotifications) {
          setNotifications(fetchedNotifications);
        } else {
          setError("Failed to load notifications.");
        }
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllNotifications();
  }, []);

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    return notifications.reduce((acc, notification) => {
      try {
        const dateKey = format(startOfDay(parseISO(notification.created_at)), 'yyyy-MM-dd');
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(notification);
        return acc;
      } catch (e) {
        console.error("Error parsing date for grouping:", notification.created_at, e);
        // Group invalid dates separately or handle as needed
        const invalidDateKey = 'invalid-dates';
         if (!acc[invalidDateKey]) {
          acc[invalidDateKey] = [];
        }
        acc[invalidDateKey].push(notification);
        return acc;
      }
    }, {} as Record<string, Notification[]>);
  }, [notifications]);

  // Filter notifications based on active filters
  const filteredNotifications = useMemo(() => {
    if (activeFilters.has('All')) {
      return groupedNotifications;
    }
    const filteredGroups: Record<string, Notification[]> = {};
    for (const dateKey in groupedNotifications) {
      const group = groupedNotifications[dateKey];
      const filteredGroup = group.filter(notification => {
        // Map notification type to FilterType (case-insensitive for flexibility)
        const typeLower = notification.type?.toLowerCase();
        if (activeFilters.has('Announcements') && typeLower === 'announcement') return true;
        if (activeFilters.has('Information') && typeLower === 'information') return true; // Assuming 'information' type
        if (activeFilters.has('Changelog') && typeLower === 'changelog') return true; // Assuming 'changelog' type
        // Add more type mappings if needed
        return false;
      });
      if (filteredGroup.length > 0) {
        filteredGroups[dateKey] = filteredGroup;
      }
    }
    return filteredGroups;
  }, [groupedNotifications, activeFilters]);

  const sortedDateKeys = useMemo(() => {
     return Object.keys(filteredNotifications).sort((a, b) => b.localeCompare(a)); // Sort dates descending (newest first)
  }, [filteredNotifications]);

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (filter === 'All') {
        // If 'All' is selected, clear others and add 'All'
        return new Set(['All']);
      } else {
        // If another filter is selected, remove 'All'
        newFilters.delete('All');
        if (newFilters.has(filter)) {
          newFilters.delete(filter); // Toggle off
        } else {
          newFilters.add(filter); // Toggle on
        }
        // If no specific filters are left, default back to 'All'
        if (newFilters.size === 0) {
          return new Set(['All']);
        }
        return newFilters;
      }
    });
  };

  const getNotificationIcon = (type?: string) => {
    switch (type?.toLowerCase()) {
      case 'announcement': return <BellRing className="h-4 w-4 mr-2 text-green-600" />;
      case 'information': return <Info className="h-4 w-4 mr-2 text-blue-600" />;
      case 'changelog': return <FileText className="h-4 w-4 mr-2 text-purple-600" />;
      case 'update': return <Info className="h-4 w-4 mr-2 text-blue-600" />; // Map 'update' to Information icon
      case 'tip': return <Info className="h-4 w-4 mr-2 text-yellow-600" />; // Example for 'tip'
      default: return <BellRing className="h-4 w-4 mr-2 text-gray-500" />; // Default icon
    }
  };

  const formatDisplayDate = (dateKey: string) => {
     try {
       return format(parseISO(dateKey), 'MMMM dd, yyyy'); // e.g., March 31, 2025
     } catch {
       return "Invalid Date";
     }
  };

   const formatDisplayTime = (timestamp: string) => {
     try {
       return format(parseISO(timestamp), 'h:mm a'); // e.g., 3:18 PM
     } catch {
       return "";
     }
   };


  return (
    <div className="container mx-auto py-8 px-4 md:px-4 lg:px-2">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
        {/* Filter Section */}
        <div className="flex items-center space-x-4">
           {/* Simple Tabs for now - replace with image style later */}
           {(['All', 'Announcements', 'Information', 'Changelog'] as FilterType[]).map(f => (
             <Button
               key={f}
               variant={activeFilters.has(f) ? 'secondary' : 'ghost'}
               size="sm"
               onClick={() => handleFilterChange(f)}
               className={`px-3 py-1 rounded-md ${activeFilters.has(f) ? 'bg-gray-200 text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
             >
               {f}
             </Button>
           ))}

          {/* Settings Popover (Basic Structure) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings2 className="h-5 w-5 text-gray-600" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-60 p-4">
              <h4 className="font-medium mb-3 text-sm text-gray-700">Notification Settings</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="notify-announcements" className="text-sm text-gray-600">Announcements</label>
                  <Checkbox id="notify-announcements" defaultChecked />
                </div>
                 <div className="flex items-center justify-between">
                  <label htmlFor="notify-information" className="text-sm text-gray-600">Information</label>
                  <Checkbox id="notify-information" defaultChecked />
                </div>
                 <div className="flex items-center justify-between">
                  <label htmlFor="notify-changelog" className="text-sm text-gray-600">Changelog</label>
                  <Checkbox id="notify-changelog" defaultChecked />
                </div>
                 {/* Add more settings as needed */}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </header>

      {loading && <p className="text-center text-gray-500">Loading notifications...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && !error && (
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar - Dates */}
          <aside className="w-full md:w-1/4 lg:w-1/5 space-y-4">
            {sortedDateKeys.map(dateKey => (
              <div key={dateKey}>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">{formatDisplayDate(dateKey)}</h3>
                <ul className="space-y-1">
                  {filteredNotifications[dateKey].map(notification => (
                     <li key={notification.id} className="text-xs text-gray-400 flex items-center">
                       {getNotificationIcon(notification.type)}
                       <span>{formatDisplayTime(notification.created_at)}</span>
                       <span className="ml-2 truncate font-medium text-gray-600">{notification.title}</span> {/* Show title preview */}
                     </li>
                  ))}
                </ul>
              </div>
            ))}
             {sortedDateKeys.length === 0 && <p className="text-sm text-gray-400">No notifications match the current filter.</p>}
          </aside>

          {/* Main Content Area - Notification Details */}
          <main className="w-full md:w-3/4 lg:w-4/5 space-y-6">
            {sortedDateKeys.map(dateKey => (
              <div key={`content-${dateKey}`}>
                {/* Optionally repeat date header here if needed */}
                {/* <h2 className="text-xl font-semibold text-gray-700 mb-4">{formatDisplayDate(dateKey)}</h2> */}
                {filteredNotifications[dateKey].map(notification => (
                  <Card key={`card-${notification.id}`} className="mb-4 border border-gray-200 shadow-sm">
                    <CardHeader className="pb-2 pt-4 px-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                           {getNotificationIcon(notification.type)}
                           <CardTitle className="text-lg font-semibold text-gray-800">{notification.title}</CardTitle>
                        </div>
                        <span className="text-xs text-gray-400 whitespace-nowrap">{formatDisplayDate(dateKey)} - {formatDisplayTime(notification.created_at)}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      {/* Render message - potentially use markdown renderer if messages contain markdown */}
                      <p className="text-sm text-gray-600 leading-relaxed">{notification.message}</p>
                      {notification.link && (
                        <a href={notification.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline mt-2 inline-block">
                          Learn More
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
             {sortedDateKeys.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-gray-500">No notifications to display.</p>
                </div>
             )}
          </main>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
