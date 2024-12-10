import InputForm from '@/components/InputForm'
import { Suspense } from 'react'
import Cards from '@/app/dashboard/Cards'

export default async function BugReportsPage() {

    return (
        <div className='w-4/6 flex flex-col mx-auto my-10'>
            <div className='flex justify-between'>
                <h1 className='text-4xl font-bold'>My Tickets:</h1>
                <InputForm/>
            </div>
            <div className="flex gap-2 flex-wrap w-full justify-between mt-10">
                <Suspense fallback={<p>Loading...</p>}>
                    <Cards/>
                </Suspense>
            </div>
        </div>
    );
}