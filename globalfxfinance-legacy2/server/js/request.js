$(document).ready(function($) {
	$("#loginForm").submit(function(event) {
		event.preventDefault();
       

		$.ajax({
			url: 'server/classes/handleRequest.php?_mode=user-login',
			type: 'POST',
			dataType: 'json',
			data: $(this).serialize(),
		})
		.done(function(response) {
            // console.log(resp)
            if(response.input=="email" && response.status==0){
                $("#loginErr").addClass('alert alert-danger');
			     $("#loginErr").html(response.message);
            }
            else if(response.input=="password" && response.status==0){
                $("#loginErr").addClass('alert alert-danger');
                 $("#loginErr").html(response.message);
                
            }
            else if (response.input=="details" && response.status==0) {
            	$("#loginErr").addClass('alert alert-danger');
                 $("#loginErr").html(response.message);
                
                	
                
            

            }
            else if (response.input=="details" && response.status==1) {
                $("#loginErr").addClass('alert alert-success');
                 $("#loginErr").html(response.message);
                 
               var email= response.email;
                var password = response.password;
                window.location = "me/";
                
            

            }

            else{
                
                $("#loginErr").html("please check what you are doing");
                
                // $("#spanName").html(resp.firstName)
                // //alert("hello");
                // $('#myModal').modal("show");
                                
            }
        }).fail(function(error) {
            console.log(error)
        });
    });


    $("#registerForm").submit(function(event) {
        event.preventDefault();
        $.ajax({
            url: 'server/classes/handleRequest.php?_mode=user-register',
            type: 'POST',
            dataType: 'json',
            data: $(this).serialize(),
        })
        .done(function(response) {
             // console.log(response)
            if(response.input=="name" && response.status==0){
                $("#registerResponse").addClass('alert alert-danger');
                $("#registerResponse").html(response.message);
            }
            else if ( response.status==1) {
                $("#registerResponse").removeClass('alert alert-danger');
                $("#registerResponse").addClass('alert ');
                $("#registerResponse").html(response.message);
                alert("Your registration was successful, please proceed to the login page and enter your email and password")
                window.location = "login.php";
            }

            else{
                
                $("#registerResponse").html("please check what you are doing");
                
                // $("#spanName").html(resp.firstName)
                // //alert("hello");
                // $('#myModal').modal("show");
                                
            }
        }).fail(function(error) {
            console.log(error)
        });
    });







	

		$("#paymentRequestForm").submit(function(event) {
		event.preventDefault();

		$.ajax({
			url: 'server/handle_request.php?_mode=make-payment-form',
			type: 'POST',
			dataType: 'json',
			data: $(this).serialize(),
		})
		.done(function(response) {
            // console.log(resp)
            if(response.input=="name" && response.status==0){
                $("#paymentResponse").addClass('alert alert-danger');
			$("#paymentResponse").html(response.message);
            }
            else if ( response.status==1) {
            	$("#paymentResponse").removeClass('alert alert-danger');
            	$("#paymentResponse").addClass('alert alert-success');
                $("#paymentResponse").html(response.message);
                
            }

            else{
                
                $("#paymentResponse").html("please check what you are doing");
                
                // $("#spanName").html(resp.firstName)
                // //alert("hello");
                // $('#myModal').modal("show");
                                
            }
        }).fail(function(error) {
            console.log(error)
        });
    }) ;


		$("#frmPremiumServices").submit(function(event) {
		event.preventDefault();

		$.ajax({
			url: 'server/handle_request.php?_mode=frmPremiumServices',
			type: 'POST',
			dataType: 'json',
			data: $(this).serialize(),
		})
		.done(function(response) {
            // console.log(resp)
            if(response.input=="name" && response.status==0){
                $("#premiumResponse").addClass('alert alert-danger');
			$("#premiumResponse").html(response.message);
            }
            else if ( response.status==1) {
            	$("#premiumResponse").removeClass('alert alert-danger');
            	$("#premiumResponse").addClass('alert alert-success');
                $("#premiumResponse").html(response.message);
                
            }

            else{
                
                $("#premiumResponse").html("please check what you are doing");
                
                // $("#spanName").html(resp.firstName)
                // //alert("hello");
                // $('#myModal').modal("show");
                                
            }
        }).fail(function(error) {
            console.log(error)
        });
    }) ;
	
});

