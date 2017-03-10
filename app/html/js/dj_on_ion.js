const socket = io.connect('http://localhost:8080');
var SEid = []; //SE呼ぶ時に必要
var loopid=[]; //ループを保管しておく場所
var se = [
    "button_click"
    ,"computer_error"
  , "button_tiny"
,  "bell_ring"
]; //SEのファイル名

ion.sound({
    sounds: [                            // 使用する音声ファイルを設定する配列
        {
          name:se[0]
        },{
          name:se[1]
        },{
          name:se[2]
        },{
          name:se[3]
        }
    ],
    path: "sounds/",                // サウンドファイルの入ったフォルダーを指定する
    multiplay: true,               // true - １度に複数のサウンドを鳴らせるようにする(対false)
    volume: 0.5,                    // 音量(大きさに注意！sounds内のvolumeが優先されます)
    preload: true                  // true の場合、音声再生前にあらかじめ音声ファイルを読み込んでおきます
});



var bpm = 120;
var sound_req = [];
//-------宣言や呼び出しここまで--------

var se_type = 0;
$('.ring').click(function(){
  sound_req.push({"se":se[se_type++],"loop":se_type});

});



//ループ用処理
var metronome = setInterval(function(){
  while(sound_req.length != 0){
    add_sound();
  }
}, 60000/bpm);//60BPMで1秒毎

function add_sound(){
  var id = sound_req[0]["se"];
  var loop=sound_req[0]["loop"];
  loopid[loopid.length] = setInterval(function(){play(id)}, 1000/Math.pow(2,loop-1));
  console.log("add_sound");
  sound_req.shift();
}

var play = function(data){
  console.log(data);
  ion.sound.play(data,{volume:1});
  //createjs.Sound.play(data);
};
