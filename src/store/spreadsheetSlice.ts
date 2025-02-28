import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SpreadsheetState, CellData, CellFormat, DEFAULT_CELL_FORMAT, DEFAULT_COLUMN_WIDTH, DEFAULT_ROW_HEIGHT } from '../types/spreadsheet';
import { getCellId, getCellCoordinates } from '../utils/spreadsheetFunctions';

const initialState: SpreadsheetState = {
  cells: {},
  selectedCell: null,
  selectedRange: null,
  columnWidths: {},
  rowHeights: {}
};

export const spreadsheetSlice = createSlice({
  name: 'spreadsheet',
  initialState,
  reducers: {
    updateCell: (state, action: PayloadAction<{ id: string; data: Partial<CellData> }>) => {
      const { id, data } = action.payload;
      if (!state.cells[id]) {
        state.cells[id] = {
          value: '',
          formula: '',
          format: { ...DEFAULT_CELL_FORMAT },
          dependencies: []
        };
      }
      state.cells[id] = { ...state.cells[id], ...data };
    },
    setSelectedCell: (state, action: PayloadAction<string | null>) => {
      state.selectedCell = action.payload;
      state.selectedRange = null;
    },
    setSelectedRange: (state, action: PayloadAction<string[] | null>) => {
      state.selectedRange = action.payload;
    },
    updateCellFormat: (state, action: PayloadAction<{ id: string; format: Partial<CellFormat> }>) => {
      const { id, format } = action.payload;
      if (!state.cells[id]) {
        state.cells[id] = {
          value: '',
          formula: '',
          format: { ...DEFAULT_CELL_FORMAT },
          dependencies: []
        };
      }
      state.cells[id].format = { ...state.cells[id].format, ...format };
    },
    updateColumnWidth: (state, action: PayloadAction<{ columnId: string; width: number }>) => {
      const { columnId, width } = action.payload;
      state.columnWidths[columnId] = width;
    },
    updateRowHeight: (state, action: PayloadAction<{ rowId: string; height: number }>) => {
      const { rowId, height } = action.payload;
      state.rowHeights[rowId] = height;
    },
    addRow: (state, action: PayloadAction<number>) => {
      const rowIndex = action.payload;
      const newCells: { [key: string]: CellData } = {};
      
      // Shift existing cells down
      Object.entries(state.cells).forEach(([cellId, cellData]) => {
        const { row, col } = getCellCoordinates(cellId);
        if (row >= rowIndex) {
          const newCellId = getCellId(col, row + 1);
          newCells[newCellId] = cellData;
        } else {
          newCells[cellId] = cellData;
        }
      });
      
      state.cells = newCells;
    },
    deleteRow: (state, action: PayloadAction<number>) => {
      const rowIndex = action.payload;
      const newCells: { [key: string]: CellData } = {};
      
      // Shift existing cells up
      Object.entries(state.cells).forEach(([cellId, cellData]) => {
        const { row, col } = getCellCoordinates(cellId);
        if (row > rowIndex) {
          const newCellId = getCellId(col, row - 1);
          newCells[newCellId] = cellData;
        } else if (row < rowIndex) {
          newCells[cellId] = cellData;
        }
      });
      
      state.cells = newCells;
    },
    addColumn: (state, action: PayloadAction<number>) => {
      const colIndex = action.payload;
      const newCells: { [key: string]: CellData } = {};
      
      // Shift existing cells right
      Object.entries(state.cells).forEach(([cellId, cellData]) => {
        const { row, col } = getCellCoordinates(cellId);
        if (col >= colIndex) {
          const newCellId = getCellId(col + 1, row);
          newCells[newCellId] = cellData;
        } else {
          newCells[cellId] = cellData;
        }
      });
      
      state.cells = newCells;
    },
    deleteColumn: (state, action: PayloadAction<number>) => {
      const colIndex = action.payload;
      const newCells: { [key: string]: CellData } = {};
      
      // Shift existing cells left
      Object.entries(state.cells).forEach(([cellId, cellData]) => {
        const { row, col } = getCellCoordinates(cellId);
        if (col > colIndex) {
          const newCellId = getCellId(col - 1, row);
          newCells[newCellId] = cellData;
        } else if (col < colIndex) {
          newCells[cellId] = cellData;
        }
      });
      
      state.cells = newCells;
    },
  }
});

export const {
  updateCell,
  setSelectedCell,
  setSelectedRange,
  updateCellFormat,
  updateColumnWidth,
  updateRowHeight,
  addRow,
  deleteRow,
  addColumn,
  deleteColumn
} = spreadsheetSlice.actions;

export default spreadsheetSlice.reducer;