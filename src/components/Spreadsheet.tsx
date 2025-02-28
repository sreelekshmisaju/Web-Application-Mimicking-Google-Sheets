import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Paper } from '@mui/material';
import { RootState } from '../store/store';
import { setSelectedCell, updateCell, setSelectedRange } from '../store/spreadsheetSlice';
import { getCellId, getCellCoordinates, evaluateFormula } from '../utils/spreadsheetFunctions';
import { cellDependencyManager } from '../utils/cellDependencyManager';
import Toolbar from './Toolbar';

const NUM_ROWS = 100;
const NUM_COLS = 26;

const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const Spreadsheet: React.FC = () => {
  const dispatch = useDispatch();
  const { cells, selectedCell, selectedRange } = useSelector((state: RootState) => state.spreadsheet);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartCell, setDragStartCell] = useState<string | null>(null);
  const [formulaBarValue, setFormulaBarValue] = useState('');

  const getCellValue = useCallback((cellId: string) => {
    return cells[cellId]?.value || '';
  }, [cells]);

  const handleCellClick = (cellId: string) => {
    dispatch(setSelectedCell(cellId));
    setFormulaBarValue(cells[cellId]?.formula || '');
  };

  const handleFormulaBarChange = (value: string) => {
    if (selectedCell) {
      handleCellChange(selectedCell, value);
      setFormulaBarValue(value);
    }
  };

  const debouncedCellUpdate = useCallback(
    debounce((cellId: string, value: string) => {
      try {
        cellDependencyManager.updateDependencies(cellId, value, cells);

        let computedValue = value;
        if (value.startsWith('=')) {
          computedValue = evaluateFormula(value, getCellValue);
        }

        dispatch(updateCell({
          id: cellId,
          data: {
            value: computedValue,
            formula: value,
            dependencies: [],
            format: cells[cellId]?.format || {
              bold: false,
              italic: false,
              fontSize: 12,
              color: '#000000'
            }
          }
        }));

        const affectedCells = cellDependencyManager.getAffectedCells(cellId);
        affectedCells.forEach(dependentCellId => {
          const dependentCell = cells[dependentCellId];
          if (dependentCell?.formula) {
            const newValue = evaluateFormula(dependentCell.formula, getCellValue);
            dispatch(updateCell({
              id: dependentCellId,
              data: {
                ...dependentCell,
                value: newValue
              }
            }));
          }
        });
      } catch (error) {
        if (error instanceof Error && error.message === 'Circular dependency detected') {
          alert('Circular dependency detected. Please check your formula.');
        } else {
          console.error('Error updating cell:', error);
        }
      }
    }, 150),
    [cells, dispatch, getCellValue]
  );

  const handleCellChange = (cellId: string, value: string) => {
    try {
      cellDependencyManager.updateDependencies(cellId, value, cells);

      let computedValue = value;
      if (value.startsWith('=')) {
        computedValue = evaluateFormula(value, getCellValue);
      }

      dispatch(updateCell({
        id: cellId,
        data: {
          value: computedValue,
          formula: value,
          dependencies: [],
          format: cells[cellId]?.format || {
            bold: false,
            italic: false,
            fontSize: 12,
            color: '#000000'
          }
        }
      }));

      const affectedCells = cellDependencyManager.getAffectedCells(cellId);
      affectedCells.forEach(dependentCellId => {
        const dependentCell = cells[dependentCellId];
        if (dependentCell?.formula) {
          const newValue = evaluateFormula(dependentCell.formula, getCellValue);
          dispatch(updateCell({
            id: dependentCellId,
            data: {
              ...dependentCell,
              value: newValue
            }
          }));
        }
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Circular dependency detected') {
        alert('Circular dependency detected. Please check your formula.');
      } else {
        console.error('Error updating cell:', error);
      }
    }
  };

  const handleMouseDown = (cellId: string) => {
    setIsDragging(true);
    setDragStartCell(cellId);
    dispatch(setSelectedCell(cellId));
  };

  const handleMouseEnter = (cellId: string) => {
    if (isDragging && dragStartCell) {
      const startCoords = getCellCoordinates(dragStartCell);
      const currentCoords = getCellCoordinates(cellId);

      const minRow = Math.min(startCoords.row, currentCoords.row);
      const maxRow = Math.max(startCoords.row, currentCoords.row);
      const minCol = Math.min(startCoords.col, currentCoords.col);
      const maxCol = Math.max(startCoords.col, currentCoords.col);

      const selectedCells = [];
      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          selectedCells.push(getCellId(col, row));
        }
      }

      dispatch(setSelectedRange(selectedCells));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStartCell(null);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const Cell = React.memo(({ row, col, cell, isSelected, isInRange, onCellClick, onMouseDown, onMouseEnter }: {
  row: number;
  col: number;
  cell: any;
  isSelected: boolean;
  isInRange: boolean;
  onCellClick: (cellId: string) => void;
  onMouseDown: (cellId: string) => void;
  onMouseEnter: (cellId: string) => void;
}) => {
  const cellId = getCellId(col, row);
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleCellChange(cellId, e.target.value);
    setFormulaBarValue(e.target.value);
  }, [cellId]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const nextCellId = getCellId(col, row + 1);
      onCellClick(nextCellId);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const nextCellId = getCellId(col + 1, row);
      onCellClick(nextCellId);
    }
  }, [col, row, onCellClick]);

  return (
    <Box
      key={cellId}
      sx={{
        border: 1,
        borderColor: 'grey.300',
        p: 1,
        height: '25px',
        backgroundColor: isSelected ? 'rgba(26, 115, 232, 0.12)' : isInRange ? 'rgba(26, 115, 232, 0.08)' : cell?.format?.backgroundColor || 'white',
        outline: isSelected ? '2px solid #1a73e8' : 'none',
        outlineOffset: isSelected ? '-2px' : '0',
        position: 'relative',
        zIndex: isSelected ? 2 : 1,
        fontWeight: cell?.format?.bold ? 'bold' : 'normal',
        fontStyle: cell?.format?.italic ? 'italic' : 'normal',
        fontSize: cell?.format?.fontSize || 12,
        color: cell?.format?.color || '#000000',
        textAlign: cell?.format?.textAlign || 'left',
        '&:hover': {
          backgroundColor: 'grey.100'
        },
        cursor: 'text',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        display: 'flex',
        alignItems: 'center'
      }}
      onClick={() => onCellClick(cellId)}
      onMouseDown={() => onMouseDown(cellId)}
      onMouseEnter={() => onMouseEnter(cellId)}
      onDoubleClick={(e) => {
        e.preventDefault();
        onCellClick(cellId);
      }}
    >
      {isSelected ? (
        <input
          value={cell?.formula || ''}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            textAlign: (cell?.format?.textAlign || 'left') as 'left' | 'right' | 'center',
            padding: 0,
            margin: 0,
            fontFamily: 'inherit',
            fontSize: 'inherit',
            fontWeight: 'inherit',
            fontStyle: 'inherit',
            color: 'inherit'
          }}
          autoFocus
        />
      ) : (
        <div style={{ width: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {cell?.value || ''}
        </div>
      )}
    </Box>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.cell === nextProps.cell &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isInRange === nextProps.isInRange
  );
});

