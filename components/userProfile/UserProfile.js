"use client"
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import React from 'react'

const UserProfile = () => {
    const { data: session } = useSession()

    return <>
        <div>
            <Image
                src={session?.user?.image}
                width={24}
                height={24}
                alt='user profile picture'
                className=' rounded-full'
            />
        </div>
    </>
}

export default UserProfile