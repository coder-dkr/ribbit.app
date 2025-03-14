import React from 'react'
import RibbitLogo from './RibbitLogo/RibbitLogo'
import Search from './Search/Search'
import SignUser from './SignUser/SignUser'


export default function Header() {
  return (
    <header className='w-full p-5 flex justify-around mx-auto border-b border-b-gray-800'>
      <RibbitLogo />
      <Search />
      <SignUser />
    </header>
  )
}
