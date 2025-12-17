# Reusable TanStack Table Component

This is a reusable table component built with TanStack Table (React Table) that provides the following features:

## Features

- Server-side pagination, sorting, and search
- Action buttons (Edit, Delete, Toggle Status)
- Responsive design
- Customizable columns
- Loading states
- Type safety with TypeScript

## Installation

The component requires the following dependencies:

```bash
npm install @tanstack/react-table react-icons
```

## Usage

### Basic Usage

```tsx
import { ReusableTable } from '@/components/Table';

// Define your data interface
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

// Define table columns
const columns = [
  {
    header: 'Name',
    accessorKey: 'name',
  },
  {
    header: 'Email',
    accessorKey: 'email',
  },
  {
    header: 'Role',
    accessorKey: 'role',
  },
  {
    header: 'Status',
    accessorKey: 'isActive',
    cell: ({ getValue }: any) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        getValue() 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }`}>
        {getValue() ? 'Active' : 'Inactive'}
      </span>
    )
  },
  {
    header: 'Created At',
    accessorKey: 'createdAt',
  }
];

// In your component
<ReusableTable<User>
  columns={columns}
  data={data?.users || []}
  isLoading={isLoading}
  totalCount={data?.totalCount || 0}
  pageCount={data?.pageCount || 0}
  searchable={true}
  sortable={true}
  showActions={true}
  onToggleStatus={handleToggleStatus}
  onDelete={handleDelete}
  fetchData={({ pageIndex, pageSize, search }) => {
    setPageIndex(pageIndex);
    setPageSize(pageSize);
    setSearchTerm(search || '');
  }}
/>
```

### Props

| Prop | Type | Description | Default |
|------|------|-------------|---------|
| columns | `ColumnDef<T>[]` | Table columns definition | - |
| data | `T[]` | Array of data to display | - |
| isLoading | `boolean` | Loading state | `false` |
| pageCount | `number` | Total number of pages | `0` |
| totalCount | `number` | Total number of records | `0` |
| fetchData | `function` | Function to fetch data with pagination params | - |
| onEdit | `function` | Callback when edit button is clicked | - |
| onDelete | `function` | Callback when delete button is clicked | - |
| onToggleStatus | `function` | Callback when toggle status button is clicked | - |
| searchable | `boolean` | Show/hide search bar | `true` |
| sortable | `boolean` | Enable/disable column sorting | `true` |
| showActions | `boolean` | Show/hide action buttons | `true` |

## Example Implementation

See `src/app/(admin)/admin/category/list.tsx` and `src/app/(admin)/admin/users/list.tsx` for complete examples of how to use this component.

## Customization

You can customize the table by:

1. Adding custom cell renderers in the column definitions
2. Modifying the CSS classes in the component
3. Extending the props to add more functionality

## Action Buttons

The component provides three action buttons:

1. **Toggle Status** - For activating/deactivating records
2. **Edit** - For editing records
3. **Delete** - For deleting records

Each button can be enabled/disabled independently by providing the corresponding callback function.