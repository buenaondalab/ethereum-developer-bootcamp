import { Box, Divider, Typography } from "@mui/material"
import { FixedSizeList } from "react-window"

function Transfer ({index, style, data}) {
    console.log(data[index].metadata)
    return (
        <Box style={style} sx={{paddingX: 3, paddingTop: 1}}>
            <Typography>{new Date(data[index].metadata.blockTimestamp).toLocaleString()}</Typography>
            <Typography>From: {data[index].from}</Typography>
            <Typography variant='h5' textAlign={'right'}>{data[index].value} {data[index].asset}</Typography>
            <Divider />
        </Box>
    )
}

export default function Transfers({transfers}){

    return (
        <Box sx={{margin: 3, width: '70%', alignItems: 'center', justifyContent: 'center', borderRadius: 3}} className="bordered">
            <Typography variant="h4" sx={{backgroundColor: 'lightskyblue', padding: 1.5}}>Incoming Transfers in {new Date().getFullYear()}</Typography>
        <FixedSizeList height={window.innerHeight/2} itemCount={transfers.length} itemSize={100} width={'100%'} overscanCount={5} itemData={transfers} >
            {Transfer}
        </FixedSizeList>
        </Box>
    )
}