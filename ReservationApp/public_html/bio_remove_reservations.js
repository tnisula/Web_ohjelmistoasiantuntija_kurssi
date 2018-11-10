var xhr = new XMLHttpRequest();
window.onload = function(event){
    xhr.onreadystatechange = responseReady;
    xhr.open('GET','/seats',true);
    xhr.send();
};

function responseReady(event){
    if(xhr.readyState === 4 && xhr.status === 200)
    {
        if(event.target.responseText.match(/html/i)){
            document.write(event.target.responseText);
            return;
        }
        var data = JSON.parse(event.target.responseText);
        // main_h.innerHTML = "Welcome to " + data[0].place_id + " remove seat reservation.";
        main_h.innerHTML = "Admin Remove Reservations in " + data[0].place_id + ".";
        var row = document.createElement('tr');
        for(var i = 0; i < data[0].place.length; i++){

            if(i % 10 === 0)
            {
                row = document.createElement('tr');
                my_table.appendChild(row);
            }
            var col = document.createElement('td');
            col.onclick = columnClicked;
            col.innerHTML = '<b>' + data[0].place[i].seat + '</b>';
            col.title = " Price: " + data[0].place[i].placePrice;
            col.reserved = data[0].place[i].reserved; 
            if(data[0].place[i].reserved === true)
            {
                col.style.backgroundColor = "red";
            }
            col.id = data[0].place[i]._id;
            row.appendChild(col);
        }
    }
}
function columnClicked(event){
    console.log(event.target.id);
    if(!event.target.reserved === true)
    {
        alert('Sorry! This place is not reserved! You cannot remove reservation!');
        return;
    }
    var answ = window.confirm("Do you want to remove reservation " + event.target.innerText + " ?");
    if(answ === true){
        event.target.style.backgroundColor = 'white';
        xhr.onreadystatechange = reservationDone;
        xhr.open('PUT','/remove_seat/:id:' + event.target.id,true);
        xhr.send();
    }
}

function reservationDone()
{
    if(xhr.readyState === 4 && xhr.status === 200){
        console.log(xhr.responseText);
    }
}

