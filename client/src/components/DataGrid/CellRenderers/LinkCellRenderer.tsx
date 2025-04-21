import React from 'react';
import { Link } from '@mui/material';
import { CellRenderer, CellData, Column, CellType, LinkCell } from '../../../types/dataGrid';

export class LinkCellRenderer implements CellRenderer {
  render(cell: CellData, column: Column, onEdit: (value: any) => void) {
    if (cell.type !== CellType.LINK) {
      return <div>Invalid cell type</div>;
    }

    const linkCell = cell as LinkCell;

    return (
      <Link
        href={linkCell.href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
      >
        {linkCell.value}
      </Link>
    );
  }
}
