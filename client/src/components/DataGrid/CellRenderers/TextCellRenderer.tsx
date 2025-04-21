import React from 'react';
import { Typography } from '@mui/material';
import { CellRenderer, CellData, Column, CellType, TextCell } from '../../../types/dataGrid';

export class TextCellRenderer implements CellRenderer {
  render(cell: CellData, column: Column, onEdit: (value: any) => void) {
    if (cell.type !== CellType.TEXT) {
      return <Typography variant="body2">Invalid cell type</Typography>;
    }

    const textCell = cell as TextCell;

    return (
      <Typography variant="body2">
        {textCell.value}
      </Typography>
    );
  }
}
