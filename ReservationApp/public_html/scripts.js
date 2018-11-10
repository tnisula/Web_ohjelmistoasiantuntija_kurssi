window.onload = function(event){
    
    loginBtn.onclick = logIn;
    
    function logIn(event)
    {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = responseReady;
        xhr.open('POST','/login',true);
        xhr.setRequestHeader('Content-Type','application/json');
        
        var dataJSON = {
            first : firstname.value,
            last : lastname.value
        };
        
        xhr.send(JSON.stringify(dataJSON));
        event.preventDefault();
    }
    
    function responseReady(event)
    {
        if(event.target.readyState === 4 && event.target.status===200)
        {
               if(!event.target.responseText.match(/html/i))
               {
                    resp_status.innerHTML = event.target.responseText; 
               }
               else
               {
                    document.write(event.target.responseText);
               }
        }
    }
};


