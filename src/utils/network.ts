import * as Network from 'expo-network';

export const network = async () => {
  const status = await Network.getNetworkStateAsync();
  console.log('status', status);
  return status?.isConnected && status?.type === 'WIFI';
};
