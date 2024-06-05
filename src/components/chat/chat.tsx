import { Message, UserData, userData } from "@/app/data";
import ChatTopbar from "./chat-topbar";
import { ChatList } from "./chat-list";
import React from "react";

interface ChatProps {
    messages?: Message[];
}

export function Chat({ messages }: ChatProps) {
    const [selectedUser, setSelectedUser] = React.useState(userData[0]);
    const [isMobile, setIsMobile] = React.useState(false);

    const [messagesState, setMessages] = React.useState<Message[]>(
        messages ?? []
    );

    const sendMessage = (newMessage: Message) => {
        setMessages([...messagesState, newMessage]);
    };

    return (
        <div className="flex flex-col justify-between w-full h-full">
            <ChatTopbar selectedUser={selectedUser} />

            <ChatList
                messages={messagesState}
                selectedUser={selectedUser}
                sendMessage={sendMessage}
                isMobile={isMobile}
            />
        </div>
    );
}