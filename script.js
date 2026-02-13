document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    const maxScore = 50; 
    const namespace = 'atauidaro_v1';

    const indicator = document.getElementById('indicator');
    const scoreDisplay = document.getElementById('score-display');
    const statusText = document.getElementById('status-text');
    const btnCold = document.getElementById('btn-cold');
    const btnHot = document.getElementById('btn-hot');

    async function fetchGlobalScore() {
        try {
            const hotRes = await fetch('https://api.countapi.xyz/get/' + namespace + '/hot').catch(() => null);
            const coldRes = await fetch('https://api.countapi.xyz/get/' + namespace + '/cold').catch(() => null);
            
            let hotCount = 0;
            let coldCount = 0;

            if (hotRes && hotRes.ok) {
                const data = await hotRes.json();
                hotCount = data.value || 0;
            }
            if (coldRes && coldRes.ok) {
                const data = await coldRes.json();
                coldCount = data.value || 0;
            }
            
            score = hotCount - coldCount;
            updateDisplay();
        } catch (e) {
            console.error('Fetch error:', e);
        }
    }

    async function vote(type) {
        if(type === 'hot') score++;
        else score--;
        updateDisplay();

        try {
            await fetch('https://api.countapi.xyz/hit/' + namespace + '/' + type);
            fetchGlobalScore();
        } catch (e) {
            console.error('Vote error:', e);
        }
    }

    function updateDisplay() {
        scoreDisplay.textContent = '総スコア: ' + score;
        let percentage = (score / maxScore) * 100;
        if (percentage > 100) percentage = 100;
        if (percentage < -100) percentage = -100;

        if (score >= 0) {
            indicator.style.left = '50%';
            indicator.style.width = percentage + '%';
            indicator.style.background = 'linear-gradient(90deg, #ff9a9e 0%, #ff0606 100%)';
            if(score === 0) statusText.textContent = "ちょうどいい";
            else if(score < 10) statusText.textContent = "ちょっと暑いかも";
            else if(score < 30) statusText.textContent = "暑い！";
            else statusText.textContent = "激暑！！！";
        } else {
            const absPercentage = Math.abs(percentage);
            indicator.style.left = (50 - absPercentage) + '%';
            indicator.style.width = absPercentage + '%';
            indicator.style.background = 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)';

            if(score > -10) statusText.textContent = "ちょっと肌寒い";
            else if(score > -30) statusText.textContent = "寒い！";
            else statusText.textContent = "極寒！！！";
        }
    }

    btnHot.addEventListener('click', () => vote('hot'));
    btnCold.addEventListener('click', () => vote('cold'));

    fetchGlobalScore();
    setInterval(fetchGlobalScore, 10000); // 10秒おきに他ユーザーの動きを反映
});
