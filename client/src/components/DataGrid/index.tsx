import React, { useEffect, useState } from 'react';
import { Box, Paper, Checkbox, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { GridData, CellType, Row } from '../../types/dataGrid';
import { DataGridProvider, useDataGridContext } from './DataGridContext';
import { DataGridHeader } from './DataGridHeader';
import { DataGridRow } from './DataGridRow';

// Import renderers
import { TextCellRenderer, TagCellRenderer, LinkCellRenderer, MultiUserCellRenderer } from './CellRenderers';

// Import editors
import { TextCellEditor, MultiUserCellEditor } from './CellEditors';

interface DataGridProps {
  data: GridData;
}

export const DataGrid: React.FC<DataGridProps> = ({ data }) => {
  return (
    <DataGridProvider initialData={data}>
      <DataGridContent />
    </DataGridProvider>
  );
};

const DataGridContent: React.FC = () => {
  const { data, registry } = useDataGridContext();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Register renderers and editors
  useEffect(() => {
    // Register renderers
    registry.registerRenderer(CellType.TEXT, new TextCellRenderer());
    registry.registerRenderer(CellType.TAG, new TagCellRenderer());
    registry.registerRenderer(CellType.LINK, new LinkCellRenderer());
    registry.registerRenderer(CellType.MULTI_USER, new MultiUserCellRenderer());

    // Register editors
    registry.registerEditor(CellType.TEXT, new TextCellEditor());
    registry.registerEditor(CellType.MULTI_USER, new MultiUserCellEditor());
  }, [registry]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRows(data.rows.map(row => row.id));
      setSelectAll(true);
    } else {
      setSelectedRows([]);
      setSelectAll(false);
    }
  };

  const handleSelectRow = (rowId: string) => {
    setSelectedRows(prevSelected => {
      const isSelected = prevSelected.includes(rowId);
      const newSelected = isSelected
        ? prevSelected.filter(id => id !== rowId)
        : [...prevSelected, rowId];

      setSelectAll(newSelected.length === data.rows.length);
      return newSelected;
    });
  };

  const handleDeleteSelected = () => {
    console.log('Delete selected rows:', selectedRows);
    // Implementation for delete functionality would go here
    // For now, just clear selection
    setSelectedRows([]);
    setSelectAll(false);
  };

  return (
    <Paper elevation={3} sx={{
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px',
        borderBottom: theme => `1px solid ${theme.palette.divider}`,
        backgroundColor: theme => theme.palette.grey[50]
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox
            indeterminate={selectedRows.length > 0 && selectedRows.length < data.rows.length}
            checked={selectAll}
            onChange={handleSelectAll}
            color="primary"
          />
          {selectedRows.length > 0 && (
            <IconButton
              color="error"
              onClick={handleDeleteSelected}
              size="small"
            >
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
        <Box sx={{ fontWeight: 'bold' }}>
          {selectedRows.length > 0 ? `${selectedRows.length} selected` : ''}
        </Box>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
          <Box sx={{ display: 'table-header-group' }}>
            <Box sx={{ display: 'table-row' }}>
              <Box sx={{
                display: 'table-cell',
                width: '48px',
                padding: '12px 8px',
                borderBottom: theme => `2px solid ${theme.palette.divider}`,
                backgroundColor: theme => theme.palette.background.paper,
              }}>
                <Checkbox
                  indeterminate={selectedRows.length > 0 && selectedRows.length < data.rows.length}
                  checked={selectAll}
                  onChange={handleSelectAll}
                  color="primary"
                />
              </Box>
              {data.columns.map(column => (
                <Box
                  key={column.id}
                  sx={{
                    display: 'table-cell',
                    width: column.width || 'auto',
                    padding: '12px 16px',
                    fontWeight: 'bold',
                    borderBottom: theme => `2px solid ${theme.palette.divider}`,
                    backgroundColor: theme => theme.palette.background.paper,
                  }}
                >
                  {column.title}
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ display: 'table-row-group' }}>
            {data.rows.map(row => (
              <Box
                key={row.id}
                sx={{
                  display: 'table-row',
                  '&:hover': {
                    backgroundColor: theme => theme.palette.action.hover,
                  },
                  ...(selectedRows.includes(row.id) ? {
                    backgroundColor: theme => theme.palette.action.selected,
                  } : {})
                }}
              >
                <Box sx={{
                  display: 'table-cell',
                  padding: '12px 8px',
                  borderBottom: theme => `1px solid ${theme.palette.divider}`,
                  verticalAlign: 'middle'
                }}>
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleSelectRow(row.id)}
                    color="primary"
                  />
                </Box>
                {data.columns.map(column => (
                  <Box
                    key={`${row.id}-${column.id}`}
                    sx={{
                      display: 'table-cell',
                      padding: '12px 16px',
                      borderBottom: theme => `1px solid ${theme.palette.divider}`,
                      verticalAlign: 'middle'
                    }}
                  >
                    <DataGridCell
                      rowId={row.id}
                      columnId={column.id}
                      cell={row.cells[column.id]}
                      column={column}
                    />
                  </Box>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

// Custom DataGridCell component for this table layout
const DataGridCell = ({ rowId, columnId, cell, column }) => {
  const { selectedCell, setSelectedCell, updateCellValue, registry } = useDataGridContext();
  const [isEditing, setIsEditing] = useState(false);

  const isSelected = selectedCell?.[0] === rowId && selectedCell?.[1] === columnId;

  const handleClick = () => {
    setSelectedCell([rowId, columnId]);
    if (column.editable && cell.editable !== false) {
      setIsEditing(true);
    }
  };

  const handleSave = (value) => {
    updateCellValue(rowId, columnId, value);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Get the renderer and editor from the registry
  const renderer = registry.getRenderer(cell.type);
  const editor = registry.getEditor(cell.type);

  // Render content based on available renderers and cell type
  const renderContent = () => {
    if (isEditing && editor) {
      return editor.edit(cell, column, handleSave, handleCancel);
    }

    if (renderer) {
      return renderer.render(cell, column, () => setIsEditing(true));
    }

    // Fallback rendering for different types of values
    if (Array.isArray(cell.value)) {
      // For arrays (like in MultiUserCell), attempt to extract meaningful values
      return cell.value.map(item =>
        typeof item === 'object' && item !== null
          ? (item.name || item.id || 'Unknown')
          : String(item)
      ).join(', ');
    }

    // For objects, try to get a name or id property
    if (typeof cell.value === 'object' && cell.value !== null) {
      return cell.value.name || cell.value.id || 'Unknown object';
    }

    // Default string representation for primitive values
    return String(cell.value);
  };

  return (
    <Box
      onClick={handleClick}
      sx={{
        cursor: column.editable ? 'pointer' : 'default',
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {renderContent()}
    </Box>
  );
};

export { useDataGridContext } from './DataGridContext';
