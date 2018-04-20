/**
 * echarts
 */
var EchartsCompoent = function(cfg){
    var eCom = {
        init: function(){
            this.divId = cfg.divId;
            this.chartTitle = cfg.title;
            this.chartData = cfg.data;
            this.chartInstent = echarts.init(document.getElementById(this.divId));
            this.formatChartData();
            this.configOption();
            this.renderCharts();
        },
        formatChartData: function(){
            var base = +new Date(1968, 9, 3);
            var oneDay = 24 * 3600 * 1000;
            var date = [];

            var data = [Math.random() * 300];

            for (var i = 1; i < 20000; i++) {
                var now = new Date(base += oneDay);
                date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
                data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
            }
            this.date = date;
            this.chartData = data;
        },
        configOption: function(){
            this.option = {
                title: {
                    left: 'left',
                    padding: [5,5,5,16],
                    textStyle:{
                        fontSize: 14,
                        color:'#6e6e6e'
                    },
                    text: '占用CPU时间',
                },
                grid:{
                    top:50,
                    bottom:20
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.date,
                    axisLine:{
                        lineStyle:{
                            color:'#efefef'
                        }
                    },
                    axisLabel:{
                        textStyle: {
                            color: function (value, index) {
                                return '#6e6e6e';
                            }
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    splitLine:{
                        lineStyle:{
                            color: ['#efefef']
                        }
                    },
                    axisLabel:{
                        textStyle: {
                            color: function (value, index) {
                                return '#6e6e6e';
                            }
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#efefef'
                        }
                    },
                    boundaryGap: [0, '100%']
                },
                series: [
                    {
                        name:'模拟数据',
                        type:'line',
                        smooth:true,
                        symbol: 'none',
                        sampling: 'average',
                        itemStyle: {
                            normal: {
                                color: 'rgb(67, 187, 240)'
                            }
                        },
                        lineStyle:{
                            normal: {
                                color: 'rgb(67, 187, 240)',
                                width:1
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(185,237,250)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(185,237,250)'
                                }])
                            }
                        },
                        data: this.chartData
                    }
                ]
            };
        },
        renderCharts: function(){
            // 使用刚指定的配置项和数据显示图表。
            this.chartInstent.setOption(this.option);
        }
    };
    return eCom;
};

/**
 * Created on 2017/9/26.
 * monitorSqlDetail封装
 * @returns {{version: string, init: init, initList: initList}}
 * @constructor
 */
var MonitorSqlDetailManage = function(cfg){
    var toolInfo = {
        version: '0.0.1',
        description: '',
        init: function () {
            this.baseUrl = '';
            this.apiUrl = {
                'generalInfoInitUrl': this.baseUrl + '../../src/mockData/sqlIntelligent/generalInfoData.json',  //概况信息
                'timeAndWaitCountUrl': this.baseUrl + '../../src/mockData/sqlIntelligent/timeAndWaitCountData.json',  //概况之时间和等待统计
                'ioCountUrl': this.baseUrl + '../../src/mockData/sqlIntelligent/ioCountData.json',  //概况之IO统计
                'listInitUrl': this.baseUrl + '../../src/mockData/sqlIntelligent/listData.json'     //页面加载时获取初始化列表接口
            };
            this.initGeneralInfo();
            this.initList();
        },
        initGeneralInfo: function(){
            $('#J_generalInfo').html("");
            $.ajax({
                url: this.apiUrl.generalInfoInitUrl,
                type: 'GET',
                data: {
                },
                dataType: 'json',
                success: function(data){
                    var t=_.template($("#T_info_template").html());
                    $('#J_generalInfo').append(t({"data":data}));
                },
                error: function(){
                    $('#J_warnInfo').removeClass('hidden');
                    $('#J_warnContent').html('网络错误，请稍后重试');
                }
            });
        },
        getTimeAndWaitCount: function(){
            $('#J_timeAndWaitCount').html("");
            $.ajax({
                url: this.apiUrl.generalInfoInitUrl,
                type: 'GET',
                data: {
                },
                dataType: 'json',
                success: function(data){
                    var t=_.template($("#T_time_wait_template").html());
                    $('#J_timeAndWaitCount').append(t({"data":data}));
                },
                error: function(){
                    $('#J_warnInfo').removeClass('hidden');
                    $('#J_warnContent').html('网络错误，请稍后重试');
                }
            });
        },
        getIoCount: function(){
            $('#J_ioCount').html("");
            $.ajax({
                url: this.apiUrl.generalInfoInitUrl,
                type: 'GET',
                data: {
                },
                dataType: 'json',
                success: function(data){
                    var t=_.template($("#T_io_template").html());
                    $('#J_ioCount').append(t({"data":data}));
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
    return toolInfo;
};

/**
 * 渲染初始化
 */
(function($){
    $('.alert').draggable();//弹出框可拖动
    for(var i=0; i<5; i++) {
        var chartCfg = {
                'divId': 'J_chart-count'+i,
                'title': '占用CPU时间'
            };
        var chartObj = new EchartsCompoent(chartCfg);
        chartObj.init();
    }

    var sqlDetail = new MonitorSqlDetailManage();
    sqlDetail.init();
})(jQuery);
