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
import { Alchemy, Network } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { useState } from 'react';
import IpfsImage from './IpfsImage'

const provider = new ethers.providers.Web3Provider(window.ethereum);

function App() {
  const [account, setAccount] = useState();
  const [network, setNetwork] = useState();
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const config = {
    apiKey: 'ySrSWZFSgtdrJKB3eWsgWKzGvSjDXLkK',
    network: Network.ETH_GOERLI,
  };

  const theme = useTheme();

  async function getNFTsForOwner() {
    setIsLoading(true);

    const alchemy = new Alchemy(config);
    try {
      const data = await alchemy.nft.getNftsForOwner(userAddress);
      setResults(data);
  
      const nfts = [];
  
      for (let nft of data.ownedNfts) {
        const metadata = await alchemy.nft.getNftMetadata(
          nft.contract.address,
          nft.tokenId,
          {tokenType: 'ERC721'}
        );
        console.log(metadata);
        nfts.push(metadata);
      }
  
      setTokenDataObjects(nfts);
    } catch(e) {
      console.error(e);
      setResults([]);
    } finally {
      setHasQueried(true);
      setIsLoading(false);
    }
  }

  async function getAccounts() {
    const accounts = await provider.send('eth_requestAccounts', []);
    setAccount(accounts[0]);
    setUserAddress(accounts[0]);
    setNetwork(config.network);
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
            NFT Indexer 🖼
          </Heading>
          <Text>
            Plug in an address and this website will return all of its NFTs!
          </Text>
        </Flex>
      <Flex
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
      >
        <Heading mt={42}>Get all the ERC-721 tokens of this address:</Heading>
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
        <Button fontSize={20} onClick={getNFTsForOwner} mt={'36px'} _hover={{bgColor: theme.colors.gray[600], cursor: 'pointer'}}>
          Fetch NFTs
        </Button>

        <Heading my={'36px'}>Here are your NFTs:</Heading>

        {isLoading && <CircularProgress mt="13px" isIndeterminate color='green' />}
        {hasQueried && isLoading === false ? (
          <SimpleGrid w={'90vw'} columns={columns} spacing={24}>
            {results.ownedNfts.map((e, i) => {
              return (
                <Flex
                  flexDir={'column'}
                  color="white"
                  key={e.id}
                >
                  <Box>
                    <b>Name:</b>{' '}
                    {tokenDataObjects[i].title?.length === 0
                      ? 'No Name'
                      : tokenDataObjects[i].title}
                  </Box>
                  <Image
                    src={
                      tokenDataObjects[i]?.media?.[0].gateway ??
                      'https://via.placeholder.com/200'
                    }
                    alt={'NFT Image'}
                  />
                </Flex>
              );
            })}
          </SimpleGrid>
        ) : (
          isLoading === false ? 'Please make a query! This may take a few seconds...' : ''
        )}
      </Flex>
    </Box>
  );
}

export default App;
