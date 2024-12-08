'use client'

import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { api } from '@/trpc/react'
import { Info } from 'lucide-react'
import React, { useState } from 'react'
import createCheckoutSession from '@/lib/stripe'

const BillingPage = () => {
  const {data: credits} = api.project.getMyCredits.useQuery()
  const [buyCredits, setBuyCredits] = useState([100])
  const creditsToBuyAmount = buyCredits[0]!
  const price = (creditsToBuyAmount / 50).toFixed(2)
  return (
    <div>
      <h1 className='text-2xl font-semibold'>Billing</h1>
      <div className='h-2'/>
      <p className='text-sm text-gray-500'>
        You currently have {credits?.credits} credits.
      </p>
      <div className='h-2'/>
      <div className='bg-blue-50 px-4 py-2 rounded-md border border-blue-200 text-blue-700'>
        <div className='flex items-center gap-2'>
          <Info className='size-4'/>
          <p className='text-sm'>Each credit allows you to index 1 file in a repository</p>
        </div>
        <p className='text-sm'>E.g. if your project has 100 files, you will need 100 credits to index it.</p>
      </div>
      <div className='h-4'/>
      <Slider 
        defaultValue={[100]} 
        max={1000} 
        min={10} 
        step={10} 
        onValueChange={value => setBuyCredits(value)} 
        value={buyCredits}
      />
      <div className='h-4'/>
      <Button onClick={() => {
        createCheckoutSession(creditsToBuyAmount)
      }}>
        Buy {creditsToBuyAmount} credits for ${price}
      </Button>
    </div>
  )
}

export default BillingPage
