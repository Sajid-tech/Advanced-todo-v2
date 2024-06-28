"use client";
import { signOutAction } from '@/actions/auth-action';
import UserProfile from '@/components/userProfile/UserProfile';

const Page = () => {

    const handleSignOut = () => {
        signOutAction()
    }

    return (
        <main className='flex flex-col items-center justify-between p-24'>
            <h1>Todovex</h1>
            <UserProfile />
            <button onClick={handleSignOut}>signout</button>
        </main>
    );
};

export default Page;
