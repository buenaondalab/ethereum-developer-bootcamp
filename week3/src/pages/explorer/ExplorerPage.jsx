import { Box, Button, TextField } from "@mui/material";
import './ExplorerPage.css'
import { useCallback, useEffect, useState } from "react"
import Transactions from "./Transactions"
import BlockList from "./BlockList"

const BLOCK_TAGS = ['pending', 'latest', 'earliest', 'safe', 'finalized'];

export default function ExplorerPage({alchemy}) {
    const [searchInput, setSearchInput] = useState('latest');
    const [block, setBlock] = useState();
    const [blockList, setBlockList] = useState([]);
    const [blockNumber, setBlockNumber] = useState('latest');
    const [selectedBlock, setSelectedBlock] = useState(); // block number
    const [selectedTxn, setSelectedTxn] = useState(); // tx hash?

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
      const block = await alchemy.core.getBlock(blockTag);
      const list = [];
      list.push(block);
      for (let i = block.number - 1; i > block.number -5; i--) {
          const b = await alchemy.core.getBlock(i);
          list.push(b);
      }
      setBlockList([...list]);

      console.log(block)
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
      setBlockNumber(input);
      setBlock(null);
      setSelectedBlock(null);
      setSelectedTxn(null);
    }, [])

      useEffect(() => {
        if(blockNumber) {
            getBlocks(blockNumber);
        }
      }, [blockNumber, getBlocks])
    
      useEffect(() => {
        if(selectedBlock) {
            getBlockWithTransactions(selectedBlock);
        }
      },[getBlockWithTransactions, selectedBlock]);

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