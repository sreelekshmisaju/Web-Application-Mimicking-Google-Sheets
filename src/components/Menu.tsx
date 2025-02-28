import React from 'react';
import { AppBar, Box, Button, Menu, MenuItem, Toolbar, ListItemIcon, ListItemText, Divider } from '@mui/material';
import {
  FileCopy, ContentCut, ContentCopy, ContentPaste,
  Undo, Redo, Delete, SelectAll,
  ViewColumn, ZoomIn, ZoomOut,
  InsertChart, AddComment, Image,
  FormatBold, FormatItalic, FormatUnderlined,
  Functions, Sort, FilterList,
  Build, Extension, Help,
  Save, SaveAs
} from '@mui/icons-material';

const MenuBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = React.useState<{ [key: string]: HTMLElement | null }>({});

  const handleClick = (event: React.MouseEvent<HTMLElement>, menu: string) => {
    setAnchorEl({ ...anchorEl, [menu]: event.currentTarget });
  };

  const handleClose = (menu: string) => {
    setAnchorEl({ ...anchorEl, [menu]: null });
  };

  const menuItems = [
    {
      id: 'file',
      label: 'File',
      items: [
        { icon: <FileCopy />, label: 'Make a copy', shortcut: 'Ctrl+C' },
        { type: 'divider' },
        { icon: <Save />, label: 'Save', shortcut: 'Ctrl+S' },
        { icon: <SaveAs />, label: 'Save as', shortcut: 'Ctrl+Shift+S' },
        { type: 'divider' },
        { icon: <FileCopy />, label: 'Download', shortcut: '' },
      ]
    },
    {
      id: 'edit',
      label: 'Edit',
      items: [
        { icon: <Undo />, label: 'Undo', shortcut: 'Ctrl+Z' },
        { icon: <Redo />, label: 'Redo', shortcut: 'Ctrl+Y' },
        { type: 'divider' },
        { icon: <ContentCut />, label: 'Cut', shortcut: 'Ctrl+X' },
        { icon: <ContentCopy />, label: 'Copy', shortcut: 'Ctrl+C' },
        { icon: <ContentPaste />, label: 'Paste', shortcut: 'Ctrl+V' },
        { type: 'divider' },
        { icon: <Delete />, label: 'Delete', shortcut: 'Del' },
        { icon: <SelectAll />, label: 'Select all', shortcut: 'Ctrl+A' }
      ]
    },
    {
      id: 'view',
      label: 'View',
      items: [
        { icon: <ViewColumn />, label: 'Freeze', shortcut: '' },
        { type: 'divider' },
        { icon: <ZoomIn />, label: 'Zoom in', shortcut: 'Ctrl+Plus' },
        { icon: <ZoomOut />, label: 'Zoom out', shortcut: 'Ctrl+Minus' }
      ]
    },
    {
      id: 'insert',
      label: 'Insert',
      items: [
        { icon: <InsertChart />, label: 'Chart', shortcut: '' },
        { icon: <AddComment />, label: 'Comment', shortcut: '' },
        { icon: <Image />, label: 'Image', shortcut: '' }
      ]
    },
    {
      id: 'format',
      label: 'Format',
      items: [
        { icon: <FormatBold />, label: 'Bold', shortcut: 'Ctrl+B' },
        { icon: <FormatItalic />, label: 'Italic', shortcut: 'Ctrl+I' },
        { icon: <FormatUnderlined />, label: 'Underline', shortcut: 'Ctrl+U' }
      ]
    },
    {
      id: 'data',
      label: 'Data',
      items: [
        { icon: <Functions />, label: 'Formula', shortcut: '' },
        { icon: <Sort />, label: 'Sort range', shortcut: '' },
        { icon: <FilterList />, label: 'Create filter', shortcut: '' }
      ]
    },
    {
      id: 'tools',
      label: 'Tools',
      items: [
        { icon: <Build />, label: 'Spelling', shortcut: '' },
        { icon: <Functions />, label: 'Script editor', shortcut: '' }
      ]
    },
    {
      id: 'extensions',
      label: 'Extensions',
      items: [
        { icon: <Extension />, label: 'Add-ons', shortcut: '' },
        { icon: <Extension />, label: 'Apps Script', shortcut: '' }
      ]
    },
    {
      id: 'help',
      label: 'Help',
      items: [
        { icon: <Help />, label: 'Help Center', shortcut: '' },
        { icon: <Help />, label: 'Keyboard shortcuts', shortcut: '' }
      ]
    }
  ];

  return (
    <AppBar position="static" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'grey.300', backgroundColor: '#f8f9fa' }}>
      <Toolbar variant="dense" sx={{ minHeight: '36px', padding: '0 8px' }}>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {menuItems.map((menu) => (
            <React.Fragment key={menu.id}>
              <Button
                size="small"
                onClick={(e) => handleClick(e, menu.id)}
                sx={{
                  textTransform: 'none',
                  color: '#3c4043',
                  minWidth: 'auto',
                  padding: '4px 8px',
                  fontSize: '14px',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.04)',
                  },
                }}
              >
                {menu.label}
              </Button>
              <Menu
                anchorEl={anchorEl[menu.id]}
                open={Boolean(anchorEl[menu.id])}
                onClose={() => handleClose(menu.id)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                sx={{
                  '& .MuiPaper-root': {
                    minWidth: 240,
                    boxShadow: '0 2px 6px rgba(60,64,67,.15)',
                    border: '1px solid #dadce0',
                    borderRadius: '8px',
                    mt: 0.5
                  }
                }}
              >
                {menu.items.map((item, index) => 
                  item.type === 'divider' ? (
                    <Divider key={index} sx={{ my: 0.5 }} />
                  ) : (
                    <MenuItem
                      key={index}
                      onClick={() => handleClose(menu.id)}
                      dense
                      sx={{
                        padding: '6px 12px',
                        minHeight: '32px',
                        '&:hover': {
                          backgroundColor: 'rgba(0,0,0,0.04)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
                        <ListItemIcon sx={{ minWidth: 32, color: '#5f6368' }}>
                          {item.icon}
                        </ListItemIcon>
                        <ListItemText 
                          primary={item.label}
                          sx={{ 
                            '& .MuiTypography-root': { 
                              fontSize: '14px',
                              color: '#3c4043'
                            } 
                          }} 
                        />
                      </Box>
                      {item.shortcut && (
                        <Box sx={{ color: '#5f6368', fontSize: '12px', ml: 2 }}>
                          {item.shortcut}
                        </Box>
                      )}
                    </MenuItem>
                  )
                )}
              </Menu>
            </React.Fragment>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MenuBar;