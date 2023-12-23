import React from 'react'
import {UserButton} from '@clerk/nextjs'
import MainNav from '@/components/MainNav'
import StoreSwitcher from '@/components/StoreSwitcher'

const Navbar = () => {
  return (
    <div className = "border-b flex h-16 items-center px-4">
        <div className = "">
           <StoreSwitcher/>
        </div>
        <MainNav className = "mx-6"/>
        <div className = "ml-auto flex items-center space-x-4">
            <UserButton afterSignOutUrl='/'/>
        </div>
    </div>
  )
}

export default Navbar