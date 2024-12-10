import React from "react";
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar";
import { UserButton } from "@clerk/nextjs";
import { AppSidebar } from "../../components/app-sidebar";
import { Button } from "@/components/ui/button";
import SidebarMain from "../../components/sidebar-main";

type Props = {
  children: React.ReactNode;
};

const SidebarLayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarMain>
        {children}
      </SidebarMain>
    </SidebarProvider>
  );
};

export default SidebarLayout;
