"use client";
import { signOutAction } from '@/actions/auth-action';
import MobileNav from '@/components/nav/MobileNav';
import Sidebar from '@/components/nav/Sidebar';
import TodoList from '@/components/todos/TodoList';



const Page = () => {

    const handleSignOut = () => {
        signOutAction()
    }

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <Sidebar />
            <div className="felx flex-col">
                <MobileNav />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
                    <TodoList />
                </main>

            </div>
        </div>
    );
};

export default Page;
