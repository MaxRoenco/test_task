import React from "react";
import { Button } from "../components/ui/button";
import Link from "next/link";

const Page = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col gap-4">
      <h1 className="text-2xl">You're a...</h1>
      <div>
        <Button size="lg">
          <Link className="w-full h-full flex justify-center items-center" href="/tickets">Developer</Link>
        </Button>
      </div>
      <div>
        <Button size="lg">
          <Link className="w-full h-full flex justify-center items-center" href="/dashboard">User</Link>
        </Button>
      </div>
    </div>
  );
};

export default Page;
