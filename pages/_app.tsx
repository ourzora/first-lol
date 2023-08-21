import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import "../styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import { GameProvider } from '../providers/GameProvider';
import { WagmiConfig, configureChains, createConfig, mainnet } from 'wagmi';
import { zora, zoraTestnet } from 'viem/chains';
import { publicProvider } from 'wagmi/providers/public'
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const arialMono = localFont({
  src: [
    { path: '../public/fonts/ArialMonoMTProRegular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/ArialMonoMTProBold.ttf', weight: '700', style: 'normal' },
  ], variable: '--font-mono'
})

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [zoraTestnet, mainnet, zora],
  [publicProvider()],
)

const { connectors } = getDefaultWallets({
  appName: 'first.lol',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
  // @ts-ignore
  chains: chains.map(chain => ({ ...chain, fees: { ...chain.fees ?? {}, defaultPriorityFee: parseInt(chain.fees?.defaultPriorityFee.toString()) } }))
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-mono: ${arialMono.style.fontFamily};
        }
      `}</style>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains}>
          <GameProvider>
            <Component {...pageProps} />
          </GameProvider >
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  )
}
