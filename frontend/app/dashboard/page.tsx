'use client'
import InputForm from '@/components/InputForm'
import { Suspense } from 'react'
import Cards from '@/app/dashboard/Cards'
import { createContext, useState } from 'react';

export interface triggerType {
    trigger: boolean;
    setTrigger: (trigger: boolean) => void;
}

export const triggerContext = createContext<triggerType>({
    trigger: true,
    setTrigger: () => {}
});

export default function BugReportsPage() {
    const [trigger, setTrigger] = useState<boolean>(true);

    return (
      <triggerContext.Provider value={{ trigger, setTrigger }}>
        <div className="w-4/6 flex flex-col mx-auto my-10">
          <div className="flex justify-between">
            <h1 className="text-4xl font-bold">My Tickets:</h1>
            <InputForm />
          </div>
          <div className="flex gap-2 flex-wrap w-full justify-between mt-10">
            <Suspense fallback={<p>Loading...</p>}>
              <Cards />
            </Suspense>
          </div>
        </div>
      </triggerContext.Provider>
    );
}