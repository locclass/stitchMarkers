let stitchCount = 0;
let increaseCount = 0;
let decreaseCount = 0;
var pendingColumn = false;
let numRows = 0;
let stitchDefs = [];

// Close the modal
function closeModal() {
    const modal = document.getElementById("myModal");
    modal.style.display = "none";
}

// Handle select changes
function editSelects(event) {
    // Placeholder for handling selection changes
    console.log("Selected: " + event.target.value);
}

function finishRow() {
    console.log("row finished");
    var table = document.getElementById("patternTable");
    table.appendChild(document.createElement("tr"));
    document.getElementById("btnCompleteRow").remove();
    stitchCount = 0;
    increaseCount = 0;
    decreaseCount = 0;
    numRows++;
}

// Add data to table and update counters
function addData() {

    var option = document.getElementById('choose-sel').value;
    if (option == null || option == "null") { alert("Please choose a valid stitch."); return; }
    if (pendingColumn) {
        var table = document.getElementById("patternTable");
        var rows = table.getElementsByTagName('tr');
        var row = rows[rows.length - 1];
        var repeat = document.getElementById("numReps").value;
        stitchDefs = getAllStitches();

        let selectedStitch;

        let i = 0;
        let found = false;
        while (i < stitchDefs.length && !found) {
            if (stitchDefs[i].shortHand.toString() == option.toString()) {
                selectedStitch = stitchDefs[i];
                found = true;
            }
            i++;
        }


        for (var j = 0; j < repeat; j++) {
            increaseCount += selectedStitch.numInc;
            decreaseCount += selectedStitch.numDec;
            stitchCount += (1 + selectedStitch.numInc - selectedStitch.numDec);
            var cell = row.insertCell(-1);
            cell.className = "stitchCell";
            cell.innerHTML = `<img src="./symbols/${selectedStitch.shortHand}.jpg" >`;
        }

        let infoId = "stitchInfoCell" + (numRows + 1).toString();
        if (document.getElementById(infoId)) {
            document.getElementById(infoId).remove();
        }

        var cell = row.insertCell(-1).innerHTML = `   <div id="${infoId}">    <p>Total sts: <span id="spanCantPuntos">${stitchCount}</span></p>
        <p>Num. inc.: <span id="spanCantInc">${increaseCount}</span></p>
        <p>Num. dec.: <span id="spanCantDec">${decreaseCount}</span></p></div> `;


        // Reset pendingColumn to false after adding the column
        pendingColumn = false;

        if (document.getElementById("btnCompleteRow") == null) {
            var completeButton = document.createElement("button");
            completeButton.addEventListener("click", finishRow);
            completeButton.innerHTML = "Row is complete";
            completeButton.id = "btnCompleteRow";
            document.getElementById("divButtonsGoHere").appendChild(completeButton);
        }

        document.getElementById('choose-sel').value = null;
    }

    closeModal(); // Close modal after adding data
}

function getAllStitches() {
    if (stitchDefs.length == 0) {
        createReadStream(path.join(__dirname, 'data', 'stitches.csv')) // Make sure to place the CSV file in the data folder
            .pipe(csv()) // Parse CSV content
            .on('data', (data) => stitchDefs.push(data))
            .on('end', () => {
                console.table(data);
            });
    }
    return stitchDefs;
}

function loadStitches(stitches) {
    var table = document.getElementById("patternTable");
    table.appendChild(document.createElement("tr"));
    // var stitches = getAllStitches();
    var selectBox = document.getElementById("choose-sel");
    if (stitches == undefined || stitches == null) return;
    stitches.forEach(s => {
        var opt = document.createElement('option');
        opt.innerText = s.name;
        opt.value = s.shortHand;
        selectBox.appendChild(opt);
    })
}

// Open the modal
function openModal() {
    pendingColumn = true;

    const modal = document.getElementById("myModal");
    modal.style.display = "block";
}


document.getElementById('addStitchButton').addEventListener('click', openModal);
document.getElementById("spanCloseModal").addEventListener("click", closeModal);


//document.onload = loadStitches(getAllStitches());

// Event listener to close the modal when clicked outside
window.onclick = function (event) {
    const modal = document.getElementById("myModal");
    const closeModalBtn = document.getElementById("spanCloseModal");
    if (event.target === modal || event.target === closeModalBtn) {
        modal.style.display = "none";
    }
};

module.exports = {loadStitches}