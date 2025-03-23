export const ResourceAction = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  LIST: 'list',
  EXPORT: 'export',
  IMPORT: 'import',
  PRINT: 'print',
  VERIFY: 'verify',
  APPROVE: 'approve',
} as const;

export type ResourceActionType =
  (typeof ResourceAction)[keyof typeof ResourceAction];

export const RESOURCE_ACTION_METADATA: Record<
  ResourceActionType,
  ResourceActionMetadata
> = {
  [ResourceAction.CREATE]: {
    name: 'Create',
    description: 'Create a new resource',
    icon: 'plus',
  },
  [ResourceAction.READ]: {
    name: 'Read',
    description: 'Read a resource',
    icon: 'eye',
  },
  [ResourceAction.UPDATE]: {
    name: 'Update',
    description: 'Update a resource',
    icon: 'pencil',
  },
  [ResourceAction.DELETE]: {
    name: 'Delete',
    description: 'Delete a resource',
    icon: 'trash',
  },
  [ResourceAction.LIST]: {
    name: 'List',
    description: 'List all resources',
    icon: 'list',
  },
  [ResourceAction.EXPORT]: {
    name: 'Export',
    description: 'Export resources to a file',
    icon: 'file-export',
  },
  [ResourceAction.IMPORT]: {
    name: 'Import',
    description: 'Import resources from a file',
    icon: 'file-import',
  },
  [ResourceAction.PRINT]: {
    name: 'Print',
    description: 'Print a resource',
    icon: 'print',
  },
  [ResourceAction.VERIFY]: {
    name: 'Verify',
    description: 'Verify a resource',
    icon: 'check',
  },
  [ResourceAction.APPROVE]: {
    name: 'Approve',
    description: 'Approve a resource',
    icon: 'check',
  },
};

export interface ResourceActionMetadata {
  name: string;
  description: string;
  icon?: string;
}
