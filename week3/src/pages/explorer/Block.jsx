import { Button, Card, CardActions, CardContent, CardHeader, Collapse, Link, Stack, Typography, useTheme } from '@mui/material'
import { useState } from 'react'

function BlockDetails({block}) {
  return Object.keys(block).map(
    field => (field !== 'transactions'
      ? <Typography key={field} noWrap textOverflow={'ellipsis'}>{field}: {block[field].toString()}</Typography>
      : undefined
    ))
}

export default function Block({block, onSelect, isSelected}) {
  const theme = useTheme();
  const [showDetails, setShowDetails] = useState(false);
  return (
    <Card sx={{
      borderColor: 'greenyellow',
      margin: '3px',
      width: showDetails ? '87ex' : '250px'
    }} className={isSelected ? 'bordered' : ''}>
      <CardHeader
        title={`Block ${block?.number}`}
        subheader={block?.hash}
        subheaderTypographyProps={{noWrap: true, textOverflow:'ellipsis', width: '220px'}}/>
      <CardContent>
        <Stack>
          <Link
            href="#transactions"
            variant="h4"
            sx={{backgroundColor: theme.palette.divider, borderRadius: 3, padding: 1, textAlign: 'center'}}
            onClick={onSelect}
          >
            {`${block?.transactions?.length} TXNS`}
          </Link>
          <Typography color={'GrayText'} sx={{alignSelf: 'flex-end', paddingRight: 1}}>Gas used: {block?.gasUsed?.toString()}</Typography>
          <Typography sx={{alignSelf: 'flex-end', paddingRight: 1}}>{new Date(block?.timestamp * 1000).toLocaleString()}</Typography>
        </Stack>
      </CardContent>
      <CardActions sx={{justifyContent: "flex-end"}}>
        <Button size="small" variant="contained" color='success'  onClick={() => setShowDetails(!showDetails)}>{showDetails ? 'Hide details' : 'Show details'}</Button>
      </CardActions>
      <Collapse in={showDetails} timeout="auto" unmountOnExit>
        <CardContent sx={{
          backgroundColor: theme.palette.divider,
          borderRadius: 3,
          padding: 1,
          margin: 2,
          minWidth: '83ex'
        }}>
          <BlockDetails block={block}/>
        </CardContent>
      </Collapse>
    </Card>
  );
}