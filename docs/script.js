localStorage.setItem("numRows", 1);
localStorage.setItem("stitchDefs", "");

// html object definitions
let modal;
let btnCloseModal;
let selectBox;
let addStitchButton;
let btnConfirmStitch;
let btnAddRow;
let btnConfirmInst;
let selectInstructions;
let btnConfirmRowInst;

document.onload = addListeners();

function addListeners() {
    modal = document.getElementById("myModal");
    btnCloseModal = document.getElementById("btnCloseModal");
    selectBox = document.getElementById("choose-sel");
    addStitchButton = document.getElementById('addStitchButton');
    btnConfirmStitch = document.getElementById("btnConfirmStitch");
    btnAddRow = document.getElementById("newRowButton");
    btnConfirmInst = document.getElementById("btnConfirmInst");
    selectInstructions = document.getElementById("sel-inst");
    btnConfirmRowInst = document.getElementById("btnConfirmRowDesc");

    addStitchButton.addEventListener('click', openModal);
    btnCloseModal.addEventListener('click', closeModal);
    btnConfirmStitch.addEventListener('click', function () {
        let numReps = document.getElementById("numReps").value
        addStitchToRow(selectBox.value, parseInt(numReps));
        document.getElementById("numReps").value = 1;
        closeModal();
        selectBox.value = "null";
    })
    btnAddRow.addEventListener('click', function () {
        let numRows = parseInt(localStorage.getItem("numRows"));
        numRows++;
        localStorage.setItem("numRows", numRows);

        // create new row
        let divRows = document.getElementById("divRows");
        let newRow = document.createElement('div');
        newRow.id = ('row' + numRows).toString();
        newRow.className = 'row';
        newRow.style = 'margin-top: 5px; margin-bottom: 5px; background-color: #fce6ef; height: 50px;';

        divRows.appendChild(newRow);
    })

    loadStitchesFromFile('defaultStrings.xliff');

    btnConfirmInst.addEventListener('click', showInstructions);

    btnConfirmRowInst.addEventListener('click', showRowExplanation)
}

// load stitches to select box
async function loadStitchesFromFile(xliffPath) {
    let lanOption;
    if (xliffPath == "defaultStrings.xliff") {
        lanOption = "source"
    } else {
        lanOption = "target"
    }

    try {
        const response = await fetch(xliffPath, {
            method: "GET",
            mode: "cors",
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        });
        const xmlString = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

        let allStitchNames = xmlDoc.querySelectorAll("group[id='stitchNames'] > unit");
        let allInstructions = xmlDoc.querySelectorAll("group[id='instructions'] > unit");

        let strToStore = "";

        for (let i = 0; i < allStitchNames.length; i++) {

            let nameUnit = allStitchNames.item(i);
            let instUnit = allInstructions.item(i);
            let shortHand = String(nameUnit.id).replace("st_n_", "");
            let name = nameUnit.querySelector(String(lanOption)).innerHTML;
            let inst = instUnit.querySelector(String(lanOption)).innerHTML;
            inst = inst.replace('\n', "");

            strToStore += shortHand + ';' + name + ';' + inst;
            if (i != allStitchNames.length - 1) strToStore += '|';
        }

        localStorage.setItem("stitchDefs", strToStore);
        loadStitchesToBoxes();
    } catch (error) {
        console.log(error)
    }
    return;
}

function loadStitchesToBoxes() {
    let stitchDefs = localStorage.getItem("stitchDefs").split('|');

    let selectBox = document.getElementById("choose-sel");
    let selectInstructions = document.getElementById("sel-inst");
    let defaultValue = document.createElement("option");
    defaultValue.value = null;
    defaultValue.innerHTML = "Select a stitch"
    selectBox.appendChild(defaultValue);
    selectInstructions.appendChild(defaultValue);

    for (let i = 0; i < stitchDefs.length; i++) {
        let currentStitch = stitchDefs[i];
        currentStitch = currentStitch.split(';');
        let opt = document.createElement("option");
        opt.text = currentStitch[1];
        opt.value = "opt_" + currentStitch[0];

        selectBox.appendChild(opt);
        let opt2 = document.createElement("option");
        opt2.text = currentStitch[1];
        opt2.value = "opt_" + currentStitch[0];
        selectInstructions.appendChild(opt2);
    }
}

