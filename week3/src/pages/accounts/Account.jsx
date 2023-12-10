import { Box, Button, Card, CardActions, CardContent, CardHeader, Stack, Typography } from '@mui/material'

export default function Account({address, balance}) {
  return (
    <Card sx={{
      borderWidth: 3,
      borderColor: 'greenyellow',
      borderStyle: 'solid',
      borderRadius: 3,
      maxWidth: '700px',
    }}>
      <CardHeader
        title={`Address: ${address}`}
        subheader={'BALANCE:'}
        // subheaderTypographyProps={{noWrap: false}}
      />
      <CardContent>
        <Stack sx={{display: 'flex', alignItems: 'flex-end',}}>
        <Typography variant="h4" sx={{backgroundColor: 'lime', borderRadius: 3, padding: 1}}>{balance} ETH</Typography>
        {/* <Typography color={'GrayText'} sx={{paddingRight: 1}}>BALANCE</Typography> */}
        {/* <Typography>{new Date(block?.timestamp * 1000).toLocaleString()}</Typography> */}
        </Stack>
      </CardContent>
      {/* <CardActions sx={{justifyContent: "flex-end"}}>
        <Button size="small" variant="contained" color='success'>Block details</Button>
      </CardActions> */}
    </Card>
  );
}