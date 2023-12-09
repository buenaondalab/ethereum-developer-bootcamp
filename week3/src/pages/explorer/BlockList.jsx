import { Box, Divider } from "@mui/material"
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
                b => b && (
                    <Box key={b.number}>
                        <Block block={b} isSelected={b.number === selected} onSelect={() => onSelect(b.number)}/>
                        <Divider color='greenyellow' sx={{margin: 1}}/>
                    </Box>
                ))
            }            
        </Box>
    )
}