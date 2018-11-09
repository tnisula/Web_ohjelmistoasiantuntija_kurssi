//The ready function will be triggered when DOM is ready
$(document).ready(function() {
    console.log('second page ready');
    $("#mylist").listview({filter:true,autodividers:true});
    
    $('#addBtn').on('click',function(){
        if(item.value.length > 0)
        {
            $('#mylist').append('<li><a href="#">' + item.value + '</a></li>');
            $('#mylist').listview('refresh');
        }
        else{
            alert('Item name must be given!');
        }
    });
    
    $('#saveBtn').on('click',function(){
        console.log('save pressed');
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = responseReady;
        xhr.open("POST","/save_list",true);
        xhr.setRequestHeader('Content-Type',"application/json");
        var array = $('li').children();
        var itemArray = new Array();
        for(var i = 0; i < array.length; i++){
            itemArray.push(array[i].innerText.trim());
        }
        console.log(itemArray);
        xhr.send(JSON.stringify(itemArray));
    });
    
    function responseReady(event){
        console.log('it is ready');
    }
});


