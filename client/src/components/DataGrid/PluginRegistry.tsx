import { useCallback, useMemo } from 'react';
import { CellType, CellRenderer, CellEditor, PluginRegistry } from '../../types/dataGrid';

export const usePluginRegistry = (): PluginRegistry => {
  // Create maps to store renderers and editors
  const renderers = useMemo(() => new Map<CellType, CellRenderer>(), []);
  const editors = useMemo(() => new Map<CellType, CellEditor>(), []);

  // Register a renderer
  const registerRenderer = useCallback((type: CellType, renderer: CellRenderer) => {
    renderers.set(type, renderer);
  }, [renderers]);

  // Register an editor
  const registerEditor = useCallback((type: CellType, editor: CellEditor) => {
    editors.set(type, editor);
  }, [editors]);

  // Get a renderer by type
  const getRenderer = useCallback((type: CellType) => {
    return renderers.get(type);
  }, [renderers]);

  // Get an editor by type
  const getEditor = useCallback((type: CellType) => {
    return editors.get(type);
  }, [editors]);

  return {
    registerRenderer,
    registerEditor,
    getRenderer,
    getEditor,
  };
};
