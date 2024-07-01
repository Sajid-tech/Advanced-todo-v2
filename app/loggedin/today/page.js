import MobileNav from '@/components/nav/MobileNav';
import Sidebar from '@/components/nav/Sidebar';
import React from 'react'

const page = () => {
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="felx flex-col">
                <MobileNav />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
                    <h3>Today</h3>
                </main>

            </div>
        </div>
    );
}

export default page