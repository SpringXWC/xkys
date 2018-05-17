'use strict';
var storage = {
    local: {
        set: function (key, value) {
            //key = key+ new Date().getTime();
            localStorage.setItem(key, value);
            return key;
        },
        get: function (key) {
            var val = localStorage.getItem("key");
            if (val == null || val == undefined) {
                return null
            }
            return val;
        },
        del: function (key) {
            if (localStorage.removeItem(key)) ;
        },
        clear: function () {
            localStorage.clear();
        }
    },
    session: {
        set: function (key, value) {
            //key = key+ new Date().getTime();
            sessionStorage.setItem(key, value);
            return key;
        },
        get: function (key) {
            var val = sessionStorage.getItem(key);
            if (val === null || val === undefined) {
                return "";
            }
            return val;
        },
        del: function (key) {
            if (sessionStorage.removeItem(key)) ;
        },
        clear: function () {
            sessionStorage.clear();
        }
    }
}

/**
 * 加载更多
 * @param data
 * @constructor
 */
function LoadMore(data) {
    this.scrollEl = data.sel;
    this.el = data.el || data.sel;
    this.state; //0 等待触发加载  1 加载中   2 没有更多数据
    this.maxdistance = 30; // 距离底部<distance 时加载更多
    this.loadMoreHtml = '<tr class="load-more">\n' +
        '                    <td colspan="4" class="text-center load-more-content">\n' +
        '                    </td>\n' +
        '                </tr>';
    this.ctxDefault = '<i class="glyphicon glyphicon-arrow-up ft14"></i> <span class="ui-text ft14">加载更多</span>';
    this.ctxLoading = '<i class="icon-loading xkfont anim"></i> <span class="ui-text ft14">加载更多</span>';
    this.ctxNomre = '<span class="ui-text ft14">没有更多数据</span>';

    this.getDistance = data.getDistance;
    this.getData = data.getData;
    /**
     * 初始化
     */
    this.init = function () {
        this.state = 0;
        $(this.el).append(this.loadMoreHtml);
        $(this.el).find('.load-more-content').html(this.ctxDefault);
        $(this.scrollEl).scroll(function (e) {
            var currdistance = this.getDistance();

            if (currdistance < this.maxdistance && this.state === 0) {
                this.getData && this.getData();
            }
        }.bind(this));
        if (this.getDistance() <= 0) {
            this.getData && this.getData();
        }
    };
    /**
     * 初始状态
     */
    this.default = function () {
        this.state = 0;
        if ($(this.el).find('.load-more').length) {
            $(this.el).find('.load-more-content').html(this.ctxDefault);
        } else {
            $(this.el).append(this.loadMoreHtml);
            $(this.el).find('.load-more-content').html(this.ctxDefault);
        }
    };
    /**
     * 加载中
     */
    this.loading = function () {
        this.state = 1;
        if ($(this.el).find('.load-more').length) {
            $(this.el).find('.load-more-content').html(this.ctxLoading);
        } else {
            $(this.el).append(this.loadMoreHtml);
            $(this.el).find('.load-more-content').html(this.ctxLoading);
        }
    };
    /**
     * 没有更多
     */
    this.nomore = function () {
        this.state = 2;
        if ($(this.el).find('.load-more').length) {
            $(this.el).find('.load-more-content').html(this.ctxNomre);
        } else {
            $(this.el).append(this.loadMoreHtml);
            $(this.el).find('.load-more-content').append(this.ctxNomre);
        }
    };
    this.removeLoadHtml = function () {
        $(this.el).find('.load-more').remove();
    }
}

//table 固定头部
function tableHeadFixed(table) {
    $(table).parent().scroll(function () {
        if ($(table).attr('data-init') == undefined) {
            var thead = $(table).children('thead')
            $(table + '>thead>tr>th').each(function (idx, el) {
                var wid = getStyle(this, 'width');
                $(this).attr("data-width", wid).css('width', wid);
                $(table + '>tbody>tr:first-child').children().eq(idx).css('width', wid)
            })
            var height = thead.css('height');
            thead.after("<div class='fixed-placeholder' style='height:" + height + "'></div>")
            thead.css({
                'position': 'fixed',
                'margin-top': '-1px',
                "z-index": "10000",
                "background": "#fff"
            });
            $(table + '>thead>tr').children().css('height', parseInt(height) + 2 + "px")
            $(table).attr('data-init', true);
        }
    })
}

