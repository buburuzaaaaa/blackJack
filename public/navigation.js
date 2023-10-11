function signup(){
    fetch('/signup', {
        method: 'GET',
        headers: {"Content-Type": "application/json"},
    }).then((res) => {
        window.location.href = res.url;
    })
}