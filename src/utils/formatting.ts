// Helper function to format date
export const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        // Basic check for invalid date
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
    } catch (error) {
        console.error("Error formatting date:", dateString, error);
        return 'Invalid Date';
    }
};

// Helper function to truncate text
export const truncateText = (text: string | null | undefined, maxLength: number): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

// Helper function to get badge color based on content type
export const getBadgeColorForType = (type: string | null | undefined): string => {
    switch (type) {
        case 'blog': return 'bg-accent-teal/20 text-accent-teal';
        case 'marketing': return 'bg-primary/20 text-primary-hover';
        case 'creative': return 'bg-accent-purple/20 text-accent-purple';
        case 'academic': return 'bg-secondary/20 text-secondary';
        case 'social': return 'bg-success/20 text-success';
        default: return 'bg-neutral-light/40 text-neutral-medium';
    }
};