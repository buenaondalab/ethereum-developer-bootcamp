import { Box, Button, TextField } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { AlchemySubscription, Utils } from "alchemy-sdk"
import Transaction from "./Transaction"

export default function TransactionPage ({alchemy}) {

    const [searchInput, setSearchInput] = useState('');
    const [txn, setTxn] = useState();

    const getTxn = useCallback(async (hash) => {
        const tx = await alchemy.transact.getTransaction(hash);
        console.log(JSON.stringify(tx));
        if(tx) {
            setTxn(tx);
            !Boolean(tx.blockNumber) && monitorTxn(hash);
        }
    },[alchemy.core]);

    const search = useCallback(() => {
        setTxn(null);
        getTxn(searchInput);
    },[getTxn, searchInput])


    const monitorTxn = useCallback(async (hash) => {
        console.log(`Monitoring ${hash}`);
        await alchemy.ws.on(
            {
              method: AlchemySubscription.MINED_TRANSACTIONS,
              includeRemoved: true,
              hashesOnly: false,
            },
            result => {
                if(result.transaction.hash === hash) {
                    alchemy.ws.removeAllListeners();
                    setTxn(result.transaction);
                } else {
                    console.log('not found');
                }
            }
        );
        console.log(await alchemy.ws.listenerCount());
    },[alchemy.ws])

    // useEffect(() => () => alchemy.ws.removeAllListeners());

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Box className='page-header'>Transaction Monitor on [{alchemy.config.network}]</Box>
            <Box className='search'>
                <TextField id="txn-search-input"
                            label="txn hash..."
                            // helperText='Insert address Ox...'
                            color='secondary' value={searchInput}
                            onChange={e => setSearchInput(e.currentTarget.value)}
                            onKeyDown={e => e.key === 'Enter' && search()}/>
                <Button variant="contained" size="large" sx={{height: '55px', marginLeft: 1}} onClick={search}>Search</Button>
            </Box>
            <Box className='content' alignItems={'center'} justifyContent={'center'}>
                {txn &&<Transaction tx={txn}/>}
            </Box>
        </Box>
    );
}