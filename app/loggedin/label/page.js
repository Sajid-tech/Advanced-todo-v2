"use client"
import AddLabel from '@/components/label/AddLabel';
import MobileNav from '@/components/nav/MobileNav';
import Sidebar from '@/components/nav/Sidebar';
import axios from 'axios';
import { Tag } from 'lucide-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react'

const Label = () => {
    const { data: session } = useSession()
    const [getData, setGetData] = useState([])

    useEffect(() => {
        if (session) {
            const fetchData = async () => {
                const res = await axios.get('/api/labels')
                setGetData(res.data)
            }
            fetchData()
        }
    }, [session])

    const refreshLabels = async () => {
        if (session) {
            const res = await axios.get('/api/labels');
            setGetData(res.data);
        }
    };

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="felx flex-col">
                <MobileNav />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
                    <div className="xl:px-40">
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-semibold md:text-2xl">Label</h1>
                        </div>
                        <div className="flex flex-col gap-1 py-4">
                            {getData?.map((item, id) => (
                                <div key={id}
                                    className='flex
                                 flex-row justify-start items-center gap-2'
                                >
                                    <Tag />
                                    <p>{item.name}</p>
                                </div>
                            ))}
                            <AddLabel onFormSubmit={refreshLabels} />
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
}

export default Label