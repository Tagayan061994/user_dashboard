import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook that handles data fetching with loading and error states
 */
const useDataFetching = <T>(
  fetchFn: () => Promise<T>,
  initialFetch: boolean = true,
  dependencies: any[] = []
): [FetchState<T>, () => Promise<void>] => {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: initialFetch,
    error: null,
  });

  const fetchData = useCallback(async () => {
    setState(prevState => ({ ...prevState, isLoading: true, error: null }));

    try {
      const data = await fetchFn();
      setState({ data, isLoading: false, error: null });
    } catch (error) {
      setState({ data: null, isLoading: false, error: error as Error });
    }
  }, [fetchFn]);

  useEffect(() => {
    if (initialFetch) {
      fetchData();
    }
  }, [initialFetch, fetchData, ...dependencies]);

  return [state, fetchData];
};

export default useDataFetching;
