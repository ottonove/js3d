/**
 * [canvasを使って3次元上の平面をスクリーンに描画する（透視投影変換）](https://codepen.io/utano320/pen/RrKLxV?editors=0010)
 */

var canvas2D; // 2次座標系用canvas要素(HTMLCanvasElement)
var canvas3D; // 3次座標系用canvas要素(HTMLCanvasElement)
var sX3D = null; // ドラッグ開始時点のx座標（スクリーン座標）
var sY3D = null; // ドラッグ開始時点のy座標（スクリーン座標）
var sT3D = null; // ドラッグ開始時点のθ
var sP3D = null; // ドラッグ開始時点のφ
var mouseX2D; // 2次座標系用ドラッグされている位置のx座標（スクリーン座標）
var mouseY2D; // 2次座標系用ドラッグされている位置のy座標（スクリーン座標）
var mouseX3D; // 3次座標系用ドラッグされている位置のx座標（スクリーン座標）
var mouseY3D; // 3次座標系用ドラッグされている位置のy座標（スクリーン座標）

// 2次元座標系
var TwoDim = function(canvas) {
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');

  // 中心Ｏの座標（スクリーン座標）
  this.oX = Math.floor(this.width / 2);
  this.oY = Math.ceil(this.height / 2);

  // 面確定フラグ（trueの時は新しい頂点を追加できない）
  this.commit_flg = false;
  // 頂点（Point3D）を格納する配列
  this.point = [];

  // 平面の方程式（ax+by+cz+d=0）に必要なパラメータ
  this.a = 0;
  this.b = 0;
  this.c = 0;
  this.d = 0;

  // 平面の方程式を求める
  this.calcEquation = function() {
    // 頂点の数が3の場合のみ計算可能
    if (this.point.length != 3) return;

    var x0 = this.point[0].x,
      y0 = this.point[0].y,
      z0 = this.point[0].z;
    var x1 = this.point[1].x,
      y1 = this.point[1].y,
      z1 = this.point[1].z;
    var x2 = this.point[2].x,
      y2 = this.point[2].y,
      z2 = this.point[2].z;

    // パラメータ計算
    this.a = (y1 - y0) * (z2 - z0) - (z1 - z0) * (y2 - y0);
    this.b = (z1 - z0) * (x2 - x0) - (x1 - x0) * (z2 - z0);
    this.c = (x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0);
    this.d = -this.a * x0 - this.b * y0 - this.c * z0;
  }

  // 平面の方程式を使ってz座標を算出
  this.calcZ = function(x, y) {
    return -(this.d + this.a * x + this.b * y) / this.c;
  }

  // 描画処理
  this.repaint = function() {
    // 一度描画をクリア
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 座標軸の描画
    this.drawAxis();

    // 面の描画
    this.drawSurface();
  }

  // 座標軸の描画
  this.drawAxis = function() {
    this.ctx.strokeStyle = '#999';
    this.ctx.lineWidth = 1;

    // x座標軸を描画
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.oY);
    this.ctx.lineTo(this.width, this.oY);
    this.ctx.stroke();

    // y座標軸を描画
    this.ctx.beginPath();
    this.ctx.moveTo(this.oX, 0);
    this.ctx.lineTo(this.oX, this.height);
    this.ctx.stroke();

    this.ctx.fillStyle = "#999";

    // x座標軸の矢印を描画
    this.ctx.beginPath();
    this.ctx.moveTo(this.width, this.oY);
    this.ctx.lineTo(this.width - 10, this.oY - 7);
    this.ctx.lineTo(this.width - 10, this.oY + 7);
    this.ctx.fill();

    // y座標軸の矢印を描画
    this.ctx.beginPath();
    this.ctx.moveTo(this.oX, 0);
    this.ctx.lineTo(this.oX - 7, 10);
    this.ctx.lineTo(this.oX + 7, 10);
    this.ctx.fill();

    // 原点を表す文字「Ｏ」を描画
    this.ctx.beginPath();
    var maxWidth = 100;
    this.ctx.font = "12px 'Verdana'";
    this.ctx.textAlign = 'right';
    this.ctx.fillText('Ｏ', this.oX - 5, this.oY + 15, maxWidth);
  }

  // 面の描画
  this.drawSurface = function() {
    var length = this.point.length;
    if (length === 0) return;

    for (var i = 0; i < length; i++) {
      // 頂点の描画
      this.drawPoint(this.point[i].x, this.point[i].y, '#000', false);
      if (i != 0) {
        // 線分の描画
        this.drawLine(i - 1, i, '#000', 3);
      }
    }

    // 多角形を作れる場合は、最初と最後の頂点を結ぶ線分を描画
    if (length >= 3) {
      if (this.commit_flg) {
        // 面が確定している場合
        this.drawLine(length - 1, 0, '#000', 3);
      } else {
        // 面が未確定の場合
        this.drawLine(length - 1, 0, '#F66', 1);
      }
    }
  }

  // 指定位置に点と座標表示を描画
  this.drawPoint = function(x, y, color, pointText) {
    if (pointText === undefined) {
      pointText = '';
    }

    this.ctx.fillStyle = color;

    // 指定位置を中心に円を描画
    this.ctx.beginPath();
    var screenX = this.oX + x;
    var screenY = this.oY - y;
    this.ctx.arc(screenX, screenY, 5, 0, Math.PI * 2, false);
    this.ctx.fill();

    // 座標の表示テキストを描画
    if (pointText !== false) {
      var maxWidth = 100;
      if (x >= 0) {
        // xが正（第一象限、第四象限）の場合は点の左側に座標を描画
        this.ctx.textAlign = 'right';
        this.ctx.fillText(pointText + '( ' + x + ', ' + y + ' )', screenX - 10, screenY + 3, maxWidth);
      } else {
        // xが負（第二象限、第三象限）の場合は点の右側に座標を描画
        this.ctx.textAlign = 'left';
        this.ctx.fillText(pointText + '( ' + x + ', ' + y + ' )', screenX + 10, screenY + 3, maxWidth);
      }
    }
  }

  // 指定された2つの点を結ぶ線分を描画
  this.drawLine = function(indexStartPoint, indexEndPoint, color, width) {
    var startPoint = this.point[indexStartPoint];
    var endPoint = this.point[indexEndPoint];

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;

    // 線分を描画
    this.ctx.beginPath();
    this.ctx.moveTo(this.oX + startPoint.x, this.oY - startPoint.y);
    this.ctx.lineTo(this.oX + endPoint.x, this.oY - endPoint.y);
    this.ctx.stroke();
  }

  // マウス位置に点を描画
  this.drawTempPoint = function(mouseX, mouseY) {
    this.drawPoint(mouseX - this.oX, this.oY - mouseY, '#999');
  }

  // マウス位置に向けて線分を描画
  this.drawTempLine = function(mouseX, mouseY) {
    var length = this.point.length;
    if (length == 0) {
      return;
    }

    var startPoint = this.point[0];
    var endPoint = this.point[length - 1];

    this.ctx.strokeStyle = '#999';
    this.ctx.lineWidth = 2;

    // 線分を描画
    this.ctx.beginPath();
    this.ctx.moveTo(mouseX, mouseY);
    this.ctx.lineTo(this.oX + startPoint.x, this.oY - startPoint.y);
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(mouseX, mouseY);
    this.ctx.lineTo(this.oX + endPoint.x, this.oY - endPoint.y);
    this.ctx.stroke();
  }

  // 頂点の追加
  this.addPoint = function(x, y, z) {
    this.point.push(new Point3D(x, y, z));
  }

  // 頂点の削除
  this.deletePoint = function(index) {
    this.point.splice(index, 1);
  }

  // 面の描画確定
  this.commit = function() {
    this.commit_flg = true;
    this.repaint();
  }

  // 面の描画確定を解除
  this.cancel = function() {
    this.commit_flg = false;
    this.repaint();
  }

  // 面のすべての頂点を削除
  this.clear = function() {
    this.point = [];
    this.repaint();
  }

  // 初期化時の描画
  this.repaint();
}

