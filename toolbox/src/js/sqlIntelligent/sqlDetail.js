/**
 * Created on 2017/9/27.
 * monitorSqlDetail封装
 * @returns {{version: string, init: init, initList: initList}}
 * @constructor
 */
var SqlDetailManage = function(cfg){
    var sqlDetailInfo = {
        version: '0.0.1',
        description: '',
        init: function () {
            this.baseUrl = '';
            this.apiUrl = {
                'sqlTextInitUrl': this.baseUrl + '../../src/mockData/sqlIntelligent/sqlTextData.json',  //SQL Text
                'InfoInitUrl': this.baseUrl + '../../src/mockData/sqlIntelligent/infoData.json',     //Global Information
                'listInitUrl': this.baseUrl + '../../src/mockData/sqlIntelligent/listData.json'      //Gloal Stats
            };
            $('.alert').draggable();//弹出框可拖动
            this.initSqlText();
            this.initInfo();
            this.initList();
        },
        initSqlText: function(){
            $('#J_sqlText').html("");
            $.ajax({
                url: this.apiUrl.sqlTextInitUrl,
                type: 'GET',
                data: {
                },
                dataType: 'json',
                success: function(data){
                    $('#J_sqlText').html(data.data);
                },
                error: function(){
                    $('#J_warnInfo').removeClass('hidden');
                    $('#J_warnContent').html('网络错误，请稍后重试');
                }
            });
        },
        initInfo: function(){
            $('#J_InfoContent').html("");
            $.ajax({
                url: this.apiUrl.InfoInitUrl,
                type: 'GET',
                data: {
                },
                dataType: 'json',
                success: function(data){
                    var t=_.template($("#T_info_template").html());
                    $('#J_InfoContent').append(t({"data":data.data}));
                },
                error: function(){
                    $('#J_warnInfo').removeClass('hidden');
                    $('#J_warnContent').html('网络错误，请稍后重试');
                }
            });
        },
        initList: function(curPage, sortColumn){
            var self = this;
            $('#J_listContent').html("");
            $.ajax({
                url: this.apiUrl.listInitUrl,
                type: 'GET',
                data: {
                    'current':curPage || 1,
                    'sortColumn': sortColumn? sortColumn : ''
                },
                dataType: 'json',
                success: function(data){
                    var t=_.template($("#T_list_template").html());
                    $('#J_listContent').append(t({"data":data.data}));
                    self.structPager(data.currentPage,data.totalPage,data.slipCount);
                },
                error: function(){
                    $('#J_warnInfo').removeClass('hidden');
                    $('#J_warnContent').html('网络错误，请稍后重试');
                }
            });
        },
        structPager: function(current,total,slip){
            $('#pageCount').html(total); //分页器总页数
            $('#slipCount').val(slip);  //列表每页显示条数
            var self = this;
            $("#pager").pagination({
                currentPage: current,
                totalPage: total,
                isShow: false,
                count: 6,
                prevPageText: "<span class='glyphicon glyphicon-triangle-left' aria-hidden='tru'></span>",
                nextPageText: "<span class='glyphicon glyphicon-triangle-right' aria-hidden='tru'></span>",
                callback: function(current) {
                    self.initList(current);
                }
            });
        }
    };
    return sqlDetailInfo;
};

/**
 * 渲染初始化
 */
(function($){
    var sqlDetail = new SqlDetailManage();
    sqlDetail.init();
})(jQuery);
