import TokenIcon from 'components/TokenIcon'
import getStats from 'lib/zilstream/getStats'
import { InferGetServerSidePropsType } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { cryptoFormat, currencyFormat } from 'utils/format'
import useMoneyFormatter from 'utils/useMoneyFormatter'

export const getServerSideProps = async () => {
  const stats = await getStats()

  return {
    props: {
      stats,
    }
  }
}

const Liquidity = ({ stats }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const moneyFormat = useMoneyFormatter({maxFractionDigits: 5})

  const tokens = stats.tokens.filter((token: any) => token.liquidity > 0)

  tokens.sort((a: any, b: any) => {
    return (a.liquidity < b.liquidity) ? 1 : -1
  })
  
  return (
    <>  
      <Head>
        <title>ZilSwap Liquidity | ZilStream</title>
        <meta property="og:title" content={`ZilSwap Liquidity | ZilStream`} />
      </Head>
      <div className="pt-8 pb-2 md:pb-8">
        <div className="flex flex-col lg:flex-row items-start">
          <div className="flex-grow">
            <h1 className="mb-1">ZilSwap Liquidity</h1>
            <div className="flex items-center text-sm">
              <div className="text-gray-600">Total Value Locked: <span className="font-medium">{currencyFormat(stats.tvl)}</span></div>
            </div>
          </div>
        </div>
      </div>
      <div className="scrollable-table-container max-w-full overflow-x-scroll">
        <table className="zilstream-table table-fixed border-collapse">
          <colgroup>
            <col style={{width: '250px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
            <col style={{width: '140px', minWidth: 'auto'}} />
          </colgroup>
          <thead className="text-gray-500 dark:text-gray-400 text-xs">
            <tr>
              <th className="pl-3 pr-2 py-2 text-left">Token</th>
              <th className="px-2 py-2 text-right">Reserve</th>
              <th className="px-2 py-2 text-right">Liquidity</th>
              <th className="px-2 py-2 text-right">ZIL</th>
              <th className="px-2 py-2 text-right">EMA30</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token: any, index: number) => {
              return (
                <tr key={token.address} role="row" className="text-sm border-b dark:border-gray-700 last:border-b-0 whitespace-nowrap">
                  <td className={`pl-4 pr-2 py-4 flex items-center font-medium ${index === 0 ? 'rounded-tl-lg' : ''} ${index === tokens.length-1 ? 'rounded-bl-lg' : ''}`}>
                   <Link href={`/tokens/${token.symbol.toLowerCase()}`}>
                      <a className="flex items-center">
                        <div className="w-6 h-6 flex-shrink-0 flex-grow-0 mr-3">
                          <TokenIcon address={token.address} />
                        </div>
                        <span className="hidden lg:inline">{token.name}</span>
                        <span className="lg:font-normal ml-2 lg:text-gray-500">{token.symbol}</span>
                      </a>
                    </Link>
                  </td>
                  <td className="px-2 py-2 font-normal text-right">
                    <div>{cryptoFormat(token.zil_reserve)} <span className="font-medium">ZIL</span></div>
                    <div>{cryptoFormat(token.token_reserve)} <span className="font-medium">{token.symbol}</span></div>
                  </td>
                  <td className="px-2 py-2 font-normal text-right">{currencyFormat(token.liquidity)}</td>
                  <td className="px-2 py-2 font-normal text-right">
                    {cryptoFormat(token.liquidity_zil)}
                  </td>
                  <td className={`px-2 py-2 font-normal text-right ${index === 0 ? 'rounded-tr-lg' : ''} ${index === tokens.length-1 ? 'rounded-br-lg' : ''}`}>
                  {cryptoFormat(token.liquidity_ema30_zil)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Liquidity