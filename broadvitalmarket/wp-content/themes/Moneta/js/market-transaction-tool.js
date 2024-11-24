
jQuery(document).ready(function($){
    let webSocket = null;
    let isAjax = false;
    function getSymbolData() {
        $('.loading-box').css('display','flex');
        if(webSocket) {
            webSocket.close();
            isAjax = false;
        }
    
        function getChangeValue(ask, openPrice) {
            let changeValue = (ask - openPrice).toFixed(3);
            let changeString = changeValue;
            if (changeValue > 0) changeString = '+' + changeValue;
            return {
                changeValue,
                changeString,
            };
        }
        // function getPercentageValue(changeValue, openPrice) {
        //     let isJust = '';
        //     let percentageValue = (changeValue / openPrice) * 100;
        //     if (percentageValue > 0 && isFinite(percentageValue)) {
        //         isJust = 1;
        //         percentageValue = '+' + (parseInt(percentageValue * 100) / 100).toFixed(3) + '%';
        //     } else if (percentageValue <= 0 && isFinite(percentageValue)) {
        //         percentageValue = (parseInt(percentageValue * 100) / 100).toFixed(3) + '%';
        //         isJust = -1;
        //     } else {
        //         percentageValue = '-';
        //         isJust = 0;
        //     }
        //     return {percentageValue, isJust};
        // }
        $.ajax({
                url: `/data/encryption.php?v=${+new Date()}`,
                success: msg => {
                    webSocket = new WebSocket('wss://feeds.vqfx.com/api/v1/tick?token=' + msg);
                    let screenWidth = document.body.clientWidth || window.screen.width;
                    let symbolList = [];
                    $('.data-box .data-list').each(function() {
                        if($(this).attr('data-type')) {
                            symbolList.push($(this).attr('data-type'))
                        }
                    })
                    webSocket.onopen = () => {
                        webSocket.send(`{"Server": "VAU","Symbols":${JSON.stringify(symbolList)}}`);
                    };
                    webSocket.onmessage = ({ data }) => {
                        let newData = JSON.parse(data);
                        newData.forEach(item => {
                            let symbolName = item.Symbol;
                            let trEl = $(`.data-box div[data-type="${symbolName}"]`);
                            let bidEl = $(`.data-box div[data-type="${symbolName}"] .bid-value`);
                            let spreadsEl = $(`.data-box div[data-type="${symbolName}"] .spreads-value`)
                            let askEl = $(`.data-box div[data-type="${symbolName}"] .ask-value`);

                            let bidValue = item.Bid;
                            let askValue = item.Ask;
                            
                            let spreadValue = parseFloat(askValue - bidValue);
                            
                            if(symbolName == "EURUSD+" || symbolName == "AUDUSD+" || symbolName == "GBPUSD+" || symbolName == "EURGBP+" || symbolName == "USDCAD+") spreadValue = spreadValue*10000
                            if (symbolName == "USDJPY+" || symbolName =="COPPER-C" || symbolName =="GAS") spreadValue = spreadValue*100
                            if (symbolName == "CL-OIL" || symbolName == "XAGUSD+" || symbolName == "XAUUSD+" || symbolName == "GDX.m" || symbolName == "ICLN.m" || symbolName == "BKCH.m" || symbolName == "SDS.m")spreadValue = spreadValue*10

                            let { changeValue, changeString } = getChangeValue(item.Ask, item.OpenPrice);

                            let oldBidValue = bidEl.attr('data-value') || 0;
                            let oldAskValue = askEl.attr('data-value') || 0;

                            if (Number(oldBidValue) > bidValue) bidEl.parent('.bid').attr('class', 'bid deficit');
                            else if(Number(oldBidValue) < bidValue) bidEl.parent('.bid').attr('class', 'bid profit');
                            else if (Number(changeValue) === 0 || changeValue === '-') bidEl.parent('.bid').attr('class', 'bid unbound');


                            if (Number(oldAskValue) > askValue) askEl.parent('.ask').attr('class', 'ask deficit');
                            else if(Number(oldAskValue) < askValue) askEl.parent('.ask').attr('class', 'ask profit');
                            else if (Number(changeValue) === 0 || changeValue === '-') askEl.parent('.ask').attr('class', 'ask unbound');


                            bidEl.text(bidValue.toFixed(3)).attr('data-value',bidValue);
                            spreadsEl.text(spreadValue.toFixed(1)).attr('data-value',spreadValue);
                            askEl.text(askValue.toFixed(3)).attr('data-value',askValue);

                        })
                        if(!isAjax) {
                            $('.loading-box').hide()
                            isAjax = true
                        }
                    }
                }

        })
        
    }
    getSymbolData();
});