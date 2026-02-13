document.addEventListener('DOMContentLoaded', () => {
    const namespace = 'atauidaro_v1';

    const statusText = document.getElementById('status-text');
    const btnCold = document.getElementById('btn-cold');
    const btnHot = document.getElementById('btn-hot');
    const valCold = document.getElementById('val-cold');
    const valHot = document.getElementById('val-hot');
    const percentCold = document.getElementById('percent-cold');
    const percentHot = document.getElementById('percent-hot');
    const gaugeCold = document.getElementById('gauge-cold');
    const gaugeHot = document.getElementById('gauge-hot');
    const participantsDisplay = document.getElementById('participants-display');
    const dominantIndicator = document.getElementById('dominant-indicator');

    let hotCount = 0;
    let coldCount = 0;

    async function fetchGlobalScore() {
        try {
            const hotRes = await fetch('https://api.countapi.xyz/get/' + namespace + '/hot').catch(() => null);
            const coldRes = await fetch('https://api.countapi.xyz/get/' + namespace + '/cold').catch(() => null);
            
            if (hotRes && hotRes.ok) {
                const data = await hotRes.json();
                hotCount = data.value || 0;
            }
            if (coldRes && coldRes.ok) {
                const data = await coldRes.json();
                coldCount = data.value || 0;
            }
            
            updateDisplay();
        } catch (e) {
            console.error('Fetch error:', e);
        }
    }

    async function vote(type) {
        if(type === 'hot') hotCount++;
        else coldCount++;
        updateDisplay();

        try {
            await fetch('https://api.countapi.xyz/hit/' + namespace + '/' + type);
            fetchGlobalScore();
        } catch (e) {
            console.error('Vote error:', e);
        }
    }

    function updateDisplay() {
        const total = hotCount + coldCount;
        const hotPercent = total > 0 ? Math.round((hotCount / total) * 100) : 50;
        const coldPercent = total > 0 ? Math.round((coldCount / total) * 100) : 50;
        
        // 投票数表示
        valCold.textContent = coldCount;
        valHot.textContent = hotCount;
        percentCold.textContent = coldPercent + '%';
        percentHot.textContent = hotPercent + '%';
        participantsDisplay.textContent = '総投票数: ' + total;

        // ゲージ更新
        gaugeCold.style.width = coldPercent + '%';
        gaugeHot.style.width = hotPercent + '%';

        // 優勢表示の更新
        const diff = Math.abs(hotCount - coldCount);
        const diffPercent = Math.abs(hotPercent - coldPercent);
        
        if (diffPercent < 5) {
            // 均衡状態
            dominantIndicator.className = 'dominant-indicator neutral';
            dominantIndicator.querySelector('.dominant-icon').textContent = '⚖️';
            dominantIndicator.querySelector('.dominant-text').textContent = '均衡';
            statusText.textContent = 'ちょうどいい温度！';
            statusText.style.color = '#666';
        } else if (hotCount > coldCount) {
            // 暑い派優勢
            dominantIndicator.className = 'dominant-indicator hot-dominant';
            dominantIndicator.querySelector('.dominant-icon').textContent = '🥵';
            
            if (diffPercent < 15) {
                dominantIndicator.querySelector('.dominant-text').textContent = '暑い派やや優勢';
                statusText.textContent = 'ちょっと暑いかも...';
            } else if (diffPercent < 30) {
                dominantIndicator.querySelector('.dominant-text').textContent = '暑い派優勢！';
                statusText.textContent = '暑い！エアコン強めて！';
            } else {
                dominantIndicator.querySelector('.dominant-text').textContent = '暑い派圧勝！！';
                statusText.textContent = '激暑！！！すぐエアコン！！';
            }
            statusText.style.color = '#ff0606';
        } else {
            // 寒い派優勢
            dominantIndicator.className = 'dominant-indicator cold-dominant';
            dominantIndicator.querySelector('.dominant-icon').textContent = '🥶';
            
            if (diffPercent < 15) {
                dominantIndicator.querySelector('.dominant-text').textContent = '寒い派やや優勢';
                statusText.textContent = 'ちょっと肌寒い...';
            } else if (diffPercent < 30) {
                dominantIndicator.querySelector('.dominant-text').textContent = '寒い派優勢！';
                statusText.textContent = '寒い！暖房つけて！';
            } else {
                dominantIndicator.querySelector('.dominant-text').textContent = '寒い派圧勝！！';
                statusText.textContent = '極寒！！！すぐ暖房！！';
            }
            statusText.style.color = '#0072ff';
        }
    }

    btnHot.addEventListener('click', () => vote('hot'));
    btnCold.addEventListener('click', () => vote('cold'));

    fetchGlobalScore();
    setInterval(fetchGlobalScore, 10000);
});
