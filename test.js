import {Client} from './index.js'
console.log(Client)

const client = new Client({
	userid: '63824e52d62f9d79c6459b40',
	token: process.env['token']
})

client.onPost(post => {
	console.log(post)
})