const reels = document.querySelectorAll('.reel');
const stopButtons = document.querySelectorAll('.stop-button');
const scoreValue = document.getElementById('score-value');
const resetButton = document.getElementById('reset-button');

let score = 5000;
let intervals = [];
let stopIndex = 0; // ストップボタンのインデックス

function startSpinning() {
    reels.forEach((reel, index) => {
        let number = 0;
        reel.textContent = number; 
        intervals[index] = setInterval(() => {
            number = (number + 1) % 10; // 0-9の順番で数字を増やす
            reel.textContent = number;
        }, 100); // 数字の更新間隔を調整することでスピードをコントロール
    });

    resetButton.disabled = true;
}

function stopSpinning(index) {
    setTimeout(() => { // 0.5秒後にスロットを止める
        clearInterval(intervals[index]);
        intervals[index] = null; // クリアしたインターバルをnullに設定
        if (intervals.every(interval => interval === null)) { // 全てのインターバルがクリアされているかチェック
            calculateScore();
            resetButton.disabled = false;
        }
    }, 500); // 500ミリ秒のディレイ
}

function calculateScore() {
    const symbols = Array.from(reels).map(reel => Number(reel.textContent));

    if (symbols[0] === 7 && symbols[1] === 7 && symbols[2] === 7) {
        score += 100000000000; // 777のときは100,000,000,000ポイントを加算
    } else if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        score += symbols[0] * 1000; // それ以外のゾロ目の場合は、その数字に10を掛けた値をスコアに加算
    }

    scoreValue.textContent = score;
}


document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') { // スペースキーが押された場合
        event.preventDefault(); // スペースキーのデフォルトの動作を無効にする
        if (stopIndex < stopButtons.length) { // まだストップボタンが残っている場合
            stopButtons[stopIndex].click(); // ストップボタンをクリック
            stopIndex++; // インデックスを増やす
        } else if (!resetButton.disabled) { // すべてのストップボタンが押されてリセットボタンが有効な場合
            resetButton.click(); // リセットボタンをクリック
            stopIndex = 0; // インデックスをリセット
        }
    }
});

stopButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        stopSpinning(index);
    });
});

resetButton.addEventListener('click', () => {
    score-=1000;
    scoreValue.textContent = score;
    checkGameOver();
    startSpinning();
});

function checkGameOver() {
    if (score <= 0) {
        const gameOverOverlay = document.createElement('div');
        gameOverOverlay.style.position = 'fixed';
        gameOverOverlay.style.top = '0';
        gameOverOverlay.style.left = '0';
        gameOverOverlay.style.width = '100%';
        gameOverOverlay.style.height = '100%';
        gameOverOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        gameOverOverlay.style.color = 'white';
        gameOverOverlay.style.fontSize = '3em';
        gameOverOverlay.style.display = 'flex';
        gameOverOverlay.style.justifyContent = 'center';
        gameOverOverlay.style.alignItems = 'center';
        gameOverOverlay.textContent = 'ゲームオーバー';
        document.body.appendChild(gameOverOverlay);
    }
}


startSpinning();
