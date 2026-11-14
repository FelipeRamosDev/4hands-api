const assert = require('node:assert/strict');
const http = require('node:http');
const { test } = require('node:test');
const { Server } = require('socket.io');
const SocketIO = require('../client/services/SocketIO');

test('socket client forwards options and reports connection errors', async (t) => {
   const server = http.createServer();
   const io = new Server(server);
   io.of('/test').use((socket, next) => {
      if (socket.handshake.headers.cookie !== 'session=valid') {
         next(new Error('Authentication required'));
         return;
      }
      next();
   });

   await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
   t.after(() => new Promise(resolve => io.close(resolve)));
   const port = server.address().port;
   const parent = { closeSocket() {} };

   const error = await new Promise(resolve => {
      const client = new SocketIO({
         hostURL: 'http://127.0.0.1',
         port,
         routePath: '/test',
         socketOptions: { transports: ['polling'], reconnection: false },
         onError(err) {
            this._socket.disconnect();
            resolve(err);
         }
      }, parent);
      t.after(() => client._socket.disconnect());
   });
   assert.equal(error.message, 'Authentication required');

   const user = await new Promise((resolve, reject) => {
      const client = new SocketIO({
         hostURL: 'http://127.0.0.1',
         port,
         routePath: '/test',
         socketOptions: {
            transports: ['polling'],
            reconnection: false,
            extraHeaders: { Cookie: 'session=valid' },
            withCredentials: true
         },
         onConnect() {
            resolve(this);
         },
         onError: reject
      }, parent);
      t.after(() => client._socket.disconnect());
   });
   assert.equal(user._socket.io.opts.withCredentials, true);
});
