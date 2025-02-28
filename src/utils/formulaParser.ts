import { getCellCoordinates, getCellId } from './spreadsheetFunctions';

interface CellReference {
  col: number;
  row: number;
  absoluteCol: boolean;
  absoluteRow: boolean;
}

export const parseCellReference = (ref: string): CellReference => {
  const match = ref.match(/\$?([A-Z]+)\$?(\d+)/);
  if (!match) throw new Error('Invalid cell reference');

  const [, colStr, rowStr] = match;
  const absoluteCol = ref.indexOf('$') === 0;
  const absoluteRow = ref.indexOf('$', 1) !== -1;

  const { col, row } = getCellCoordinates(`${colStr}${rowStr}`);
  return { col, row, absoluteCol, absoluteRow };
};

export const resolveReference = (
  ref: CellReference,
  fromCell: { col: number; row: number }
): string => {
  const targetCol = ref.absoluteCol ? ref.col : ref.col + (fromCell.col - ref.col);
  const targetRow = ref.absoluteRow ? ref.row : ref.row + (fromCell.row - ref.row);
  return getCellId(targetCol, targetRow);
};

export const expandCellRange = (start: string, end: string): string[] => {
  const startRef = parseCellReference(start);
  const endRef = parseCellReference(end);

  const minCol = Math.min(startRef.col, endRef.col);
  const maxCol = Math.max(startRef.col, endRef.col);
  const minRow = Math.min(startRef.row, endRef.row);
  const maxRow = Math.max(startRef.row, endRef.row);

  const cells: string[] = [];
  for (let row = minRow; row <= maxRow; row++) {
    for (let col = minCol; col <= maxCol; col++) {
      cells.push(getCellId(col, row));
    }
  }
  return cells;
};

export const parseRangeReference = (range: string): string[] => {
  const [start, end] = range.split(':');
  if (!end) return [start];
  return expandCellRange(start, end);
};