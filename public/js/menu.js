const choices = document.querySelectorAll(".choice");

choices.forEach(choice => {
    choice.addEventListener("click", () => {
        let selected = "";
        if(choice.classList.contains("game")){
            window.location.href = "game";
        } else if(choice.classList.contains("diary")){
            window.location.href = "diary";
        } else if(choice.classList.contains("movie")){
            window.location.href = "movie";
        } else{
            window.location.href = "/riddles/add-riddle";
        }
    });
});