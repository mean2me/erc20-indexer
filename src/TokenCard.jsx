import { PiImageBroken } from 'react-icons/pi';
import { etherscanTokenLink, formatBalance } from './lib/helpers';
import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Icon,
  Image,
  Link,
  Text,
} from '@chakra-ui/react';
import { FaExternalLinkAlt } from 'react-icons/fa';

const TokenCard = ({ token, tokenDataObject }) => {
  return tokenDataObject ? (
    <Card
      overflow="hidden"
      variant="outline"
      direction={'column'}
      backgroundColor={'gray.700'}
      color={'gray.100'}
    >
      <CardBody
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          flexDirection: 'column',
        }}
      >
        <Heading size="sm">
          <Link
            href={etherscanTokenLink(tokenDataObject.address)}
            target="_black"
            sx={{ display: 'flex', alignItems: 'center' }}
            title="View on Etherscan"
          >
            {tokenDataObject.symbol}
            <Icon sx={{ mx: 8 }} fontSize={12} as={FaExternalLinkAlt} />
          </Link>
        </Heading>

        <Box p={2}>
          {tokenDataObject.logo ? (
            <Image
              flex={'1'}
              objectFit="cover"
              src={tokenDataObject.logo}
              alt={tokenDataObject.symbol}
              sizes={[48]}
            />
          ) : (
            <Icon fontSize={48} as={PiImageBroken} />
          )}
        </Box>
      </CardBody>

      <CardFooter>
        <Text
          fontSize={'small'}
          title={formatBalance(token.tokenBalance, tokenDataObject.decimals)}
        >
          Balance: {formatBalance(token.tokenBalance, tokenDataObject.decimals)}
        </Text>
      </CardFooter>
    </Card>
  ) : (
    <></>
  );
};

export default TokenCard;
