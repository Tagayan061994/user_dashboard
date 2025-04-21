import { useCallback, memo } from 'react';
import { Container, Box, Typography, CircularProgress, Alert, Paper } from '@mui/material';
import { DataGrid } from './components/DataGrid';
import { fetchTasks } from './services/api';
import { GridData } from './types/dataGrid';
import { useDataFetching } from './hooks';

// Memoized loading state component
const LoadingState = memo(() => (
  <Box display="flex" justifyContent="center" p={4}>
    <CircularProgress />
  </Box>
));

LoadingState.displayName = 'LoadingState';

// Memoized error state component
const ErrorState = memo(({ message }: { message: string }) => (
  <Alert severity="error">{message}</Alert>
));

ErrorState.displayName = 'ErrorState';

// Memoized empty state component
const EmptyState = memo(() => (
  <Alert severity="info">No data available</Alert>
));

EmptyState.displayName = 'EmptyState';

// Memoized header component
const Header = memo(() => (
  <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
    <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ fontWeight: 600 }}>
      Interactive Data Grid Component
    </Typography>

    <Typography variant="subtitle1" gutterBottom align="center" color="textSecondary">
      A pluggable data grid with custom cell renderers and editors
    </Typography>
  </Paper>
));

Header.displayName = 'Header';

function App() {
  const [{ data: gridData, isLoading, error }] = useDataFetching<GridData>(
    fetchTasks
  );

  const renderContent = useCallback(() => {
    if (isLoading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState message="Failed to load tasks data. Please try again later." />;
    }

    if (!gridData) {
      return <EmptyState />;
    }

    return <DataGrid data={gridData} />;
  }, [isLoading, error, gridData]);

  return (
    <Container maxWidth={false} sx={{ px: 4 }}>
      <Box my={4}>
        <Header />
        <Box>{renderContent()}</Box>
      </Box>
    </Container>
  );
}

export default App;
