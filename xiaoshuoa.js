jQuery(document).ready(function($) {
    // 1. 初始化 Swiper
    var shelfSwiper = new Swiper('.bookshelf-swiper', {
        autoHeight: true,
        spaceBetween: 40,
        speed: 500,
        on: {
            // 滑动时更新 Tab 状态
            slideChange: function() {
                updateTab(this.activeIndex);
            }
        }
    });

    // 2. Tab 点击逻辑
    $('.tab-btn').on('click', function() {
        var idx = $(this).data('index');
        shelfSwiper.slideTo(idx);
    });

    // 3. 更新 Tab 指示器位置 (核心动画逻辑)
    function updateTab(index) {
        var $tabs = $('.hero-tabs');
        var $activeBtn = $('.tab-btn[data-index="' + index + '"]');
        var $indicator = $('.tab-indicator');

        // 移除旧状态
        $('.tab-btn').removeClass('active');
        $activeBtn.addClass('active');

        // 计算位置和宽度
        var left = $activeBtn.position().left;
        var width = $activeBtn.outerWidth();

        // 移动白色滑块
        $indicator.css({
            'left': left + 'px',
            'width': width + 'px'
        });
    }

    // 初始化运行一次，设置滑块初始位置
    setTimeout(function() {
        updateTab(0);
    }, 100);
});