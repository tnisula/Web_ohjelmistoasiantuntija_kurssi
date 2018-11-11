var xhr = new XMLHttpRequest();
var updateText;
 window.onload = function(event){

    btnSearch.onclick = searchItems;
    xhr.onreadystatechange = responseReady;
    xhr.open("GET","/read_tweets",true);
    xhr.send();

    function responseReady(){

        if(xhr.readyState===4 && xhr.status === 200){
            var data = JSON.parse(xhr.responseText);
            console.log(data.length)
            for(var i = 0; i < data.length; i++){
                console.log('CREATE ELEMENT');
                var listElem = document.createElement('li');
                listElem.style="margin-bottom: 5px;";
                var details = document.createElement('details');
                var summary = document.createElement('summary')
                summary.innerHTML = '<b>' + data[i].username + '</b>';
                details.appendChild(summary);
                var my_date = document.createElement('p');
                my_date.innerHTML = data[i].created;
                var message = document.createElement('p');
                message.innerHTML = data[i].body;
                message.contentEditable = true;
                message.onblur = saveChanges;

                details.appendChild(my_date);
                details.appendChild(message);
                var deleteButton = document.createElement('input');
                deleteButton.type='button';
                deleteButton.value = "Delete Tweet";
                deleteButton.style="width: 200px;height:30px;border-radius:10px;text-align:center;color:#ffffff;background-color: rgb(245, 12, 12);margin-bottom: 5px;margin-right:15px;";
                deleteButton.id = data[i]._id;
                deleteButton.onclick = deleteTweet;

                var  updateButton = document.createElement('input');
                updateButton.type= 'button';
                updateButton.value = "Update Tweet";
                updateButton.style="width: 200px;height:30px;border-radius:10px;text-align:center;color:#ffffff;background-color:#098d2a;margin-right:15px;";
                updateButton.id = data[i]._id;
                updateButton.onclick = updateTweet;

                details.appendChild(deleteButton);
                details.appendChild(updateButton);
                listElem.appendChild(details);
                tweets.appendChild(listElem);
            }
        }
    }

    function saveChanges(event){
        console.log(event);
        updateText = event.target.innerText;
    }

    function deleteTweet(event)
    {
        xhr.onreadystatechange = delete_ready;
        xhr.open("DELETE","/delete_tweet/:id:" + event.target.id,true);
        xhr.send();
    }

    function delete_ready(event)
    {
        if(xhr.readyState===4 && xhr.status === 200){
            location.reload();
        }
    }

    function update_ready(event)
    {
        if(xhr.readyState===4 && xhr.status === 200){
            location.reload();
        }
    }

    function searchItems(event)
    {
       tweets.innerHTML = "";
        xhr.onreadystatechange = responseReady;
        xhr.open("POST","/filter_tweets",true);
        var my_json_object = {
            data:query.value
        }
        xhr.setRequestHeader("Content-type","application/json");
        xhr.send(JSON.stringify(my_json_object));
    }

    function updateTweet(event)
    {
        xhr.onreadystatechange = update_ready;
        xhr.open("PUT","/update_tweet/:id:" + event.target.id,true);
        xhr.setRequestHeader("Content-type","application/json");
        var temp = {
            data:updateText
        }
        xhr.send(JSON.stringify(temp));
    }
}


