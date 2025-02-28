import { parseRangeReference } from './formulaParser';

export const evaluateFormula = (formula: string, getCellValue: (cellId: string) => string): string => {
  if (!formula.startsWith('=')) return formula;
  
  const cleanFormula = formula.substring(1);
  const functionMatch = cleanFormula.match(/^([A-Z]+)\((.*?)\)$/);
  
  if (!functionMatch) return '#ERROR!';
  
  const [, functionName, args] = functionMatch;
  const cellRefs = args.split(',').map(ref => {
    const trimmedRef = ref.trim();
    return trimmedRef.includes(':') ? parseRangeReference(trimmedRef) : [trimmedRef];
  }).flat();
  
  try {
    switch (functionName) {
      case 'SUM':
        return sum(cellRefs, getCellValue);
      case 'AVERAGE':
        return average(cellRefs, getCellValue);
      case 'MAX':
        return max(cellRefs, getCellValue);
      case 'MIN':
        return min(cellRefs, getCellValue);
      case 'COUNT':
        return count(cellRefs, getCellValue);
      case 'TRIM':
        return trim(cellRefs, getCellValue);
      case 'UPPER':
        return upper(cellRefs, getCellValue);
      case 'LOWER':
        return lower(cellRefs, getCellValue);
      case 'REMOVE_DUPLICATES':
        return removeDuplicates(cellRefs, getCellValue);
      case 'FIND_AND_REPLACE':
        return findAndReplace(cellRefs, getCellValue);
      default:
        return '#ERROR!';
    }
  } catch (error) {
    return '#ERROR!';
  }
};

const removeDuplicates = (refs: string[], getCellValue: (cellId: string) => string): string => {
  if (refs.length === 0) return '#ERROR!';
  const values = refs.map(ref => getCellValue(ref));
  const uniqueValues = [...new Set(values)];
  return uniqueValues.join(',');
};

const findAndReplace = (refs: string[], getCellValue: (cellId: string) => string): string => {
  if (refs.length !== 3) return '#ERROR!';
  const [targetCell, findText, replaceText] = refs;
  const text = getCellValue(targetCell);
  return text.replace(new RegExp(findText, 'g'), replaceText);
};

const validateNumeric = (value: string): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(Number(value));
};

const validateDate = (value: string): boolean => {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date.getTime());
};

export const validateCell = (value: string, type: 'number' | 'date' | 'text'): boolean => {
  switch (type) {
    case 'number':
      return validateNumeric(value);
    case 'date':
      return validateDate(value);
    case 'text':
      return true;
    default:
      return false;
  }
};


const sum = (refs: string[], getCellValue: (cellId: string) => string): string => {
  const numbers = refs
    .map(ref => parseFloat(getCellValue(ref)))
    .filter(num => !isNaN(num));
  return numbers.reduce((acc, curr) => acc + curr, 0).toString();
};

const average = (refs: string[], getCellValue: (cellId: string) => string): string => {
  const numbers = refs
    .map(ref => parseFloat(getCellValue(ref)))
    .filter(num => !isNaN(num));
  if (numbers.length === 0) return '#DIV/0!';
  return (numbers.reduce((acc, curr) => acc + curr, 0) / numbers.length).toString();
};

const max = (refs: string[], getCellValue: (cellId: string) => string): string => {
  const numbers = refs
    .map(ref => parseFloat(getCellValue(ref)))
    .filter(num => !isNaN(num));
  if (numbers.length === 0) return '#ERROR!';
  return Math.max(...numbers).toString();
};

const min = (refs: string[], getCellValue: (cellId: string) => string): string => {
  const numbers = refs
    .map(ref => parseFloat(getCellValue(ref)))
    .filter(num => !isNaN(num));
  if (numbers.length === 0) return '#ERROR!';
  return Math.min(...numbers).toString();
};

const count = (refs: string[], getCellValue: (cellId: string) => string): string => {
  const numbers = refs
    .map(ref => parseFloat(getCellValue(ref)))
    .filter(num => !isNaN(num));
  return numbers.length.toString();
};

const trim = (refs: string[], getCellValue: (cellId: string) => string): string => {
  if (refs.length !== 1) return '#ERROR!';
  return getCellValue(refs[0]).trim();
};

const upper = (refs: string[], getCellValue: (cellId: string) => string): string => {
  if (refs.length !== 1) return '#ERROR!';
  return getCellValue(refs[0]).toUpperCase();
};

const lower = (refs: string[], getCellValue: (cellId: string) => string): string => {
  if (refs.length !== 1) return '#ERROR!';
  return getCellValue(refs[0]).toLowerCase();
};

export const getCellCoordinates = (cellId: string): { col: number; row: number } => {
  const colStr = cellId.match(/[A-Z]+/)![0];
  const rowStr = cellId.match(/\d+/)![0];
  
  let col = 0;
  for (let i = 0; i < colStr.length; i++) {
    col = col * 26 + (colStr.charCodeAt(i) - 64);
  }
  
  return {
    col: col - 1,
    row: parseInt(rowStr) - 1
  };
};

export const getCellId = (col: number, row: number): string => {
  let colStr = '';
  let colNum = col + 1;
  
  while (colNum > 0) {
    const remainder = (colNum - 1) % 26;
    colStr = String.fromCharCode(65 + remainder) + colStr;
    colNum = Math.floor((colNum - 1) / 26);
  }
  
  return `${colStr}${row + 1}`;
};