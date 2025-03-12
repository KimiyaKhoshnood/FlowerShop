import { DashboardHeader } from '@/components/headerAndFooter';
import React from 'react'

const layout = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) => {
  return (
    <div>
        <DashboardHeader/>
        {children}
    </div>
  )
}

export default layout