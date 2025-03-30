export interface Project {
  id: string;
  title: string;
  date: string;
  views: number;
  status: 'Draft' | 'Published';
}

export const recentProjectsData: Project[] = [
  { id: 'proj1', title: 'Fantasy Novel', date: new Date().toISOString(), views: 12, status: 'Draft' },
  { id: 'proj2', title: 'Character Profiles', date: new Date().toISOString(), views: 8, status: 'Published' },
  { id: 'proj3', title: 'World Building', date: new Date().toISOString(), views: 15, status: 'Draft' },
  { id: 'proj4', title: 'Plot Outline', date: new Date().toISOString(), views: 5, status: 'Draft' }
];