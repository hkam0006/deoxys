'use client'

import { Button } from '@/components/ui/button'
import {Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { Bot, CreditCard, LayoutDashboardIcon, Plus, Presentation } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboardIcon
  }, 
  {
    title: "Q&A",
    url: "/qa",
    icon: Bot
  },
  {
    title: "Meetings",
    url: "/meetings",
    icon: Presentation
  },
  {
    title: "Billing",
    url: "/billing",
    icon: CreditCard,
  }
]

const projects = [
  {
    name: "Project 1"
  },
  {
    name: "Project 2"
  },
  {
    name: "Project 3"
  },
  {
    name: "Project 4"
  },
]

export function AppSidebar(){
  const pathname = usePathname()
  const {open} = useSidebar()
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className='flex items-center gap-2 w-full justify-center'>
          <h1 className='font-bold text-xl text-primary/80'>
            {open ? "Deoxys" : "D"}
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Application
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className={cn({
                      '!bg-primary !text-white' : pathname === item.url
                    })}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            Your Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {projects.map((project) => (
                <SidebarMenuItem key={project.name}>
                  <SidebarMenuButton asChild>
                    <div>
                      <div className={cn(
                        'rounded-sm border size-6 flex items-center justify-center text-sm bg-white text-primary',
                        {
                          'bg-primary text-white' : true
                        }
                      )}>
                        {project.name[0]}
                      </div>
                      <span>{project.name}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <div className='h-2'></div>
              {open && (<SidebarMenuItem>
                <Link href='/create'>
                  <Button size='sm' variant='outline' className='w-fit'>
                    <Plus />
                    Create Project
                  </Button>
                </Link>
              </SidebarMenuItem>)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}