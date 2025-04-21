import React from 'react';
import { Box } from '@mui/material';
import { Row, Column } from '../../types/dataGrid';
import { DataGridCell } from './DataGridCell';

interface DataGridRowProps {
  row: Row;
  columns: Column[];
}

export const DataGridRow: React.FC<DataGridRowProps> = ({ row, columns }) => {
  return (
    <Box display="flex">
      {columns.map((column) => (
        <DataGridCell
          key={`${row.id}-${column.id}`}
          rowId={row.id}
          columnId={column.id}
          cell={row.cells[column.id]}
          column={column}
        />
      ))}
    </Box>
  );
};
