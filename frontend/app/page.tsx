'use client'
import { Button } from '../components/ui/button'
import Link from 'next/link'
import MainPageCard from "@/components/MainPageCard";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* <h1 className="mb-4">You're a...</h1> */}
      {/* <Link href="/tickets">
        <Button size="lg" className="mb-2">
          Developer
        </Button>
      </Link>
      <Link href="/dashboard">
        <Button size="lg">
          User
        </Button>
      </Link> */}
      <MainPageCard/>
    </div>
  )
}

export default Page