function validatorForm() {
    var currElem = $('.nav-container>.active');
    var validatorFlag = true;
    currElem.find('[data-must="true"]').each(function (i, item) {
        if ($(item).val().trim() == "") {
            $(item).addClass('focus');
            //			var top = $(item).offset().top;
            //			var left = $(item).offset().left;
            //			var scrollTop = document.body.scrollTop;
            //			var elWidth = parseFloat($(item).css('width'))
            validatorFlag = false;
            if (layer) {
                layer.open({
                    content: '此项必填!',
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            }
            return;
        }
    });
    return validatorFlag;
}


$(function () {
    $('.dropdown-toggle').click(function () {
        //下拉菜单
        $(this).siblings('.dropdown-menu').slideToggle().parents('.filter-item').siblings().find('.dropdown-menu').slideUp();
    });

    $('.dropdown-menu').on('click', 'li>a', function (e) {
        e.preventDefault();
        var val = $(this).html();
        var dataId = $(this).attr('data-id') ? $(this).attr('data-id') : '';
        $(this).parents('.dropdown-menu').siblings('.dropdown-toggle').attr('data-id', dataId).find('b').html(val);
        $(this).parents('.dropdown-menu').slideUp();
    });

    //查看报告,详情切换
    $('.suggest-ctr').click(function () {
        $(this).find('img').toggleClass('active');
        $(this).siblings('.suggest-details').slideToggle();
    });
    $('.item-special').click(function () {
        $(this).find('img').toggleClass('active');
        $(this).next('.item-special-d').slideToggle();
    });

    //清楚验证失败input加的focus类名
    $('body').on('click', 'input', function () {
        if ($(this).hasClass('focus')) {
            $(this).removeClass('focus');
        }
    });
    $('body').on('blur', 'input', function () {
        if ($(this).hasClass('focus')) {
            $(this).removeClass('focus');
        }
    });
    //导航条 切换显示
    $('.nav').on('click', 'a', function (e) {
        e.preventDefault();
        var idx = $(this).parent('li').index();

        $(this).parent('li').addClass('active').siblings().removeClass('active');
        $(this).parents('.nav').next('.nav-container').children().eq(idx).addClass('active').siblings().removeClass('active');
    });
    //左侧导航
    $('.nav-side').on('click', 'li', function () {
        $(this).addClass('active').siblings().removeClass('active');
        //添加图标选中效果
        $(this).find('[class^="iconx-"]').each(function () {
            if ($(this).attr('class').indexOf('-hover') == -1) {
                var cname = $(this).attr('class');
                $(this).attr('class', cname + '-hover');
            }
        });
        //移除图标选中效果
        $(this).siblings().find('[class^="iconx-"]').each(function () {
            if ($(this).attr('class').indexOf('-hover') != -1) {
                var cname = $(this).attr('class');
                $(this).attr('class', cname.replace('-hover', ""));
            }
        });
    });

    //个人档案导航 切换显示
    $('.nav-process').on('click', 'a', function (e) {
        e.preventDefault()
        var idx = $(this).parent('li').index();
        if (idx != $(this).parents('ul').children('li').length - 1) {
            $(this).parent('li').addClass('active').siblings().removeClass('active');
            $(this).parents('.nav-process').next('.nav-container').children().eq(idx).addClass('active').siblings().removeClass('active');
        }
    });

    //表格头部固定
    tableHeadFixed('.table-head-fixed');

});
$('body').on('click', '[data-href]', function (e) {
    var e = e ? e : window.event;
    e.preventDefault();
    if ($(this).data('href'))
        location.href = $(this).data('href');
});
$('body').on('click', '[data-urlReplace=true]', function (e) {
    var e = e ? e : window.event;
    e.preventDefault();
    if ($(this)[0].nodeName == "A") {
        location.replace($(this).attr('href'));
    } else {
        location.replace($(this).attr('data-href'));
    }
});


$.fn.extend({
    /**
     * jq 扩展表格
     * @param columns 配置列参数
     * @param tableData 表格数据
     * @param load 为true时添加数据,false 替换数据
     */
    xkTableInit: function (columns, tableData, load) { //表格模版
        var $table = $(this);  //table标签
        if (this.tagName != 'table') {
            throw new Error('此方法只能用于table');
        }
        var tableDomHead = '';  //表头
        var tableDomBody = '';  //表格内容
        tableDomHead += '    <thead>\n' +
            '    <tr>\n';
        $.each(columns, function (idx, item) {
            tableDomHead += '        <th>' + item.title || item.field + '</th>\n';
        });
        tableDomHead += '    </tr>\n' +
            '    </thead>';

        // 表格数据
        $.each(tableData, function (idx, item) {
            tableDomBody += '    <tr>\n';
            $.each(columns, function (i, col) {
                var colHtml = '';
                if (typeof item[col.field] === 'undefined') {
                    if (col.type === 'index') {
                        colHtml = idx + 1;
                    } else {
                        colHtml = '--'
                    }
                } else {
                    if (col.formatter && (typeof col.formatter == 'function')) {
                        colHtml = col.formatter({
                            val: item[col.field],
                            col: col,
                            row: item,
                            index: idx
                        });
                    } else {
                        colHtml = item[col.field] || ''
                    }
                }
                tableDomBody += '        <td>' + colHtml + '</td>\n';
            });
            tableDomBody += '    </tr>\n';
        });
        if (load) {
            $table.children('tbody').append(tableDomBody);
        } else {
            tableDomBody = '<tbody>' + tableDomBody + '</tbody>';
            $table.html(tableDomHead + tableDomBody);
        }
    }
});


function Table(el, columns) {
    this.columns;
    this.el;
    /**
     * 表格初始化
     * @param el  table标签元素,css选择器或者dom对象
     * @param columns   列参数 [{ title:'表格列显示名', filed: '匹配表格数据中对应字段',  type: 'index为显示序号', formatter: function}]
     */
    this.init = function (el, columns) { //表格模版
        this.el = el != undefined ? el : this.el;
        this.columns = columns != undefined ? columns : this.columns;

        if ($(el)[0].tagName != 'TABLE') {
            throw new Error('此方法只能用于table');
        }
        var tableDomHead = '';  //表头
        var tableDomBody = '';  //表格内容
        tableDomHead += '    <thead>\n' +
            '    <tr>\n';
        $.each(columns, function (idx, item) {
            tableDomHead += '        <th>' + item.title || item.field + '</th>\n';
        });
        tableDomHead += '    </tr>\n' +
            '    </thead>';

        tableDomBody = '<tbody></tbody>';
        $(this.el).html(tableDomHead + tableDomBody);
    };
    /**
     * 表格 dom 拼接
     * @param data
     * @returns {string}
     */
    this.bodyFragment = function(data){
        // 表格数据
        var bodyDom = '';
        $.each(data, function (idx, item) {
            bodyDom += '    <tr>\n';
            $.each(columns, function (i, col) {
                var colHtml = '';
                if (typeof item[col.field] === 'undefined') {
                    if (col.type === 'index') {
                        colHtml = idx + 1;
                    } else {
                        colHtml = '--'
                    }
                } else {
                    if (col.formatter && (typeof col.formatter == 'function')) {
                        colHtml = col.formatter({
                            val: item[col.field],
                            col: col,
                            row: item,
                            index: idx
                        });
                    } else {
                        colHtml = item[col.field] || ''
                    }
                }
                bodyDom += '        <td>' + colHtml + '</td>\n';
            });
            bodyDom += '    </tr>\n';
        });
        return bodyDom;
    };
    /**
     * 载入 tbody 文档片段
     * @param data
     * @param isAppend
     */
    this.loadData = function(data,isAppend){
        if(isAppend === undefined){
            isAppend = true;
        }
        if(isAppend) {
            $(this.el).find('tbody').append(this.bodyFragment(data))
        }else{
            $(this.el).find('tbody').html(this.bodyFragment(data))
        }
    };


    return this.init(el, columns);

}