"use client";

import { signOutAction } from '@/actions/auth-action';
import axios from 'axios';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

const Page = () => {
    const { data: session } = useSession();
    const [getUser, setGetUser] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get('/api/users');
                setGetUser(res.data); // Assuming res.data contains the array of users

            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchData();

    }, []);

    console.log(getUser)

    const handleSignOut = async () => {
        await signOutAction();
    };

    if (!session) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <>
            <div>
                <h1>Hi, {session.user.name}, I am logged in page</h1>
                <button onClick={handleSignOut}>Sign out</button>
            </div>
            <div>
                {getUser.length > 0 ? (
                    getUser.map((item) => (
                        <h1 key={item._id}>{item.name}</h1>
                    ))
                ) : (
                    <p>No users found</p>
                )}
            </div>
        </>
    );
};

export default Page;
