import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GridData, Row, Column, CellData } from '../../types/dataGrid';
import { usePluginRegistry } from './PluginRegistry';

interface DataGridContextType {
  data: GridData;
  selectedCell: [string, string] | null; // [rowId, columnId]
  setSelectedCell: (cell: [string, string] | null) => void;
  updateCellValue: (rowId: string, columnId: string, value: any) => void;
  registry: ReturnType<typeof usePluginRegistry>;
}

const DataGridContext = createContext<DataGridContextType | null>(null);

export const useDataGridContext = () => {
  const context = useContext(DataGridContext);
  if (!context) {
    throw new Error('useDataGridContext must be used within a DataGridProvider');
  }
  return context;
};

interface DataGridProviderProps {
  initialData: GridData;
  children: ReactNode;
}

export const DataGridProvider: React.FC<DataGridProviderProps> = ({ initialData, children }) => {
  const [data, setData] = useState<GridData>(initialData);
  const [selectedCell, setSelectedCell] = useState<[string, string] | null>(null);
  const registry = usePluginRegistry();

  const updateCellValue = (rowId: string, columnId: string, value: any) => {
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
  };

  return (
    <DataGridContext.Provider
      value={{
        data,
        selectedCell,
        setSelectedCell,
        updateCellValue,
        registry,
      }}
    >
      {children}
    </DataGridContext.Provider>
  );
};
