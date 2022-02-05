const UPLOAD_PATH = document.currentScript.getAttribute('upload_path');
const AUTOSAVE_INTERVAL = 5000
let pageName = window.location.pathname
pageName = pageName.substring(pageName.indexOf('/', 1) + 1)
let oldContent = null

function copy_fun(mes) {
    var tempInput = document.createElement("input");
    tempInput.style = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = mes;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

}

let filename = "";
let messages = [];
const inputElement = document.querySelector('input[type="file"]');
const pond = FilePond.create(inputElement);
FilePond.setOptions({
    server: {
        url: '/',
        process: {
            url: `./${UPLOAD_PATH}`,
            onload: (response) => {
                filename = response;
                messages.push(filename);
                let mes = "";
                let i;
                for (i in messages) {
                    let md;
                    md = `![caption](/${UPLOAD_PATH}/${messages[i]})`;
                    let m;
                    m = "<li>Use <b>" + md + "</b> inside your markdown file <a id='myLink' href='#' onclick=\"copy_fun('" + md + "')\">Copy</a> </li>";
                    mes = mes + m
                }
                document.getElementById("message").innerHTML = mes;
            }

        }
    },
});

var editor = CodeMirror.fromTextArea(document.getElementById("content"), {
    mode: 'markdown',
    lineNumbers: true,
    theme: "default",
    extraKeys: {"Enter": "newlineAndIndentContinueMarkdownList"}
});

function isValidForm() {
    let form = document.getElementById("page-form")
    return form.PN.value !== "";
}

function validateForm() {
    if (!isValidForm()) {
        alert("Page name must be filled out");
        return false;
    }
    return true;
}

function save(name, redirect = false, auto = false) {
    const content = editor.getValue()
    const hasChanged = oldContent !== content || name !== pageName

    if (hasChanged) {
        let url = `/${window.location.pathname.split('/')[1]}`;
        if (url === '/edit') {
            url = url + "/" + pageName
        }
        axios({
            method: 'post',
            url: url,
            data: {
                name: name,
                content: content
            }
        }).then((response) => {
            if (redirect) {
                window.location.replace(`/${name}`)
            }
            pageName = name
            oldContent = content
            const today = new Date();
            var dt = today.toLocaleDateString("en-GB", { // you can use undefined as first argument
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });
            let savetimeElement = document.getElementById("save-time")
            savetimeElement.innerHTML = `Last saved: ${dt}`;
            savetimeElement.hidden = false;

            if (auto && document.getElementById("autosave").checked) {
                this.autosaveTimeout = setTimeout(autosave, AUTOSAVE_INTERVAL);
            }
        }, (error) => {
            console.log(error);
            if (auto && document.getElementById("autosave").checked) {
                this.autosaveTimeout = setTimeout(autosave, AUTOSAVE_INTERVAL);
            }
        });
    } else {
        if (auto && document.getElementById("autosave").checked) {
            this.autosaveTimeout = setTimeout(autosave, AUTOSAVE_INTERVAL);
        }
    }
}

// This method will autosave the page every x seconds
function autosave() {
    if (isValidForm()) {
        save(document.getElementById("page-form").PN.value, false, true)
    }
}

function enableAutosave(that) {
    if (that.checked) {
        autosave();
    } else {
        clearTimeout(this.autosaveTimeout)
    }
}