// 3次元座標系
var ThreeDim = function(canvas) {
  this.width = canvas.width;
  this.height = canvas.height;
  this.ctx = canvas.getContext('2d');

  // 中心Ｏの座標（スクリーン座標）
  this.oX = Math.ceil(this.width / 2);
  this.oY = Math.ceil(this.height / 2);

  // 面確定フラグ（trueの時は新しい頂点を追加できない）
  this.commit_flg = false;
  // 頂点（Point3D）を格納する配列
  this.point = [];

  // 透視投影変換に必要なパラメータ
  this.the = 20;
  this.phi = 60;
  this.rho = 1000;
  this.dis = 750;

  // 描画処理
  this.repaint = function() {

    // 一度描画をクリア
    this.ctx.clearRect(0, 0, this.width, this.height);

    // 座標軸を描画
    this.drawAxis();

    // 平面を描画
    this.drawSurface();
  }

  // 座標軸を描画
  this.drawAxis = function() {
    // 原点、x軸終点、y軸終点、z軸終点
    var ow = new Point3D(0, 0, 0);
    var xw = new Point3D(200, 0, 0);
    var yw = new Point3D(0, 200, 0);
    var zw = new Point3D(0, 0, 200);

    // 透視投影変換によって各点の2次元座標を求める
    var os = ow.toScreenAxis(this.the, this.phi, this.rho, this.dis);
    var xs = xw.toScreenAxis(this.the, this.phi, this.rho, this.dis);
    var ys = yw.toScreenAxis(this.the, this.phi, this.rho, this.dis);
    var zs = zw.toScreenAxis(this.the, this.phi, this.rho, this.dis);

    // 座標軸を描画
    this.drawLine(os, xs);
    this.drawLine(os, ys);
    this.drawLine(os, zs);

    // 原点を表す文字「Ｏ」を描画
    this.drawText(os, 'Ｏ');
    this.drawText(xs, 'Ｘ');
    this.drawText(ys, 'Ｙ');
    this.drawText(zs, 'Ｚ');
  }

  // 平面を描画
  this.drawSurface = function() {
    var length = this.point.length;
    if (length === 0) return;

    for (var i = 0; i < length; i++) {
      // 頂点の描画
      this.drawPoint3D(this.point[i], '#000');
      if (i != 0) {
        // 線分の描画
        this.drawLine3D(this.point[i - 1], this.point[i], '#000', 3);
      }
    }
    // 多角形を作れる場合は、最初と最後の頂点を結ぶ線分を描画
    if (length >= 3) {
      if (this.commit_flg) {
        // 面が確定している場合
        this.drawLine3D(this.point[length - 1], this.point[0], '#000', 3);
      } else {
        // 面が未確定の場合
        this.drawLine3D(this.point[length - 1], this.point[0], '#F66', 1);
      }
    }
  }

  // 3次元座標から2次元座標を計算して頂点を描画
  this.drawPoint3D = function(point3D, color) {
    // 透視投影変換によって頂点の2次元座標を求める
    var point2D = point3D.toScreenAxis(this.the, this.phi, this.rho, this.dis);

    this.ctx.fillStyle = color;

    // 指定位置を中心に円を描画
    this.ctx.beginPath();
    var screenX = point2D.x + this.oX;
    var screenY = this.oY - point2D.y;
    this.ctx.arc(screenX, screenY, 5, 0, Math.PI * 2, false);
    this.ctx.fill();
  }

  // 3次元座標から2次元座標を計算して線分を描画
  this.drawLine3D = function(startPoint3D, endPoint3D, color, lineWidth) {
    // 透視投影変換によって始点と終点の2次元座標を求める
    var startPoint2D = startPoint3D.toScreenAxis(this.the, this.phi, this.rho, this.dis);
    var endPoint2D = endPoint3D.toScreenAxis(this.the, this.phi, this.rho, this.dis);

    // 始点と終点を結ぶ線分を描画
    this.drawLine(startPoint2D, endPoint2D, color, lineWidth);
  }

  // 指定された2つの点を結ぶ線分を描画
  this.drawLine = function(startPoint2D, endPoint2D, color, lineWidth) {
    this.ctx.strokeStyle = (color === undefined) ? '#999' : color;
    this.ctx.lineWidth = (lineWidth === undefined) ? 1 : lineWidth;

    // 線分を描画
    this.ctx.beginPath();
    this.ctx.moveTo(startPoint2D.x + this.oX, -(startPoint2D.y - this.oY));
    this.ctx.lineTo(endPoint2D.x + this.oX, -(endPoint2D.y - this.oY));
    this.ctx.stroke();
  }

  // 指定された位置に文字を描画
  this.drawText = function(point2D, text) {
    this.ctx.beginPath();
    var maxWidth = 100;
    this.ctx.font = "12px 'Verdana'";
    this.ctx.textAlign = 'right';
    this.ctx.fillText(text, point2D.x + this.oX - 5, -(point2D.y - this.oY) + 15, maxWidth);
  }

  // 頂点の追加
  this.addPoint = function(x, y, z) {
    this.point.push(new Point3D(x, y, z));
  }

  // 頂点の削除
  this.deletePoint = function(index) {
    this.point.splice(index, 1);
  }

  // 面の描画確定
  this.commit = function() {
    this.commit_flg = true;
    this.repaint();
  }

  // 面の描画確定を解除
  this.cancel = function() {
    this.commit_flg = false;
    this.repaint();
  }

  // 面のすべての頂点を削除
  this.clear = function() {
    this.point = [];
    this.repaint();
  }

  // 初期化時の描画
  this.repaint();
}

