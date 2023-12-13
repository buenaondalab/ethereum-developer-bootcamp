import { Box, Divider, Typography } from "@mui/material"
import Block from "./Block"

export default function BlockList({blocks, selected, onSelect}) {
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            margin: '15px',
            justifyContent: 'center',
        }}>
            {blocks.map(
                (b, i, bb) => b && (
                    <Box key={b.number} sx={{display: 'flex', flexDirection: 'row', alignItems: 'flex-start'}}>
                        <Box>
                            <Block block={b} isSelected={b.number === selected} onSelect={() => onSelect(b.number)}/>
                            <Divider color='greenyellow' sx={{margin: 1}}/>
                        </Box>
                        {i < bb.length-1 && b.number - bb[i+1].number > 1 && <Typography variant={'h1'}>. . .</Typography>}
                    </Box>
                )
            )}            
        </Box>
    )
}