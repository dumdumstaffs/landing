



    // $(".rotate_data").css({
    //     "display":"none",
    //     "animation":"none",
    //     "-webkit-animation":"none"
    // });
    // $(".rotate_data_box").css({
    //     "display":"none"
    // });
    jQuery(document).ready(function($){
     
        var symbolArr = $('.product-table-wrap .data-list');
        var changeArr = $(".change .change-value");
        for (var i = 0; i < symbolArr.length; i++) {
            for (var j = 0; j < data.length; j++) {
                if (symbolArr[i].getAttribute("data-type") == data[j].symbol) {
                    var obj=data[j].items[data[j].items.length-1];
                    var num1=math.format(math.chain(math.bignumber(obj.close)).subtract(math.bignumber(obj.open)).done());
                    var num2=math.format(math.chain(math.bignumber(num1)).divide(math.bignumber(obj.open)).done());
                    var num3=toPercent(num2*100);
                    changeArr[i].innerHTML =num3;
    
                    var volume = [];
                    var high = [];
                    var sum = "";
                    sum = data[j].items;
                    var volumeA = [];
                    var highA = [];
                    sum.map(function (item) {
                        volumeA.push(item.close);
    
                    });
    
                    sum.map(function (item) {
    
                        highA.push(item.startTime.slice(11, 18));
                    });
    
                    var line_color="#00EBB6";
                    var shadow_color="#00EBB6";
    
                    if(num3.indexOf("-") > -1){
                        line_color="#FF0033";
                        shadow_color="#FF0033";
                    }
    
                    volume = volumeA;
                    high = highA;
    
                    Chart('echarts-' + data[j].symbol, high, volume, line_color, shadow_color);
    
                }
            }
    
        }
        ColorHref();
    
        function Chart(id, high,  volume, color, shadow) {
            var foreign = document.getElementById(id);
            var myChart = echarts.init(foreign);
            var option = {
                tooltip: {
                    formatter:"<span style='color:#ACACAC'>time</span> <br/>{b} <br/><span style='color:#ACACAC'>price</span> <br/>{c}",
                    trigger: 'axis',
                    backgroundColor: '#fff',
                    borderColor: '#F4F4F9',
                    borderRadius: 4,
                    borderWidth: 1,
                    padding: 15,
                    textStyle: {
                        color: '#000'
                    },
                    position: function (pos, params, el, elRect, size) {
                        console.log();
                        var obj = {  left: pos[0] -100 , top: pos[1] - 140};
                        return obj;
                    },
                },
                grid:{
                    left: 0,
                    top:0,
                    right: 0,
                    bottom: 0
    
                },
                xAxis: {
                    show: false,
                    type: 'category',
                    data: high,
                    min:'dataMin',
                    max:'dataMax',
                    axisTick:{
                            show:false
                        },
                    splitLine: {
                        show: true,
                            lineStyle: {
                            color: '#F4F4F9'
                            }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#4A4A4A',
                            width:0
                            }
    
                    },
                    boundaryGap: false
                },
                yAxis: {
                    show: false,
                    type: 'value',
                    position:'right',
                    min:'dataMin',
                    max:'dataMax',
                        axisTick:{
                            show:false
                        },
                    splitLine: {
                        show: true,
                            lineStyle: {
                            color: '#F4F4F9'
                            }
                    },
                    axisLine:{
                        lineStyle:{
                            color:'#4A4A4A',
                            width:0
                            }
    
                        },
                        splitNumber:3
                },
                series: [{
                    data:volume,
                    type: 'line',
                    smooth: true,
                    symbol: 'none',
                    animationDuration: 1800,
                    animationEasing: "cubicInOut",
                    lineStyle: {
                        color: color,
                        width:1
    
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: shadow
                            }, {
                                offset: 1,
                                color: '#0b1020'
                            }])
                        }
    
                    }
                }]
    
            };
            myChart.clear();
            myChart.setOption(option,true);
            $(window).resize(function () {
                myChart.resize();
            })
    
        }
    
    
        //Up or down text
        function toPercent(point){
    
            var str=Number(point).toFixed(2);
                if(point>0){
                str="+"+str;
            }
            str+="%";
            return str;
        }
        // ups and downs color
        function ColorHref(){
            $(".change .change-value").each(function() {
                var text_color = $(this).html();
                if(text_color.indexOf("+") > -1) {
                    $(this).addClass("green-text")
                }else if(text_color.indexOf("-") > -1){
                    $(this).addClass("red-text")
                }else{
                    $(this).addClass("black-text")
                }
    
            })
        }
    
    })
    
    