import React from 'react';
import { Trans } from '@lingui/macro';
import { Button, CopyToClipboard, Card, Flex } from '@chia/core';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  TextField,
  InputAdornment,
  Grid,
} from '@material-ui/core';
import { get_address, farm_block } from '../../../modules/message';
import type { RootState } from '../../../modules/rootReducer';
import config from '../../../config/config';

type Props = {
  walletId: number;
};

export default function WalletCardReceiveAddress(props: Props) {
  const { walletId } = props;

  const dispatch = useDispatch();
  const wallet = useSelector((state: RootState) =>
    state.wallet_state.wallets?.find((item) => item.id === walletId),
  );

  if (!wallet) {
    return null;
  }

  const { address } = wallet;

  function newAddress() {
    dispatch(get_address(walletId, true));
  }

  function handleFarm() {
    if (address) {
      dispatch(farm_block(address));
    }
  }

  return (
    <Card
      title={<Trans>Receive Address</Trans>}
      action={
        <Flex gap={1} alignItems="center">
          {!!config.local_test && (
            <Button onClick={handleFarm} variant="outlined" disabled={!address}>
              <Trans>Farm</Trans>
            </Button>
          )}
          <Button onClick={newAddress} variant="outlined">
            <Trans>New Address</Trans>
          </Button>
        </Flex>
      }
      tooltip={
        <Trans>
          HD or Hierarchical Deterministic keys are a type of public key/private
          key scheme where one private key can have a nearly infinite number of
          different public keys (and therefor wallet receive addresses) that
          will all ultimately come back to and be spendable by a single private
          key.
        </Trans>
      }
    >
      <Grid item xs={12}>
        <Box display="flex">
          <Box flexGrow={1}>
            <TextField
              label={<Trans>Address</Trans>}
              value={address}
              variant="filled"
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <CopyToClipboard value={address} />
                  </InputAdornment>
                ),
              }}
              fullWidth
            />
          </Box>
        </Box>
      </Grid>
    </Card>
  );
}
