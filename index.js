// Streamer ID : Stream information
const streamers = new Map()
let streamId = 0

/*
Client packets:
    0 - Stream info (Sent when client wants to start stream)
        Request: u32 width, u32 height, u8 fps, u8 reqId
        Response: server packet 255
    1 - Stream frame (Sent as a raw binary blob)
        Request: blob frame data
        Response: server packet 254
    2 - Watch stream (Sent when a client wants to subscribe to a sream)
        Request: u32 streamId, u8 reqId
        Response: Server packet 253
Server packets:
    253 - Stream info (Sent in response to watch stream)
        Request: client packet 2
        Response: u32 width, u32 height, u8 fps, u8 reqId
    254 - Stream frame (Sent to a watcher of a stream)
        Request: client packet 1
        Response: blob frame data
    255 - Stream ID (Sent in response to client stream info)
        Request: client packet 0
*/

const server = Bun.serve({
    fetch(req, server) {
        const url = new URL(req.url)
        const success = server.upgrade(req, {
            data: { url }
        })

        return success
            ? new Response("", { status: 200 })
            : new Response("Could not upgrade connection", { status: 418 })
    },
    websocket: {
        open(ws) {
            ws.subscribe("all")
        },
        message(ws, message) {
            switch(message[0]) {
                case 0: {
                    
                    break
                }
                case 1: {
                    ws.publish("all", message)
                    break
                }

            }

            
        },
        close(ws) {
            ws.unsubscribe("all")
        }
    }
})

console.log(`Listening on ${server.hostname}:${server.port}`)