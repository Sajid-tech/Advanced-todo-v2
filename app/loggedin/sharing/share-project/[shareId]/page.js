"use client";
import MobileNav from '@/components/nav/MobileNav';
import Sidebar from '@/components/nav/Sidebar';
import AddShareProject from '@/components/sharing/AddShareProject';
import ShareTaskDisplay from '@/components/sharing/ShareTaskDisplay';
import axios from 'axios';
import { ArrowLeftToLine, Briefcase, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SharedProject = () => {
    const { data: session } = useSession();
    const { shareId } = useParams();
    const router = useRouter();

    const [getData, setGetData] = useState([]);
    const [selectUser, setSelectUser] = useState([]);
    const [shareTask, setShareTask] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch share labels
                const responseLabels = await axios.get(`/api/shareLabels/${shareId}`);
                setGetData(responseLabels.data);
                setSelectUser(responseLabels.data.selectUser);

                // Fetch share tasks
                const responseTasks = await axios.get(`/api/shareProjects/${shareId}`);
                setShareTask(responseTasks.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error gracefully
            }
        };

        if (session) {
            fetchData();
        }
    }, [session, shareId]);

    const refreshShareTask = async () => {
        if (session) {
            const responseTasks = await axios.get(`/api/shareProjects/${shareId}`);
            setShareTask(responseTasks.data);
        }
    };

    console.log("share task", shareTask);

    const handleLabelClick = () => {
        router.push(`/loggedin/sharing`);
    };

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="flex flex-col">
                <MobileNav />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-8 lg:p-6">
                    <div className="mx-auto w-full max-w-5xl space-y-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h1 className="text-2xl font-bold tracking-tight">Sharing Project Task</h1>
                            <button
                                onClick={handleLabelClick}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
                            >
                                <ArrowLeftToLine className="mr-2 h-4 w-4" />
                                Back to Sharing
                            </button>
                        </div>
                        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                            <div className="p-6 space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div className="flex items-center">
                                        <Briefcase className="mr-2 h-5 w-5 text-muted-foreground" />
                                        <h2 className="text-lg font-semibold">Project: {getData?.projectName}</h2>
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="mr-2 h-5 w-5 text-muted-foreground" />
                                        <p className="text-sm text-muted-foreground">Shared with: {getData?.selectUser?.join(', ')}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Tasks</h3>
                                    <ShareTaskDisplay task={shareTask} />
                                </div>
                                <div className="pt-4 border-t">
                                    <h3 className="text-lg font-semibold mb-4">Add New Task</h3>
                                    <AddShareProject parentShareId={shareId} users={selectUser} onShareTaskAdded={refreshShareTask} />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SharedProject;
