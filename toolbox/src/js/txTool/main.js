/**
 * Created by DELL on 2017/8/22.
 */
(function(){
    //初始化各个接口地址
    var baseUrl = '';
    listInitUrl = baseUrl + '../../src/mockData/txTool/initInfo.json';  //页面加载时获取初始化列表接口
    pagerUrl = baseUrl + '../../src/mockData/txTool/pager.json';   //改变分页器时重新获取列表接口
    slipUrl = baseUrl + '../../src/mockData/txTool/slip.json';   //改变每页条数重新获取列表接口
    toggleDownUrl = baseUrl + '../../src/mockData/txTool/toggleDown.json';   //收拢列表重新获取接口
    toggleUpUrl = baseUrl + '../../src/mockData/txTool/toggleUp.json';   //收拢列表重新获取接口
    searchUrl = baseUrl + '../../src/mockData/txTool/search.json';   //按照搜索重新获取列表接口
    sortUrl = baseUrl + '../../src/mockData/txTool/sort.json';    //点击表头重新获取列表接口
    recordUrl = baseUrl +'';   //记录阻塞日志接口
    createKillUrl = baseUrl + '';   //生成kill命令接口
    executeOrderUrl = baseUrl + '';  //执行kill命令接口


    initList();
})();

//初始化列表、分页器
function initList(){
   $.ajax({
        url: listInitUrl,
        type: 'GET',
        dataType: 'json',
        success: function(data){
            createList(data);
            pager(data.currentPage,data.totalPage,data.slipCount);
        },
        error: function(){
            $('#warnInfo').removeClass('hidden');
            $('#warnContent').html('网络错误，请稍后重试');
        }
    });
}

//生成列表
function createList(data){
    $('#listContent').html('');
    var list = data.data,
        appendElement = '';
    for(var i = 0; i < list.length; i++){
        appendElement += '<tr>';
        appendElement += list[i].selectAll === true?  '<td><input type="checkbox" class="selectAll"></td>':'<td></td>';
        appendElement += '<td><input type="checkbox" class="select"></td>';
        appendElement += '<td>'+ list[i].SID +'</td>';
        appendElement += '<td>'+ list[i].userName +'</td>';
        appendElement += '<td>'+ list[i].keepTime +'</td>';
        appendElement += '<td>'+ list[i].startTime +'</td>';
        appendElement += '<td>'+ list[i].keepBlockCount +'</td>';
        appendElement += '<td>'+ list[i].Client_info +'</td>';
        appendElement += '<td>'+ list[i].blockSessionCount +'</td>';
        appendElement += '<td>'+ list[i].SQL_ID +'</td>';
        appendElement += '<td>'+ list[i].executingSQL +'</td>';
        appendElement += '</tr>';
    }
    $('#listContent').append(appendElement);
}

//初始化分页器
function pager(current,total,slip){
    $('#pageCount').html(total); //分页器总页数
    $('#slipCount').val(slip);  //列表每页显示条数
    $("#pager").pagination({
        currentPage: current,
        totalPage: total,
        isShow: false,
        count: 6,
        prevPageText: "<span class='glyphicon glyphicon-triangle-left' aria-hidden='tru'></span>",
        nextPageText: "<span class='glyphicon glyphicon-triangle-right' aria-hidden='tru'></span>",
        callback: function(current) {
            pagerList(current);
        }
    });
}

//改变分页器重新获取列表数据
function pagerList(current){
    $.ajax({
         url: pagerUrl + '?current=' + current,
         type: 'GET',
         success: function(data){
             createList(data);
             pager(data.currentPage,data.totalPage,data.slipCount);
         },
         error: function(){
             $('#warnInfo').removeClass('hidden');
             $('#warnContent').html('网络错误，请稍后重试');
         }
     })
}

//改变每页条数重启获取列表数据
$('#slipCount').change(function(){
    var slipCount = $('#slipCount').val();
    $.ajax({
         url: slipUrl +'?slip='+ slipCount,
         type: 'GET',
         success: function(data){
             createList(data);
             pager(data.currentPage,data.totalPage,data.slipCount);
         },
         error: function(){
             $('#warnInfo').removeClass('hidden');
             $('#warnContent').html('网络错误，请稍后重试');
         }
     })
});

//搜索
$('#search').on('keypress',function(event){
    var searchContent= $('#search').val();
    if(event.keyCode === 13){
        $.ajax({
             url: searchUrl + '?search=' + searchContent,
             type: 'GET',
             success: function(data){
                 createList(data);
                 pager(data.currentPage,data.totalPage,data.slipCount);
             },
             error: function(){
                 $('#warnInfo').removeClass('hidden');
                 $('#warnContent').html('网络错误，请稍后重试');
             }
         })
    }
});

