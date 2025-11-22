"use strict"
const { Server } = require('socket.io')
const fs = require('node:fs')
const http = require('node:http')

const server = http.createServer()
const io = new Server(server)

const request_list = [{
    address: '/',
    type: 'text/html',
    file: '/index.html'
},
{
    address: '/style.css',
    type: 'text/css',
    file: '/style.css'
},
{
    address: '/game.html',
    type: 'text/html',
    file: '/game.html'
},
{
    address: '/game.css',
    type: 'text/css',
    file: '/game.css'
}]

// retrieve cards from the folder
const path = 'C:\\Users\\Arwin\\Desktop\\Lucky Nine\\SVG-cards'
let cards = fs.readdirSync(path)

for(let card of cards){
    request_list.push({
        address: `/SVG-cards/${card}`,
        type: 'image/svg+xml',
        file: `/SVG-cards/${card}`
    })
}

console.log(request_list)

// serve the files and send the cards to the client
server.on('request', (req, res) => {
    for(const rl of request_list){
        if(req.url === rl.address){
            res.writeHead(200, {'Content-Type': rl.type})
            fs.createReadStream(__dirname + rl.file).pipe(res) // Send user the page when they visit home
        }
    }
})

io.on('connection', async socket => {
    io.emit('cards', cards)
})

server.listen(3000, 'localhost')
console.log('Now listening...')