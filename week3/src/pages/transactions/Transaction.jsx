import { Box, Divider, Paper, Typography } from "@mui/material"
import { Utils } from "alchemy-sdk"
import CircleIcon from '@mui/icons-material/Circle';

export default function Transaction({tx}){
    const status = tx.blockNumber ? 'mined' : 'pending';
    return (
        <Box sx={{height: '750px', overflow: 'auto', width: '800px'}}>
            <Paper sx={{padding: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}} >
                <Typography variant="h6" noWrap>GENERAL INFOS</Typography>
                <Box sx={{display: 'flex', flexDirection: 'row'}}>
                    <CircleIcon color={status === 'mined' ? 'success' : 'error'} className={status === 'mined' ? '' : 'live'}/>
                    <Typography noWrap sx={{paddingX: 1}}>status: {status}</Typography>
                </Box>
            </Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1">Hash: {tx.hash}</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1">From: {tx.from}</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1">To: {tx.to}</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1">Value: {Utils.formatEther(tx.value ?? 0)} ETH</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1">Chain id: {tx.chainId}</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Data: {tx.data || tx.input}</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1">Nonce: {tx.nonce}</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Confirmations: {tx.confirmations}</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Type: {tx.type}</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Block Hash: {tx.blockHash}</Typography></Paper>
            <Divider />
            <Paper sx={{padding: 1}} elevation={1}><Typography variant="h6" noWrap>GAS</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Max fee: {tx.maxFeePerGas ? Utils.formatUnits(tx.maxFeePerGas, 'gwei') : '-'} gwei</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Max priority fee: {tx.maxPriorityFeePerGas ? Utils.formatUnits(tx.maxPriorityFeePerGas, 'gwei') : '-'} gwei</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Gas limit: {tx.gasLimit ? tx.gasLimit.toString() : '-'} units</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1" noWrap>Gas price: {tx.gasPrice ? Utils.formatUnits(tx.gasPrice, 'gwei') : '-'} gwei</Typography></Paper>
            <Divider />
            <Paper sx={{padding: 1}} elevation={1}><Typography variant="h6" noWrap>SIGNATURE</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1" noWrap>r: {tx.r}</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1" noWrap>s: {tx.s}</Typography></Paper>
            <Paper sx={{paddingX: 2}} elevation={2}><Typography variant="subtitle1" noWrap>v: {tx.v}</Typography></Paper>
        </Box>
    );
}