import { Provider } from 'react-redux';
import { Box } from '@mui/material';
import { store } from './store/store';
import Spreadsheet from './components/Spreadsheet';
import MenuBar from './components/Menu';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <MenuBar />
        <Spreadsheet />
      </Box>
    </Provider>
  );
}

export default App;
