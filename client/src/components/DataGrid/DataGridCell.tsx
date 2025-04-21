import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CellData, Column } from '../../types/dataGrid';
import { useDataGridContext } from './DataGridContext';

interface DataGridCellProps {
  rowId: string;
  columnId: string;
  cell: CellData;
  column: Column;
}

const StyledCell = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: '48px',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&.selected': {
    backgroundColor: theme.palette.action.selected,
  },
}));

const DefaultCellRenderer: React.FC<{ value: any }> = ({ value }) => {
  return <Typography variant="body2">{String(value)}</Typography>;
};

export const DataGridCell: React.FC<DataGridCellProps> = ({ rowId, columnId, cell, column }) => {
  const { selectedCell, setSelectedCell, updateCellValue, registry } = useDataGridContext();
  const [isEditing, setIsEditing] = useState(false);

  const isSelected = selectedCell?.[0] === rowId && selectedCell?.[1] === columnId;

  const handleClick = () => {
    setSelectedCell([rowId, columnId]);
    if (column.editable && cell.editable !== false) {
      setIsEditing(true);
    }
  };

  const handleSave = (value: any) => {
    updateCellValue(rowId, columnId, value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Get the renderer and editor from the registry
  const renderer = registry.getRenderer(cell.type);
  const editor = registry.getEditor(cell.type);

  return (
    <StyledCell
      className={isSelected ? 'selected' : ''}
      onClick={handleClick}
      sx={{ width: column.width }}
    >
      {isEditing && editor ? (
        editor.edit(cell, column, handleSave, handleCancel)
      ) : renderer ? (
        renderer.render(cell, column, () => setIsEditing(true))
      ) : (
        <DefaultCellRenderer value={cell.value} />
      )}
    </StyledCell>
  );
};
