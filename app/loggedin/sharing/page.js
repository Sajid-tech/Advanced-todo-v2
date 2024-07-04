"use client"
import MobileNav from '@/components/nav/MobileNav';
import Sidebar from '@/components/nav/Sidebar';
import AddProject from '@/components/sharing/AddProject';
import axios from 'axios';
import { Hash, Tag, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react'

const Sharing = () => {
    const { data: session } = useSession()
    const [getData, setGetData] = useState([])
    const router = useRouter()


    useMemo(async () => {
        if (session) {
            try {
                const response = await axios.get("/api/shareLabels");
                setGetData(response.data);
            } catch (error) {
                console.error("Error fetching labels:", error);
                return []; // Return empty array in case of error
            }


        }
    }, [session])

    // const handleDeleteLabel = async (labelId) => {
    //     try {
    //         await axios.delete(`/api/labels/${labelId}`);
    //         refreshLabels()
    //     } catch (error) {
    //         console.error("Error deleting label:", error);
    //     }
    // };



    const refreshLabels = async () => {
        if (session) {
            const res = await axios.get("/api/shareLabels");
            setGetData(res.data);
        }
    };
    const handleShareClick = (shareId) => {
        router.push(`/loggedin/sharing/share-project/${shareId}`);
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="felx flex-col">
                <MobileNav />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
                    <div className="xl:px-40">
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-semibold md:text-2xl">Sharing-Project</h1>
                        </div>
                        <div className="flex flex-col gap-1 py-4">
                            {getData?.map((item, id) => (
                                <div key={id}
                                    className='flex flex-row justify-start items-center gap-2 py-2 border-b border-gray-200' // Added border and padding
                                >
                                    <div className="flex items-center gap-2">
                                        <Hash className="text-primary" /> {/* Added text color to Tag */}
                                        <p
                                            onClick={() => handleShareClick(item._id)}
                                            className=" text-sm font-normal text-left cursor-pointer">{item.projectName}</p> {/* Adjusted text size */}
                                    </div>
                                    <button
                                        className="ml-auto"
                                        onClick={() => handleDeleteLabel(item._id)}>
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                    </button>

                                </div>
                            ))}
                            <AddProject />
                        </div>
                    </div>
                </main>

            </div>
        </div>
    );
}

export default Sharing