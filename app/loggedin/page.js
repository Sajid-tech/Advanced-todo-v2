"use client";
import { signOutAction } from '@/actions/auth-action';
import MobileNav from '@/components/nav/MobileNav';
import Sidebar from '@/components/nav/Sidebar';



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
                    <h1>Todovex</h1>
                    <button onClick={handleSignOut}>signout</button>
                </main>

            </div>
        </div>
    );
};

export default Page;
