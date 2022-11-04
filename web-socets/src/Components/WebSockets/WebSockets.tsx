import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";

interface IMessage {
    id: number;
    message: string;
    username: string;
    event: 'connection'| 'message';
}

interface IEvent {
    data: string;
}

const WebSockets = () => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [value, setValue] = useState<string>('');
    const [connection, setConnection] = useState<boolean>(false);
    const [username, setUsername] = useState<string>('');
    const socket = useRef<WebSocket>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value)
    }

    const handleUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUsername(e.target.value)
    }

    const sendMessage = async () => {
        const message: IMessage = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        if (socket.current) {
            socket.current.send(JSON.stringify(message));
        }
        setValue('')
    }

    const connectChat = () => {
        socket.current = new WebSocket('ws://localhost:5000');

        socket.current.onopen = () => {
            setConnection(true);
            const message = {
                event: 'connection',
                username,
                id: Date.now(),

            }
            console.log('Подключение установлено');
            if (socket.current) {
                socket.current.send(JSON.stringify(message))
            }
        }

        socket.current.onmessage = (event: IEvent) => {
            const message = JSON.parse(event.data);
            setMessages(prev => [message, ...prev])
        }

        socket.current.onclose = () => {
            console.log('Socket закрыт')
        }

        socket.current.onerror = () => {
            console.log('Произошла ошибка')
        }
    }

    if (!connection) {
        return (
            <>
                <h1>
                    Введите имя пользователя
                </h1>
                <div>
                    <input
                        type="text"
                        value={username}
                        onChange={handleUserName}
                        placeholder="Введите имя пользователя"
                    />
                    <button onClick={connectChat}>Войти</button>
                </div>
            </>
        )
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
                        {mess.event === 'connection' ?
                            <div style={{color: "green"}}>
                                Пользователь {mess.username} подключился
                            </div>
                            :
                            <div style={{color: "red"}}>
                                {mess.username}. {mess.message}
                            </div>
                        }
                    </div>
                )}
            </div>
        </>
    );
};

export default WebSockets;
