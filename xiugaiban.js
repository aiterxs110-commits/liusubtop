(function() {
    const ptrBox = document.getElementById('ptr-loader');
    const iconBox = document.querySelector('.ptr-icon-box');
    const icon = document.getElementById('ptr-icon-el');
    
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    let isRefreshing = false;

    // --- 核心调整区 ---
    const deadZone = 30;  // 死区：手指下拉前30像素不触发任何效果（防手抖）
    const threshold = 100; // 阈值：需要拉动到的距离（增加到100px，更难触发）
    const maxDrag = 180;   // 最大视觉拉动距离
    const damping = 0.35;  // 阻尼系数：0.35表示拉100px只动35px（越小越重）
    // ------------------

    window.addEventListener('touchstart', (e) => {
        // 必须严格在顶部
        if (window.scrollY === 0 && !isRefreshing) {
            startY = e.touches[0].clientY;
            // 不立即设为 isPulling，等移动了再判断
        }
    }, {passive: true});

    window.addEventListener('touchmove', (e) => {
        // 如果页面不在顶部，或者正在刷新，直接退出
        if (window.scrollY > 0 || isRefreshing) return;

        currentY = e.touches[0].clientY;
        let diff = currentY - startY;

        // 1. 判断是否进入“死区” (防止极小的误操作)
        if (diff < deadZone) {
            return; 
        }

        // 2. 开始处理下拉逻辑
        isPulling = true;
        
        // 计算“有效”拖拽距离 (减去死区)
        let effectiveDiff = diff - deadZone;
        
        // 增加阻尼感，计算实际显示的移动距离
        let dampedDiff = Math.min(effectiveDiff * damping, maxDrag);
        
        // 阻止浏览器默认行为 (防止页面本身被拉下来)
        if(e.cancelable && dampedDiff > 0) {
             // 只有真的在下拉时才阻止，避免影响横滑等
             // e.preventDefault(); // 视情况开启，部分安卓机型可能需要
        }

        // 更新 UI
        ptrBox.style.height = dampedDiff + 'px';
        
        // 图标缩放：随着下拉逐渐变大，直到 1.0
        let scaleVal = Math.min(dampedDiff / 60, 1);
        iconBox.style.transform = `scale(${scaleVal})`;
        
        // 箭头旋转：根据距离旋转
        icon.style.transform = `rotate(${dampedDiff * 2.5}deg)`;
        
        // 达到阈值后的视觉反馈
        if (dampedDiff >= threshold) {
            if (!iconBox.classList.contains('ready')) {
                iconBox.classList.add('ready');
                icon.classList.remove('bi-arrow-down');
                icon.classList.add('bi-arrow-down-circle-fill'); 
                icon.style.color = '#007aff';
                // 震动反馈 (安卓支持)
                if (navigator.vibrate) navigator.vibrate(10);
            }
        } else {
            // 未达到阈值，恢复状态
            if (iconBox.classList.contains('ready')) {
                iconBox.classList.remove('ready');
                icon.classList.add('bi-arrow-down');
                icon.classList.remove('bi-arrow-down-circle-fill');
                icon.style.color = '#333';
            }
        }
    }, {passive: false});

    window.addEventListener('touchend', (e) => {
        if (!isPulling) return;
        isPulling = false;
        
        // 重新计算最终距离
        let diff = currentY - startY;
        let effectiveDiff = diff - deadZone;
        let dampedDiff = Math.min(effectiveDiff * damping, maxDrag);

        if (dampedDiff >= threshold) {
            startRefresh();
        } else {
            resetPtr();
        }
    });

    function startRefresh() {
        isRefreshing = true;
        // 锁定高度
        ptrBox.style.transition = 'height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)';
        ptrBox.style.height = '60px'; 
        
        // 切换加载图标
        iconBox.style.transform = 'scale(1)';
        icon.className = 'bi bi-arrow-repeat ptr-icon';
        iconBox.classList.add('ptr-loading');
        icon.style.transform = ''; 
        
        // 刷新页面
        setTimeout(() => {
            window.location.reload();
        }, 500); 
    }

    function resetPtr() {
        // 回弹隐藏
        ptrBox.style.transition = 'height 0.3s ease';
        ptrBox.style.height = '0';
        iconBox.style.transform = 'scale(0)';
        
        setTimeout(() => {
            ptrBox.style.transition = ''; 
            iconBox.classList.remove('ready', 'ptr-loading');
            icon.className = 'bi bi-arrow-down ptr-icon';
            icon.style.color = '#333';
            icon.style.transform = 'rotate(0deg)';
        }, 300);
    }
})();