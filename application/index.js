if("serviceWorker" in navigator){
    window.addEventListener('load', ()=>{
        navigator.serviceWorker.register("sw.js").then(registration=>{
            console.log("SW Registered")
            console.log(registration)
        }).catch(error =>{
            console.log("SW Registration failed")
            console.log(error)
        })
    })
}