const renderCell = (row: number, col: number) => {
  const cellId = getCellId(col, row);
  const cell = cells[cellId];
  const isSelected = selectedCell === cellId;
  const isInRange = selectedRange?.includes(cellId);

  return (
    <Cell
      key={cellId}
      row={row}
      col={col}
      cell={cell}
      isSelected={isSelected}
      isInRange={isInRange || false}
      onCellClick={handleCellClick}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    />
  );
};

  return (
    <Paper sx={{ width: '100%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      <Box sx={{ 
        p: 1, 
        display: 'flex', 
        alignItems: 'center', 
        borderBottom: 1, 
        borderColor: 'grey.300',
        backgroundColor: '#f8f9fa',
        gap: 1
      }}>
        <Box sx={{ 
          width: 30, 
          height: 24, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#5f6368',
          fontSize: '18px',
          fontWeight: 'bold'
        }}>
          fx
        </Box>
        <input
          value={formulaBarValue}
          onChange={(e) => handleFormulaBarChange(e.target.value)}
          style={{
            width: '100%',
            height: '24px',
            padding: '0 8px',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            fontSize: '14px',
            color: '#3c4043',
            backgroundColor: 'white'
          }}
          placeholder="Enter formula"
        />
      </Box>
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '40px repeat(26, 100px)',
            position: 'relative',
            backgroundColor: '#f8f9fa'
          }}
        >
          {/* Column Headers */}
          <Box sx={{ display: 'contents' }}>
            <Box sx={{ 
              height: '25px', 
              backgroundColor: '#f8f9fa',
              borderRight: 1,
              borderBottom: 1,
              borderColor: '#e0e0e0'
            }} />
            {Array.from({ length: NUM_COLS }, (_, col) => (
              <Box
                key={`col-${col}`}
                sx={{
                  height: '25px',
                  borderRight: 1,
                  borderBottom: 1,
                  borderColor: '#e0e0e0',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#5f6368',
                  userSelect: 'none',
                  fontWeight: 500
                }}
              >
                {String.fromCharCode(65 + col)}
              </Box>
            ))}
          </Box>

          {/* Row Headers and Cells */}
          {Array.from({ length: NUM_ROWS }, (_, row) => (
            <React.Fragment key={row}>
              <Box
                sx={{
                  height: '25px',
                  borderRight: 1,
                  borderBottom: 1,
                  borderColor: 'grey.300',
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#5f6368'
                }}
              >
                {row + 1}
              </Box>
              {Array.from({ length: NUM_COLS }, (_, col) => renderCell(row, col))}
            </React.Fragment>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default Spreadsheet;
