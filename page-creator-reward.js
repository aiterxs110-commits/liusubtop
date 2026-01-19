// 复制链接功能
function copyPostLink(postLink) {
    navigator.clipboard.writeText(postLink).then(() => {
        // 显示提示框
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        
        // 3秒后隐藏
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }).catch(err => {
        alert('复制失败，请手动复制：' + postLink);
    });
}

// 滚动渐显动画
document.addEventListener('DOMContentLoaded', function() {
    // 检测元素是否在视口中
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 1.1 &&
            rect.bottom >= 0
        );
    }
    
    // 添加滚动监听
    function handleScroll() {
        const elements = document.querySelectorAll('.scroll-reveal');
        elements.forEach(element => {
            if (isInViewport(element) && !element.classList.contains('active')) {
                element.classList.add('active');
            }
        });
    }
    
    // 初始检查
    handleScroll();
    
    // 滚动时检查
    window.addEventListener('scroll', handleScroll);
    
    // 优化性能 - 节流
    let throttleTimeout;
    window.addEventListener('scroll', function() {
        if (!throttleTimeout) {
            throttleTimeout = setTimeout(function() {
                handleScroll();
                throttleTimeout = null;
            }, 50);
        }
    });
});