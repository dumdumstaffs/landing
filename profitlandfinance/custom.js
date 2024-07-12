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
Feedback User
---------------------------- */    
function feedback(){

    let firstname = $("input[name=firstname]").val();
    let lastname = $("input[name=lastname]").val();
    let email = $("input[name=email]").val();
    let message = $("textarea[name=message]").val();
    


    if(firstname == "" ||firstname == null ){ toastAlert(true,"top-end",false,3000,"info","Please Fill Your First Name"); return; }
    if(lastname == "" ||lastname == null ){ toastAlert(true,"top-end",false,3000,"info","Please Fill Your Last Name"); return; }     
    if(email == "" ||email == null ){ toastAlert(true,"top-end",false,3000,"info","Please Fill Your Email Address"); return; }
    if(message == "" ||message == null ){ toastAlert(true,"top-end",false,3000,"info","Please Fill Your Message"); return; }
    

    let form = $('form')[0]; // You need to use standard javascript object here
    let formData = new FormData(form);

    $.ajax({
        url : "../apps/login/feedback2.php",
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
          else {
            Swal.fire({
              icon: 'info',
              title: 'Submited',
              text: 'Your feedback has been sent Thank you for choosing Tradeprofxsignals',
              footer: 'Copyright &copy, 2021. All right reserved. Tradeprofxsignals'
            })
            setTimeout(function(){ window.location = "index.php"} , 2500);  
          }
          
        }
      })     
  
    }