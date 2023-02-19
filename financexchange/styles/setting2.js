$(document).ready(function(){
	wow = new WOW(
      {
        animateClass: 'animated',
        offset:       100,
        callback:     function(box) {
          console.log("WOW: animating <" + box.tagName.toLowerCase() + ">")
        }
      }
    );
    wow.init();

	var percent 	= [100,120,150,200,250,300];
	var minMoney 	= [200,1001,5001,10001,25001,50001];
	var maxMoney	= [1000,5000,10000,25000,50000,5000000];

	$("#money").val(minMoney[0]);
	console.log($("#money").val(minMoney[0]));
	
	//Calculator
	function calc(){
		money = parseFloat($("#money").val());
		id = -1;
		var length = percent.length;
		var i = 0;
		do {
			if(minMoney[i] <= money && money <= maxMoney[i]){
				id = i;
				i = i + length;
			}
			i++
		}
		while(i < length)
		
		if(id != -1){
			profitDaily = money / 100 * percent[id];
			profitDaily = profitDaily.toFixed(2);
			profitWeekly = profitDaily * 7;
			profitWeekly = profitWeekly.toFixed(2);
			profitMonthly = profitDaily * 30;
			profitMonthly = profitMonthly.toFixed(2);


			if(money < minMoney[id] || isNaN(money) == true){
				$("#profitDaily").text("Error!");
				$("#profitWeekly").text("Error!");
				$("#profitMonthly").text("Error!");
			} else {
				$("#profitDaily").text(profitDaily);
				$("#profitWeekly").text(profitWeekly);
				$("#profitMonthly").text(profitMonthly);
				
			}
		} else {
			$("#profit").text("Error!");
			$("#profitDaily").text("Error!");
			$("#profitWeekly").text("Error!");
			$("#profitMonthly").text("Error!");
		}
	}
	if($("#money").length){
		calc();
	}
	$("#money, #days").keyup(function(){
		calc();
	});
});