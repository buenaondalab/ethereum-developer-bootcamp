import { Box, Button, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import Account from "./Account"
import { Utils } from "alchemy-sdk"

export default function AccountPage ({alchemy}) {

    const [searchInput, setSearchInput] = useState();
    const [address, setAddress] = useState();
    const [balance, setBalance] = useState(0);

    function onSearch(input) {
        setAddress(input);
    }

    useEffect(() => {
        address && alchemy.core.getBalance(address).then(b=> setBalance(Utils.formatEther(b)));
    }, [address, alchemy.core])

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
            <Box className='content'>
                {address && <Account balance={balance} address={address} />}
            </Box>
        </Box>
    );
}