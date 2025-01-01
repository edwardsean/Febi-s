let start = false;

const riddle = [
    "makanan kesukaan febi",
    "makanan kesukaan sean",
    "our first food",
    "the drink that sean bought for febi for the first date",
    "our fav song"
]
let boolArray = JSON.parse(localStorage.getItem("boolArray")) || new Array(riddle.length).fill(false);
let count = parseInt(localStorage.getItem("count")) || 0;

function chooseRiddle(){
    if(count === riddle.length){
        boolArray = new Array(riddle.length).fill(false);
        count = 0;
        localStorage.setItem("boolArray", JSON.stringify(boolArray));
        localStorage.setItem("count", count.toString());
    }

    let index;
    do{
        index = Math.floor(Math.random() * riddle.length);
    } while(boolArray[index]);

    const chosen = riddle[index];
    document.getElementById("daily-password").textContent = chosen;
    document.getElementById("hidden-riddle").value = chosen;
    count++;
    boolArray[index] = true;
    localStorage.setItem("boolArray", JSON.stringify(boolArray));
    localStorage.setItem("count", count.toString());

}

function firstRiddleClick(start){
    const riddleButton = document.getElementById("daily-password"),
    password_form = document.getElementById("password-form");
    if(!start) {
        riddleButton.classList.remove("first");
        start = true;
        password_form.style.display = "block";
    } 
    return;
}

document.getElementById("daily-password").addEventListener("click", () => {
    chooseRiddle();
    firstRiddleClick();
});



const form = document.querySelector("form");
const passbox = form.querySelector(".password");
const passinput = passbox.querySelector("input");
const currentriddle = document.getElementById("hidden-riddle");

form.onsubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/enter", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            password: passinput.value,
            riddle: currentriddle.value,
        }),
    });

    const result = await response.json();

    if (result.success) {
        window.location.href = "/index"; 
    } else {
        passbox.classList.add("shake");
        passbox.classList.add("invalid");

        setTimeout(() => {
            passbox.classList.remove("shake");
            passbox.classList.remove("invalid");
        }, 500);
    }
};