import { Box, Button, TextField } from "@mui/material";
import './ExplorerPage.css'
import { useCallback, useEffect, useState } from "react"
import Transactions from "./Transactions"
import BlockList from "./BlockList"
import LinkOutlinedIcon from '@mui/icons-material/LinkOutlined';
import LinkIcon from '@mui/icons-material/Link'

const BLOCK_TAGS = ['pending', 'latest', 'earliest', 'safe', 'finalized'];

export default function ExplorerPage({alchemy}) {
    const [searchInput, setSearchInput] = useState('latest');
    const [block, setBlock] = useState();
    const [blockList, setBlockList] = useState([]);
    const [selectedBlock, setSelectedBlock] = useState(); // block number
    const [selectedTxn, setSelectedTxn] = useState(); // tx hash?
    const [liveMode, setLiveMode] = useState('OFF');

    const getBlockWithTransactions = useCallback(async (tag) => {
        let blockTag;
        if (BLOCK_TAGS.includes(tag)) {
          blockTag = tag;
        } else {
          blockTag = Number(tag);
        }
        const block = await alchemy.core.getBlockWithTransactions(blockTag);
        setBlock(block);
        console.log(block)
      }, [alchemy.core]);

    const getBlocks = useCallback(async (tag) => {
      let blockTag;
      if (BLOCK_TAGS.includes(tag)) {
        blockTag = tag;
      } else {
        blockTag = Number(tag);
      }
      if(blockTag) {
        console.log(`Getting block ${blockTag}`)
        const block = await alchemy.core.getBlock(blockTag);
        const list = [];
        list.push(block);
        for (let i = block.number - 1; i > block.number -5; i--) {
            const b = await alchemy.core.getBlock(i);
            list.push(b);
        }
        setBlockList([...list]);
        console.log(block)
      } else {
        console.warn('Invalid block');
      }


    }, [alchemy.core]);

    const getTxn = useCallback(async (hash) => {
      const txn = await alchemy.transact.getTransaction(hash);
      console.log(txn);
      setSelectedTxn(txn);
    }, [alchemy.transact]);


    const onBlockSelection = useCallback(bnum => {
      setSelectedBlock(bnum);
      setSelectedTxn(null);
    }, []);

    const onSearch = useCallback((input) => {
      getBlocks(input);
      setBlock(null);
      setSelectedBlock(null);
      setSelectedTxn(null);
    }, [getBlocks]);

    const onNewBlock = useCallback(async (blockNum) => {
      const block = await alchemy.core.getBlock(blockNum);
      blockList.unshift(block);
      blockList.pop();
      setBlockList([...blockList]);
    }, [alchemy.core, blockList]);

      useEffect(() => {
        if(blockList.length === 0) {
            getBlocks('latest');
        }
      }, [blockList.length, getBlocks])
    
      useEffect(() => {
        if(selectedBlock) {
            getBlockWithTransactions(selectedBlock);
        }
      },[getBlockWithTransactions, selectedBlock]);

      async function manageLiveMode(mode) {
        if(mode === 'ON' && await alchemy.ws.listenerCount('block') < 1) {
          alchemy.ws.on(
            'block',
            onNewBlock
          );
          console.log('ON')
        }
        else if (mode === 'OFF') {
          console.log('OFF');
          // alchemy.ws.off(AlchemySubscription.PENDING_TRANSACTIONS)
          alchemy.ws.removeAllListeners();
        }
        setLiveMode(mode);
      };
      
      useEffect(() => () => alchemy.ws.removeAllListeners(), [alchemy.ws]);
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Box className='page-header'>Block Explorer on [{alchemy.config.network}]</Box>
            <Box className='search'>
                <TextField id="block-search-input"
                            label="Search block"
                            helperText='Insert a block number or tag {latest, earliest, pending}'
                            color='secondary' value={searchInput}
                            onChange={e => setSearchInput(e.currentTarget.value)}
                            onKeyDown={e => e.key === 'Enter' && onSearch(searchInput)}/>
                <Button variant="contained" size="large" sx={{height: '55px', marginLeft: 1}} onClick={() => onSearch(searchInput)}>Search</Button>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
              {liveMode === 'OFF' ? <LinkOutlinedIcon sx={{marginX: 1}}/> : <LinkIcon className="live" sx={{marginX: 1}}/>}
              <Button title={`Click to ${liveMode === 'ON' ? 'de' : ''}activate live mode`} variant="outlined" onClick={() => manageLiveMode(liveMode === 'OFF' ? 'ON' : 'OFF')}>LIVE MODE: {liveMode}</Button>
              {liveMode === 'OFF' ? <LinkOutlinedIcon sx={{marginX: 1}}/> : <LinkIcon className="live" sx={{marginX: 1}}/>}
            </Box>
            <Box className='content'>
                <BlockList blocks={blockList} selected={selectedBlock} onSelect={onBlockSelection} />
                {block?.transactions &&
                  <Transactions
                    block={block}
                    selected={selectedTxn}
                    onSelect={hash => getTxn(hash)}/>
                }
            </Box>
        </Box>
    );
}