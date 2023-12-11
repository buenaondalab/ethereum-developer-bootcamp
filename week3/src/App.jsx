import { Alchemy, Network } from 'alchemy-sdk';
import { useState } from 'react';

import './common.css';
import './App.css';
import { Box, Divider, Link, Typography } from '@mui/material'
import ExplorerPage from './pages/explorer/ExplorerPage'
import AccountPage from './pages/accounts/AccountPage'
import NftPage from './pages/nfts/NftPage';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  // apiKey: 'OYNxlWlgJHFP7aBnau2bI0YTyTEPMVr-',
  network: Network.ETH_MAINNET,
  // network: Network.MATIC_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);
function renderPage(page) {
  switch(page) {
    case 'accounts': return <AccountPage alchemy={alchemy} />;
    case 'nfts': return <NftPage alchemy={alchemy} />;  
    case 'blocks':
    default: return <ExplorerPage alchemy={alchemy} />;
  }
}

function App() {
  const [page, setPage] = useState('blocks');
  
  function navigate(page) {
    setPage(page);
  }

  return (
    <Box className="App">
      <Box className='App-header'>
        <Box>
          <Link href='#' onClick={() => navigate('accounts')}>Accounts</Link>
           {' | '} 
          <Link href='#' onClick={() => navigate('blocks')}>Blocks</Link>
           {' | '} 
          <Link href='#' onClick={() => navigate('nfts')}>NFTs</Link>
        </Box>
        <Typography>Explorer on [{alchemy.config.network}]</Typography>
      </Box>
      <Divider/>
      {renderPage(page)}
    </Box>
  );
}

export default App;
