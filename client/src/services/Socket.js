import SocketIO from 'socket.io-client';
const SOCKET_URL = process.env.SOCKET;

let socket = SocketIO(SOCKET_URL);

export default socket;