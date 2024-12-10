'use client'

import React from 'react'
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu, PanelLeft, PanelLeftClose, PanelLeftOpen } from 'lucide-react';


type Props = {
  children: React.ReactNode
}

const SidebarMain = ({children}: Props) => {
  const {toggleSidebar} = useSidebar()
  return (
    <main className="m-2 w-full">
        <div className="flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar p-2 pr-4 shadow mb-4">
          <Button onClick={() => toggleSidebar()} variant='ghost' size='icon'>
            <PanelLeft />
          </Button>
          <div className="ml-auto" />
          <UserButton />
        </div>
        <div className="h-[calc(100vh-5rem)] overflow-y-scroll rounded-md border border-sidebar-border bg-sidebar p-4 shadow">
          {children}
        </div>
      </main>
  )
}

export default SidebarMain