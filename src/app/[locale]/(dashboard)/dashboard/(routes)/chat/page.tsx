"use client"
import React from 'react'
import { Chat } from "@/components/chat/chat";
import { userData } from '@/app/data';

export default function page() {
    const [selectedUser, setSelectedUser] = React.useState(userData[0]);
    return (
        <div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex">
            <Chat messages={selectedUser.messages} />
        </div>
    )
}
