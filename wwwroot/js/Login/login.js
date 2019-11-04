var userRole;
var menuName;
var menuURL;
var menuFileName;
function GetTitle(getmenuName,getuserRole,getmenuURL,getmenuFileName)
{
    $("#result").empty();
    $("#user-id").val(""); 
    $("#title") .html(getmenuName);
    menuName = getmenuName;
    userRole = getuserRole;
    menuURL = getmenuURL;
    menuFileName = getmenuFileName;
}

function LogIn()
{    
    if(document.getElementById('user-id').value=="")
    {
        alert("Hãy nhập mã nhân số viên!"); 
        return;
    }
    $.ajax({    
        url:'/Home/CheckUser', 
        data: {
            UserRole: userRole,          
            UserId : document.getElementById('user-id').value,
        },
        cache:'false',
        dataType:'json',        
        type:'POST',      
        success: function(results) { 
            if(results == "OK")
            {                       
                window.location.assign("/" + menuURL + "/" + menuFileName); 
            }   
            else
            {
                alert("User " + document.getElementById('user-id').value + " " + results + " vào chức năng " + menuName);      
            }                             
        }
    })     
}

function runButton(e) {   
    if (e.keyCode == 13) {
        document.getElementById("btnCloseModal").click();
        return false;
    }
}