/**
 * echarts
 */
var EchartsCompoent = function(cfg){
    var eCom = {
        init: function(){
            this.divId = cfg.divId;
            this.chartTitle = cfg.title;
            this.chartData = [
                [120, 132, 101, 134, 90, 230, 210],
                [220, 182, 191, 234, 290, 330, 310],
                [150, 232, 201, 154, 190, 330, 410],
                [320, 332, 301, 334, 390, 330, 320]];
            this.chartInstent = echarts.init(document.getElementById(this.divId));
            this.configOption();
            this.renderCharts();
        },
        formatChartData: function(){
        },
        configOption: function(){
            this.option = {
                title: {
                    left: 'left',
                    padding: [5,5,5,16],
                    textStyle:{
                        fontSize: 16,
                        color:'#6e6e6e'
                    },
                    text: '性能'
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'line',
                        lineStyle:{
                            color:'#efefef'
                        }
                    }
                },
                color:['rgb(243, 98, 101)','rgb(113, 235, 134)','rgb(238, 154, 58)','rgb(84, 187, 246)'],
                legend: {
                    data:[{
                        name: '等待',
                        icon: 'rect',
                        textStyle:{
                            color: 'rgb(243, 98, 101)'
                        }
                    },{
                        name: '用户I/O',
                        icon: 'rect',
                        textStyle:{
                            color: 'rgb(113, 235, 134)'
                        }
                    },{
                        name: 'CPU',
                        icon: 'rect',
                        textStyle:{
                            color: 'rgb(238, 154, 58)'
                        }
                    },{
                        name: 'CPU内核',
                        icon: 'rect',
                        textStyle:{
                            color: 'rgb(84, 187, 246)'
                        }
                    }],
                    right: 20
                },
                grid:{
                    top:50,
                    bottom:20,
                    left: 60,
                    right:40
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['周一','周二','周三','周四','周五','周六','周日'],
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
                        name:'等待',
                        type:'line',
                        stack: '总量',
                        showSymbol: false,
                        symbolSize: 2,
                        lineStyle:{
                            normal: {
                                color: 'rgb(243, 98, 101)',
                                width:1
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(243,98,101)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(243,98,101)'
                                }])
                            }
                        },
                        data:this.chartData[0]
                    },
                    {
                        name:'用户I/O',
                        type:'line',
                        stack: '总量',
                        showSymbol: false,
                        symbolSize: 2,
                        lineStyle:{
                            normal: {
                                color: 'rgb(113, 235, 134)',
                                width:1
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(113,235,134)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(113,235,134)'
                                }])
                            }
                        },
                        data:this.chartData[1]
                    },
                    {
                        name:'CPU',
                        type:'line',
                        stack: '总量',
                        showSymbol: false,
                        symbolSize: 2,
                        lineStyle:{
                            normal: {
                                color: 'rgb(238, 154, 58)',
                                width:1
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(238, 154, 58)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(238, 154, 58)'
                                }])
                            }
                        },
                        data:this.chartData[2]
                    },
                    {
                        name:'CPU内核',
                        type:'line',
                        stack: '总量',
                        showSymbol: false,
                        symbolSize: 2,
                        lineStyle:{
                            normal: {
                                color: 'rgb(84, 187, 246)',
                                width:1
                            }
                        },
                        areaStyle: {
                            normal: {
                                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: 'rgb(84, 187, 246)'
                                }, {
                                    offset: 1,
                                    color: 'rgb(84, 187, 246)'
                                }])
                            }
                        },
                        data:this.chartData[3]
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
                'listInitUrl': this.baseUrl + '../../src/mockData/toolManage/listData.json'  //页面加载时获取初始化列表接口
            };
            $('.alert').draggable();                                            //弹出框可拖动
            this.initList();
        },
        initList: function(curPage, sortColumn){
            var slipCount = $('#slipCount').val(),
                searchContent = $('#search').val();
                self = this;
            $('#J_listContent').html("");
            $.ajax({
                url: this.apiUrl.listInitUrl,
                type: 'GET',
                data: {
                    'current':curPage || 1,
                    'slip': slipCount,
                    'search': searchContent,
                    'sortColumn': sortColumn? sortColumn : ''
                },
                dataType: 'json',
                success: function(data){
                    var t=_.template($("#T_list_template").html());
                    $('#J_listContent').append(t({"data":data.data}));
                    self.structPager(data.currentPage,data.totalPage,data.slipCount);
                    $('[data-toggle="popover"]').popover();
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
    var chartCfg = {
            'divId': 'J_chart_performance',
            'title': '性能'
        },
        chartObj = new EchartsCompoent(chartCfg);
    chartObj.init();

    var sqlDetail = new MonitorSqlDetailManage();
    sqlDetail.init();
})(jQuery);
