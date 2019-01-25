/*
 * To Fix Header Or Columns(LEFT Columns) Of Table Object, jQuery PlugIn By KEVIN SHEEP, May 2018
 * Based On jQuery.js, compatibled with chrome, IE 9+
 * 
 */
;
"use strict";

(function($) {
    ////default tdata
    $.fn.tdata = {
         fixColsHead: ".fix-cols-head"
        ,fixCols: ".fix-cols"
        ,fixColsCount: 2    //冻结前fixColsCount列
        ,fixHead: ".fix-head"
        ,fixBody: ".fix-body"
        ,headCell: "th"     //用于计算列宽的容器
        ,PD: 16
        ,needRebuild: false
        ,offsetH: 220
    };

    $.fn.extend({
        ////初始化表格的各种固定操作和尺寸计算
        initFix: function(options) {
            this.tdata = this.extend(this.tdata, options);

            var fn = this,
                fh = fn.tdata.fixHead,
                fb = fn.tdata.fixBody,
                fc = fn.tdata.fixCols,
                fcc = fn.tdata.fixColsCount,
                fch = fn.tdata.fixColsHead;

            ////冻结前两列，暂存宽度
            var headColW = fn.getColW();
            var fixColW = fn.getFixColW(fcc);

            ////设置活动表体的高度、上左边距（pd为表头高、pl为冻结列宽）
            $(fb).css({
            		"height": $(window).height() - fn.tdata.offsetH,
                    "paddingLeft": fixColW,
                    "paddingTop": fn.getFixHeadH()
                })
                .on("scroll", function (){//同步冻结的表头和表列的滚动
                    $(fh).scrollLeft($(this).scrollLeft());
                    $(fc).scrollTop($(this).scrollTop());
                });

            ////设置活动表头的可视宽度、左边距
            $(fh).css({
                "width" : fn.getFixBodySize().w - 1,
                "paddingLeft" : fixColW
            });

            ////设置活动表头、表体的实际宽度
            $(fh + "> table," + fb + "> table").css({
                "width" : headColW + 1
            });

            ////设置冻结表头、表体的实际宽度
            $(fch + "> table," + fc + "> table").css({
                "width" : fixColW + 1
            });

            ////设置冻结表体的宽度、高度、上边距
            $(fc).css({
                "width" : fixColW + 1,//加上表格边框宽度
                "height" : fn.getFixBodySize().h - 1,
                "top": fn.getFixHeadH()
            });

            ////设置冻结表头宽度，加上1条表格边框宽度
            $(fch).width(fixColW + 1);

            //setTimeout(function(){
            	////有竖向滚动条时，手动插入表头占位符
                //if($(".table-patch").length == 0){
                //    var ofb = $(fb).get(0);
                //    var _sw = ofb.offsetWidth - ofb.clientWidth;
                //    var thtml = '<th class="table-patch"><div class="table-cell"></div></th>';
                //    console.log("ofb.offsetWidth,  ofb.clientWidth", ofb.offsetWidth, ofb.clientWidth)
                //    $(fh).find("tr").append(thtml).find(".table-patch").width(_sw);
                //}
            //}, 300);//延迟执行，相当于nextTick()

        } //END OF initFix

        ////取得冻结列的总宽度，参数传入表时前n列
        ,getFixColW: function() {
            var result = 0,
                $fch = $(this.tdata.fixColsHead),
                hc = this.tdata.headCell,
                pd = this.tdata.PD,
                ltstr = "";
            if(arguments.length > 0){//有大于0的整型参数传入时
                ltstr = ":lt(" + arguments[0] + ")";
            }
            $fch.find(hc + ltstr).each(function(index, el) {
                result += parseInt($(el).get(0).width || $(el).get(0).clientWidth) + pd;
            });
            return result;
        }
        ////取得列的总宽度
        ,getColW: function() {
            var result = 0,
                $fh = $(this.tdata.fixHead),
                hc = this.tdata.headCell,
                pd = this.tdata.PD;
            $fh.find(hc).each(function(index, el) {
                result += parseInt($(el).get(0).width || $(el).get(0).clientWidth) + pd;
            });
            return result;
        }

        ////取得固定的表体宽度\高度
        ,getFixBodySize: function() {
            var $fb = $(this.tdata.fixBody),
                $fh = $(this.tdata.fixHead);
            return {
                "w": $fb.get(0).clientWidth - parseInt($fb.css("paddingLeft")),
                "h": $fb.get(0).clientHeight - $fh.get(0).clientHeight
            };
        }

        ////取得冻结的表头高度
        ,getFixHeadH: function() {
            return $(this.tdata.fixHead).get(0).clientHeight;
        }
    }); //extend    
})(jQuery);