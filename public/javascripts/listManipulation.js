document.addEventListener("DOMContentLoaded", e => {
    document.addEventListener("click", c => {
        if (c.target.nodeName.toLowerCase() === "button" && c.target.parentElement.parentElement.id.includes("task-")) {
            let taskID = c.target.parentElement.parentElement.id;

            if (c.target.classList[0] === "edit" && document.getElementsByName("editForm-" + taskID).length === 0) { // Editace tasku
                let polozka = document.getElementById(taskID).getElementsByClassName("polozka")[0];

                //Define form
                let form = document.createElement("form");
                form.name = "editForm-" + taskID;
                //Define Form Textbox
                let formTextbox = document.createElement("input");
                formTextbox.type = "textbox";
                formTextbox.name = "formTextbox" + taskID;
                formTextbox.value = polozka.innerText;
                polozka.innerText = ""; //Vyklidí pole pro input box
                //Define Form Input button
                let formSubmit = document.createElement("input");
                formSubmit.type = "submit";
                formSubmit.value = "Uložit";
                //Connect form together
                form.appendChild(formTextbox);
                form.appendChild(formSubmit);
                polozka.appendChild(form);

                document.getElementsByName(form.name)[0].addEventListener('submit', e => {
                    e.preventDefault();
                    if (document.getElementsByName(formTextbox.name)[0].value.trim().length <= 0) {
                        //TODO Udělat vlastní alertBox
                        alert("Zadaná hodnota musí něco obsahovat");
                    } else {
                        let task = document.getElementsByName(formTextbox.name)[0].value,
                            xhr = new XMLHttpRequest();

                        xhr.open('PUT', '/list/edit');
                        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                        xhr.onload = () => {
                            if (xhr.status === 200) {
                                let response = JSON.parse(xhr.responseText);
                                let textnode = document.createTextNode(response.task);
                                polozka.innerHTML = "";
                                polozka.appendChild(textnode);
                            } else if (xhr.status !== 200) {
                                alert('Požadavek selhal. Chyba ' + xhr.status);
                            }
                        };
                        xhr.send(encodeURI('id=' + taskID + '&task=' + task));
                    }
                });
            } else if (c.target.classList[0] === "remove") { // Odstranění tasku
                c.preventDefault();
                let taskID = c.target.parentElement.parentElement.id;
                let xhr = new XMLHttpRequest();

                xhr.open('DELETE', '/list/remove');
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        if (xhr.responseText === "true") {
                            c.target.parentElement.parentElement.remove();
                        } else {
                            alert("Položku se nepodařilo odstranit");
                        }
                    } else if (xhr.status !== 200) {
                        alert('Požadavek selhal. Chyba ' + xhr.status);
                    }
                };
                xhr.send(encodeURI('id=' + taskID));
            }
        } else if (c.target.type === "checkbox" && c.target.parentElement.parentElement.id.includes("task-")) {
            let taskID = c.target.parentElement.parentElement.id,
                xhr = new XMLHttpRequest();

            xhr.open('PUT', '/list/check');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = () => {
                if (xhr.status === 200) {
                    if (xhr.responseText === "checked") {
                        let fragment = document.createDocumentFragment();
                        fragment.appendChild(document.getElementById(taskID));
                        document.getElementById('donelist').getElementsByTagName("tbody")[0].appendChild(fragment);
                    } else if (xhr.responseText === "unchecked") {
                        let fragment = document.createDocumentFragment();
                        fragment.appendChild(document.getElementById(taskID));
                        document.getElementById('list').getElementsByTagName("tbody")[0].appendChild(fragment);
                    } else {
                        alert("Položku se nepodařilo odškrtnout");
                    }
                } else if (xhr.status !== 200) {
                    alert('Požadavek selhal. Chyba ' + xhr.status);
                }
            };
            xhr.send(encodeURI('id=' + taskID + "&done=" + (c.target.checked ? "check" : "uncheck")));
        }
    });

    document.getElementById("addTask").addEventListener('submit', e => { // Přidání tasku
        e.preventDefault();
        if (document.addTask.taskText.value.trim().length <= 0) {
            alert("Zadaná hodnota musí něco obsahovat");
        } else {
            let task = document.addTask.taskText.value,
                xhr = new XMLHttpRequest();

            xhr.open('POST', '/list/add');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = () => {
                if (xhr.status === 200) {
                    let response = JSON.parse(xhr.responseText);
                    let parent = document.createElement("tr");
                    parent.id = response.id;
                    //Vytvořit checkbox
                    let checkboxNode = document.createElement("td");
                    let checkbox = document.createElement("input");
                    checkboxNode.classList.add('checkbox');
                    checkbox.type = "checkbox";
                    checkbox.value = "Hotovo";
                    checkboxNode.appendChild(checkbox);
                    parent.appendChild(checkboxNode);
                    //Vytvořit novou položku seznamu
                    let node = document.createElement("td");
                    let textnode = document.createTextNode(response.task);
                    node.classList.add('polozka');
                    node.appendChild(textnode);
                    parent.appendChild(node);
                    //Vytvořit tlačítka
                    let buttonNode = document.createElement("td");
                    let editButton = document.createElement("button");
                    let removeButton = document.createElement("button");
                    buttonNode.classList.add('tlacitka');
                    editButton.classList.add('edit');
                    removeButton.classList.add('remove');
                    buttonNode.appendChild(editButton);
                    buttonNode.appendChild(removeButton);
                    parent.appendChild(buttonNode);
                    //Přilepit vytvořené HTML
                    document.getElementById("list").getElementsByTagName("tbody")[0].appendChild(parent);
                    //Vyčistit pole po přidání
                    document.addTask.taskText.value = "";
                } else if (xhr.status !== 200) {
                    alert('Požadavek selhal. Chyba ' + xhr.status);
                }
            };
            xhr.send(encodeURI('task=' + task));
        }
    });
});