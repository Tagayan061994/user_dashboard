import React from 'react';
import { Chip } from '@mui/material';
import { CellRenderer, CellData, Column, CellType, TagCell } from '../../../types/dataGrid';

// Map of status to colors with more visually appealing design
const STATUS_COLORS: Record<string, { bg: string; color: string; border?: string }> = {
  'todo': { bg: '#e3f2fd', color: '#0d47a1', border: '1px solid #bbdefb' },
  'in-progress': { bg: '#fff8e1', color: '#e65100', border: '1px solid #ffe082' },
  'done': { bg: '#e8f5e9', color: '#1b5e20', border: '1px solid #c8e6c9' },
  'blocked': { bg: '#ffebee', color: '#b71c1c', border: '1px solid #ffcdd2' },
};

export class TagCellRenderer implements CellRenderer {
  render(cell: CellData, column: Column, onEdit: (value: any) => void) {
    if (cell.type !== CellType.TAG) {
      return <div>Invalid cell type</div>;
    }

    const tagCell = cell as TagCell;
    const tag = tagCell.value;
    const colors = STATUS_COLORS[tag.toLowerCase()] || { bg: '#f5f5f5', color: '#616161', border: '1px solid #e0e0e0' };

    return (
      <Chip
        label={tag}
        size="small"
        sx={{
          backgroundColor: colors.bg,
          color: colors.color,
          fontWeight: 500,
          border: colors.border,
          borderRadius: '4px',
          fontSize: '0.75rem',
          padding: '0 4px',
          height: '24px',
          '& .MuiChip-label': {
            padding: '0 8px',
          },
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      />
    );
  }
}
