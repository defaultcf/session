
  var SEid = []; //SE呼ぶ時に必要
  var se = [
      "bell_ring"
    , "button_push"
    , "camera_flashing"
    , "door_bell"
  ]; //SEのファイル名

  for(let i = 0; i < 4; i++) {
    SEid.push('ring' + i);
    createjs.Sound.registerSound("sounds/" + se[i] + ".mp3", SEid[i]);
  }


  const socket = io.connect('http://localhost:8080');
  const ring = document.getElementsByClassName('ring');

  for(let i = 0; i < ring.length; i++) {
    ring[i].addEventListener('click', (event) => {
      debug(event.target.id);
      socket.emit('ring', {value: event.target.id});
    }, false);
  }

  socket.on('rung', (data) => {
    debug(data.value);
    createjs.Sound.play(data.value);
  });

  function debug(text) {
    console.log(text);
    /*
    const logs = document.getElementById('log');
    var log = document.createElement('p');
    var now = new Date();
    log.textContent = `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] ${text}`;
    logs.insertBefore(log, logs.firstChild);
    */
  }