//展开列表
$('body').on('click','.toggleDown',function(){
    $('.toggleDown').addClass('hidden');
    $('.toggleUp').removeClass('hidden');
    $.ajax({
        url: toggleDownUrl,
        type: 'GET',
        success: function(data){
            createList(data);
            pager(data.currentPage,data.totalPage,data.slipCount);
        },
        error: function(){
            $('#warnInfo').removeClass('hidden');
            $('#warnContent').html('网络错误，请稍后重试');
        }
    })
});

//收拢列表
$('body').on('click','.toggleUp',function(){
    $('.toggleUp').addClass('hidden');
    $('.toggleDown').removeClass('hidden');
    $.ajax({
         url: toggleUpUrl,
         type: 'GET',
         success: function(data){
             createList(data);
             pager(data.currentPage,data.totalPage,data.slipCount);
        },
         error: function(){
             $('#warnInfo').removeClass('hidden');
             $('#warnContent').html('网络错误，请稍后重试');
         }
     })
});

//全部选中
$('body').on('click','.chooseAll',function(){
    $('input[type=checkbox]').each(function(index){
        $($('input[type=checkbox]')[index]).prop('checked',true);
    })
});

//全部取消选中
$('body').on('click','.removeAll',function(){
    $('input[type=checkbox]').each(function(index){
        $($('input[type=checkbox]')[index]).prop('checked',false);
    })
});

//返回
$('.back').click(function(){
    window.history.go(-1);
});

//关闭弹窗
$('body').on('click','.close',function(){
    $('.alert').addClass('hidden');
});

//记录阻塞日志
$('#record').click(function(){
     $.ajax({
         url: recordUrl,
         type: 'GET',
         success: function(data){
             $('#warnInfo').removeClass('hidden');
             $('#warnContent').html(data);
         },
         error: function(){
             $('#warnInfo').removeClass('hidden');
             $('#warnContent').html('网络错误，请稍后重试');
         }
    })
});

//生成kill命令
$('#createKill').click(function(){
    var SIDList = [];
    $('.select:checked').each(function(index){
        SIDList.push($($('.select')[index]).parent().next().html());
    });
    $.ajax({
        url: createKillUrl,
        type: 'POST',
        data: SIDList,
        success: function(data){
            $('#killOrder').removeClass('hidden');
            $('#alertContent').val(data);

            //导出文本
            var date = new Date();

            $('#export').prop('href','data:text/paint; utf-8,'+data);
            $('#export').prop('download',date+'.txt');
        },
        error: function(){
            $('#warnInfo').removeClass('hidden');
            $('#warnContent').html('网络错误，请稍后重试');
        }
    })
});

//改变导出内容
$('#alertContent').change(function(){
    $('#export').prop('href','data:text/paint; utf-8,'+ $('#alertContent').val());
});

//执行kill命令
$('#executeOrder').click(function(){
    var orderList = $('#alertContent').val();
    $.ajax({
        url: executeOrderUrl,
        type: 'POST',
        data: orderList,
        success: function(data){
            $('#killOrder').removeClass('hidden');
            $('#warnContent').html(data);
        },
        error: function(){
            $('#warnInfo').removeClass('hidden');
            $('#warnContent').html('网络错误，请稍后重试');
        }
    })
});



//点击表头排序
$('.sort').click(function(event){
    var sortHtml = event.target.innerHTML;
    $.ajax({
        url: sortUrl +'?sort='+ sortHtml,
        type: 'GET',
        data: sortHtml,
        success: function(data){
            createList(data);
            pager(data.currentPage,data.totalPage,data.slipCount);
        },
        error: function(){
            $('#warnInfo').removeClass('hidden');
            $('#warnContent').html('网络错误，请稍后重试');
        }
    })
});

//全选框改变 影响单选框
$('body').on('change','.selectAll',function(event){
    var target = $(event.target);
    if(target.is(':checked') === true) {
        target.parent().next().children('input:first-child').prop('checked', true);
        chooseSelect(target.parent().parent(),true);
    }else{
        target.parent().next().children('input:first-child').prop('checked', false);
        chooseSelect(target.parent().parent(),false);
    }
});
//改变单选框
function chooseSelect(parent,bool){
    if(parent.next().children('td:first-child').html() === ''){
        if(bool === true) {
            parent.next().children('td:eq(1)').children('input[class=select]').prop('checked', true);
        }else{
            parent.next().children('td:eq(1)').children('input[class=select]').prop('checked', false);
        }
        chooseSelect(parent.next(),bool);
    }
}

//弹出框可拖动
$('.alert').draggable();

