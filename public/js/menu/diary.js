const startWriteButton = document.getElementById("start"),
trashButton = document.getElementById("delete"),
selectDraftButton = document.getElementById("select"),
writingBox = document.getElementById("writing-box"),
nodraftBox = document.querySelector(".no-draft"),
nopostBox = document.querySelector(".no-post"),
deleteDraftButton = document.getElementById("delete-draft"),
postDraftButton = document.getElementById("post-draft"),
draftsBox = document.querySelector(".drafts"),
writeContent = document.getElementById("write"),
trash = document.querySelector(".trash"),
trashIcon = document.getElementById("trash-icon"),
PostandEdit = document.querySelector(".post-edit"),
upload = document.getElementById("upload"),
edit = document.getElementById("edit"),
postsBox = document.querySelector(".posts");

let drafts = 0;
let posts = 0;
let draftOff = false;
let noneOff = false;
let writeOff = false;

let goUpload = false;
let goEdit  = false;


function formatDate() {
    const year = getTime("year");
    const month = getTime("month");
    const day = getTime("day");
    
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    const monthName = monthNames[month - 1] || "Unknown";
    
    return `${monthName} ${day}, ${year}`;
}

function restartSelection() {
    const selected = document.querySelectorAll(".draft-select.selected");
    selected.forEach((circle) => {
        circle.classList.remove("selected");
        circle.style.backgroundColor = "transparent";
    });
}

function zeroDrafts() {
    nodraftBox.style.display = "flex";
    draftsBox.style.display = "none";
    trash.style.display = "none";
    PostandEdit.style.display = "none";
}
function getTime(wanted) {
    const date = new Date();

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    switch(wanted) {
        case "hours":
            return hours;   
        case "minutes":
            return minutes;  
        case "year":
            return year;
        case "month":
            return month;
        case "day":
            return day;
        default:
            console.log("invalid input");
            break;
    }
}

function toggleSelectCircle(show) {
    const selectCircle = document.querySelectorAll(".draft-select.still-draft");
    selectCircle.forEach((circle) => {
        circle.style.display = show ? "block" : "none";
    });
}

function deleteDraft(){
    if(drafts === 0){
        nodraftBox.style.display = "flex";
        writingBox.style.display = "none";
        return;
    }
    draftsBox.style.display = "flex";
    writingBox.style.display = "none";

}

function postDraft(){
    const content = writeContent.value.trim();
    if(content){
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);

        let dateGroup = Array.from(draftsBox.children).find(group => {
            const header = group.querySelector('.date-header');
            return header && header.textContent === formattedDate;
        });

        if (!dateGroup) {
            dateGroup = document.createElement('div');
            dateGroup.classList.add('date-group');

            const dateHeader = document.createElement('div');
            dateHeader.classList.add('date-header');
            dateHeader.style.fontSize = "12px";
            dateHeader.textContent = formattedDate;

            dateGroup.appendChild(dateHeader);
            draftsBox.insertBefore(dateGroup, draftsBox.firstChild);
        }


        let DraftWrap = document.createElement("div");
        DraftWrap.classList.add("draft-wrap");
        
        let selectOption = document.createElement("div");
        selectOption.classList.add("draft-select", "still-draft");
        selectOption.style.width = "20px";
        selectOption.style.height = "20px";
        selectOption.style.border = "2px solid gray";
        selectOption.style.borderRadius = "50%";
        selectOption.style.cursor = "pointer";
        selectOption.style.marginRight = "10px";
        selectOption.style.display = "none"; 

        selectOption.addEventListener("click", () => {
            if (selectOption.classList.contains("selected")) {
                selectOption.classList.remove("selected");
                selectOption.style.backgroundColor = "transparent";
            } else {
                selectOption.classList.add("selected");
                selectOption.style.backgroundColor = "blue";
            }
        });

        let contentSpan = document.createElement("span");
        contentSpan.classList.add("content-text");
        contentSpan.textContent = content;

        let newDraft = document.createElement("div");
        newDraft.classList.add("draft-bubble");
        newDraft.appendChild(contentSpan);

        const hours = getTime("hours");
        const minutes = getTime("minutes");
        let timeDiv = document.createElement("div");
        timeDiv.classList.add("time");
        timeDiv.textContent = `${hours}:${minutes}`;
        timeDiv.style.fontSize = "12px";
        timeDiv.style.color = "gray";
        timeDiv.style.textAlign = "end";

        DraftWrap.appendChild(selectOption);
        DraftWrap.appendChild(newDraft);
        DraftWrap.appendChild(timeDiv);
        draftsBox.appendChild(DraftWrap);

        
        
        writeContent.value = "";
        drafts++;
        nodraftBox.style.display = "none";
        writingBox.style.display = "none";
        draftsBox.style.display = "flex";
        
    }
}

