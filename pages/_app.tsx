import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import "../styles/globals.css";

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const arialMono = localFont({ src: '../public/fonts/ArialMonoMTProRegular.ttf', variable: '--font-mono' })


export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-mono: ${arialMono.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} /></>
  )
}
