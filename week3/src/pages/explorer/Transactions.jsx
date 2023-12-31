import { Box, ListItem, ListItemButton, ListItemText, Typography, useTheme } from "@mui/material"
import { useCallback, useEffect, useRef, useState } from "react"
import { FixedSizeList } from "react-window"

import './ExplorerPage.css';
import TransactionDetails from "./TransactionDetails"

export default function Transactions({block, selected, onSelect}) {
    const theme = useTheme();

    function Transaction(props) {
        const { index, style, data } = props;
        const hash = data[index].hash;
      
        return (
          <ListItem style={style}
                    sx={{borderColor: 'darkseagreen'}}
                    className={selected?.hash === hash ? 'bordered' : ''}
                    key={index}
                    component="div"
                    disablePadding>
            <ListItemButton divider sx={{justifyContent: 'center'}} onClick={() => onSelect(hash)}>
              <ListItemText primary={hash} secondary={`from: ${data[index].from}`}/>
            </ListItemButton>
          </ListItem>
        );
      }
    
    useEffect(() => {
      window.scroll({top: window?.innerHeight, behaviour: "smooth"});      
    });
    
    return (
        <Box id='transactions' className="TransactionList bordered"
            sx={{
                borderRadius: 2,
                borderColor: theme.palette.primary.dark,
                height: 900,
                width: window.innerWidth*0.9
            }}>
            <Box sx={{display: 'flex', flexDirection: 'column', backgroundColor: theme.palette.primary.dark, padding: 1}}>
              <Typography variant='h4'>Transactions</Typography>
              <Typography variant='body' marginLeft={1}>BLOCK {block?.number}</Typography>
            </Box>
            <Box sx={{display: 'flex', flexDirection: 'row', flex: 1, minWidth: 0}}>
              <Box sx={{display: 'flex'}}>
              <FixedSizeList height={window.innerHeight/1.5} itemCount={block?.transactions.length} itemSize={72} width={'82ex'} overscanCount={5} itemData={block?.transactions}>
                  {Transaction}
              </FixedSizeList>
              </Box>
              <TransactionDetails txn={selected}/>
            </Box>
        </Box>
    )
}