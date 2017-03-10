const socket = io.connect('http://localhost:8080');
var SEid = []; //SE呼ぶ時に必要
var loopid=[]; //ループを保管しておく場所
var se = [
  "base1",
  "base2",
  "snare",
  "piano1",
  "basedrum",
  "hat",
  "button_click",
  "computer_error",
  "button_tiny"
]; //SEのファイル名

for(let i = 0; i < se.length; i++) {
  SEid.push(se[i]);
  createjs.Sound.registerSound("sounds/" + se[i] + ".mp3", SEid[i]);
}

var client_id = "ABC";

var bpm = 112;
var groove_req = [];
var groove_playing = [];
var change_groove_req = [];
//-------宣言や呼び出しここまで--------

socket.on('add_groove',(data) => {
  groove_req.push[data];
});

var metro_place = 0;
var metronome = setInterval(function(){
  if(metro_place == 0){
    //サウンドを追加する処理
    add_groove();
    //擬似セッション用
    session();
  }
  //読み込んでいるサウンドから、現在呼び出すパターンを選択
  for(key in groove_playing){
    if(groove_playing[key].rhythm[metro_place]){
      play(groove_playing[key].sound);
    }
  }
  metro_place = (metro_place + 1) % 16;
},60000/bpm/4);//60BPMで1秒毎に16回(16ビート)

function add_groove(){
  for(key in groove_req){
    if(groove_req[key].rhythm === false){
      //削除
      delete groove_playing[groove_req[key].id];
    }else{
      //追加、変更
      groove_playing[groove_req[key].id] = groove_req[key];
      $('#' + groove_req[key].btn).css({"background":"#e91e63"});
    }
  }
  groove_req = [];
}


function play(data){
  console.log(data);
  createjs.Sound.play(data);
}



$('.sound-btn').click(function(){
  console.log("btn_clicked");
  var send_json = {};
  send_json["id"] = client_id + $('.sound-btn').index(this);
  send_json["btn"] = $('.sound-btn').index(this);
  send_json["sound"] = $(this).attr('sound');
  send_json["rhythm"] = preset_rhythm[selected_rhythm];

  $(this).css({"background":"#2196f3"});


  //groove_req[send_json["id"]] = send_json;
  console.log(send_json);
});

var preset_rhythm = [
  [
    1,0,0,0,
    1,0,0,0,
    1,0,0,0,
    1,0,0,0
  ],[
    0,0,1,0,
    0,0,1,0,
    0,0,1,0,
    0,0,1,0
  ],[
    0,0,0,0,
    1,0,0,0,
    0,0,0,0,
    1,0,0,0
  ],[
    0,0,0,0,
    0,0,0,0,
    0,0,0,0,
    1,0,0,0
  ],[
    1,0,0,0,
    0,0,1,0,
    1,0,0,0,
    0,0,0,0
  ]
];



//----------------------リズム選択部分---------------------------
var selected_rhythm = 0;
$('.rhythm-btn').click(function(){
  $('.rhythm-btn').css({"background":"#009688"});
  $(this).css({"background":"#e91e63"});
  selected_rhythm = $('.rhythm-btn').index(this);
});

//----------------------グルーヴ編集部分------------------------

//バー

$(".sound-bar").change(function(){
  var val = $(this).parent().children("span").children("span").html() -1 ;
  var send_json = {};
  send_json["id"] = client_id + $('.sound-bar').index(this);
  send_json["btn"] = $('.sound-bar').index(this);
  send_json["sound"] = $(this).attr('sound');

  if(val == -1){
    send_json["rhythm"] = false;
  }else{
    send_json["rhythm"] = preset_rhythm[val];
  }

  console.log(send_json);

  //groove_req[send_json["id"]] = send_json;
  socket.emit('send',send_json);
});

socket.on('sent',(data) => {
  groove_req[send_json["id"]] = data;
});

//----------------デバッグ用部分-----------------------
$('.change-btn').click(function(){
  var send_json = {};
  send_json["id"] = client_id + 0;
  send_json["btn"] = 0;
  send_json["sound"] = $('.sound-btn').eq(0).attr('sound');
  send_json["rhythm"] = preset_rhythm[5];
  groove_req[send_json["id"]] = {"id":client_id + $('.change-btn').index(this),"rhythm":preset_rhythm[selected_rhythm]};
});

$('#debug01').click(function(){
  //change_groove_req.push({"id":client_id + "0","rhythm":false});
  change_groove_req.push({"id":client_id + "0","rhythm":preset_rhythm[1]});
});

var session_flag = false;
$('#session').click(function(){
  session_flag = true;
});

var sessin_value = 0;
function session(){
  if(!session_flag) return;
  switch(sessin_value){
    case 0:
      easy_groove_req(1,preset_rhythm[0]);
    break;
    case 1:
    break;
    case 2:
      easy_groove_req(3,preset_rhythm[1]);
    break;
    case 3:
    break;
    case 4:
      easy_groove_req(5,preset_rhythm[4],"computer_error");
    break;
    case 5:
    break;
    case 6:
    break;
  }
  sessin_value++;
}
function easy_groove_req(id,rhythm,sound=false){
  if(sound === false){
    sound = $(".sound-btn").eq(id).attr('sound');
  }
  groove_req.push({"id":client_id+id,"btn":id,"sound":sound,"rhythm":rhythm});
}
