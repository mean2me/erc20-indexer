import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  SimpleGrid,
} from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { getAlchemy, isValidAddress } from './lib/helpers';
import MetamaskButton from './MetamaskButton';

import { ethers } from 'ethers';

import TokenCard from './TokenCard';
import { FaSearch } from 'react-icons/fa';

function App() {
  const [userAddress, setUserAddress] = useState('');
  const [results, setResults] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [signer, setSigner] = useState();

  /**
   * Note for the reader or code reviewer:
   * Here I took advantage of an async generator to limit the request rate
   * to an acceptable amount of calla per iteration.
   * It prevents the 429 error "too many requests"
   */
  async function* consumeTokens(tokensAddresses = []) {
    let sliceIndex = 0;
    let sliceSize = 10;
    const alchemy = await getAlchemy();
    while (sliceIndex < tokensAddresses.length) {
      const tokens = tokensAddresses.slice(sliceIndex, sliceIndex + sliceSize);
      const promises = tokens.map(
        address =>
          new Promise(resolve => {
            alchemy.core.getTokenMetadata(address).then(data => {
              resolve({ ...data, address });
            });
          })
      );
      const results = await Promise.all(promises);
      sliceIndex += sliceSize;
      yield results;
    }
  }

  async function getTokenData() {
    if (!userAddress) return;
    const alchemy = await getAlchemy();
    const data = await alchemy.core.getTokenBalances(userAddress);

    data.tokenBalances.map(t => {
      const balance = t?.tokenBalance
        ? ethers.BigNumber.from(t.tokenBalance)
        : 0;

      return { ...t, tokenBalance: balance };
    });
    const results = data.tokenBalances?.filter(
      t => parseInt(t.tokenBalance) > 0
    );
    setResults({ ...data, tokenBalances: results });

    const addresses = data.tokenBalances.map(token => token.contractAddress);

    const dataObjects = [];
    for await (let info of consumeTokens(addresses)) {
      dataObjects.push(...info);
    }

    setTokenDataObjects(dataObjects);
    setHasQueried(true);
  }

  const handleMetamaskButtonClick = useCallback(async _signer => {
    if (!signer) {
      setSigner(_signer);
      const address = await _signer.getAddress();
      setUserAddress(address);
    }
  }, []);

  const handleMetamaskOnLoadEvent = useCallback(async _signer => {
    if (!signer) {
      setSigner(_signer);
      const address = await _signer.getAddress();
      setUserAddress(address);
    }
  }, []);

  const handleMetamaskDisconnected = useCallback(() => {
    setSigner(null);
    setUserAddress('');
    setResults([]);
    setHasQueried(false);
  }, [setSigner]);

  useEffect(() => {
    if (userAddress && isValidAddress(userAddress)) {
      getTokenData();
    } else {
      setResults([]);
      setHasQueried(false);
    }
  }, [userAddress]);

  return (
    <Box
      w="100vw"
      h="100vh"
      pt={'72px'}
      backgroundColor={'gray.900'}
      overflowX={'hidden'}
    >
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          w: '100vw',
          bgColor: 'purple.900',
          h: '64px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 1,
        }}
        shadow={'md'}
        zIndex={'modal'}
      >
        <Heading mb={0} fontSize={{ base: 18, md: 36 }} flex={1}>
          ERC-20 Token Indexer
        </Heading>
        <MetamaskButton
          onClick={handleMetamaskButtonClick}
          onLoad={handleMetamaskOnLoadEvent}
          onDisconnect={handleMetamaskDisconnected}
        />
      </Box>
      <Flex
        w="100vw"
        m={0}
        p={0}
        flexDirection="column"
        alignItems="center"
        justifyContent={'center'}
        overflow={'hidden'}
      >
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <Input
            disabled={!!signer}
            onChange={e => {
              setUserAddress(e.target.value);
            }}
            color="black"
            textAlign="center"
            bgColor="white"
            fontSize={24}
            value={userAddress}
            sx={{ fontSize: 'xs' }}
            minWidth={{ base: 350, md: 400 }}
            mx={2}
            placeholder="Type a valid address or connect you Metamask"
          />
          <Button
            fontSize={{ base: 16 }}
            onClick={getTokenData}
            rightIcon={<FaSearch size={'1rem'} />}
            colorScheme="orange"
          >
            Search
          </Button>
        </Box>

        {results.tokenBalances?.length === 0
          ? 'No balances for this address'
          : ''}

        {hasQueried ? (
          <SimpleGrid w={'80vw'} py={2} columns={3} spacing={2}>
            {results.tokenBalances.map((token, i) => {
              return (
                <TokenCard
                  key={`token_${i}`}
                  token={token}
                  tokenDataObject={tokenDataObjects[i]}
                />
              );
            })}
          </SimpleGrid>
        ) : (
          'Please make a query! This may take a few seconds...'
        )}
      </Flex>
    </Box>
  );
}

export default App;
