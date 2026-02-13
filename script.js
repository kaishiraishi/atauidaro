document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    const maxScore = 50; // インジケーターが最大になる値

    const indicator = document.getElementById('indicator');
    const scoreDisplay = document.getElementById('score-display');
    const statusText = document.getElementById('status-text');
    const btnCold = document.getElementById('btn-cold');
    const btnHot = document.getElementById('btn-hot');

    // 状態を更新する関数
    function updateDisplay() {
        // スコア表示更新
        scoreDisplay.textContent = `Score: ${score}`;

        // インジケーターの更新
        // スコアを -100% ~ 100% (maxScore基準) に正規化
        let percentage = (score / maxScore) * 100;
        
        // 範囲制限 (-100% ~ 100%)
        if (percentage > 100) percentage = 100;
        if (percentage < -100) percentage        if (percentage < -100) percentage        if (percentage < -100) percentage        if (pertor.style.left = '50%';
            indicator.style.width = `${percentage}%`;
            indicator.style.background = `linear-gradient(90deg, #ff9a9e 0%, #ff0606 100%)`;
            
            if(score === 0) statusText.textContent = "ちょうどいい";
            else if(score < 10) statusText.textContent = "ちょっと暑いかも";
            else if(score < 30) statusText.textContent = "暑い！";
            else statusText.textContent = "激暑！！！";
            
        } else {
            // 寒い側 (左へ伸びる)
            // widthは絶対値、leftは 50% - width
            const absPercentage = Math.abs(percentage);
            indicator.style.left = `${50 - absPercentage}%`;
            indicator.style.width = `${absPercentage}%`;
            indicator.style.background = `linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)`;

            if(score > -10) statusText.textContent = "ちょっと肌寒い";
            else if(score > -30) statusText.textContent = "寒い！";
            else statusText.textContent = "極寒！！！";
        }
    }

    // ボタンイベント
    btnHot.addEventListener('click', () => {
        score++;
        updateDisplay();
    });

    btnCold.addEventListener('click', () => {
        score--;
        updateDisplay();
    });

    // 初期化
    updateDisplay();
});
