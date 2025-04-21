import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  TextField,
  Autocomplete,
  Avatar,
  Chip,
  CircularProgress,
  Paper,
} from '@mui/material';
import { CellEditor, CellData, Column, CellType, MultiUserCell, User } from '../../../types/dataGrid';
import { fetchUsers } from '../../../services/api';
import { useDebounce, useOutsideClick } from '../../../hooks';

export class MultiUserCellEditor implements CellEditor {
  edit(cell: CellData, column: Column, onSave: (value: any) => void, onCancel: () => void) {
    if (cell.type !== CellType.MULTI_USER) {
      return <div>Invalid cell type</div>;
    }

    return (
      <MultiUserEditor
        cell={cell as MultiUserCell}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }
}

interface MultiUserEditorProps {
  cell: MultiUserCell;
  onSave: (value: User[]) => void;
  onCancel: () => void;
}

const MultiUserEditor: React.FC<MultiUserEditorProps> = React.memo(({ cell, onSave, onCancel }) => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>(cell.value || []);
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search input to avoid excessive API calls
  const debouncedInputValue = useDebounce(inputValue, 300);

  // Use outside click hook for handling clicks outside the component
  const containerRef = useOutsideClick<HTMLDivElement>(() => {
    onSave(selectedUsers);
  });

  // Memoize users map for quick lookups
  const usersMap = useMemo(() => {
    const map = new Map<string, User>();
    for (const user of selectedUsers) {
      map.set(user.id, user);
    }
    return map;
  }, [selectedUsers]);

  // Fetch users when the debounced input changes
  useEffect(() => {
    let active = true;

    const getUsers = async () => {
      setLoading(true);
      try {
        const users = await fetchUsers(debouncedInputValue);
        if (active) {
          setOptions(users);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setError('Failed to load users');
          setOptions([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    getUsers();

    return () => {
      active = false;
    };
  }, [debouncedInputValue]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onCancel]);

  // Handlers as callbacks to prevent unnecessary recreations
  const handleInputChange = useCallback((_, newInputValue: string) => {
    setInputValue(newInputValue);
  }, []);

  const handleChange = useCallback((_, newValue: User[]) => {
    setSelectedUsers(newValue);
  }, []);

  // Render an option in the dropdown
  const renderOption = useCallback((props: React.HTMLAttributes<HTMLLIElement>, option: User) => (
    <li {...props}>
      <Box display="flex" alignItems="center">
        <Avatar
          src={option.avatar}
          alt={option.name}
          sx={{ width: 24, height: 24, mr: 1 }}
        >
          {option.name.charAt(0)}
        </Avatar>
        {option.name}
      </Box>
    </li>
  ), []);

  // Render user chips
  const renderTags = useCallback((value: User[], getTagProps: any) =>
    value.map((option, index) => (
      <Chip
        {...getTagProps({ index })}
        key={option.id}
        label={option.name}
        size="small"
        avatar={
          <Avatar src={option.avatar} alt={option.name}>
            {option.name.charAt(0)}
          </Avatar>
        }
      />
    )),
    []);

  return (
    <Box ref={containerRef} className="multi-user-editor" sx={{ minWidth: 200 }}>
      <Autocomplete
        multiple
        id="user-selector"
        options={options}
        value={selectedUsers}
        onChange={handleChange}
        onInputChange={handleInputChange}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            placeholder="Search users..."
            error={!!error}
            helperText={error}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={renderOption}
        renderTags={renderTags}
        PaperComponent={(props) => (
          <Paper {...props} elevation={3} />
        )}
        autoComplete
        autoHighlight
        openOnFocus
        filterOptions={(options) => options} // Don't filter locally, rely on server-side filtering
      />
    </Box>
  );
});

MultiUserEditor.displayName = 'MultiUserEditor';
