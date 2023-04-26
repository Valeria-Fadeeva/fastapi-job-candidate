const createCandidateEmployeeModal = new bootstrap.Modal(document.getElementById("createCandidateEmployeeModal"), {});
const deleteCandidateEmployeeModal = new bootstrap.Modal(document.getElementById("deleteCandidateEmployeeModal"), {});
const btnCreateCandidateEmployee = document.getElementById("createCandidateEmployee");
btnCreateCandidateEmployee.addEventListener("click", async () => await document.getElementById("formCreateCandidateEmployee").reset());
btnCreateCandidateEmployee.addEventListener("click", async () => await createCandidateEmployeeModal.show());


// Получение всех пользователей
async function getUsers() {
    // отправляет запрос и получаем ответ
    const response = await fetch("/api/users", {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    // если запрос прошел нормально
    if (response.ok === true) {
        // получаем данные
        const users = await response.json();
        const rows = document.querySelector(".userdata");
        // добавляем полученные элементы в таблицу
        users.forEach(user => rows.append(row(user)));
    }
}

// Получение одного пользователя
async function getUser(id) {
    const response = await fetch(`/api/users/${id}`, {
        method: "GET",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const user = await response.json();
        document.getElementById("userId").value = user.id;
        document.getElementById("userName").value = user.name;
        document.getElementById("userAge").value = user.age;
        document.getElementById("userCompany").value = user.company;

        document.getElementById("userIdWantToDelete").value = user.id;
        document.getElementById("userNameWantToDelete").value = user.name;

        //document.getElementById("userLanguages").value = user.languages;
        console.log(user.languages);
        let values = user.languages;
        values = values.replaceAll('"', '');
        values = values.replaceAll('[', '');
        values = values.replaceAll(']', '');
        values = values.split(', ');

        if (typeof(values) != 'object') {
            values = values.split(',');
        }

        let options = Array.from(document.getElementById("userLanguages"));
        console.log(options);

        values.forEach(function(v) {
            console.log(v)
            options.find(c => c.value == v).selected = true;
        });
    }
    else {
        // если произошла ошибка, получаем сообщение об ошибке
        const error = await response.json();
        console.log(error.message); // и выводим его на консоль
    }
}

// Добавление пользователя
async function createUser(userName, userAge, userLanguages, userCompany) {

    const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            name: userName,
            age: parseInt(userAge, 10),
            languages: userLanguages,
            company: userCompany
        })
    });
    if (response.ok === true) {
        const user = await response.json();
        document.querySelector(".userdata").append(row(user));
    }
    else {
        const error = await response.json();
        console.log(error.message);
    }
}

// Изменение пользователя
async function editUser(userId, userName, userAge, userLanguages, userCompany) {
    const response = await fetch("api/users", {
        method: "PUT",
        headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
            id: userId,
            name: userName,
            age: parseInt(userAge, 10),
            languages: userLanguages,
            company: userCompany
        })
    });
    if (response.ok === true) {
        const user = await response.json();
        document.querySelector(`tr[data-rowid='${user.id}']`).replaceWith(row(user));
    }
    else {
        const error = await response.json();
        console.log(error.message);
    }
}

// Удаление пользователя
async function deleteUser(id) {
    const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
        headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
        const user = await response.json();
        document.querySelector(`tr[data-rowid='${user.id}']`).remove();
    }
    else {
        const error = await response.json();
        console.log(error.message);
    }
}

// сброс данных формы после отправки
function reset() {
    document.getElementById("userId").value =
    document.getElementById("userName").value =
    document.getElementById("userAge").value =
    document.getElementById("userLanguages").value =
    document.getElementById("userCompany").value = "";

    document.getElementById("userIdWantToDelete").value = "";
    document.getElementById("userNameWantToDelete").value = "";
}

// создание строки для таблицы
function row(user) {
    const tr = document.createElement("tr");
    tr.setAttribute("data-rowid", user.id);

    const th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.setAttribute("data-rowid", user.id);
    th.append(user.id);
    tr.append(th);

    const nameTd = document.createElement("td");
    nameTd.className = "text-start";
    nameTd.append(user.name);
    tr.append(nameTd);

    const ageTd = document.createElement("td");
    ageTd.append(user.age);
    tr.append(ageTd);

    const languagesTd = document.createElement("td");
    languagesTd.className = "text-start";

    language_value = user.languages
    language_value = language_value.replaceAll('"', '');
    language_value = language_value.replaceAll('[', '');
    language_value = language_value.replaceAll(']', '');
    // console.log(language_value);
    languagesTd.append(language_value);
    //languagesTd.append(user.languages);
    tr.append(languagesTd);

    const companyTd = document.createElement("td");
    companyTd.className = "text-start";
    companyTd.append(user.company);
    tr.append(companyTd);

    const linksTd = document.createElement("td");

        const editLink = document.createElement("a");
        editLink.className = "btn btn-outline-dark";
        i = document.createElement('i');
        i.className = "fa-solid fa-pen-to-square";
        editLink.appendChild(i);

        editLink.addEventListener("click", async () => await getUser(user.id));
        editLink.addEventListener("click", async () => await createCandidateEmployeeModal.show());

    linksTd.append(editLink);

        const removeLink = document.createElement("a");
        removeLink.className = "btn btn-outline-danger";
        i = document.createElement('i');
        i.className = "fa-solid fa-trash";
        removeLink.appendChild(i);

    //removeLink.addEventListener("click", async () => await deleteUser(user.id));
    removeLink.addEventListener("click", async () => await getUser(user.id));
    removeLink.addEventListener("click", async () => await deleteCandidateEmployeeModal.show());

    linksTd.append(removeLink);
    tr.appendChild(linksTd);

    return tr;
}

// сброс значений формы
document.getElementById("resetBtn").addEventListener("click", () => reset());
document.getElementById("resetDeleteFormBtn").addEventListener("click", () => reset());

// отправка формы
document.getElementById("saveBtn").addEventListener("click", async () => {
    const id = document.getElementById("userId").value;
    const name = document.getElementById("userName").value;
    const age = document.getElementById("userAge").value;
    //const languages = document.getElementById("userLanguages").value;
    const languages = [...document.getElementById("userLanguages").options]
        .filter(x => x.selected)
        .map(x => x.value);
    const company = document.getElementById("userCompany").value;

    if (id === "")
        await createUser(name, age, languages, company);
    else
        await editUser(id, name, age, languages, company);
    reset();
});

document.getElementById("deleteBtn").addEventListener("click", async () => {
    const id = document.getElementById("userIdWantToDelete").value;
    if (id !== "")
        await deleteUser(id);
    reset();
});

// загрузка пользователей
getUsers();