function addStitchToRow(stValue, numReps) {
    // I'm expecting stValue to be the id
    let stShortHand = stValue.replace("opt_", "");
    let allStitches = localStorage.getItem("stitchDefs").split('|');
    let fullSt;
    for (let i = 0; i < allStitches.length && !fullSt; i++) {
        fullSt = allStitches[i].split(';');
        if (fullSt[0] != stShortHand) fullSt = null;
    }

    let activeRow = document.getElementById(('row' + localStorage.getItem("numRows")).toString());
    let img = document.createElement("img");
    img.src = "symbols/" + fullSt[0] + ".jpg";
    img.style = "width: 50px; height: 50px; padding: 2px;"
    for (let i = 0; i < numReps; i++) {
        document.getElementById(activeRow.id).appendChild(img.cloneNode())
    }
}

function showInstructions() {
    let selectedStitch = document.getElementById("sel-inst").value;
    let splitDefinitions = localStorage.getItem("stitchDefs").split('|');
    for (let i = 0; i < splitDefinitions.length; i++) {
        let currentSt = splitDefinitions[i].split(';');
        if (selectedStitch.replace("opt_", "") == currentSt[0]) {
            document.getElementById("divInst").innerHTML = currentSt[2];
            return
        }
    }
}

function showRowExplanation() {
    let rowNumber = document.getElementById('numRow').value;
    let allRows = document.getElementById('divRows');
    allRows = allRows.getElementsByTagName('div');
    if (allRows.length < rowNumber) {
        alert('Please choose a number lower or equal to ' + allRows.length);
    } else {
        let selectedRow = allRows[rowNumber - 1];
        let rowStitchesImg = selectedRow.getElementsByTagName('img');
        let rowStitches = [];
        let rowStitchesReps = [];
        //console.log(rowStitches);
        for (let i = 0; i < rowStitchesImg.length; i++) {
            let currentSt = String(rowStitchesImg[i].src).substring(String(rowStitchesImg[i].src).indexOf("/symbols/") + 1);
            if (i == 0) {
                rowStitches.push(currentSt);
                rowStitchesReps.push(1);
            } else {
                if (rowStitches[i - 1] == currentSt) {
                    let numRepetitions = parseInt(rowStitchesReps[rowStitchesReps.length - 1]);
                    rowStitchesReps[rowStitchesReps.length - 1] = numRepetitions + 1;
                } else {
                    rowStitches.push(currentSt);
                    rowStitchesReps.push(1);
                }
            }
        }

        let paragraph = document.getElementById("divRowInst");
        for (let j = 0; j < rowStitchesReps.length; j++) {
            let st = findStitch(rowStitches[j].replace(".jpg", ""));
            paragraph.insertAdjacentText("beforeend", `\n` + "Work " + st[1].toLowerCase() + "stitch");
            if (rowStitchesReps[j] != 1) {
                paragraph.insertAdjacentText("beforeend", " " + rowStitchesReps[j] + " times.");
            } else {
                paragraph.insertAdjacentText("beforeend", ".");
            }
        }
    }


}

function getShortHand(str) {
    //let aux = str.split("symbols/");
    str = str.replace("symbols/", "");
    str = str.replace(".jpg", "");
    return str;
}

function findStitch(shortHand) {
    let allSts = localStorage.getItem("stitchDefs");
    allSts = allSts.split('|');

    for (let i = 0; i < allSts.length; i++) {
        let st = allSts[i].split(";");
        if (st[0] == shortHand) {
            return st;
        }
    }
}

function closeModal() {
    if (modal.style.display != 'none') modal.style.display = 'none';
}

function openModal() {
    modal.style.display = "block";
}

