export const ResourceModule = {
  USERS: 'users',
  PRODUCTS: 'products',
  ORDERS: 'orders',
  CUSTOMERS: 'customers',
  INVENTORY: 'inventory',
  MARKETING: 'marketing',
  SETTINGS: 'settings',
  REPORTS: 'reports',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
} as const;

export type ResourceModuleType =
  (typeof ResourceModule)[keyof typeof ResourceModule];

export interface ResourceModuleMetadata {
  name: string;
  description: string;
  icon?: string;
}

export const RESOURCE_MODULE_METADATA: Record<
  ResourceModuleType,
  ResourceModuleMetadata
> = {
  [ResourceModule.USERS]: {
    name: 'User Management',
    description: 'Manage system users and their access',
    icon: 'users',
  },
  [ResourceModule.PRODUCTS]: {
    name: 'Product Management',
    description: 'Manage products and their variants',
    icon: 'box',
  },
  [ResourceModule.ORDERS]: {
    name: 'Order Management',
    description: 'Manage orders and their statuses',
    icon: 'shopping-cart',
  },
  [ResourceModule.CUSTOMERS]: {
    name: 'Customer Management',
    description: 'Manage customers and their details',
    icon: 'users',
  },
  [ResourceModule.INVENTORY]: {
    name: 'Inventory Management',
    description: 'Manage inventory and stock levels',
    icon: 'inventory',
  },
  [ResourceModule.MARKETING]: {
    name: 'Marketing Management',
    description: 'Manage marketing campaigns and promotions',
    icon: 'marketing',
  },
  [ResourceModule.SETTINGS]: {
    name: 'System Settings',
    description: 'Manage system settings and configurations',
    icon: 'settings',
  },
  [ResourceModule.REPORTS]: {
    name: 'Reports',
    description: 'Generate and view reports',
    icon: 'chart-line',
  },
  [ResourceModule.ROLES]: undefined,
  [ResourceModule.PERMISSIONS]: undefined,
};
