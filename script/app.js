let counterColor = {
    white: "#fff",
    green: "#d3ffd0",
    yellow: "#fdffd0",
    red: "#ffd7d0",
    blue: "#d0ebff",
    violet: "#f7d0ff"
};
maxCounter = 2;


// SUPPRIMER AU DESSUS


// ---------------------------------- GENERATION LISTE COMPTEUR ---------------------




// Classe d'une ligne de session
class TableLineSession{

    constructor(parentRef,idNumber){
        this.parentRef = parentRef;
        this.idNumber = idNumber;

        // la row
        this.element = document.createElement("tr");
        this.render();
    }

    render(){
        this.element.innerHTML = `
            <td class="gen-session-col-nom">
                <input type="text" id="inputGenSessionNom_${this.idNumber}" class="gen-session-col-nom">
            </td>
            <td class="gen-session-col-series">
                <input type="number" id="inputGenSessionSerie_${this.idNumber}" class="gen-session-col-series">
            </td>
            <td class="gen-session-col-rep">
                <input type="number" id="inputGenSessionRep_${this.idNumber}" class="gen-session-col-rep">
            </td>
            <td class="gen-session-col-color"  id="tdGenSessionChooseColor_${this.idNumber}">
                <select id="selectGenSessionColor_${this.idNumber}" onchange="onChangeColorInGenSessionTable(${this.idNumber})">
                    <option value="white">Blanc</option>
                    <option value="green">Vert</option>
                    <option value="yellow">Jaune</option>
                    <option value="red">Rouge</option>
                    <option value="blue">Bleu</option>
                    <option value="violet">Violet</option>
                </select>
            </td>
        `;


        // Insertion
        this.parentRef.appendChild(this.element);
    }

}




// Génération du tableau de création de session

function onGenerateSessionTable(params) {
    
    // Reférence le parent
    let parentRef = document.getElementById("bodyTableGenerateSession");

    // Reset le contenu du parent
    parentRef.innerHTML = "";

    for (let i = 0; i < maxCounter; i++) {
        new TableLineSession(parentRef,i);
        
    }

}

onGenerateSessionTable();


// Génération de la session

function onGenerateSession() {
    let sessionList = [];

    for (let i = 0; i < maxCounter; i++) {

        // Reférence les éléments
        inputName = document.getElementById(`inputGenSessionNom_${i}`);
        inputSerie = document.getElementById(`inputGenSessionSerie_${i}`);
        inputRep = document.getElementById(`inputGenSessionRep_${i}`);
        selectColor = document.getElementById(`selectGenSessionColor_${i}`);

        // Si inputName remplit
        if (inputName.value != "") {

            // récupère les éléments de la ligne 
            sessionList.push( {
                name: inputName.value, 
                serieTarget: inputSerie.value,
                repIncrement:inputRep.value,
                color : selectColor
            })
        } 
    }

    console.log(sessionList);
}



// changement de couleur dans le tableau de génération
function onChangeColorInGenSessionTable(idRef) {
    let tableDataRef = document.getElementById(`tdGenSessionChooseColor_${idRef}`),
    colorRef = document.getElementById(`selectGenSessionColor_${idRef}`).value;
    tableDataRef.style.backgroundColor = counterColor[colorRef];
}