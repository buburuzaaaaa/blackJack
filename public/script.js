const login = document.getElementById('bt');
// jquery for frontend
$(document).ready(function(){
      $("h1").hide().delay(500).fadeIn(2000).show(2000).end();
})  
$(document).ready(function(){
    $(".btn").hide().delay(900).fadeIn(2000).show(2000).end()
});
$(document).ready(function(){
    $(".txt-bx").hide().delay(900).fadeIn(2000).show(2000).end()
});
$(document).ready(function(){
    $(".btn1").hide().delay(900).fadeIn(2000).show(2000).end()
});

// for login button if clicked
// button.addEventListener('click', function(){
//     if(login == true){
//         $(document).ready(function(){
//             $(".txt-bx").fadeIn(2000).end()
//         });
//     }
// });

function hit(){
    fetch("/game/hit", {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    }).then((res)=>{
        location.reload();
    })
}

function stand(){
    fetch("/game/stand", {
        method: "GET",
        headers: {"Content-Type": "application/json"}
    }).then((res)=>{
        location.reload();
    })
}
