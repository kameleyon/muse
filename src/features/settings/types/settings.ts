import { ReactNode } from 'react';

export interface SettingsSubcategory {
  id: string;
  label: string;
  icon: ReactNode;
}

export interface SettingsCategory {
  id: string;
  label: string;
  icon: ReactNode;
  subcategories: SettingsSubcategory[];
}
