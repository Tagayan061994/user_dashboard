import { render, screen } from '@testing-library/react';
import { DataGridRow } from '../DataGridRow';
import { Row, Column, CellType } from '../../../types/dataGrid';

// Mock the DataGridCell component to simplify testing
jest.mock('../DataGridCell', () => ({
  DataGridCell: ({ rowId, columnId, cell, column }: {
    rowId: string;
    columnId: string;
    cell: any;
    column: Column;
  }) => (
    <div data-testid={`cell-${rowId}-${columnId}`}>
      Mock Cell: {column.title}
    </div>
  )
}));

describe('DataGridRow', () => {
  const mockColumns: Column[] = [
    {
      id: 'name', title: 'Name', width: 150,
      type: CellType.TEXT
    },
    {
      id: 'age', title: 'Age', width: 100,
      type: CellType.TEXT
    }
  ];

  const mockRow: Row = {
    id: '1',
    cells: {
      name: { type: CellType.TEXT, value: 'John Doe' },
      age: { type: CellType.TEXT, value: '30' }
    }
  };

  it('renders all cells for the row', () => {
    render(<DataGridRow row={mockRow} columns={mockColumns} />);

    const nameCell = screen.getByTestId('cell-1-name');
    const ageCell = screen.getByTestId('cell-1-age');

    expect(nameCell).toBeInTheDocument();
    expect(ageCell).toBeInTheDocument();
  });

  it('passes correct props to each cell', () => {
    render(<DataGridRow row={mockRow} columns={mockColumns} />);

    // Verify the content of mocked cells
    expect(screen.getByText('Mock Cell: Name')).toBeInTheDocument();
    expect(screen.getByText('Mock Cell: Age')).toBeInTheDocument();
  });
});
