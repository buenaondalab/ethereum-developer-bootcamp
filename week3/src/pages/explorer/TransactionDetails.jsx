import { Box, Divider, Paper, Typography, useTheme } from "@mui/material"
import { Utils } from "alchemy-sdk"

export default function TransactionDetails({txn}) {

    function parseTxn() {
        const t = {};
        Object.keys(txn || {}).forEach(
            field => {
                if(!['wait', 'creates'].includes(field)) {
                    t[field] = (txn[field] ?? '').toString()
                };
            })
        return Object.keys(t).length > 0 ? t : null;
    }

    const tx = parseTxn();

    return (
        <Box
            className='bordered'
            sx={{borderColor: 'darkseagreen', margin: 0, flexGrow: 2, maxWidth: '70%', height: '813px'}}
        >
            <Box sx={{backgroundColor: 'darkseagreen', alignItems: 'flex-end'}}>
                <Box sx={{display: 'flex', flexDirection: 'row', padding: 1, justifyContent: 'space-between'}}>
                    <Typography variant="h5" textAlign={'left'}>{tx ? tx.hash : '<- Select a transaction in the list'}</Typography>
                    <Typography variant="h5" textAlign={'right'}>Transaction Details</Typography>
                </Box>
            </Box>
            {tx && <Box sx={{height: '750px', overflow: 'auto'}}>
                <Paper sx={{padding: 1}} ><Typography variant="h6" noWrap>GENERAL INFOS</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1">From: {tx.from}</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1">To: {tx.to}</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1">Value: {Utils.formatEther(tx.value ?? 0)} ETH</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1">Chain id: {tx.chainId}</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Data: {tx.data}</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1">Nonce: {tx.nonce}</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Confirmations: {tx.confirmations}</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Type: {tx.type}</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Block Hash: {tx.blockHash}</Typography></Paper>
                <Divider />
                <Paper sx={{padding: 1}} elevation={1}><Typography variant="h6" noWrap>GAS</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Max fee: {tx.maxFeePerGas ? Utils.formatUnits(tx.maxFeePerGas, 'gwei') : '-'} gwei</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Max priority fee: {tx.maxPriorityFeePerGas ? Utils.formatUnits(tx.maxPriorityFeePerGas, 'gwei') : '-'} gwei</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Gas limit: {tx.gasLimit} units</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Gas price: {tx.gasPrice ? Utils.formatUnits(tx.gasPrice, 'gwei') : '-'}</Typography></Paper>
                <Divider />
                <Paper sx={{padding: 1}} elevation={1}><Typography variant="h6" noWrap>SIGNATURE</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1" noWrap>r: {tx.r}</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1" noWrap>s: {tx.s}</Typography></Paper>
                <Paper sx={{paddingLeft: 2}} elevation={2}><Typography variant="subtitle1" noWrap>v: {tx.v}</Typography></Paper>
            </Box>}
        </Box>
    )
}