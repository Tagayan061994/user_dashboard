import { useState, useCallback, useMemo } from 'react';
import { GridData, Row, Column } from '../types/dataGrid';
import useLocalStorage from './useLocalStorage';

interface UseDataGridProps {
  initialData: GridData;
}

interface UseDataGridReturn {
  data: GridData;
  selectedRows: string[];
  selectedCell: [string, string] | null;
  selectRow: (rowId: string) => void;
  selectAllRows: (selected: boolean) => void;
  isRowSelected: (rowId: string) => boolean;
  setSelectedCell: (cell: [string, string] | null) => void;
  updateCellValue: (rowId: string, columnId: string, value: any) => void;
  getColumnWidth: (columnId: string) => string | undefined;
  updateColumnWidth: (columnId: string, width: string) => void;
  getSortedRows: () => Row[];
  sortByColumn: (columnId: string) => void;
  currentSortColumn: string | null;
  currentSortDirection: 'asc' | 'desc' | null;
}

const useDataGrid = ({ initialData }: UseDataGridProps): UseDataGridReturn => {
  const [data, setData] = useState<GridData>(initialData);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectedCell, setSelectedCell] = useState<[string, string] | null>(null);
  const [currentSortColumn, setCurrentSortColumn] = useState<string | null>(null);
  const [currentSortDirection, setCurrentSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [columnWidths, setColumnWidths] = useLocalStorage<Record<string, string>>(
    'dataGrid-columnWidths',
    {}
  );

  // Memoize the column lookup for performance
  const columnMap = useMemo(() => {
    const map = new Map<string, Column>();
    for (const column of data.columns) {
      map.set(column.id, column);
    }
    return map;
  }, [data.columns]);

  // Select/deselect a single row
  const selectRow = useCallback((rowId: string) => {
    setSelectedRows(prevSelected => {
      const isAlreadySelected = prevSelected.includes(rowId);
      if (isAlreadySelected) {
        return prevSelected.filter(id => id !== rowId);
      }
      return [...prevSelected, rowId];
    });
  }, []);

  // Select/deselect all rows
  const selectAllRows = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedRows(data.rows.map(row => row.id));
    } else {
      setSelectedRows([]);
    }
  }, [data.rows]);

  // Check if a row is selected
  const isRowSelected = useCallback(
    (rowId: string) => selectedRows.includes(rowId),
    [selectedRows]
  );

  // Update a cell value
  const updateCellValue = useCallback((rowId: string, columnId: string, value: any) => {
    setData(prevData => {
      const newRows = [...prevData.rows];
      const rowIndex = newRows.findIndex(row => row.id === rowId);

      if (rowIndex !== -1) {
        const updatedRow = { ...newRows[rowIndex] };
        updatedRow.cells = { ...updatedRow.cells };

        if (updatedRow.cells[columnId]) {
          updatedRow.cells[columnId] = {
            ...updatedRow.cells[columnId],
            value,
          };

          newRows[rowIndex] = updatedRow;
        }
      }

      return {
        ...prevData,
        rows: newRows,
      };
    });
  }, []);

  // Get column width (from saved preferences or default)
  const getColumnWidth = useCallback(
    (columnId: string) => {
      // Check if we have a saved width preference
      if (columnWidths[columnId]) {
        return columnWidths[columnId];
      }

      // Otherwise use the default from the column definition
      const column = columnMap.get(columnId);
      return column?.width;
    },
    [columnMap, columnWidths]
  );

  // Update column width
  const updateColumnWidth = useCallback(
    (columnId: string, width: string) => {
      setColumnWidths(prev => ({
        ...prev,
        [columnId]: width,
      }));
    },
    [setColumnWidths]
  );

  // Sort rows by column
  const sortByColumn = useCallback(
    (columnId: string) => {
      if (columnId === currentSortColumn) {
        // Toggle direction if same column
        setCurrentSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
      } else {
        // New column, default to ascending
        setCurrentSortColumn(columnId);
        setCurrentSortDirection('asc');
      }
    },
    [currentSortColumn]
  );

  // Get sorted rows based on current sort state
  const getSortedRows = useCallback(() => {
    if (!currentSortColumn || !currentSortDirection) {
      return data.rows;
    }

    const column = columnMap.get(currentSortColumn);
    if (!column) return data.rows;

    return [...data.rows].sort((rowA, rowB) => {
      const cellA = rowA.cells[currentSortColumn];
      const cellB = rowB.cells[currentSortColumn];

      if (!cellA || !cellB) return 0;

      const valueA = cellA.value;
      const valueB = cellB.value;

      // Handle different value types
      let comparison = 0;
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = valueA - valueB;
      } else if (Array.isArray(valueA) && Array.isArray(valueB)) {
        // For arrays like users, compare lengths
        comparison = valueA.length - valueB.length;
      } else {
        // Default string conversion compare
        comparison = String(valueA).localeCompare(String(valueB));
      }

      return currentSortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data.rows, columnMap, currentSortColumn, currentSortDirection]);

  return {
    data,
    selectedRows,
    selectedCell,
    selectRow,
    selectAllRows,
    isRowSelected,
    setSelectedCell,
    updateCellValue,
    getColumnWidth,
    updateColumnWidth,
    getSortedRows,
    sortByColumn,
    currentSortColumn,
    currentSortDirection,
  };
};

export default useDataGrid;
