import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { pinata } from 'frog/hubs'
import { serveStatic } from 'frog/serve-static'
import { handle } from 'frog/vercel'
import type { Address } from 'viem'
import { baseSepolia } from 'viem/chains'
import { abi } from '../abi.js'

const GAME_URL = {
	ios: "https://testflight.apple.com/join/x7XlR5Ij",
	android: "https://play.google.com/store/apps/details?id=com.zeeverse.zee",
	webgl: "https://play.zee-verse.com/",
	epic: "https://store.epicgames.com/en-US/p/zeeverse-92a34e",
};

// Uncomment to use Edge Runtime.
export const config = {
  runtime: 'edge',
}

export const app = new Frog({
  basePath: '/api',
  // Supply a Hub API URL to enable frame verification.
  hub: pinata(),
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' }),
})

app.frame('/', (c) => {
  return c.res({
    action: '/finish',
    // image: 'http://localhost:5173/og.png',
    // imageAspectRatio: '1:1',
    intents: [<Button.Transaction target="/mint">Mint</Button.Transaction>],
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 50,  }}>
        <h2>Perform a transaction to mint zeeverse nft</h2>
      </div>
    ),
    // intents: [<Button.Transaction target="/mint">Mint</Button.Transaction>],
  })
})

app.frame('/finish', (c) => {
  const { transactionId } = c
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Transaction ID: {transactionId}
      </div>
    ),
  })
})

app.transaction('/mint', (c) => {
  const address = c.address as Address

  console.log('address', address)
  return c.contract({
    abi,
    functionName: 'claim',
    args: [
      address,
      0n,
      1n,
      '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      0n,
      {
        proof: [],
        quantityLimitPerWallet: 100n,
        pricePerToken: 0n,
        currency: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
      },
      '0x',
    ],
    chainId: `eip155:${baseSepolia.id}`,
    to: '0x5D26e97F4383dDeAC24F0DF514452906fd35B088', // web3 nft contract adress
  })
})

app.frame('/play', (c) => {
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        <h1>PLAY ZEEVERSE</h1>
      </div>
    ),
    intents: [
      <Button.Link href={GAME_URL.android}>Android</Button.Link>,
      <Button.Link href={GAME_URL.ios}>IOS</Button.Link>,
      <Button.Link href={GAME_URL.webgl}>Play on website</Button.Link>,
      <Button.Link href={GAME_URL.epic}>Epic Launcher</Button.Link>
    ]
  })
})


devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
