let clouds = [];
const NUM_CLOUDS = 5;
let scene = 0;
let startTime;
let transitionAlpha = 0;
let isTransitioning = false;
let sunPulse = 0;

function setup() {
  createCanvas(800, 600);
  startTime = millis();
  
  for (let i = 0; i < NUM_CLOUDS; i++) {
    clouds.push({
      x: random(-100, width),
      y: random(50, 200),
      speed: random(0.2, 0.8),
      size: random(40, 80)
    });
  }
}

function draw() {
  // Sky gradient
  let skyTop = color(135, 206, 250);
  let skyBottom = color(176, 226, 255);
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(skyTop, skyBottom, inter);
    stroke(c);
    line(0, y, width, y);
  }
  
  drawSunlightGlow();
  drawBackground();
  drawSun();
  updateClouds();

  // 자동 장면 전환
  let currentTime = millis() - startTime;
  
  if (currentTime < 4000) {
    scene = 0; // 시작 화면
  } else if (currentTime < 8000) {
    if (scene === 0) startTransition();
    scene = 1; // 배경만 표시
  } else if (currentTime < 20000) {
    if (scene === 1) startTransition();
    scene = 2; // 배경만 표시
  } else {
    if (scene === 2) startTransition();
    scene = 3; // 엔딩 크레딧
  }

  if (scene === 0) {
    drawStartScreen();
  } else if (scene === 3) {
    drawEnding();
  }

  // 트랜지션 효과
  if (isTransitioning) {
    transitionAlpha -= 5;
    if (transitionAlpha <= 0) {
      isTransitioning = false;
      transitionAlpha = 0;
    }
    fill(0, transitionAlpha);
    rect(0, 0, width, height);
  }
}

function startTransition() {
  isTransitioning = true;
  transitionAlpha = 255;
}

function drawSunlightGlow() {
  sunPulse += 0.01;
  let pulseSize = map(sin(sunPulse), -1, 1, 380, 420);
  
  for (let r = pulseSize; r >= 50; r -= 10) {
    fill(255, 255, 100, map(r, pulseSize, 50, 0, 50));
    noStroke();
    ellipse(700, 100, r, r);
  }
}

function updateClouds() {
  for (let i = 0; i < clouds.length; i++) {
    clouds[i].x += clouds[i].speed;
    if (clouds[i].x > width + 100) {
      clouds[i].x = -100;
    }
    drawCloud(clouds[i].x, clouds[i].y, clouds[i].size);
  }
}

function drawStartScreen() {
  fill(255, 220);
  rect(0, 0, width, height);
  
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(20);
  text("자연의 풍경", width/2, height/2 - 50);
  textSize(15);
  text("아름다운 풍경을 담은 그림", width/2, height/2);
  
  textSize(15);
  fill(100);
  text("11조: 잇잇떠, 쩟케이카인, 낭프원프원에이", width/2, height/2 + 50);
}

function drawSun() {
  for (let r = 80; r <= 200; r += 10) {
    fill(255, 255, 0, map(r, 80, 200, 100, 0));
    noStroke();
    ellipse(700, 100, r, r);
  }

  fill(255, 255, 0);
  noStroke();
  ellipse(700, 100, 80, 80);
  
  // 태양 빛줄기
  stroke(255, 255, 0, 100);
  strokeWeight(2);
  for (let i = 0; i < 12; i++) {
    let angle = TWO_PI * i / 12 + millis() * 0.0005;
    let x1 = 700 + cos(angle) * 45;
    let y1 = 100 + sin(angle) * 45;
    let x2 = 700 + cos(angle) * 70;
    let y2 = 100 + sin(angle) * 70;
    line(x1, y1, x2, y2);
  }
}

function drawBackground() {
  // 산
  fill(85, 160, 80, 200);
  noStroke();
  beginShape();
  vertex(0, 400);
  vertex(150, 350);
  vertex(300, 380);
  vertex(450, 320);
  vertex(600, 370);
  vertex(800, 330);
  vertex(800, 600);
  vertex(0, 600);
  endShape(CLOSE);

  // 잔디
  fill(60, 180, 75);
  noStroke();
  ellipse(400, 600, 1000, 300);

  // 언덕
  fill(85, 160, 80);
  ellipse(600, 650, 900, 400);
  ellipse(200, 700, 1000, 500);

  // 햇빛 반사
  fill(170, 230, 120, 70);
  noStroke();
  ellipse(700, 580, 300, 100);

  // 나무
  fill(120, 100, 40);
  rect(100, 350, 30, 100);
  fill(34, 139, 34);
  ellipse(115, 330, 100, 100);
  ellipse(80, 360, 80, 80);
  ellipse(150, 360, 80, 80);
  
  // 꽃들
  drawFlower(200, 550, 8, color(255, 100, 100));
  drawFlower(300, 570, 6, color(255, 255, 100));
  drawFlower(500, 560, 7, color(200, 100, 255));
  drawFlower(650, 550, 5, color(100, 255, 100));
}

function drawFlower(x, y, size, col) {
  fill(col);
  noStroke();
  for (let i = 0; i < 5; i++) {
    let angle = TWO_PI * i / 5;
    ellipse(x + cos(angle) * size, y + sin(angle) * size, size, size);
  }
  fill(255, 255, 0);
  ellipse(x, y, size, size);
}

function drawCloud(x, y, size = 60) {
  let d = dist(x, y, 700, 100);
  let brightness = map(d, 0, 500, 255, 180);
  fill(brightness);
  noStroke();
  ellipse(x, y, size, size);
  ellipse(x + size*0.6, y, size, size);
  ellipse(x + size*0.3, y - size*0.3, size, size);
}

function drawEnding() {
  let fadeTime = millis() - startTime - 20000;
  let fadeAmount = map(fadeTime, 0, 5000, 0, 200);
  fadeAmount = constrain(fadeAmount, 0, 200);
  
  fill(0, fadeAmount);
  rect(0, 0, width, height);
  
  if (fadeAmount > 50) {
    let textFade = map(fadeAmount, 50, 200, 0, 255);
    fill(255, textFade);
    textAlign(CENTER, CENTER);
    
    textSize(18);
    text("자연의 아름다움", width/2, height/2 - 20);
    
    textSize(16);
    text("팀 11의 작품", width/2, height/2 + 20);
    text("잇잇떠 : 쩟케이카인 : 낭프원프원에이", width/2, height/2 + 50);
    
    // 스크롤 크레딧
    if (fadeTime > 1000) {
      let scrollPos = map(fadeTime - 1000, 0, 10000, 0, 600);
      
      textSize(16);
      text("감사합니다", width/2, height + 430 - scrollPos);
    }
  }
}