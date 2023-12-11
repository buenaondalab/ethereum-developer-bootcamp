import { Box, Card, CardContent, CardHeader, CardMedia, Stack, Typography } from '@mui/material'

export default function NftInfo({metadata, price}) {

  function resolveIpfs(uri) {
    const id = uri.split('//')[1];
    console.log(uri);
    console.log(id);
    return `https://ipfs.io/ipfs/${id}`;
  }

  const img = metadata?.rawMetadata.image;
  const image = img?.startsWith('ipfs://') ? resolveIpfs(img) : img;
  return (
    <Card sx={{
      borderWidth: 3,
      borderColor: 'greenyellow',
      borderStyle: 'solid',
      borderRadius: 3,
      minWidth: 0,
      maxWidth: '800px',
    }}>
      <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
      <CardMedia
        component="img"
        sx={{ maxWidth: 251, minHeight: 251 }}
        image={image}
        alt="Live from space album cover"
      />
      <CardHeader
        title={metadata?.title}
        subheader={metadata?.description}
        // subheaderTypographyProps={{noWrap: false}}
      />
      </Box>
      <CardContent>
        <Stack sx={{display: 'flex', alignItems: 'flex-end',}}>
        <Typography color={'GrayText'} sx={{paddingRight: 1, marginTop: -10, marginBottom: 10, marginRight: 2}}>Floor price:</Typography>
        <Typography color={'GrayText'} sx={{paddingRight: 1, marginTop: -10, marginBottom: 8, marginRight: 2}} variant='h4'>{price?.openSea.floorPrice} {price?.openSea.priceCurrency}</Typography>
        <Typography sx={{alignSelf: 'flex-start', marginLeft: -1}} noWrap>tokenId:</Typography>
        <Typography sx={{alignSelf: 'flex-start', backgroundColor: 'lime', borderRadius: 3, padding: 1, marginLeft: -3}} noWrap>{metadata?.tokenId}</Typography>
        {/* <Typography>{new Date(block?.timestamp * 1000).toLocaleString()}</Typography> */}
        </Stack>
      </CardContent>
      {/* <CardActions sx={{justifyContent: "flex-end"}}>
        <Button size="small" variant="contained" color='success'>Block details</Button>
      </CardActions> */}
    </Card>
  );
}