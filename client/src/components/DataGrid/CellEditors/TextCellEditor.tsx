import React, { useState, useEffect, useCallback } from 'react';
import { TextField } from '@mui/material';
import { CellEditor, CellData, Column, CellType, TextCell } from '../../../types/dataGrid';
import { useOutsideClick } from '../../../hooks';

export class TextCellEditor implements CellEditor {
  edit(cell: CellData, column: Column, onSave: (value: any) => void, onCancel: () => void) {
    if (cell.type !== CellType.TEXT) {
      return <div>Invalid cell type</div>;
    }

    return (
      <TextEditor
        cell={cell as TextCell}
        onSave={onSave}
        onCancel={onCancel}
      />
    );
  }
}

interface TextEditorProps {
  cell: TextCell;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const TextEditor: React.FC<TextEditorProps> = React.memo(({ cell, onSave, onCancel }) => {
  const [value, setValue] = useState(cell.value);

  // Use our custom hook to handle clicks outside the component
  const inputRef = useOutsideClick<HTMLInputElement>(() => {
    onSave(value);
  });

  useEffect(() => {
    // Focus the input when the editor mounts
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSave(value);
    } else if (e.key === 'Escape') {
      onCancel();
    }
  }, [value, onSave, onCancel]);

  return (
    <TextField
      fullWidth
      variant="outlined"
      size="small"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      inputRef={inputRef}
      autoFocus
    />
  );
});

TextEditor.displayName = 'TextEditor';