// 3次元座標を持つ頂点
var Point3D = function(x, y, z) {
  this.x = (x === undefined) ? 0 : x;
  this.y = (y === undefined) ? 0 : y;
  this.z = (z === undefined) ? 0 : z;

  // 透視投影変換による2次元座標への変換処理
  this.toScreenAxis = function(the, phi, rho, dis) {
    var p = new Point2D();

    // 円周率、sinθ、cosθ、sinφ、cosφ
    var pi = Math.PI;
    var sinT = Math.sin(the * pi / 180);
    var cosT = Math.cos(the * pi / 180);
    var sinP = Math.sin(phi * pi / 180);
    var cosP = Math.cos(phi * pi / 180);

    // 変換行列
    var vs = [
      [-dis * sinT, dis * cosT, 0, 0],
      [-dis * cosT * cosP, -dis * sinT * cosP, dis * sinP, 0],
      [-cosT * sinP, -sinT * sinP, -cosP, rho]
    ];

    // 行列計算
    var tmpX = this.x * vs[0][0] + this.y * vs[0][1] + this.z * vs[0][2] + vs[0][3];
    var tmpY = this.x * vs[1][0] + this.y * vs[1][1] + this.z * vs[1][2] + vs[1][3];
    var tmpW = this.x * vs[2][0] + this.y * vs[2][1] + this.z * vs[2][2] + vs[2][3];

    // 2次元座標を計算
    p.x = Math.round(tmpX / tmpW);
    p.y = Math.round(tmpY / tmpW);

    return p;
  }
}

