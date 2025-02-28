export interface CellData {
  value: string;
  formula: string;
  format: CellFormat;
  dependencies: string[];
}

export interface CellFormat {
  backgroundColor: string;
  textAlign: string;
  bold: boolean;
  italic: boolean;
  fontSize: number;
  color: string;
}

export interface SpreadsheetState {
  cells: { [key: string]: CellData };
  selectedCell: string | null;
  selectedRange: string[] | null;
  columnWidths: { [key: string]: number };
  rowHeights: { [key: string]: number };
}

export type CellCoordinate = {
  row: number;
  col: number;
};

export const DEFAULT_CELL_FORMAT: CellFormat = {
  bold: false,
  italic: false,
  fontSize: 12,
  color: '#000000'
};

export const DEFAULT_COLUMN_WIDTH = 100;
export const DEFAULT_ROW_HEIGHT = 25;