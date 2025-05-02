const fs = require("fs");
const { parse } = require("csv-parse");
let names = [];
let shortHands = [];
let instructions = [];

fs.createReadStream("./data/stitches.csv")
    .pipe(parse({ delimiter: ",", from_line: 2 }))
    .on("data", function (d) {
        let data = Array(d);

        for (let i = 0; i < data.length; i++) {
            names.push(data[i][0]);
            shortHands.push(data[i][1]);
            instructions.push(data[i][5]);
        }

        createFile();
    })

function createFile() {
    let beginning = `<xliff xmlns="urn:oasis:names:tc:xliff:document:2.1" version="2.1">
    <file original="global" datatype="HTML" source-language="en-GB">
        <body>\n`;

    let ending = `\n        </body>
    </file>
</xliff>`;
    let namesGroup = createNamesGroup(names);
    let shortHandsGroup = createShortHandsGroup(shortHands);
    let instructionsGroup = createInstructionsGroup(instructions);
    let functionalGroup = createFunctionalGroup();

    fs.writeFile("stringsTest.xliff", String(beginning + namesGroup + shortHandsGroup + instructionsGroup + ending), (err) => {

        // In case of a error throw err.
        if (err) throw err;
    });
}

function createNamesGroup(names) {
    let fullGroup = `<group id="stitchNames">\n`;

    for (let i = 0; i < names.length; i++) {
        fullGroup += `<unit id="st_n_${shortHands[i]}">
                    <segment>
                        <source>${names[i]}</source>
                    </segment>
                </unit> \n`;
    }

    fullGroup += `\n</group>`;
    return fullGroup;
}

function createShortHandsGroup(sH) {
    let fullGroup = `<group id="shortHands">\n`;

    for (let i = 0; i < sH.length; i++) {
        fullGroup += `<unit id="st_sh_${sH[i]}">
                    <segment>
                        <source>${sH[i]}</source>
                    </segment>
                </unit> \n`;
    }

    fullGroup += `\n</group>`;
    return fullGroup;
}

function createInstructionsGroup(ins) {
    let fullGroup = `<group id="instructions">\n`;

    for (let i = 0; i < ins.length; i++) {
        fullGroup += `<unit id="st_ins_${shortHands[i]}">
                    <segment>
                        <source>${ins[i]}</source>
                    </segment>
                </unit> \n`;
    }

    fullGroup += `\n</group>`;
    return fullGroup;
}

function createFunctionalGroup(){
    let fullGroup = `<group id="functional">\n`;

    for (let i = 0; i < ins.length; i++) {
        fullGroup += `<unit id="st_ins_${shortHands[i]}">
                    <segment>
                        <source>${ins[i]}</source>
                    </segment>
                </unit> \n`;
    }

    fullGroup += `\n</group>`;
    return fullGroup;
}