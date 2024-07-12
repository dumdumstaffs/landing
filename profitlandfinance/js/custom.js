/*--------------------------
Simplified sweetaalert
---------------------------- */
function toastAlert(bool1,pos,bool2,time,kind,msg){

    const Toast = Swal.mixin({
      toast: bool1,
      position: pos,
      showConfirmButton: bool2,
      timer: time
    });

    Toast.fire({
      type: kind,
      title: msg
    })
    }




/*--------------------------
Register User
---------------------------- */    
function validateEmail(email) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}


function subReg(){

    let fullname = $("input[name=fullname]").val();
    let username = $("input[name=username]").val();
    let email_address = $("input[name=email_address]").val();
    let phone = $("input[name=phone]").val();
    let gender = $("#gender").val();
    let currency = $("#currency").val();
    let country = $("#country").val();
    let password = $("input[name=password]").val();
    let cpassword = $("input[name=cpassword]").val();


    if(fullname == "" ||fullname == null ){ toastAlert(true,"top-end",false,3000,"info","Please Fill Your Fullname"); return; }
    if(username == "" ||username == null ){ toastAlert(true,"top-end",false,3000,"info","Please Fill Your Username"); return; }     
    if(email_address == "" ||email_address == null ){ toastAlert(true,"top-end",false,3000,"info","Please Fill Your Email Address"); return; }
    if ( validateEmail(email_address) !== true ){ toastAlert(true,"top-end",false,3000,"info","Sorry This email is Invalid"); return; }
    if(phone == "" ||phone == null ){ toastAlert(true,"top-end",false,3000,"info","Please Fill Your Phone Number"); return; }
    if(gender == "" ||gender == null){ toastAlert(true,"top-end",false,3000,"info","Please Fill Select Your Gender"); return; }  
    if(currency == "" ||currency == null){ toastAlert(true,"top-end",false,3000,"info","Please Select Your Currency"); return; }  
    if(country == "" ||country == null ){ toastAlert(true,"top-end",false,3000,"info","Please Fill Your Country"); return; }  
    if(password == "" ||password == null ){ toastAlert(true,"top-end",false,3000,"info","Please Fill Your Password"); return; }
     if(password.length<=7 ||password == null ){ toastAlert(true,"top-end",false,3000,"info","Please your password should be at least 8 characters"); return; }  
     if( ! password.match(/[A-Z]/g) ){ toastAlert(true,"top-end",false,3000,"info","Please your password must contain one Upper case letter"); return; }
     if( ! password.match(/[a-z]/g) ){ toastAlert(true,"top-end",false,3000,"info","Please your password must contain a Lower case letter"); return; }  
     if(cpassword == "" ||cpassword == null ){ toastAlert(true,"top-end",false,3000,"info","Please Fill Your Password"); return; }  
    if(password != cpassword ){ toastAlert(true,"top-end",false,3000,"info","Both Passowrds should match please"); return; }  

    if( document.getElementById("accept-terms").checked == true ){}else{

      toastAlert(true,"top-end",false,3000,"info","Please Agree To our Terms And Policies"); return;
  
    }
    let form = $('form')[0]; // You need to use standard javascript object here
    let formData = new FormData(form);

    $.ajax({
      url : "apps/login/signup.php",
      type : "POST",
      contentType: false, 
      processData: false,
      data : formData,
      success : function(data){
        if( data == "user exist" ){
          toastAlert(true,"top-end",false,3000,"info","A user with this email already exist");
          return; 
        }
        else if( data == "error" ){
          toastAlert(true,"top-end",false,3000,"error","Something went wrong, Please try again");
          return;
        }
        else{
          toastAlert(true,"top-end",false,3000,"success","Welcome "+email);
          setTimeout(function(){ window.location = "user/verify.php"} , 3200);
        }
      }
    })     

  }

