let sprites = [];
let currentSprite = 0;
let frameWidth = 96;
let frameHeight = 80;
let totalFrames = 4;
let currentFrame = 0;
let x, y;
let introBoxVisible = false;
let introText = "你好，我是吳映璇，新北人，畢業於崇光中學";
let ripples = [];
let stars = [];
let nodes = [];
let nodeCount = 100;



// 角色設定物件
let characters = {
    character1: {
        sprite: 'sprite1.png',
        frameWidth: 96,
        frameHeight: 80,
        totalFrames: 4,
        scale: 1
    },
    character2: {
        sprite: 'sprite2.png',
        frameWidth: 103,
        frameHeight: 140,
        totalFrames: 4,
        scale: 0.75
    },
    character3: {
        sprite: 'sprite3.png',
        frameWidth: 103,
        frameHeight: 110,
        totalFrames: 4,
        scale: 0.7
    },
    character4: {
        sprite: 'sprite4.png',
        frameWidth: 75,
        frameHeight: 90,
        totalFrames: 4,
        scale: 0.8
    },
    character5: {
        sprite: 'sprite5.png',
        frameWidth: 90,
        frameHeight: 90,
        totalFrames: 4,
        scale: 0.9
    }
};

function preload() {
    sprites[0] = loadImage(characters.character1.sprite);
    sprites[1] = loadImage(characters.character2.sprite);
    sprites[2] = loadImage(characters.character3.sprite);
    sprites[3] = loadImage(characters.character4.sprite);
    sprites[4] = loadImage(characters.character5.sprite);
}

function setup() {
    // 背景畫布
    let bgCanvas = createCanvas(windowWidth, windowHeight);
    bgCanvas.parent("backgroundCanvas"); // 將背景畫布附加到背景區域
    bgCanvas.style('z-index', '1'); // 背景畫布在最底層
    

    x = 20;
    y = 20;
    frameRate(60);
    
    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
            x: random(width),
            y: random(height),
            vx: random(-0.5, 0.5),
            vy: random(-0.5, 0.5),
            alpha: random(100, 255)
        });
    }
    
}

function draw() {
    clear();

    // 繪製互動背景
    drawInteractiveBackground();

    // 顯示角色動畫
    let currentCharacter = characters[`character${currentSprite + 1}`];
    let scale = currentCharacter.scale;
    image(
        sprites[currentSprite], 
        x, 
        y, 
        currentCharacter.frameWidth * scale,  
        currentCharacter.frameHeight * scale, 
        currentFrame * currentCharacter.frameWidth / 2, 
        0, 
        currentCharacter.frameWidth / 2, 
        currentCharacter.frameHeight / 2
    );
    currentFrame = (currentFrame + 1) % currentCharacter.totalFrames;

    // 如果彈出框可見，繪製彈出框
    if (introBoxVisible) {
        drawIntroBox();
    }
}

function toggleIntroBox() {
    introBoxVisible = !introBoxVisible; // 切換彈出框的顯示狀態
    let iframe = document.getElementById("contentFrame");

    // 若 introBox 顯示中，則隱藏 iframe，否則恢復上一次的內容（或你可以改成空白）
    if (introBoxVisible) {
        iframe.style.display = "none";
    } else {
        iframe.style.display = "block";
    }

}

function drawIntroBox() {
    let boxWidth = 400;
    let boxHeight = 200;
    let boxX = (width - boxWidth) / 2;
    let boxY = (height - boxHeight) / 2;

    // 繪製彈出框背景
    fill(255);
    stroke(0);
    strokeWeight(2);
    rect(boxX, boxY, boxWidth, boxHeight, 10);

    // 繪製文字內容
    fill(0);
    noStroke();
    textSize(16);
    textAlign(CENTER, CENTER);
    text(introText, boxX + boxWidth / 2, boxY + boxHeight / 2);

    // 繪製關閉按鈕
    let closeButtonSize = 20;
    let closeButtonX = boxX + boxWidth - closeButtonSize - 10;
    let closeButtonY = boxY + 10;

    fill(200, 0, 0);
    ellipse(closeButtonX, closeButtonY, closeButtonSize);

    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text("X", closeButtonX, closeButtonY);

    // 檢查滑鼠是否點擊關閉按鈕
    if (mouseIsPressed && dist(mouseX, mouseY, closeButtonX, closeButtonY) < closeButtonSize / 2) {
        introBoxVisible = false;
    }
}

function drawInteractiveBackground() {
    background(10, 20, 30); // 深藍科技底色

    noFill();
    strokeWeight(1);

    // 更新並繪製節點
    for (let i = 0; i < nodes.length; i++) {
        let n = nodes[i];

        // 移動
        n.x += n.vx;
        n.y += n.vy;

        // 邊界反彈
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // 繪製節點
        fill(100, 200, 255, n.alpha);
        noStroke();
        ellipse(n.x, n.y, 3);

        // 與滑鼠距離內則畫線
        for (let j = i + 1; j < nodes.length; j++) {
            let n2 = nodes[j];
            let d = dist(n.x, n.y, n2.x, n2.y);
            if (d < 100) {
                stroke(150, 200, 255, map(d, 0, 100, 200, 0));
                line(n.x, n.y, n2.x, n2.y);
            }
        }

        // 與滑鼠距離內也畫線
        let dMouse = dist(n.x, n.y, mouseX, mouseY);
        if (dMouse < 120) {
            stroke(255, 255, 255, map(dMouse, 0, 120, 255, 0));
            line(n.x, n.y, mouseX, mouseY);
        }
    }

    // 滑鼠光圈
    noFill();
    stroke(255, 255, 255, 40);
    ellipse(mouseX, mouseY, 80 + sin(frameCount * 0.2) * 10);
}


function mousePressed() {
    for (let i = 0; i < 15; i++) {
        nodes.push({
            x: mouseX,
            y: mouseY,
            vx: random(-2, 2),
            vy: random(-2, 2),
            alpha: 255
        });
    }
    // 檢查是否點擊關閉按鈕
    if (introBoxVisible) {
        let boxWidth = 400;
        let boxHeight = 200;
        let boxX = (width - boxWidth) / 2;
        let boxY = (height - boxHeight) / 2;
        let closeButtonSize = 20;
        let closeButtonX = boxX + boxWidth - closeButtonSize - 10;
        let closeButtonY = boxY + 10;
        
        if (dist(mouseX, mouseY, closeButtonX, closeButtonY) < closeButtonSize / 2) {
            introBoxVisible = false;
            return; // 提早結束
        }
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function changeSprite(index) {
    currentSprite = index;
}
