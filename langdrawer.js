function Langdrawer() {

    const availableLanguages = ["en", "de"];

    var selectedLang = "en";

    const trans = JSON.parse(translations);
    var lang = trans.en;

    this.switchLang = function () {
        if (selectedLang == "en") { selectedLang = "de"; }
        else if (selectedLang == "de") { selectedLang = "en"; }

        this.drawLang();
    }

    this.drawLang = function () {

        if (selectedLang == "de") {
            document.getElementById("lang-buttons").innerHTML = '<a href="#" onclick="switchLang()">English</a> | German';
            lang = trans.de;
        } else if (selectedLang == "en") {
            document.getElementById("lang-buttons").innerHTML = 'English | <a href="#" onclick="switchLang()">German</a>';
            lang = trans.en;
        } else {
            document.getElementById("lang-buttons").innerHTML = 'English | <a href="#" onclick="switchLang()">German</a>';
            lang = trans.en;
        }

        document.getElementById("site-title").innerHTML = lang.siteTitle;
        document.getElementById("site-subtitle").innerHTML = lang.siteSubtitle;
        document.getElementById("table-properties").innerHTML = lang.tableProperties;
        document.getElementById("table-prop-number").placeholder = lang.tableAccountNumber;
        document.getElementById("table-prop-name").placeholder = lang.tableAccountName;
        document.getElementById("table-prop-save").innerHTML = lang.tableSave;
        document.getElementById("add-entries").innerHTML = lang.entryAddEntries;
        document.getElementById("entry-date").placeholder = lang.entryDate;
        document.getElementById("entry-account-number").placeholder = lang.entryAccountNumber;
        document.getElementById("entry-account-name").placeholder = lang.entryAccountName;
        document.getElementById("entry-debit").placeholder = lang.entryDebit;
        document.getElementById("entry-credit").placeholder = lang.entryCredit;
        document.getElementById("entry-reset-form").innerHTML = lang.entryResetForm;
        document.getElementById("entry-add-entry").innerHTML = lang.entryAddEntry;
        document.getElementById("actions-title").innerHTML = lang.actionsTitle;
        document.getElementById("actions-download").innerHTML = lang.actionsDownload;
        document.getElementById("actions-import").innerHTML = lang.actionsImport;
        document.getElementById("actions-reset").innerHTML = lang.actionsReset;
        document.getElementById("actions-export").innerHTML = lang.actionsExport;
        document.getElementById("footer-note").innerHTML = lang.footerNote;
        document.getElementById("footer-note-text").innerHTML = lang.footerNoteText;
        document.getElementById("footer-site-name").innerHTML = lang.footerSiteName;
        document.getElementById("footer-copyright-text").innerHTML = lang.footerCopyrightText;
        document.getElementById("footer-bug-report").innerHTML = lang.footerBugReport;

    }

    this.translationForKey = function (key) {
        if (lang[key] != null) {
            return lang[key];
        } else {
            throw `Invalid translation key: ${key}`;
        }
    }

    this.addEventListener = function (ld) {
        window.addEventListener("DOMContentLoaded", function () {
            ld.drawLang();
        }, false);
    }

    this.localizedError = function (key) {
        alert(this.translationForKey(key));
    }

    Object.defineProperty(this, "selectedLang", {
        get: function () {
            return selectedLang;
        }
    });

    Object.defineProperty(this, "selectLang", {
        set: function (newLang) {
            if (availableLanguages.includes(newLang.toLowerCase())) {
                selectedLang = newLang;
                this.drawLang();
            } else {
                throw `Language '${newLang} is not available'`;
            }
        }
    });
}