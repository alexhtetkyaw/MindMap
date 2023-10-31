import { Server } from "socket.io"
// import initData from './miserables.json';

const io = new Server({
    cors: 
    {
        origin: true,
        methods: ["GET", "POST"],
        credentials: true,
    },
    allowEIO3: true,
}
)

io.listen(3001);



let data = {
    nodes: [],
    links: []
};

io.on("connection", (socket) => {
    console.log("user connected");
    const graphData = genRandomTree();
    data.nodes.push(...graphData.nodes);
    data.links.push(...graphData.links);

    //this is also not working rn
    io.emit("data", data);
   
    socket.on("disconnect", ()=> {
        console.log("user disconnected");
    })
})



function genRandomTree(N = 300, reverse = false) {
  return {
    nodes: [...Array(N).keys()].map(i => ({ id: i })),
    links: [...Array(N).keys()]
      .filter(id => id)
      .map(id => ({
        [reverse ? 'target' : 'source']: id,
        [reverse ? 'source' : 'target']: Math.round(Math.random() * (id - 1))
      }))
  };
}