

import type { Metadata } from 'next'
import RibbitLogo from '@/components/Header/RibbitLogo/RibbitLogo'
import SignUser from '@/components/Header/SignUser/SignUser'
import { redirect, usePathname } from 'next/navigation'

export const metadata: Metadata = {
    title: "Ribbit",
    description:
      "Ribbit is a Social Media web application where People can make posts , follow communities and Chat in Realtime.",
  };

const LandingPage = () => {

  const pathname = usePathname()  

  if(pathname !== '/') redirect('/')
  return (
    <section className='w-full h-screen flex flex-col'>
        <header className='flex items-center justify-between px-20 py-5 border-b border-gray-800'>
            <RibbitLogo />
            <SignUser />
        </header>

        <main className='flex-1 flex flex-col items-center gap-y-5'>
            <h1 className='mt-20 text-9xl font-mono font-bold tracking-widest text-green-400'>Ribbit</h1>
            <div className='rounded-full border border-green-400 px-7 py-2 flex  items-center gap-10'>
                <p>
                    Your go to platform to rant
                </p>
                <button className='bg-green-700 rounded-full px-3 py-1.5'>
                    Get started
                </button>
            </div>
        </main>

        <footer className='border-t border-gray-800 text-gray-500 text-sm flex items-center justify-center px-20 py-5'>
            <a href="https://dhruvroy.in" target='_blank' className='font-semibold'>
            &copy; {new Date().getFullYear()} Crafted with 🩵 by Dhruv
            </a> 
        </footer>
    </section>
  )
}

export default LandingPage