function selectCircleAppear(forTrash, forSelect) {
    draftsBox.style.height = "93%";
    toggleSelectCircle(true);
    if(forTrash) {
        trash.style.display = "flex";
        PostandEdit.style.display = "none";
        return;
    }
    if(forSelect) {
        PostandEdit.style.display = "flex";
        trash.style.display = "none";
        return;
    }
    
}

function postFunct() {
    let selectedCircles = document.querySelectorAll(".draft-select.selected");
    if (selectedCircles.length === 0) {
        alert("No drafts selected to upload.");
        return;
    }

    selectedCircles.forEach((circle) => {
        circle.parentElement.querySelector(".draft-select").style.display = "none";
        circle.parentElement.querySelector(".draft-select").classList.remove("selected");
        circle.parentElement.querySelector(".draft-select").classList.remove("still-draft");
        const wrap = circle.parentElement; 
        const clone = wrap.cloneNode(true);
        postsBox.appendChild(clone);
        posts++;
        draftsBox.removeChild(wrap); 
        drafts--;
    });

    if(posts > 0) {
        nopostBox.style.display = "none";
        postsBox.style.display = "flex";
    }

    goUpload = false;
}

function editFunct() {
    const selectedCircles = document.querySelectorAll(".draft-select.selected");

    if (selectedCircles.length === 0) {
        alert("No draft selected to edit.");
        return;
    }

    selectedCircles.forEach((circle) => {
        const wrap = circle.parentElement;
        const draftBubble = wrap.querySelector(".draft-bubble");
        const timeElement = wrap.querySelector(".time");

        if (!draftBubble || !timeElement) return;

        // Target only the content-text span
        const contentSpan = draftBubble.querySelector(".content-text");
        if (!contentSpan) return;

        const currentContent = contentSpan.textContent.trim();

        const textArea = document.createElement("textarea");
        textArea.value = currentContent;
        textArea.style.width = "100%";
        textArea.style.height = "auto";
        textArea.style.boxSizing = "border-box";
        textArea.style.padding = "10px";
        textArea.style.fontSize = "16px";
        textArea.style.resize = "vertical";
        draftBubble.innerHTML = ""; 
        draftBubble.appendChild(textArea);

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.style.marginTop = "10px";

        draftBubble.appendChild(saveButton);

        saveButton.addEventListener("click", () => {
            const updatedContent = textArea.value.trim();

            if (!updatedContent) {
                alert("Draft content cannot be empty.");
                return;
            }
            contentSpan.textContent = updatedContent; 
            draftBubble.innerHTML = ""; 
            draftBubble.appendChild(contentSpan); 

            const newHour = getTime("hours");
            const newMinute = getTime("minutes");
            timeElement.textContent = `${newHour}:${newMinute}`;
            goEdit = false;
        });
    });
}

upload.addEventListener("click", () => {
    console.log("Upload button clicked");
    if(!goEdit){ //klo lagi ga edit
        goUpload = true;
        postFunct();  
        restartSelection();
    }

    if(drafts === 0){
        zeroDrafts();
    }
      
});

edit.addEventListener("click", () => {
    if(!goUpload){
        goEdit = true;
        editFunct(); 
        restartSelection();
    }
});

selectDraftButton.addEventListener("click", () => {
    restartSelection();
    if((draftsBox.style.display !== "none") && drafts > 0) {
        selectCircleAppear(false, true);
    } 
});



startWriteButton.addEventListener("click", () => {
    restartSelection();
    writingBox.style.display = "grid";
    nodraftBox.style.display = "none";
    draftsBox.style.display = "none";
    trash.style.display = "none";
    PostandEdit.style.display = "none";
    toggleSelectCircle(false);
});

trashButton.addEventListener("click", () => {
    restartSelection();
    if((draftsBox.style.display !== "none") && drafts > 0) {
        selectCircleAppear(true, false);
    } else {
        alert("No draft to delete");
    }
});

trashIcon.addEventListener("click", () => {
    
    const selectedCircles = document.querySelectorAll(".draft-select.selected");
    selectedCircles.forEach((circle) => {
        const wrap = circle.parentElement;
        draftsBox.removeChild(wrap);
        drafts--;
    });
    if(drafts === 0){
        zeroDrafts();
    }
});

if(writingBox.style.display !== "none"){
    deleteDraftButton.addEventListener("click", deleteDraft);
    postDraftButton.addEventListener("click", postDraft);
    trash.style.display = "none";
    PostandEdit.style.display = "none";
}