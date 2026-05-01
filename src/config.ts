import { createConfig, http } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected, coinbaseWallet, metaMask } from 'wagmi/connectors';

export const config = createConfig({
  chains: [base],
  connectors: [
    injected(),
    coinbaseWallet({ appName: '8004 AgentScan' }),
    metaMask()
  ],
  transports: {
    [base.id]: http(),
  },
});
