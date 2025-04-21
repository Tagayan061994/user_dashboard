import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Column } from '../../types/dataGrid';

interface DataGridHeaderProps {
  columns: Column[];
}

const HeaderCell = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  borderBottom: `2px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  fontWeight: 'bold',
  minHeight: '48px',
  display: 'flex',
  alignItems: 'center',
}));

export const DataGridHeader: React.FC<DataGridHeaderProps> = ({ columns }) => {
  return (
    <Box display="flex">
      {columns.map((column) => (
        <HeaderCell key={column.id} sx={{ width: column.width }}>
          <Typography variant="subtitle2">{column.title}</Typography>
        </HeaderCell>
      ))}
    </Box>
  );
};
