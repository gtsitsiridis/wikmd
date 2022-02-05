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
            url: './{{upload_path}}',
            onload: (response) => {
                let filename = response;
                messages.push(filename);
                let mes = "";
                let i;
                for (i in messages) {
                    let md;
                    md = "![caption](/{{upload_path}}/" + messages[i] + ")";
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

// function validate_form(that) {
//     if (that.PN.value === "") {
//         alert("Name must be filled out");
//         return false;
//     }
// }

// // This method will autosave the page every x seconds
// function autosave() {
//
//     setTimeout(autosave, 10000);
// }

// autosave();