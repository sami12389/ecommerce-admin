import React from 'react'
import {UserButton, auth} from '@clerk/nextjs'
import MainNav from '@/components/MainNav'
import StoreSwitcher from '@/components/StoreSwitcher'
import { redirect } from 'next/navigation'
import prismadb from "@/lib/prismadb"

const Navbar = async () => {
  const {userId} = auth()
  if(!userId){
    redirect('/sign-in')
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    }
  })
  return (
    <div className = "border-b flex h-16 items-center px-4">
        <div className = "">
           <StoreSwitcher items = {stores} />
        </div>
        <MainNav className = "mx-6"/>
        <div className = "ml-auto flex items-center space-x-4">
            <UserButton afterSignOutUrl='/'/>
        </div>
    </div>
  )
}

export default Navbar