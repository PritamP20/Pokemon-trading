import ws from 'ws';

const wss = new ws.Server({ port: 8080 });

wss.on('connection', (ws)=>{
    console.log('User connected');

    ws.on('message', (message)=>{
        // Broadcast message to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === ws.OPEN) {
                client.send(`Server broadcast: ${message}`);
            }
        });
        console.log(`Received message: ${message}`);
    })

    ws.on('close', ()=>{
        console.log('User disconnected');
    })
})