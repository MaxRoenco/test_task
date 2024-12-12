'use client'
import { Button } from '../components/ui/button'
import Link from 'next/link'
import MainPageCard from "@/components/MainPageCard";

const Page = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <MainPageCard/>
    </div>
  );
};

export default Page;
