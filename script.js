var table = {
    name: "",
    number: 0,
    entries: []
};

const langdrawer = new Langdrawer();
langdrawer.addEventListener(langdrawer);

function switchLang() {
    langdrawer.switchLang();
}

function validateTableProperties(tablePropertiesForm) {
    if (!isEmpty(tablePropertiesForm.name.value) && !isEmpty(tablePropertiesForm.number.value)) {
        table.name = tablePropertiesForm.name.value;
        table.number = tablePropertiesForm.number.value;
        drawTableProperties();
    } else {
        langdrawer.localizedError("tableFormEmptyError");
    }
}

function drawTableProperties() {
    document.getElementById("table-prop-name").value = table.name;
    document.getElementById("table-prop-number").value = table.number;
    document.getElementById("table-account-name").innerHTML = table.name;
    document.getElementById("table-account-number").innerHTML = table.number;
    table.name = table.name;
    table.number = table.number;
}

function addEntry(addEntryForm) {

    if (isEmpty(addEntryForm.date.value) || isEmpty(addEntryForm.accountNumber.value) || isEmpty(addEntryForm.accountName.value)) {
        langdrawer.localizedError("entryFormError");
        return;
    } else if (isEmpty(addEntryForm.debit.value) && isEmpty(addEntryForm.credit.value)) {
        langdrawer.localizedError("entryDebitCreditErrorNone");
        return;
    } else if (!(isEmpty(addEntryForm.debit.value) || isEmpty(addEntryForm.credit.value))) {
        langdrawer.localizedError("entryDebitCreditErrorBoth");
        return;
    }

    var entryId;
    if (table.entries[table.entries.length - 1] == null) {
        entryId = 0;
    } else {
        entryId = Number(table.entries[table.entries.length - 1].id) + 1;
    }

    var newEntry = {
        id: entryId,
        date: addEntryForm.date.value,
        accountNumber: Number(addEntryForm.accountNumber.value),
        accountName: addEntryForm.accountName.value,
        debit: Number(addEntryForm.debit.value),
        credit: Number(addEntryForm.credit.value)
    };

    table.entries.push(newEntry);

    drawTable();

    addEntryForm.reset();
    document.getElementById("entry-date").focus();
}

function drawTable() {

    // Add entries

    document.getElementById("table-entries").innerHTML = '';

    table.entries.forEach(function (entry) {

        var debit = "", credit = "";
        if (entry.debit > 0) { debit = entry.debit.toLocaleString("de-DE", { minimumFractionDigits: 2 }).toString(); }
        if (entry.credit > 0) { credit = entry.credit.toLocaleString("de-DE", { minimumFractionDigits: 2 }).toString(); }

        var newEntry = '<a onclick="deleteEntry(' + entry.id + ')"> <div class="table-entry table-realentry"> <div class="entry-date">' +
            entry.date +
            '</div> <div class="entry-account">' +
            entry.accountNumber + ' ' + entry.accountName +
            '</div> <div class="entry-space"></div> <div class="entry-debit">' +
            debit +
            '</div> <div class="entry-credit">' +
            credit +
            '</div> </div> </a>';

        document.getElementById("table-entries").insertAdjacentHTML("beforeend", newEntry);

    });

    // Calc sum

    if (table.entries.length != 0) {

        var sumDebit = 0, sumCredit = 0;

        table.entries.forEach(function (entry) {
            if (!entry.debit.isEmpty) {
                sumDebit += Number(entry.debit);
            }
            if (!entry.credit.isEmpty) {
                sumCredit += Number(entry.credit);
            }

        });

        sumDebit = sumDebit.toLocaleString("de-DE", { minimumFractionDigits: 2 }).toString();
        sumCredit = sumCredit.toLocaleString("de-DE", { minimumFractionDigits: 2 }).toString();

        var sum = '<div class="table-entry"> <div class="entry-date"></div> <div class="entry-account"></div>' +
            '<div class="entry-space"></div> <div class="entry-debit entries-sum">' + sumDebit +
            '</div><div class="entry-credit entries-sum">' + sumCredit +
            '</div></div><div class="table-entry"> <div class="entries-sum-line"></div>' +
            '<div class="entries-sum-border"></div> </div>';

        document.getElementById("table-sum").innerHTML = sum;

    } else {
        document.getElementById("table-sum").innerHTML = "";
    }
}

function deleteEntry(entryId) {

    const entryIndex = table.entries.map(e => e.id).indexOf(Number(entryId));
    const entry = table.entries[entryIndex];

    if (entry.debit == 0 && entry.credit > 0) {

        if (confirm(langdrawer.translationForKey("entryDeleteConfirmation") + "\n" + entry.date + ": " + table.number + " " + table.name + " / " + entry.accountNumber + " " + entry.accountName)) {
            table.entries.splice(entryIndex, 1);
            drawTable();
        }

    } else if (entry.credit == 0 && entry.debit > 0) {

        if (confirm(langdrawer.translationForKey("entryDeleteConfirmation") + "\n" + entry.date + ": " + entry.accountNumber + " " + entry.accountName + " / " + table.number + " " + table.name)) {
            table.entries.splice(entryIndex, 1);
            drawTable();
        }

    } else {

        if (confirm(langdrawer.translationForKey("entryDeleteConfirmation") + "\n" + entry.date + " | " + entry.accountNumber + " " + entry.accountName)) {
            table.entries.splice(entryIndex, 1);
            drawTable();
        }

    }

}

function downloadAsPNG() {

    var node = document.getElementById('bwmr-table-dwl');
    domtoimage.toPng(node)
        .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = table.number + "-" + table.name + ".png";
            link.href = dataUrl;
            link.click();
        })
        .catch(function (error) {
            langdrawer.localizedError("unknownError");
        });

}

function importFromJson() {
    selectJsonFile();    
}

function selectJsonFile() {

    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {

        var file = e.target.files[0];

        var reader = new FileReader();
        reader.readAsText(file, 'UTF-8');

        reader.onload = readerEvent => {
            var content = readerEvent.target.result;
            renderJson(JSON.parse(content));
        }
    }

    input.click();

}

function renderJson(jsonData) {
    
    table = jsonData;

    drawTable();
    drawTableProperties();
}

function exportToJson() {

    var jsonData = JSON.stringify(table);

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonData);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", table.number + "-" + table.name + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function resetTable() {

    table = {
        name: "",
        number: null,
        entries: []
    };

    drawTable();
    drawTableProperties();

}

function isEmpty(strIn) {
    if (strIn === undefined) {
        return true;
    }
    else if (strIn == null) {
        return true;
    }
    else if (strIn == "") {
        return true;
    }
    else {
        return false;
    }
}