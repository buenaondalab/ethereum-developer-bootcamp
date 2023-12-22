import {
  Box,
  Button,
  CircularProgress,
  Flex,
  Heading,
  Image,
  Input,
  SimpleGrid,
  Text,
  useBreakpointValue,
  useTheme,
} from '@chakra-ui/react';
import { Alchemy, Network, Utils } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { useState } from 'react';

const provider = new ethers.providers.Web3Provider(window.ethereum);

function App() {
  const [account, setAccount] = useState();
  const [network, setNetwork] = useState();
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const theme = useTheme();
  console.log(theme);

  async function getTokenBalance() {
    setIsLoading(true);
    const config = {
      apiKey: '<-- COPY-PASTE YOUR ALCHEMY API KEY HERE -->',
      network: Network.ETH_MAINNET,
    };

    const alchemy = new Alchemy(config);
    const data = await alchemy.core.getTokenBalances(userAddress);

    setResults(data);

    const tokenDataPromises = [];

    for (let i = 0; i < data.tokenBalances.length; i++) {
      const tokenData = alchemy.core.getTokenMetadata(
        data.tokenBalances[i].contractAddress
      );
      tokenDataPromises.push(tokenData);
    }

    setTokenDataObjects(await Promise.all(tokenDataPromises));
    setIsLoading(false);
    setHasQueried(true);
  }

  async function getAccounts() {
    const accounts = await provider.send('eth_requestAccounts', []);
    setAccount(accounts[0]);
    setUserAddress(accounts[0]);
    setNetwork((await provider.getNetwork()).name);
  };

  const columns = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 4,
    xl: 6,
    "2xl": 8,
  },{
    fallback: 'md',
  });

  return (
    <Box w="100vw">
        <Flex
          alignItems={'center'}
          justifyContent="flex-start"
          flexDirection={'column'}
        >
          {account && <Text mb="0">{account}</Text>}
          <Button mt="13px" onClick={getAccounts} _hover={{bgColor: theme.colors.gray[600], cursor: 'pointer'}}>
            {account  ? `Connected on ${network}` : "Connect your wallet!"}
          </Button>
          <Heading mb={0} fontSize={36}>
            ERC-20 Token Indexer
          </Heading>
          <Text>
            Plug in an address and this website will return all of its ERC-20
            token balances!
          </Text>
        </Flex>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>
          Get all the ERC-20 token balances of this address:
        </Heading>
        <Input
          onChange={(e) => setUserAddress(e.target.value)}
          color="black"
          w="600px"
          textAlign="center"
          p={4}
          bgColor="white"
          fontSize={24}
          value={userAddress}
        />
        <Button fontSize={20} onClick={getTokenBalance} mt={'36px'} _hover={{bgColor: theme.colors.gray[600], cursor: 'pointer'}}>
          Check ERC-20 Token Balances
        </Button>
        {isLoading && <CircularProgress mt="13px" isIndeterminate color='green' />}
        {hasQueried && isLoading === false ? (
          <Box>
          <Heading my={'36px'}>ERC-20 token balances:</Heading>          
            <SimpleGrid w="90vw" my="36px" columns={columns} spacing={13}>
              {results.tokenBalances.map((e, i) => {
                return (
                  <Flex
                    flexDir={'column'}
                    border={'2px solid green'}
                    p="13px"
                    key={e.id}
                  >
                    <Text m="0">
                      <b>Symbol:</b> {tokenDataObjects[i].symbol}&nbsp;
                    </Text>
                    <Text m="0" wordBreak={'normal'} isTruncated>
                      <b>Balance:</b>&nbsp;
                      {Utils.formatUnits(
                        e.tokenBalance,
                        tokenDataObjects[i].decimals
                      )}
                    </Text>
                    <Flex justifyContent={'flex-end'}>
                      <Image w="128" p="2" src={tokenDataObjects[i].logo} />
                    </Flex>
                  </Flex>
                );
              })}
            </SimpleGrid>
          </Box>
        ) : (
          isLoading === false ? 'Please make a query! This may take a few seconds...' : ''
        )}
      </Flex>
    </Box>
  );
}

export default App;
