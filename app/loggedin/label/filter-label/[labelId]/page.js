"use client"
import AddFilterLabel from '@/components/label/AddFilterLabel';
import MobileNav from '@/components/nav/MobileNav';
import Sidebar from '@/components/nav/Sidebar';
import axios from 'axios';
import { ArrowLeftFromLine, ArrowLeftToLine } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const FilterLabel = () => {
    const { labelId } = useParams()
    const router = useRouter()

    const handleLabelClick = () => {
        router.push(`/loggedin/label`);
    }


    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="felx flex-col">
                <MobileNav />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
                    <div className="xl:px-40">
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-semibold md:text-2xl">Filter-Label</h1>
                            <ArrowLeftToLine onClick={handleLabelClick} className='text-red-500 hover:text-blue-400 cursor-pointer' />
                        </div>
                        <div className="flex flex-col gap-1 py-4">
                            <AddFilterLabel labelId={labelId} />
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
}

export default React.memo(FilterLabel)