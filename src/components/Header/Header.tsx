import React from 'react'
import RibbitLogo from './RibbitLogo/RibbitLogo'
import Search from './Search/Search'
import SignUser from './SignUser/SignUser'

export default function Header() {
  return (
    <header className='w-full p-4 flex justify-around mx-auto'>
      <RibbitLogo />
      <Search />
      <SignUser />
    </header>
  )
}
