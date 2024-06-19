"use client";

import { Button, Card } from '@/components/ui'
import React from 'react'
import { CreateJoinTeamForm } from './join-team-form';

const ActionDrive = () => {
    return (
        <>
            <div className='space-y-4'>
                <h1 className="font-bold text-2xl">My groups</h1>
                <Card className="w-full p-4">
                    <Button>Join a group</Button>
                </Card>
            </div>
        </>
    )
}

export default ActionDrive