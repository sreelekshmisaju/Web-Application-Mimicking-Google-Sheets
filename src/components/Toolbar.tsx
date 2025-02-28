import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, IconButton, Divider, Tooltip, Select, MenuItem, Slider } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import { RootState } from '../store/store';
import { updateCellFormat, addRow, deleteRow, addColumn, deleteColumn } from '../store/spreadsheetSlice';
import { getCellCoordinates } from '../utils/spreadsheetFunctions';

const Toolbar: React.FC = () => {
  const dispatch = useDispatch();
  const selectedCell = useSelector((state: RootState) => state.spreadsheet.selectedCell);
  const cells = useSelector((state: RootState) => state.spreadsheet.cells);
  
  const [fontSize, setFontSize] = useState<number>(12);
  const [zoom, setZoom] = useState<number>(100);

  const handleFormatChange = (formatKey: string, value: any) => {
    if (!selectedCell) return;
    dispatch(updateCellFormat({ id: selectedCell, format: { [formatKey]: value } }));
  };

  const isBold = selectedCell ? cells[selectedCell]?.format?.bold || false : false;
  const isItalic = selectedCell ? cells[selectedCell]?.format?.italic || false : false;
  const currentColor = selectedCell ? cells[selectedCell]?.format?.color || '#000000' : '#000000';
  const currentBgColor = selectedCell ? cells[selectedCell]?.format?.backgroundColor || '#ffffff' : '#ffffff';
  const currentAlign = selectedCell ? cells[selectedCell]?.format?.textAlign || 'left' : 'left';

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      p: 0.5, 
      borderBottom: 1, 
      borderColor: 'grey.300', 
      gap: 0.5,
      backgroundColor: '#f8f9fa',
      minHeight: '36px',
      boxShadow: '0 1px 2px rgba(60,64,67,0.15)'
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <Select
          size="small"
          value={fontSize}
          onChange={(e) => {
            const newSize = Number(e.target.value);
            setFontSize(newSize);
            if (selectedCell) handleFormatChange('fontSize', newSize);
          }}
          sx={{ 
            width: 70,
            height: 30,
            '.MuiSelect-select': {
              padding: '4px 8px'
            }
          }}
        >
          {[8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72].map((size) => (
            <MenuItem key={size} value={size}>{size}</MenuItem>
          ))}
        </Select>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <Tooltip title="Bold">
            <IconButton 
              size="small" 
              onClick={() => handleFormatChange('bold', !isBold)} 
              color={isBold ? 'primary' : 'default'}
              sx={{ padding: '4px' }}
            >
              <FormatBoldIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Italic">
            <IconButton 
              size="small" 
              onClick={() => handleFormatChange('italic', !isItalic)} 
              color={isItalic ? 'primary' : 'default'}
              sx={{ padding: '4px' }}
            >
              <FormatItalicIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Text Color">
            <IconButton 
              size="small"
              sx={{ 
                padding: '4px',
                '& .MuiSvgIcon-root': {
                  color: currentColor
                }
              }}
            >
              <FormatColorTextIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Fill Color">
            <IconButton 
              size="small"
              sx={{ 
                padding: '4px',
                '& .MuiSvgIcon-root': {
                  color: currentBgColor === '#ffffff' ? 'inherit' : currentBgColor
                }
              }}
            >
              <FormatColorFillIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <Tooltip title="Align Left">
            <IconButton 
              size="small"
              onClick={() => handleFormatChange('textAlign', 'left')}
              color={currentAlign === 'left' ? 'primary' : 'default'}
              sx={{ padding: '4px' }}
            >
              <FormatAlignLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Align Center">
            <IconButton 
              size="small"
              onClick={() => handleFormatChange('textAlign', 'center')}
              color={currentAlign === 'center' ? 'primary' : 'default'}
              sx={{ padding: '4px' }}
            >
              <FormatAlignCenterIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Align Right">
            <IconButton 
              size="small"
              onClick={() => handleFormatChange('textAlign', 'right')}
              color={currentAlign === 'right' ? 'primary' : 'default'}
              sx={{ padding: '4px' }}
            >
              <FormatAlignRightIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <Tooltip title="Add Row">
            <IconButton 
              size="small"
              onClick={() => {
                if (selectedCell) {
                  const { row } = getCellCoordinates(selectedCell);
                  dispatch(addRow(row));
                }
              }}
              sx={{ padding: '4px' }}
            >
              <AddBoxIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Row">
            <IconButton 
              size="small"
              onClick={() => {
                if (selectedCell) {
                  const { row } = getCellCoordinates(selectedCell);
                  dispatch(deleteRow(row));
                }
              }}
              sx={{ padding: '4px' }}
            >
              <IndeterminateCheckBoxIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.25 }}>
          <Tooltip title="Add Column">
            <IconButton 
              size="small"
              onClick={() => {
                if (selectedCell) {
                  const { col } = getCellCoordinates(selectedCell);
                  dispatch(addColumn(col));
                }
              }}
              sx={{ padding: '4px' }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete Column">
            <IconButton 
              size="small"
              onClick={() => {
                if (selectedCell) {
                  const { col } = getCellCoordinates(selectedCell);
                  dispatch(deleteColumn(col));
                }
              }}
              sx={{ padding: '4px' }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Zoom Out">
            <IconButton 
              size="small"
              onClick={() => setZoom(Math.max(zoom - 25, 25))}
              sx={{ padding: '4px' }}
            >
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box sx={{ width: 100 }}>
            <Slider
              size="small"
              value={zoom}
              min={25}
              max={200}
              step={25}
              onChange={(_, value) => setZoom(value as number)}
              sx={{
                '& .MuiSlider-thumb': {
                  width: 12,
                  height: 12
                }
              }}
            />
          </Box>

          <Tooltip title="Zoom In">
            <IconButton 
              size="small"
              onClick={() => setZoom(Math.min(zoom + 25, 200))}
              sx={{ padding: '4px' }}
            >
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Box sx={{ fontSize: '14px', color: '#5f6368', minWidth: 45 }}>
            {zoom}%
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Toolbar;
