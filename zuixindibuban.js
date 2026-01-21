 document.addEventListener('DOMContentLoaded', function() {
        const links = document.querySelectorAll('.nav-item');
        const refreshOverlay = document.getElementById('nav-refresh-overlay');
        const publishOverlay = document.getElementById('publish-select-overlay');
        const triggerPublishBtn = document.getElementById('trigger-publish-btn');
        const closePubBtn = document.getElementById('close-pub-panel');

        // --- 【新增】发布弹窗逻辑 ---
        if(triggerPublishBtn) {
            triggerPublishBtn.addEventListener('click', function(e) {
                e.preventDefault();
                publishOverlay.style.display = 'flex';
                setTimeout(() => publishOverlay.classList.add('show'), 10);
            });
        }

        const closePanel = () => {
            publishOverlay.classList.remove('show');
            setTimeout(() => publishOverlay.style.display = 'none', 300);
        };

        if(closePubBtn) closePubBtn.addEventListener('click', closePanel);
        publishOverlay.addEventListener('click', (e) => { if(e.target === publishOverlay) closePanel(); });

        // --- 刷新与点击逻辑 ---
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                // 如果是中间按钮，跳过刷新检测逻辑
                if (this.id === 'trigger-publish-btn') return;

                if (this.classList.contains('active')) {
                    e.preventDefault();
                    refreshOverlay.style.display = 'flex';
                    setTimeout(() => window.location.reload(), 300);
                    return;
                }
                
                links.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });
    });