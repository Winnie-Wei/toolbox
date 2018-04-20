/**
 * Created on 2017/9/20.
 * 工具管理封装
 * @returns {{version: string, init: init, initList: initList}}
 * @constructor
 */
var ToolManage = function(cfg){
    var toolInfo = {
        version: '0.0.1',
        description: 'Tool Manage Config',
        init: function () {
            this.baseUrl = '';
            this.apiUrl = {
                'listInitUrl': this.baseUrl + '../../src/mockData/toolManage/listData.json',  //页面加载时获取初始化列表接口
                'editInitUrl': this.baseUrl + '../../src/mockData/toolManage/editData.json',  //编辑接口
                'addConfigUrl': this.baseUrl + 'addConfigInfo',                 //添加接口
                'updateConfigUrl': this.baseUrl + 'updateConfigInfo',           //更新接口
                'delConfigUrl': this.baseUrl + 'delConfigUrl'                   //删除接口
            };
            this.validateService = cfg.validateService;
            $('.alert').draggable();                                            //弹出框可拖动
            this.initList();
            this.initListener();
        },
        initListener: function(){
            var self = this;
            //改变每页条数重启获取列表数据
            $('#slipCount').change(function(){
                self.initList(1);
            });

            //搜索
            $('#search').on('keypress',function(event){
                self.initList(1);
            });

            //全选或不
            $('#J_selectAll').on('click',function(event){
                var flag = event.target.checked;
                if(flag){
                    $("[class = select-one]:checkbox").prop("checked", true);
                }else{
                    $("[class = select-one]:checkbox").prop("checked", false);
                }
            });

            $('.chooseAll').on('click',function(event){
                $('#J_selectAll').prop("checked", true);
                $("[class = select-one]:checkbox").prop("checked", true);
            });

            $('.removeAll').on('click',function(event){
                $('#J_selectAll').prop("checked", false);
                $("[class = select-one]:checkbox").prop("checked", false);
            });


            //返回
            $('.back').click(function(){
                window.history.go(-1);
            });

            //关闭弹窗
            $('body').on('click','.close-win',function(){
                $('.alert').addClass('hidden');
                self.initList();
            });

            //点击表头排序
            $('.sort').click(function(event){
                var sortHtml = event.target.innerHTML;
                self.initList(1, sortHtml);
            });

            //点击添加
            $('.J_config_add').on('click',function(event){
                self.clickAdd();
            });

            //点击编辑
            $('body').on('click','.J_config_edit',function(event){
                var dataHost = event.target.dataset.host,
                    dataInst = event.target.dataset.inst;
                self.clickEdit();
            });

            //点击删除
            $('body').on('click','.J_config_del',function(event){
                var dataHost = event.target.dataset.host,
                    dataInst = event.target.dataset.inst;
                self.clickDel(dataHost, dataInst);
            });

            //点击确认删除
            $('.confirm-del').on('click',function(event){
                self.delConfig();
            });

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
        },
        bandingFormSave: function(fn){
            $('body').off('click','#J_form_save');
            $('body').on('click','#J_form_save',fn);
        },
        clickAdd: function(){
            var self = this;
            $('#J_configFormTitle').html("添加工具管理配置");
            $('#J_configFormDiv').html("");
            $('#J_configForm_popWin').removeClass('hidden');
            var t=_.template($("#T_form_template").html());
            $('#J_configFormDiv').append(t({"data":{}}));
            $("#J_form_errorMsg").html('');
            this.bandingFormSave(function(){self.addConfig(self)});
        },
        clickEdit: function(){
            var self = this;
            $('#J_configFormTitle').html("编辑工具管理配置");
            $('#J_configFormDiv').html("");
            $.ajax({
                url: this.apiUrl.editInitUrl,
                type: 'GET',
                data: {
                },
                dataType: 'json',
                success: function(data){
                    $('#J_configForm_popWin').removeClass('hidden');
                    var t=_.template($("#T_form_template").html());
                    $('#J_configFormDiv').append(t({"data":data}));
                    $("#J_form_errorMsg").html('');
                    self.bandingFormSave(function(){self.updateConfig(self)});
                },
                error: function(){
                    $('#J_warnInfo').removeClass('hidden');
                    $('#J_warnContent').html('网络错误，请稍后重试');
                }
            });
        },
        clickDel: function(host, inst){
            $('#J_confirmWin').removeClass('hidden');
            $('#J_confirmContent').html('确定删除所选项吗？');
            this.host = host;
            this.inst = inst;
        },
        addConfig: function(self){
            if(!self.validateForm()){
                return;
            }
            $('#J_configForm_popWin').addClass('hidden');
            $.ajax({
                url: this.apiUrl.addConfigUrl,
                type: 'POST',
                data: $("#J_configForm").serialize(),
                dataType: 'json',
                success: function (data) {
                    $('#J_warnInfo').removeClass('hidden');
                    $('#J_warnContent').html('添加成功！');
                },
                error: function () {
                    $('#J_warnInfo').removeClass('hidden');
                    $('#J_warnContent').html('网络错误，请稍后重试');
                }
            });
        },
        updateConfig: function(self){
            if(!self.validateForm()){
                return;
            }
            $('#J_configForm_popWin').addClass('hidden');
            $.ajax({
                url: this.apiUrl.updateConfigUrl,
                type: 'POST',
                data: $("#J_configForm").serialize(),
                dataType: 'json',
                success: function (data) {
                    $('#J_warnInfo').removeClass('hidden');
                    $('#J_warnContent').html('更新成功！');
                },
                error: function () {
                    $('#J_warnInfo').removeClass('hidden');
                    $('#J_warnContent').html('网络错误，请稍后重试');
                }
            });
        },
        delConfig: function(){
            var self = this;
            $('#J_confirmWin').addClass('hidden');
            $.ajax({
                url: this.apiUrl.delConfigUrl,
                type: 'POST',
                data: {'host':this.host,'inst':this.inst},
                dataType: 'json',
                success: function (data) {
                    $('#J_warnInfo').removeClass('hidden');
                    $('#J_warnContent').html('删除成功！');
                },
                error: function () {
                    $('#J_warnInfo').removeClass('hidden');
                    $('#J_warnContent').html('网络错误，请稍后重试');
                }
            });
        },
        validateForm: function(self){
            var x=$("#J_configForm").serializeArray();
            var flag = true,
                errorMsg = '',
                self = this;
            $.each(x, function(i, field){
                flag = self.validateService.validEmpty(field.value);
                switch(field.name) {
                    case 'db_name':
                        errorMsg = flag? '':'目标数据库名称不能为空！';
                        break;
                    case 'inst_name':
                        errorMsg = flag? '':'目标数据库节点名称不能为空！';
                        break;
                    case 'oracle_user':
                        errorMsg = flag? '':'目标数据库登录用户名不能为空！';
                        break;
                    case 'oracle_password':
                        errorMsg = flag? '':'目标数据库登录密码不能为空！';
                        break;
                    case 'host':
                        // if(flag) {
                        //     flag = self.validateService.validIp(field.value);
                        //     errorMsg = flag? '':'目标服务器主机IP格式不正确！';
                        // }else{
                        //     errorMsg = '目标服务器主机不能为空！';
                        // }
                        errorMsg = flag? '':'目标服务器主机不能为空！';
                        break;
                    case 'oracle_port':
                        if(flag) {
                            flag = self.validateService.validPort(field.value);
                            errorMsg = flag? '':'目标数据库端口号格式不正确！';
                        }else{
                            errorMsg = '目标数据库端口号不能为空！';
                        }
                        break;
                    case 'is_it_rac':
                        break;
                    case 'inst_id':
                        flag = self.validateService.validNumber(field.value, 'integer');
                        errorMsg = flag? '':'目标数据库节点ID格式不正确！';
                        break;
                    case 'os_port':
                        if(flag) {
                            flag = self.validateService.validPort(field.value);
                            errorMsg = flag? '':'目标服务器端口号格式不正确！';
                        }else{
                            errorMsg = '目标服务器端口号不能为空！';
                        }
                        break;
                    case 'os_user':
                        errorMsg = flag? '':'目标服务器登录用户不能为空！';
                        break;
                    case 'os_password':
                        errorMsg = flag? '':'目标服务器登录密码不能为空！';
                        break;
                    case 'os_directory':
                        if(flag) {
                            flag = self.validateService.validPath(field.value);
                            errorMsg = flag? '':'目标服务器目录格式不正确,正确格式如：/home/test或E:\\pool！';
                        }else{
                            errorMsg = '目标服务器目录不能为空！';
                        }
                        break;
                    default:
                        flag = true;
                }
                if(!flag){
                    $("#J_form_errorMsg").html(errorMsg);
                    return false;
                }
            });
            return flag;
        }
    };
    return toolInfo;
};

/**
 * 渲染初始化
 */
(function($, Validate){
    var validate = new Validate(),
        cfg = {validateService: validate},
        toolManage = new ToolManage(cfg);
    toolManage.init();
})(jQuery, Validate);
