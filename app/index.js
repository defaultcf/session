const path = require('path');
const Koa = require('koa');
const route = require('koa-route');
const render = require('koa-ejs');
const serve = require('koa-static');

const app = new Koa();
render(app, {
  root: path.join(__dirname, 'html'),
  layout: 'template',
  viewExt: 'html',
  cache: false,
  debug: true
});

app.use(route.get('/', async function (ctx) {
  await ctx.render('index');
}));
app.use(route.get('/:room', async function (ctx, room) {
  await ctx.render('room', {room:room});
}));
app.use(serve(__dirname + '/html'));

const server = app.listen(8080);

var store = {};
const io = require('socket.io').listen(server);
io.on('connection', (socket) => {
  socket.on('join', (data) => {
    if(data.room.match(/[^A-Za-z0-9]+/)) {
      socket.emit('info', {
        type: 'err',
        msg: '不正な部屋です。'
      });
    }
    store[socket.id] = {'room': data.room};
    socket.join(data.room);
    socket.emit('welcome', {id: socket.id});
  });
  socket.on('send', (data) => {
    io.to(store[socket.id].room).emit('sent', data);
  });
});
