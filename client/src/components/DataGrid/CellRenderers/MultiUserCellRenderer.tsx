import React, { useMemo, memo } from 'react';
import { Box, Tooltip, Avatar, AvatarGroup, Typography, Chip } from '@mui/material';
import { CellRenderer, CellData, Column, CellType, MultiUserCell, User } from '../../../types/dataGrid';

// Helper function to generate consistent colors based on name
const generateColorFromName = (name: string): string => {
  // A list of nice Material-UI-like colors
  const colors = [
    '#f44336', '#e91e63', '#9c27b0', '#673ab7',
    '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4',
    '#009688', '#4caf50', '#8bc34a', '#cddc39',
    '#ffc107', '#ff9800', '#ff5722', '#795548'
  ];

  // Create a simple hash from the name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use the hash to pick a color
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Memoized user avatar component
const UserAvatar = memo(({ user }: { user: User }) => (
  <Tooltip
    title={
      <Box sx={{ p: 0.5 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
        {user.email && (
          <Typography variant="caption" display="block">
            {user.email}
          </Typography>
        )}
      </Box>
    }
    arrow
  >
    <Avatar
      src={user.avatar}
      alt={user.name}
      sx={{
        bgcolor: !user.avatar ? generateColorFromName(user.name) : undefined,
        width: 28,
        height: 28
      }}
    >
      {user.name.charAt(0)}
    </Avatar>
  </Tooltip>
));

UserAvatar.displayName = 'UserAvatar';

export class MultiUserCellRenderer implements CellRenderer {
  render(cell: CellData, column: Column, onEdit: (value: any) => void) {
    if (cell.type !== CellType.MULTI_USER) {
      return <Typography variant="body2">Invalid cell type</Typography>;
    }

    return <MultiUserCellContent cell={cell as MultiUserCell} />;
  }
}

interface MultiUserCellProps {
  cell: MultiUserCell;
}

// Renamed from MultiUserCell to MultiUserCellContent to avoid the naming conflict
const MultiUserCellContent = memo(({ cell }: MultiUserCellProps) => {
  const users = cell.value || [];

  // Return early for empty lists
  if (users.length === 0) {
    return <Typography variant="body2" color="text.secondary">None</Typography>;
  }

  // Memoize user names to avoid recalculation on each render
  const userNameText = useMemo(() => {
    return users.map(u => u.name).join(', ');
  }, [users]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <AvatarGroup
        max={3}
        sx={{
          '& .MuiAvatar-root': {
            width: 28,
            height: 28,
            fontSize: '0.875rem',
            border: '2px solid #fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }
        }}
      >
        {users.map((user) => (
          <UserAvatar key={user.id} user={user} />
        ))}
      </AvatarGroup>

      <Box>
        <Typography variant="body2" noWrap component="span">
          {users.length > 1 ? (
            <Box component="span" sx={{ fontWeight: 'medium' }}>
              {users[0].name}
              <Chip
                size="small"
                label={`+${users.length - 1}`}
                sx={{
                  height: 18,
                  ml: 0.5,
                  fontSize: '0.7rem',
                  backgroundColor: theme => theme.palette.primary.main,
                  color: '#fff'
                }}
              />
            </Box>
          ) : (
            userNameText
          )}
        </Typography>
      </Box>
    </Box>
  );
});

MultiUserCellContent.displayName = 'MultiUserCellContent';
