import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import "../styles/globals.css";
import { GameProvider } from '../providers/GameProvider';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { zoraTestnet } from 'viem/chains';
import { publicProvider } from 'wagmi/providers/public'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const arialMono = localFont({
  src: [
    { path: '../public/fonts/ArialMonoMTProRegular.ttf', weight: '400', style: 'normal' },
    { path: '../public/fonts/ArialMonoMTProBold.ttf', weight: '700', style: 'normal' },
  ], variable: '--font-mono'
})

const { publicClient, webSocketPublicClient } = configureChains(
  [zoraTestnet],
  [publicProvider()],
)

const config = createConfig({
  autoConnect: true,
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
        <GameProvider>
          <Component {...pageProps} />
        </GameProvider >
      </WagmiConfig>
    </>
  )
}
