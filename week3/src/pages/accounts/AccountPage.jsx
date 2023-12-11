import { Box, Button, TextField, Typography } from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import Account from "./Account"
import { Utils } from "alchemy-sdk"
import { FixedSizeList } from "react-window"
import Transfers from "./Transfers"

export default function AccountPage ({alchemy}) {

    const [searchInput, setSearchInput] = useState();
    const [address, setAddress] = useState();
    const [balance, setBalance] = useState(0);
    const [transfers, setTransfers] = useState();

    const date = new Date();
    const from = new Date(`1-1-${date.getFullYear()}`).getTime();

    const getCurrentYearEthReceivedTransfers = useCallback(async (address) => {
        return await alchemy.core.getAssetTransfers({
            toAddress: address,
            excludeZeroValue: true,
            category: ["external", "internal"],
            withMetadata: true,
        })
    },[alchemy.core]);

    function onSearch(input) {
        setAddress(input);
    }

    useEffect(() => {
        address && alchemy.core.getBalance(address).then(b=> setBalance(Utils.formatEther(b)));
        address && getCurrentYearEthReceivedTransfers(address).then(r => setTransfers(r.transfers.filter(t => new Date(t.metadata.blockTimestamp).getTime() > from)));
    }, [address, alchemy.core, from, getCurrentYearEthReceivedTransfers])

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Box className='page-header'>Account Explorer on [{alchemy.config.network}]</Box>
            <Box className='search'>
                <TextField id="user-search-input"
                            label="Insert address Ox..."
                            // helperText='Insert address Ox...'
                            color='secondary' value={searchInput}
                            onChange={e => setSearchInput(e.currentTarget.value)}
                            onKeyDown={e => e.key === 'Enter' && onSearch(searchInput)}/>
                <Button variant="contained" size="large" sx={{height: '55px', marginLeft: 1}} onClick={() => onSearch(searchInput)}>Search</Button>
            </Box>
            <Box className='content' alignItems={'center'} justifyContent={'center'}>
                {address && <Account balance={balance} address={address} />}
                {transfers && <Transfers transfers={transfers} />}
            </Box>
        </Box>
    );
}