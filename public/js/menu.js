const choices = document.querySelectorAll(".choice");

choices.forEach(choice => {
    choice.addEventListener("click", () => {
        let selected = "";
        if(choice.classList.contains("game")){
            selected = "game";
        } else if(choice.classList.contains("diary")){
            selected = "diary";
        } else{
            selected = "movie";
        }

        // fetch("/set-choice", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({choice: selected}),
        // }).then(() => {
            
        // })
        window.location.href = `/index?choice=${selected}`;
    });
});