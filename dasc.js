jQuery(document).ready(function($) {
    
    // --- 初始化日期 ---
    const now = new Date();
    $('#dog-y').val(now.getFullYear());
    $('#dog-m').val(now.getMonth() + 1);
    $('#dog-d').val(now.getDate());
    updateDate(); 

    // --- 事件委托 ---
    
    $(document).on('click', '.js-upload-trigger', function() { $($(this).data('target')).click(); });

    $(document).on('change', '.js-file-input', function() {
        if (this.files && this.files[0]) {
            var input = this;
            var reader = new FileReader();
            reader.onload = function(e) {
                $(input).parent().find($(input).data('preview')).attr('src', e.target.result).show();
                $($(input).data('render')).attr('src', e.target.result);
            }
            reader.readAsDataURL(this.files[0]);
        }
    });

    $(document).on('input', '.js-sync-text', function() {
        const target = $(this).data('target');
        let val = $(this).val();
        if($(this).data('suffix') && val) val += $(this).data('suffix');
        $(target).text(val);
    });

    $(document).on('click', '.js-toggle', function() {
        $(this).parent().find('.bgen-toggle-item').removeClass('active');
        $(this).addClass('active');
        const target = $(this).data('target');
        const val = $(this).data('val');
        $(target).text(val);
        if(val==='是') $(target).addClass('yes'); else $(target).removeClass('yes');
    });

    $(document).on('click', '.js-hobby', function() {
        $(this).parent().find('.bgen-radio').removeClass('checked');
        $(this).addClass('checked');
        const key = $(this).data('key');
        const val = $(this).data('val');
        const t = $('#h-'+key);
        t.text(val);
        t.removeClass('c-N c-A c-S').addClass('c-'+val);
    });

    $(document).on('input', '.js-custom-text', function() {
        const val = $(this).val();
        if(val.trim()){ $('#res-custom-box').show(); $('#res-custom-txt').text(val); }
        else { $('#res-custom-box').hide(); }
    });

    $(document).on('change', '.js-stamp', function() {
        const val = $(this).val();
        const txt = $(this).find('option:selected').data('text');
        const s = $('#res-stamp');
        if(val==='none') { s.hide(); } else {
            const f = txt.length > 3 ? txt.substring(0,2)+'<br>'+txt.substring(2) : txt;
            $('#res-stamp-txt').html(f);
            s.css('display','flex');
        }
    });

    $(document).on('change', '.js-date-select', updateDate);
    $(document).on('click', '#js-close-modal', function() { $('#result-modal').css('display','none'); });

    function genDogId() {
        const prefix = 'XDGZ'; 
        const y = $('#dog-y').val();
        const m = $('#dog-m').val().padStart(2,'0');
        const d = $('#dog-d').val().padStart(2,'0');
        const random = Math.floor(100000 + Math.random() * 900000);
        const id = prefix + y + m + d + random;
        $('#dog-id-input').val(id);
        $('#id-num-val').text(id);
    }

    function updateDate() {
        const y = $('#dog-y').val();
        const m = $('#dog-m').val();
        const d = $('#dog-d').val();
        $('#id-y').text(y);
        $('#id-m').text(m);
        $('#id-d').text(d);
        genDogId(); 
    }

    // 生成逻辑 (无延迟极速版)
    $(document).on('click', '.js-gen-btn', function() {
        const $btn = $(this);
        const type = $btn.data('type');
        const origin = $btn.text();
        
        $btn.prop('disabled', true).text('支付验证中...');

        $.ajax({
            url: '<?php echo admin_url('admin-ajax.php'); ?>',
            type: 'POST',
            dataType: 'json',
            data: { 
                action: 'zb_pay_for_resume', 
                gen_type: type,
                security: '<?php echo $nonce; ?>' 
            },
            success: function(res) {
                if(res.success) {
                    $btn.text('绘制中...');
                    // 无 setTimeout，立即执行
                    const target = (type==='dog') ? 'render-dog' : 'render-resume';
                    // 确保可见
                    $('.bgen-offscreen').css('visibility', 'visible');
                    // 狗证不需要黑色背景，简历需要
                    const bg = (type==='dog') ? null : '#1a1a1a';

                    html2canvas(document.getElementById(target), {
                        scale: 2, backgroundColor: bg, useCORS: true, allowTaint:true, logging: false
                    }).then(canvas => {
                        $('.bgen-offscreen').css('visibility', 'hidden'); // 恢复隐藏
                        $('#result-img').attr('src', canvas.toDataURL("image/jpeg", 0.92));
                        $('#result-modal').css('display','flex');
                        $btn.prop('disabled', false).text('再次生成');
                    }).catch(err => {
                        console.error(err);
                        alert('生成图片失败，请重试');
                        $btn.prop('disabled', false).text(origin);
                    });
                } else {
                    alert(res.data.msg);
                    $btn.prop('disabled', false).text(origin);
                }
            },
            error: function(xhr, status, error){ 
                alert('网络错误: ' + status); 
                $btn.prop('disabled', false).text(origin); 
            }
        });
    });

});