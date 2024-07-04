"use client";
import { motion } from 'framer-motion';
import MobileNav from '@/components/nav/MobileNav';
import Sidebar from '@/components/nav/Sidebar';
import AddShareProject from '@/components/sharing/AddShareProject';
import ShareTaskDisplay from '@/components/sharing/ShareTaskDisplay';
import axios from 'axios';
import { ArrowLeftToLine, Briefcase, Trash2, Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SharedProject = () => {
    const { data: session } = useSession();
    const { shareId } = useParams();
    const router = useRouter();

    const [getData, setGetData] = useState(null);
    const [selectUser, setSelectUser] = useState([]);
    const [shareTask, setShareTask] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [responseLabels, responseTasks] = await Promise.all([
                    axios.get(`/api/shareLabels/${shareId}`),
                    axios.get(`/api/shareProjects/${shareId}`)
                ]);
                setGetData(responseLabels.data);
                setSelectUser(responseLabels.data.selectUser);
                setShareTask(responseTasks.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Handle error gracefully
            } finally {
                setIsLoading(false);
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

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`/api/shareProjects/${taskId}`);
            // Remove the deleted task from the state
            setShareTask(prevTasks => prevTasks.filter(task => task._id !== taskId));
        } catch (error) {
            console.error("Error deleting task:", error);
            // Handle error (e.g., show an error message to the user)
        }
    };

    const handleLabelClick = () => {
        router.push(`/loggedin/sharing`);
    };

    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        in: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: 'spring', stiffness: 100 }
        }
    };

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <motion.div
                className="flex flex-col"
                initial="initial"
                animate="in"
                exit="exit"
                variants={pageVariants}
                transition={{ duration: 0.5 }}
            >
                <MobileNav />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-8 lg:p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
                    <motion.div
                        className="mx-auto w-full max-w-5xl space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Sharing Project Task</h1>
                            <motion.button
                                onClick={handleLabelClick}
                                className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2 shadow-md hover:shadow-lg"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ArrowLeftToLine className="mr-2 h-4 w-4" />
                                Back to Sharing
                            </motion.button>
                        </motion.div>
                        <motion.div
                            variants={itemVariants}
                            className="rounded-xl border bg-white text-gray-900 shadow-lg overflow-hidden"
                        >
                            <div className="p-6 space-y-6">
                                {isLoading ? (
                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                        className="h-8 bg-gray-200 rounded"
                                    />
                                ) : (
                                    <motion.div
                                        className="flex flex-col sm:flex-row sm:items-center gap-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <div className="flex items-center">
                                            <Briefcase className="mr-2 h-6 w-6 text-blue-600" />
                                            <h2 className="text-xl font-semibold">Project: {getData?.projectName}</h2>
                                        </div>
                                        <div className="flex items-center">
                                            <Users className="mr-2 h-6 w-6 text-blue-600" />
                                            <p className="text-sm text-gray-600">Shared with: {getData?.selectUser?.join(', ')}</p>
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div
                                    className="space-y-4"
                                    variants={itemVariants}
                                >
                                    <h3 className="text-xl font-semibold text-gray-900">Tasks</h3>
                                    <ShareTaskDisplay task={shareTask} onDeleteTask={handleDeleteTask} />

                                </motion.div>
                                <motion.div
                                    className="pt-6 border-t"
                                    variants={itemVariants}
                                >
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Add New Task</h3>
                                    <AddShareProject parentShareId={shareId} users={selectUser} onShareTaskAdded={refreshShareTask} />
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                </main>
            </motion.div>
        </div>
    );
};

export default SharedProject;