body {
    font-family: Arial, sans-serif;
    background-color: #f4f4f4;
    padding: 20px;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

let noteCount = 1;

function addNote() {
    noteCount++;
    const notesForm = document.getElementById("notesForm");

    const newNote = document.createElement("div");
    newNote.classList.add("note");
    newNote.innerHTML = `
        <h2>Note ${noteCount}</h2>
        <label>Face Value ($): <input type="number" class="faceValue"></label><br>
        <label>Straight Discount Rate (%): <input type="number" class="sdr"></label><br>
        <label>Settlement Date: <input type="date" class="settlementDate"></label><br>
        <label>Maturity Date: <input type="date" class="maturityDate"></label><br>
        <label>Transaction Fees ($): <input type="number" class="fees" value="0"></label><br>
    `;
    notesForm.appendChild(newNote);
}

function calculateDaysToMaturity(settlementDate, maturityDate) {
    const startDate = new Date(settlementDate);
    const endDate = new Date(maturityDate);
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
}

function calculateNetProceeds(faceValue, sdr, fees) {
    const discountAmount = faceValue * (sdr / 100);
    return faceValue - discountAmount - fees;
}

function calculateDTY(faceValue, sdr, netProceeds, daysToMaturity) {
    const discountAmount = faceValue * (sdr / 100);
    return (discountAmount / netProceeds) * (360 / daysToMaturity) * 100;
}

function calculateResults() {
    const faceValues = document.querySelectorAll(".faceValue");
    const sdrs = document.querySelectorAll(".sdr");
    const settlementDates = document.querySelectorAll(".settlementDate");
    const maturityDates = document.querySelectorAll(".maturityDate");
    const fees = document.querySelectorAll(".fees");

    let totalSDR = 0;
    let totalDTY = 0;
    let results = "";
    let noteData = [];

    for (let i = 0; i < faceValues.length; i++) {
        const faceValue = parseFloat(faceValues[i].value);
        const sdr = parseFloat(sdrs[i].value);
        const settlementDate = settlementDates[i].value;
        const maturityDate = maturityDates[i].value;
        const fee = parseFloat(fees[i].value);

        if (isNaN(faceValue) || isNaN(sdr) || !settlementDate || !maturityDate) {
            results += `<p>Note ${i + 1}: Please fill in all fields.</p>`;
            continue;
        }

        const daysToMaturity = calculateDaysToMaturity(settlementDate, maturityDate);
        const netProceeds = calculateNetProceeds(faceValue, sdr, fee);
        const dty = calculateDTY(faceValue, sdr, netProceeds, daysToMaturity);

        noteData.push({ netProceeds, dty, sdr });

        totalSDR += sdr;
        totalDTY += dty;

        results += `<p>Note ${i + 1}:
                    <br>Net Proceeds: $${netProceeds.toFixed(2)}
                    <br>Equivalent Discount to Yield (DTY): ${dty.toFixed(2)}%</p>`;
    }

    const averageSDR = totalSDR / noteData.length;
    const averageDTY = totalDTY / noteData.length;

    results += `<h3>Averages:</h3>`;
    results += `<p>Average SDR: ${averageSDR.toFixed(2)}%</p>`;
    results += `<p>Average DTY: ${averageDTY.toFixed(2)}%</p>`;

    document.getElementById("results").innerHTML = results;
}
