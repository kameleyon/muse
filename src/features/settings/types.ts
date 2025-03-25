import { ReactElement } from 'react';

export interface SettingsSubcategory {
  id: string;
  label: string;
  icon: ReactElement;
}

export interface SettingsCategory {
  id: string;
  label: string;
  icon: ReactElement;
  subcategories: SettingsSubcategory[];
}
