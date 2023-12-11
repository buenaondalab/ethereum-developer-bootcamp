import { Box, Button, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { Utils } from "alchemy-sdk"
import NftInfo from "./NftInfo"

export default function NftPage ({alchemy}) {

    const [contractInput, setContractInput] = useState('');
    const [tokenIdInput, setTokenIdInput] = useState('');
    const [contract, setContract] = useState();
    const [tokenId, setTokenId] = useState();
    const [metadata, setMetadata] = useState();
    const [floorPrice, setFloorPrice] = useState();
    console.log('nft:', metadata);

    function onSearch(contract, tokenId) {
        setContract(contract);
        setTokenId(tokenId);
    }

    useEffect(() => {
        if(contract && tokenId) {
            alchemy.nft.getNftMetadata(contract, tokenId, 'erc721').then(setMetadata);
            alchemy.nft.getFloorPrice(contract).then(setFloorPrice);
        }
    }, [alchemy.nft, contract, tokenId])

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
            <Box className='page-header'>NFT Explorer on [{alchemy.config.network}]</Box>
            <Box className='search'>
                <TextField id="nft-contract-input"
                            label="Contract address Ox..."
                            // helperText='Insert address Ox...'
                            color='secondary' value={contractInput}
                            onChange={e => setContractInput(e.currentTarget.value)}
                            onKeyDown={e => e.key === 'Enter' && onSearch(contractInput)} sx={{flex: 1}}/>
                <TextField id="nft-tokenid-input"
                            label="Token id..."
                            // helperText='Insert address Ox...'
                            color='secondary' value={tokenIdInput}
                            onChange={e => setTokenIdInput(e.currentTarget.value)}
                            onKeyDown={e => e.key === 'Enter' && onSearch(tokenIdInput)}/>
                <Button variant="contained" size="large" sx={{height: '55px', marginLeft: 1}} onClick={() => onSearch(contractInput, tokenIdInput)}>Search</Button>
            </Box>
            <Box className='content'>
                {metadata && <NftInfo metadata={metadata} price={floorPrice} />}
            </Box>
        </Box>
    );
}