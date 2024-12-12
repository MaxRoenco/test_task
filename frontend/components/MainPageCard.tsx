'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { checkPushUser } from "@/lib/api";

const MainPageCard: React.FC = () => {

  const [name, setName] = useState<string>("");
  const router = useRouter();

  const onClickUser = async () => {
    if (name.trim()) {
      setName(name);
      localStorage.setItem("userName", name);
      const userID = await checkPushUser(name);
      localStorage.setItem("userID", userID);
      setName("");
      router.push('/dashboard');
    } else {
      alert("Please enter a valid name.");
    }
  };

  const onClickAdmin = async () => {
    if (name.trim()) {
      setName(name);
      localStorage.setItem("userName", name);
      const userID = await checkPushUser(name);
      localStorage.setItem("userID", userID);
      setName("");
      router.push('/tickets');
    } else {
      alert("Please enter a valid name.");
    }
  };


  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Enter in our report system</CardTitle>
        <CardDescription>Create your new error report in one click</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Your user name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onClickUser}>User</Button>
        <Button onClick={onClickAdmin}>Admin</Button>
      </CardFooter>
    </Card>
  );
};

export default MainPageCard;