/*--------------------------
Login User
---------------------------- */   
  function sublog(){

  let email = $("input[name=email]").val();
  let password = $("input[name=password]").val();

  if(email == "" ||email == null ){ toastAlert(true,"top-end",false,3000,"info","Please Fill Your Email Address"); return; }    
  if ( validateEmail(email) !== true ){ toastAlert(true,"top-end",false,3000,"info","Sorry This email is Invalid"); return; }
  if(password == "" ||password == null ){ toastAlert(true,"top-end",false,3000,"info","Please Fill Your Password"); return; }

  let form = $('form')[0]; // You need to use standard javascript object here
  let formData = new FormData(form);

  $.ajax({
    url : "apps/login/login.php",
    type : "POST",
    contentType : false,
    processData : false,
    data : formData,
    success : function(data){
      let info = data.trim();
      if( info == "user dosent exist" ){
        toastAlert(true,"top-end",false,3000,"error","Sorry this user dosent exist"); 
        return;
      }
      else if( info == "login details incorrect" ){
        toastAlert(true,"top-end",false,3000,"error","Sorry Login details INCORRECT"); 
        return;
      }
      else if( info == "unverrified" ){
         window.location = "user/verify.html"; 
      }
      else if( info == "blocked" ){
          window.location = "user/update.html";
      }
      else if( info == "restricted" ){
        Swal.fire({
          icon: 'info',
          title: 'Account Restricted ',
          text: 'your account has been restricted,due to inappropriate conduct contact support for more information',
          footer: 'Copyright &copy, 2021. All right reserved. Tradeprofxsignals'
        })
        setTimeout(function(){ location.reload()} , 3050);
      }
      else if( info == "success" ){
        toastAlert(true,"top-end",false,3000,"success","Welcome "+email);
        setTimeout(function(){ window.location = "user/"} , 3200);
      }
    }
  })
}

/*--------------------------
Verification Scam
---------------------------- */  
  function scam(){
    let blah = $("input[name=profile-pic]").val();
    if( blah == "" || blah == null ){ toastAlert(true,"top-end",false,3000,"info","Please Select an image"); return; }
    Swal.fire({
      icon: 'info',
      title: 'Submited',
      text: 'Our Customer care agent will attend to you shotly',
      footer: 'Copyright &copy; 2013 - 2020. All right reserved. Tradeprofxsignals'
    })
    setTimeout(function(){ window.location = "index.php"} , 2500);      
  }

/*--------------------------
Forget Email
---------------------------- */  
function validateEmail(email) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}



  function fogpwd(){
    let email = $('input[name=email]').val();
    if(email == "" ||email == null ){ toastAlert(true,"top-end",false,3000,"info","Please Fill Your Email Address"); return; }
    if ( validateEmail(email) !== true ){ toastAlert(true,"top-end",false,3000,"info","Sorry This email is Invalid"); return; }
    $.ajax({
      url: "apps/login/forgetpassword.php",
      type:"POST",
      data:{email:email},
      success:function(data){
        let info = data.trim();
        if( info == "user dosent exist" ){
          toastAlert(true,"top-end",false,3000,"error","Sorry this user dosent exist"); 
          return;
        }
        else if( info == "success" ){
          Swal.fire({
            icon: 'info',
            title: 'Submited',
            text: 'A mail has been sent to your account please, go to your mail',
            footer: 'Copyright &copy, 2020. All right reserved. Tradeprofxsignals'
          })
          setTimeout(function(){ window.location = "index.php"} , 2500);  
        }
        else{
          toastAlert(true,"top-end",false,3000,"info","Something Went Wrong, Please Try Again "); 
          return;          
        }        
      }
    })
  }



/*--------------------------
Reset Password
---------------------------- */ 




function resetpass(){
  let email = $("input[name=email]").val();
  let pass = $("input[name=pass]").val();
  let newpass = $("input[name=newpass]").val();
  
  if(pass == "" ||pass == null ){ toastAlert(true,"top-end",false,3000,"info","Please Enter Your New Password"); return; }
  if(pass.length<=7 ||pass == null ){ toastAlert(true,"top-end",false,3000,"info","Please your password should be at least 8 characters"); return; }  
  if( ! pass.match(/[A-Z]/g) ){ toastAlert(true,"top-end",false,3000,"info","Please your password must contain one Upper case letter"); return; }
  if( ! pass.match(/[a-z]/g) ){ toastAlert(true,"top-end",false,3000,"info","Please your password must contain a Lower case letter"); return; }
  if(newpass == "" ||newpass == null ){ toastAlert(true,"top-end",false,3000,"info","Please Comfirm Your Password"); return; }
  if(pass != newpass ){ toastAlert(true,"top-end",false,3000,"info","Both Passowrds should match Please."); return; }

  $.ajax({
    type : "POST",
    url : "apps/login/resetpassword.php",
    data : {email:email,pass:pass},
    success : function(data){
      let info = data.trim();
      if( info == "success" ){
        Swal.fire({
          icon: 'success',
          title: 'Done',
          text: 'Password Reset Successfull',
          footer: 'Copyright &copy, 2020. All right reserved. Tradeprofxsignals'
        })
        setTimeout(function(){ window.location = "indxef82.php"} , 2500);          
      }
      else{
          toastAlert(true,"top-end",false,3000,"info","Something Went Wrong, Please Try Again "); 
          return; 
      }
    }
  })

}