// 2次元座標を持つ頂点
var Point2D = function(x, y) {
  this.x = (x === undefined) ? 0 : x;
  this.y = (y === undefined) ? 0 : y;
}

window.onload = function() {
  // canvas要素を取得し、サイズ設定
  canvas2D = document.getElementById('axis2DCanvas');
  canvas2D.width = 395;
  canvas2D.height = 350;

  canvas3D = document.getElementById('axis3DCanvas');
  canvas3D.width = 395;
  canvas3D.height = 350;

  // 2次元座標軸のオブジェクト作成
  twoDim = new TwoDim(canvas2D);
  // 3次元座標軸のオブジェクト作成
  threeDim = new ThreeDim(canvas3D);

  // マウス位置の座標計算（2次元座標系）（canvasの左上を基準。-2ずつしているのはborderの分） 
  function calcMouseCoordinate2D(e) {
    var rect = e.target.getBoundingClientRect();
    mouseX2D = e.clientX - Math.floor(rect.left) - 2;
    mouseY2D = e.clientY - Math.floor(rect.top) - 2;
  }

  // マウス位置の座標計算（3次元座標系）（canvasの左上を基準。-2ずつしているのはborderの分）
  function calcMouseCoordinate3D(e) {
    var rect = e.target.getBoundingClientRect();
    mouseX3D = e.clientX - Math.floor(rect.left) - 2;
    mouseY3D = e.clientY - Math.floor(rect.top) - 2;
  }

  // 2次元座標系のmousedownイベント登録
  canvas2D.onmousedown = function(e) {
    // 面が確定していれば何もしない
    if (twoDim.commit_flg) return;

    // マウス位置のスクリーン座標（mouseX2D, mouseY2D）を取得
    calcMouseCoordinate2D(e);

    // 3次元座標を決定
    var x = mouseX2D - twoDim.oX;
    var y = twoDim.oY - mouseY2D;
    var z;
    if (twoDim.point.length >= 3) {
      // 平面の方程式が確定していれば、計算でz座標を求める
      z = twoDim.calcZ(x, y);
    } else {
      // 平面の方程式が確定していなければ、z座標の入力プロンプトを表示
      z = window.prompt("z座標を入力してください。", "0");
      if (z === null) return;
    }

    // 2次元座標系、3次元座標系それぞれに頂点を追加
    twoDim.addPoint(x, y, z);
    threeDim.addPoint(x, y, z);

    // 3つ目の頂点の場合、平面の方程式を求めておく（次の頂点から自動計算）
    if (twoDim.point.length === 3) {
      twoDim.calcEquation();
    }

    // 2次元座標系、3次元座標系それぞれを再描画
    twoDim.repaint();
    threeDim.repaint();
  }

  // 2次元座標系のmousemoveイベント登録
  canvas2D.onmousemove = function(e) {
    // 面が確定していれば何もしない
    if (twoDim.commit_flg) return;

    // 再描画（前回のイベントで描画された線分と頂点を消す）
    twoDim.repaint();

    // マウス位置のスクリーン座標（mouseX2D, mouseY2D）を取得
    calcMouseCoordinate2D(e);
    // マウス位置の点の描画
    twoDim.drawTempPoint(mouseX2D, mouseY2D);
    // マウス位置に向けた線分の描画
    twoDim.drawTempLine(mouseX2D, mouseY2D);
  }

  // 2次元座標系のmouseoutイベント登録
  canvas2D.onmouseout = function(e) {
    // 再描画（マウス移動時に描画された線分と頂点を消す）
    twoDim.repaint();
  }

  // 3次元座標系のmousedownイベント登録
  canvas3D.onmousedown = function(e) {
    // マウス位置のスクリーン座標（mouseX3D, mouseY3D）を取得
    calcMouseCoordinate3D(e);

    // ドラッグ開始時点のパラメータを退避しておく
    sX3D = mouseX3D;
    sY3D = mouseY3D;
    sT3D = threeDim.the;
    sP3D = threeDim.phi;
  }

  // 3次元座標系のmousemoveイベント登録
  canvas3D.onmousemove = function(e) {
    // マウス位置のスクリーン座標（mouseX3D, mouseY3D）を取得
    calcMouseCoordinate3D(e);

    if (sX3D != null && sY3D != null && sT3D != null && sP3D != null) {
      // ドラッグ開始位置からの移動距離（x方向、y方向）を用いて、透視投影変換のパラメータを更新
      threeDim.the = sT3D - Math.floor((mouseX3D - sX3D) / 0.75);
      threeDim.phi = sP3D - Math.floor((mouseY3D - sY3D) / 0.75);
      // 再描画
      threeDim.repaint();
    }
  }

  // 3次元座標系のmouseupイベント登録
  canvas3D.onmouseup = function(e) {
    // ドラッグ終了なのでドラッグ開始時点に退避させていたパラメータをクリア
    sX3D = null;
    sY3D = null;
    sT3D = null;
    sP3D = null;
  }

  // 3次元座標系のmouseoutイベント登録
  canvas3D.onmouseout = function(e) {
    // マウスが3次元座標系の外に出たらドラッグ終了として、
    // ドラッグ開始時点に退避させていたパラメータをクリア
    sX3D = null;
    sY3D = null;
    sT3D = null;
    sP3D = null;
  }

  // documentオブジェクトのkeydownイベント登録
  document.onkeydown = function(e) {
    var ENTER = 13;
    var ESC = 27;
    var DELETE = 8;

    if (e.keyCode === ENTER && !twoDim.commit_flg) {
      // ENTERで面を確定し、再描画
      twoDim.commit();
      threeDim.commit();

    } else if (e.keyCode === ESC) {
      if (twoDim.commit_flg) {
        // （面が確定している時にESC）面の確定を解除し、再描画
        twoDim.cancel();
        threeDim.cancel();
      } else {
        // （面が確定していない時にESC）頂点をすべてクリアし、再描画
        if (window.confirm('頂点をすべてクリアしていいですか？')) {
          twoDim.clear();
          threeDim.clear();
        }
      }

    } else if (e.keyCode === DELETE) {
      // DELETEで最後に追加した点を削除し、再描画
      if (twoDim.point.length != 0 && !twoDim.commit_flg) {
        twoDim.deletePoint(twoDim.point.length - 1);
        twoDim.repaint();

        threeDim.deletePoint(threeDim.point.length - 1);
        threeDim.repaint();
      }
      // 本来の処理をキャンセル
      e.preventDefault();
    }
  }
};