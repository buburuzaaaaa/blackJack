function signup(){
    fetch('/signup', {
        method: 'GET',
        headers: {"Content-Type": "application/json"},
    }).then((res) => {
        window.location.href = res.url;
    })
}


function game(){
    fetch(`/game${window.location.search}`, {
        method: 'GET',
        headers: {"Content-Type": "application/json"},
    }).then((res) => {
        window.location.href = res.url;
    })
}