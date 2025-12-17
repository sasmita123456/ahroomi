import React, { useState, useMemo, useRef } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, ColumnDef, flexRender, HeaderGroup, Row, Cell } from '@tanstack/react-table';
import { FaEdit, FaToggleOn, FaToggleOff, FaArrowLeft, FaArrowRight, FaStepForward, FaStepBackward, FaFileExport, FaFileCsv, FaFilePdf, FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReusableTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
  pageCount?: number;
  totalCount?: number;
  fetchData?: (params: {
    pageIndex: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
  }) => void;
  onEdit?: (item: T) => void;
  onToggleStatus?: (item: T, newValue: boolean) => void;
  onUploadImages?: (item: T) => void;
  onExport?: (data: T[]) => void;
  searchable?: boolean;
  sortable?: boolean;
  showActions?: boolean;
  pageSizeOptions?: number[];
}

const ReusableTable = <T extends object>({
  columns,
  data,
  isLoading = false,
  pageCount = 0,
  totalCount = 0,
  fetchData,
  onEdit,
  onToggleStatus,
  onUploadImages,
  onExport,
  searchable = true,
  sortable = true,
  showActions = true,
  pageSizeOptions = [10, 20, 50, 100],
}: ReusableTableProps<T>) => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [search, setSearch] = useState('');
  const [showExportDropdown, setShowExportDropdown] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (fetchData) {
        fetchData({ pageIndex, pageSize, sortBy, sortOrder, search });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [search, fetchData, pageIndex, pageSize, sortBy, sortOrder]);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(event.target as Node)) {
        setShowExportDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePageChange = (newPageIndex: number) => {    setPageIndex(newPageIndex);
    if (fetchData) {
      fetchData({ pageIndex: newPageIndex, pageSize, sortBy, sortOrder, search });
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPageIndex(0); 
    if (fetchData) {
      fetchData({ pageIndex: 0, pageSize: newPageSize, sortBy, sortOrder, search });
    }
  };

  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    const filename = `table-export-${new Date().toISOString().slice(0, 10)}`;
    
    if (onExport) {
      onExport(data);
    } else {
      switch (format) {
        case 'csv':
          exportToCSV(data, filename);
          break;
        case 'excel':
          exportToExcel(data, filename);
          break;
        case 'pdf':
          exportToPDF(data, filename);
          break;
      }
    }
    
    setShowExportDropdown(false);
  };

  const tableColumns = useMemo(() => {
    const cols = [...columns];
    
    cols.unshift({
      id: 'serialNumber',
      header: 'Sl No.',
      cell: ({ row }: { row: Row<T> }) => {
        const serialNumber = pageIndex * pageSize + row.index + 1;
        return <span className="text-gray-700">{serialNumber}</span>;
      },
      enableSorting: false,
    });
    
    if (showActions && (onEdit || onToggleStatus || onUploadImages)) {
      cols.push({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: { row: Row<T> }) => {
          const isActive = row.original['isActive' as keyof T];
          
          return (
            <div className="flex space-x-2">
              {onToggleStatus && (
                <button 
                  onClick={() => onToggleStatus(row.original, !isActive)}
                  className="text-blue-500 hover:text-blue-700"
                  aria-label={isActive ? "Deactivate" : "Activate"}
                >
                  {isActive ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                </button>
              )}
              
              {onUploadImages && (
                <button 
                  onClick={() => onUploadImages(row.original)}
                  disabled={!isActive}
                  className={`${
                    isActive 
                      ? 'text-green-500 hover:text-green-700' 
                      : 'text-gray-400 cursor-not-allowed' 
                  }`}
                  aria-label="Upload Images"
                >
                  <FaFileExport />
                </button>
              )}
              
              {onEdit && (
                <button 
                  onClick={() => onEdit(row.original)}
                  disabled={!isActive}
                  className={`${
                    isActive 
                      ? 'text-yellow-500 hover:text-yellow-700' 
                      : 'text-gray-400 cursor-not-allowed' 
                  }`}
                  aria-label="Edit"
                >
                  <FaEdit />
                </button>
              )}
            </div>
          );
        },
        enableSorting: false,
      });
    }
    
    return cols;
  }, [columns, onEdit, onToggleStatus, onUploadImages, showActions, pageIndex, pageSize]);

  const exportToCSV = (exportData: T[], filename: string) => {
    if (!exportData.length) return;
    
    const headers = Object.keys(exportData[0]);
    
    const exportHeaders = ['Sl No.', ...headers];
    
    const csvContent = [
      exportHeaders.join(','),
      ...exportData.map((row, index) => {
        const serialNumber = pageIndex * pageSize + index + 1;
        const rowData = headers.map(header => {
          const value = row[header as keyof T];
          if (typeof value === 'string') {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return String(value ?? '');
        });
        return [serialNumber, ...rowData].join(',');
      })
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = (exportData: T[], filename: string) => {
    if (!exportData.length) return;
    
    const headers = Object.keys(exportData[0]);
    
    const exportHeaders = ['Sl No.', ...headers];
    
    const wsData = [
      exportHeaders,
      ...exportData.map((row, index) => {
        const serialNumber = pageIndex * pageSize + index + 1;
        const rowData = headers.map(header => {
          const value = row[header as keyof T];
          return value ?? '';
        });
        return [serialNumber, ...rowData];
      })
    ];
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    XLSX.writeFile(wb, `${filename}.xlsx`);
  };

  const exportToPDF = (exportData: T[], filename: string) => {
    if (!exportData.length) return;
    
    const headers = Object.keys(exportData[0]);
    
    const exportHeaders = ['Sl No.', ...headers];
    
    const body = exportData.map((row, index) => {
      const serialNumber = pageIndex * pageSize + index + 1;
      const rowData = headers.map(header => {
        const value = row[header as keyof T];
        return value ?? '';
      });
      return [serialNumber, ...rowData];
    });
    
    const doc = new jsPDF();
    autoTable(doc, {
      head: [exportHeaders],
      body: body,
      styles: {
        fontSize: 8
      },
      headStyles: {
        fillColor: [59, 130, 246] 
      }
    });
    
    doc.save(`${filename}.pdf`);
  };

  const table = useReactTable({
    data,
    columns: tableColumns,
    pageCount,
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting: sortBy ? [{ id: sortBy, desc: sortOrder === 'desc' }] : [],
    },
    onPaginationChange: (updater: any) => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      }
    },
    onSortingChange: (updater: any) => {
      const newSort = typeof updater === 'function' 
        ? updater(sortBy ? [{ id: sortBy, desc: sortOrder === 'desc' }] : []) 
        : updater;
      
      if (newSort.length > 0) {
        const { id, desc } = newSort[0];
        setSortBy(id);
        setSortOrder(desc ? 'desc' : 'asc');
        // Call fetchData when sorting changes
        if (fetchData) {
          fetchData({ 
            pageIndex, 
            pageSize, 
            sortBy: id, 
            sortOrder: desc ? 'desc' : 'asc', 
            search 
          });
        }
      } else {
        setSortBy(undefined);
        setSortOrder('asc');
        // Call fetchData when sorting is cleared
        if (fetchData) {
          fetchData({ 
            pageIndex, 
            pageSize, 
            sortBy: undefined, 
            sortOrder: 'asc', 
            search 
          });
        }
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  // Effect to trigger fetchData when sorting or pagination changes
  React.useEffect(() => {
    if (fetchData) {
      fetchData({ pageIndex, pageSize, sortBy, sortOrder, search });
    }
  }, [pageIndex, pageSize, sortBy, sortOrder, search, fetchData]);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      {/* Table Header with Export and Search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="relative mb-2 sm:mb-0" ref={exportRef}>
          <button
            onClick={() => setShowExportDropdown(!showExportDropdown)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            <FaFileExport className="mr-2" />
            <span>Export</span>
          </button>
          
          {showExportDropdown && (
            <div className="absolute left-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200 animate-dropdown">
              <button
                onClick={() => handleExport('csv')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaFileCsv className="mr-2 text-green-500" />
                Export to CSV
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaFileExcel className="mr-2 text-green-600" />
                Export to Excel
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaFilePdf className="mr-2 text-red-500" />
                Export to PDF
              </button>
            </div>
          )}
        </div>
        
        {searchable && (
          <div className="relative w-full sm:w-auto mt-2 sm:mt-0">
            <input
              type="text"
              placeholder="Search..."
              className="pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm w-full sm:w-64 text-gray-900 placeholder-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup: HeaderGroup<T>) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th 
                    key={header.id}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider ${
                      sortable && header.column.getCanSort() ? 'cursor-pointer hover:bg-gray-200' : ''
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {sortable && header.column.getCanSort() && (
                        <span className="ml-1">
                          {{
                            asc: ' ↑',
                            desc: ' ↓',
                          }[header.column.getIsSorted() as string] ?? null}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={table.getAllColumns().length} className="px-6 py-4 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row: Row<T>, index: number) => (
                <tr 
                  key={row.id} 
                  className={`
                    ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} 
                    hover:bg-blue-50 transition-colors
                  `}
                >
                  {row.getVisibleCells().map((cell: Cell<T, unknown>) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-center mb-2 sm:mb-0">
          <span className="text-sm text-gray-900 mr-2">Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-1 text-sm bg-white text-gray-900"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size} className="text-gray-900">
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm text-gray-900 ml-4">
            Showing {data.length > 0 ? pageIndex * pageSize + 1 : 0} to {Math.min((pageIndex + 1) * pageSize, totalCount)} of {totalCount} entries
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handlePageChange(0)}
            disabled={!table.getCanPreviousPage()}
            className={`p-2 rounded-md transition-colors ${
              table.getCanPreviousPage() 
                ? 'text-gray-700 hover:bg-gray-200' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            title="First page"
          >
            <FaStepBackward />
          </button>
          <button
            onClick={() => handlePageChange(pageIndex - 1)}
            disabled={!table.getCanPreviousPage()}
            className={`p-2 rounded-md transition-colors ${
              table.getCanPreviousPage() 
                ? 'text-gray-700 hover:bg-gray-200' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            title="Previous page"
          >
            <FaArrowLeft />
          </button>
          <span className="text-sm text-gray-900 mx-2">
            Page {pageIndex + 1} of {table.getPageCount() || 1}
          </span>
          <button
            onClick={() => handlePageChange(pageIndex + 1)}
            disabled={!table.getCanNextPage()}
            className={`p-2 rounded-md transition-colors ${
              table.getCanNextPage() 
                ? 'text-gray-700 hover:bg-gray-200' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            title="Next page"
          >
            <FaArrowRight />
          </button>
          <button
            onClick={() => handlePageChange(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className={`p-2 rounded-md transition-colors ${
              table.getCanNextPage() 
                ? 'text-gray-700 hover:bg-gray-200' 
                : 'text-gray-400 cursor-not-allowed'
            }`}
            title="Last page"
          >
            <FaStepForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReusableTable;