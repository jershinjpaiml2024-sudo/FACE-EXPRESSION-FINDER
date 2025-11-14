
import type { UserRole, View } from './types';

export const USER_ROLES: UserRole[] = ['Admin', 'Energy Manager', 'Faculty/Staff', 'Student'];

export const VIEW_ICONS: Record<View, string> = {
  dashboard: 'fa-solid fa-chart-pie',
  'optimization-planner': 'fa-solid fa-lightbulb',
  'device-control': 'fa-solid fa-toggle-on',
  reports: 'fa-solid fa-file-alt',
};

export const VIEW_NAMES: Record<View, string> = {
  dashboard: 'Dashboard',
  'optimization-planner': 'AI Planner',
  'device-control': 'Device Control',
  reports: 'Reports',
};
