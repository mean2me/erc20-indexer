import { Button } from '@chakra-ui/react';
import { useCallback, useEffect, useState } from 'react';
import { MdCircle } from 'react-icons/md';
import { getProvider } from './lib/helpers';

const DISCONNECTED_COLOR = 'red';
const CONNECTED_COLOR = 'green';
const NO_METAMASK_COLOR = 'grey';

/**
 * @typedef {import('ethers').Signer} JsonRpcSigner
 */

/**
 * @typedef {Object} Props
 * @property {function(JsonRpcSigner):void} onClick
 * @property {function(JsonRpcSigner):void} onLoad
 * @property {function(JsonRpcSigner):void} onDisconnect
 */

/**
 * @param {Props} props
 */
const MetamaskButton = ({ onClick, onLoad, onDisconnect }) => {
  const [color, setColor] = useState();

  const checkConnection = useCallback(async () => {
    if (window.ethereum) {
      const provider = getProvider();
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      });
      if (accounts.length > 0) {
        setColor(CONNECTED_COLOR);
        const signer = provider.getSigner(accounts[0]);
        !!onLoad && onLoad(signer);
      } else {
        setColor(DISCONNECTED_COLOR);
      }
    } else {
      setColor(NO_METAMASK_COLOR);
    }
  }, []);

  const onConnectionChanged = useCallback(async accounts => {
    if (accounts?.length > 0) {
      setColor(CONNECTED_COLOR);
      return true;
    } else {
      setColor(DISCONNECTED_COLOR);
      onDisconnect(accounts);
      return false;
    }
  }, []);

  const connectToMetamask = useCallback(async () => {
    if (window.ethereum) {
      const provider = getProvider();
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      if (accounts.length > 0) {
        const signer = provider.getSigner(accounts[0]);
        if (signer) {
          setColor(CONNECTED_COLOR);
        }
        onClick(signer);
      } else {
        setColor(DISCONNECTED_COLOR);
        onDisconnect(accounts);
      }
    }
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      checkConnection();
      window.ethereum.on('accountsChanged', onConnectionChanged);
    }
    return () => {
      window.ethereum.removeListener('accountsChanged', onConnectionChanged);
    };
  }, []);

  return (
    <Button
      onClick={connectToMetamask}
      size={{
        base: 'xs',
        sm: 'md',
      }}
      variant={'solid'}
      colorScheme="orange"
      rightIcon={<MdCircle color={color} />}
      sx={{ mx: 0 }}
    >
      Metamask
    </Button>
  );
};

export default MetamaskButton;
