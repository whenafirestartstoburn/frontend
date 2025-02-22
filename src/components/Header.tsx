import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Moon } from 'react-feather'
import { useTheme } from 'next-themes'
import ConnectWallet from './ConnectWallet'
import useComponentVisible from 'utils/useComponentVisible'
import { useSelector } from 'react-redux'
import { AccountState, RootState } from 'store/types'
import Account from './Account'
import { useRouter } from 'next/dist/client/router'

const Header = () => {
  const router = useRouter()
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const {theme, setTheme, resolvedTheme} = useTheme()
  const accountState = useSelector<RootState, AccountState>(state => state.account)
  const {ref, isComponentVisible, setIsComponentVisible} = useComponentVisible(false)

  useEffect(() => setMounted(true), [])

  if(!mounted) return null
  
  return (
    <nav className="bg-white dark:bg-gray-800">
      <div className="container px-3 md:px-4">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} type="button" className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              {menuOpen ? (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a>
                  <img className="block lg:hidden h-8 w-auto" src="/logo.svg" alt="ZilStream" />
                  
                  {resolvedTheme === 'dark' ? (
                    <img className="hidden lg:block h-8 w-auto" src="/logo-text-dark.svg" />
                  ) : (
                    <img className="hidden lg:block h-8 w-auto" src="/logo-text.svg" />
                  )}
                </a>
              </Link>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <Link href="/">
                  <a className={router.pathname === '/' ? 'menu-item-active' : 'menu-item'} aria-current="page">Rankings</a>
                </Link>

                <Link href="/portfolio">
                  <a className={router.pathname === '/portfolio' ? 'menu-item-active' : 'menu-item'}>Portfolio</a>
                </Link>

                <Link href="/updates">
                  <a className={router.pathname === '/updates' ? 'menu-item-active' : 'menu-item'}>Updates</a>
                </Link>
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button  
              onClick={() => setTheme(resolvedTheme == 'dark' ? 'light' : 'dark')}
              className="hidden sm:block p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white focus:outline-none">
              <Moon size={22} />
            </button>

            <div className="ml-3 relative">
              <div>
                {accountState.isConnected ? (
                  <button 
                    className="bg-gray-300 dark:bg-gray-900 py-1 px-3 rounded-full font-bold ml-2 text-sm focus:outline-none" 
                    onClick={() => setIsComponentVisible(!isComponentVisible)}
                  >
                    <span className="sr-only">Open account menu</span>
                    {accountState.address.substr(0, 5) + '...' + accountState.address.substr(accountState.address.length-4,4)}
                  </button>
                ) : (
                  <button 
                    className="bg-gray-300 dark:bg-gray-900 py-1 px-3 rounded-full font-bold ml-2 text-sm focus:outline-none" 
                    onClick={() => setIsComponentVisible(!isComponentVisible)}
                  >
                    <span className="sr-only">Open connect wallet menu</span>
                    Connect wallet
                  </button>
                )
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {menuOpen &&
        <div className="sm:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/">
              <a className={router.pathname === '/' ? 'mobile-menu-item-active' : 'mobile-menu-item'} aria-current="page">Rankings</a>
            </Link>

            <Link href="/portfolio">
              <a className={router.pathname === '/portfolio' ? 'mobile-menu-item-active' : 'mobile-menu-item'}>Portfolio</a>
            </Link>

            <Link href="/updates">
              <a className={router.pathname === '/updates' ? 'mobile-menu-item-active' : 'mobile-menu-item'}>Updates</a>
            </Link>

            <button  
              onClick={() => setTheme(resolvedTheme == 'dark' ? 'light' : 'dark')}
              className="px-3 py-2 rounded-full text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white focus:outline-none">
              <Moon size={22} />
            </button>
          </div>
        </div>
      }

      {!accountState.isConnected && isComponentVisible &&
        <ConnectWallet innerRef={ref} dismissAction={() => setIsComponentVisible(false)} />
      }

      {accountState.isConnected && isComponentVisible &&
        <Account innerRef={ref} dismissAction={() => setIsComponentVisible(false)} />
      }
    </nav>
  )
}

export default Header