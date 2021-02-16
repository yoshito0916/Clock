'use script';

(() => {//即時関数（宣言と同時に実行できる関数のこと
  class ClockDrawer {
    constructor(canvas) {
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;
    }

    draw(angle, func) {
      this.ctx.save();

      this.ctx.translate(this.width / 2, this.height / 2);
      //  ctx.rotate(2 * Math.PI / 360 * angle);
      this.ctx.rotate(Math.PI / 180 * angle);//約分

      this.ctx.beginPath();//一番上の基準となるメモリを一つ描画する
      func(this.ctx);
      this.ctx.stroke();

      this.ctx.restore();
    }

    clear() {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }

  class Clock {
    constructor(drawer) {
      this.r = 100;
      this.drawer = drawer;
    }
     
    drawFace() {
      for (let angle = 0; angle < 360; angle += 6) {
        this.drawer.draw(angle, ctx => {
          ctx.moveTo(0, -this.r);
          if (angle % 30 === 0) {//30度ごとに太い線にする処理
            ctx.lineWidth = 2;//少し太く
            ctx.lineTo(0, -this.r + 10);//少し長く
            ctx.font = '13px Arial';
            ctx.textAlign = 'center';
            // ctx.fillText(angle / 30, 0, -this.r + 25);//angleを30で割った数値を入れる。位置は半径から25くらい下がった所に描画。※最初の表示を０→12とする場合はjavaScriptで０はfalseと評価されることを利用して次のように書く。
            ctx.fillText(angle / 30 || 12, 0, -this.r + 25);//こちらがfalseだったら12を使いなさいという意味。
          } else {
            ctx.lineTo(0, -this.r + 5);//それ以外は普通のメモリ
          }
        });
      }
    }
//針を描画
    drawHands() {
      //hour
      this.drawer.draw(this.h * 30 + this.m * 0.5, ctx => {
        ctx.lineWidth = 6;
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -this.r + 50);
      });

      //minute
      this.drawer.draw(this.m * 6, ctx => {
        ctx.lineWidth = 4;
        ctx.moveTo(0, 10);
        ctx.lineTo(0, -this.r + 30);
      });

      //second
      this.drawer.draw(this.s * 6, ctx => {
        ctx.strokeStyle = 'red';
        ctx.moveTo(0, 20);
        ctx.lineTo(0, -this.r + 20);
      });
    }

    update() {
      this.h = (new Date()).getHours();
      this.m = (new Date()).getMinutes();
      this.s = (new Date()).getSeconds();
    }

    run() {
      this.update();

      this.drawer.clear();
      this.drawFace();
      this.drawHands();

      setTimeout(() =>{
        this.run();
      }, 100);
    }
  }

  const canvas = document.querySelector('canvas');
  if (typeof canvas.getContext === 'undefined') {
    return;
  }
  
  const clock = new Clock(new ClockDrawer(canvas));
  clock.run();
})();