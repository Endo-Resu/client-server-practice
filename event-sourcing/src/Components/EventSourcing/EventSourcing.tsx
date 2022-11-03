import React, {useEffect, useState} from 'react';
import axios from "axios";

interface IMessage {
    id: number;
    message: string;
}

const EventSourcing = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [value, setValue] = useState<string>('');

    useEffect(() => {
        subscribe();
    }, [])

    const subscribe = async () => {
        const eventSource = new EventSource(`http://localhost:5000/connect`);
        eventSource.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [message, ...prev])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const sendMessage = async () => {
        await axios.post('http://localhost:5000/new-message', {
            message: value,
            id: Date.now(),
        })
    }

    return (
        <>
            <div>
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                />
                <button onClick={sendMessage}>Отправить</button>
            </div>
            <div>
                {messages.map(mess =>
                    <div key={mess.id}>
                        {mess.message}
                    </div>
                )}
            </div>
        </>
    );
};

export default EventSourcing;
