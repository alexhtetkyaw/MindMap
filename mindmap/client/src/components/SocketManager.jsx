import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import data from './datasets/miserables.json';
import { useAtom, atom } from "jotai";



export const socket = io("http://localhost:3001");

export const dataAtom = atom([{}]);

export const SocketManager = () => {
    const [_mapData, setData] = useAtom(dataAtom);

    useEffect(() => {
        function onConnect() {
            console.log("connected");
        }
        function onDisconnect() {
            console.log("disconnected");
        }

        //not really working rn lol
        function onData(data) {
            setData(data);
        }

        // function onInit(initialData) {
        //     setData(initialData);
        // }


        // function onPointAdded(point) {
        //     setData((prevData) => {
        //         return {
        //             ...prevData,
        //             nodes: [...prevData.nodes, point]
        //         };
        //     });
        // }

        // function onPointRemoved(index) {
        //     setData((prevData) => {
        //         return {
        //             ...prevData,
        //             nodes: prevData.nodes.filter((_, i) => i !== index)
        //         };
        //     });
        // }


        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("data", onData);
        // socket.on("init", onInit);
        // socket.on("pointAdded", onPointAdded);
        // socket.on("pointRemoved", onPointRemoved);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("data", onData);
            // socket.off("init", onInit);
            // socket.off("pointAdded", onPointAdded);
            // socket.off("pointRemoved", onPointRemoved);
        }
    }, []);

}