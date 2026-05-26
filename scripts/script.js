const container = document.querySelector(".container");

const logOutBtn = document.querySelector("#logOut");

const sortByNameBtn = document.querySelector("#sortByName");
const sortByAgeBtn = document.querySelector("#sortByAge");
const sortByRegistrationDateBtn = document.querySelector("#sortByRegistrationDate");
const findByNameInput = document.querySelector("#findByName");
const findByAgeFromInput = document.querySelector("#findByAgeFrom");
const findByAgeToInput = document.querySelector("#findByAgeTo");
const findByCountryInput = document.querySelector("#findByCountry");

const discardBtn = document.querySelector("#discard");

const prevBtn = document.querySelector("#prevPage");
const nextBtn = document.querySelector("#nextPage");
const pageInfo = document.querySelector("#pageInfo");

let originalUserArray = [];
let currentUserArray = [];

let currentPage = 1;
const pageSize = 10;
let currentSort = "";

const debouncedFilter = _.debounce(() => {
    currentPage = 1;
    pageInfo.textContent = currentPage;
    currentUserArray = filterAll();
    renderUsers(currentUserArray);
}, 500);

logOutBtn.addEventListener("click", () => {
    localStorage.clear();
    document.getElementById('appContainer').hidden = true;
    document.getElementById('loginContainer').hidden = false;
});

prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        pageInfo.textContent = currentPage;
        updateURL();
        renderUsers(currentUserArray);
    }
});

nextBtn.addEventListener("click", () => {
    if (currentPage * pageSize < currentUserArray.length) {
        currentPage++;
        pageInfo.textContent = currentPage;
        updateURL();
        renderUsers(currentUserArray);
    }
});

discardBtn.addEventListener("click", () => {
    clearInputs();
    currentUserArray = [...originalUserArray];
    currentSort = "";

    currentPage = 1;
    pageInfo.textContent = currentPage;

    updateURL();
    renderUsers(currentUserArray);
});

sortByNameBtn.addEventListener("click", () => {
    currentUserArray = filterAll();
    currentUserArray = [...currentUserArray].sort((a, b) => a.name.first.localeCompare(b.name.first));
    currentSort = "name";
    updateURL();
    renderUsers(currentUserArray);
});

sortByAgeBtn.addEventListener("click", () => {
    currentUserArray = filterAll();
    currentUserArray = [...currentUserArray].sort((a, b) => a.dob.age - b.dob.age);
    currentSort = "age";
    updateURL();
    renderUsers(currentUserArray);
});

sortByRegistrationDateBtn.addEventListener("click", () => {
    currentUserArray = filterAll();
    currentUserArray= [...currentUserArray].sort((a, b) => new Date(a.registered.date) - new Date(b.registered.date));
    currentSort = "registrationDate";
    updateURL();
    renderUsers(currentUserArray);
});


findByNameInput.addEventListener("input", () => {
    debouncedFilter();
});

findByAgeFromInput.addEventListener("input", () => {
    debouncedFilter();
});
findByAgeToInput.addEventListener("input", () => {
    debouncedFilter();
});

findByCountryInput.addEventListener("input", () => {
    debouncedFilter();
});

function filterAll() {
    let result = [...originalUserArray];

    result = filterByAge(result);
    result = filterByName(result);
    result = filterByCountry(result);
    result = sortAll(result);

    currentPage = 1;
    updateURL();
    return result;
}

function filterByName(arr) {
    const searchTerm = findByNameInput.value.toLowerCase();
    const filteredUsers = [...arr].filter(user => 
        user.name.first.toLowerCase().includes(searchTerm) || user.name.last.toLowerCase().includes(searchTerm)
    );
    return filteredUsers;
}

function filterByAge(arr) {
    const ageFrom = parseInt(findByAgeFromInput.value) || 0;
    const ageTo = parseInt(findByAgeToInput.value) || 150;

    const filteredUsers = [...arr].filter(user => user.dob.age >= ageFrom && user.dob.age <= ageTo);
    return filteredUsers;
}

function filterByCountry(arr) {
    const countrySearchTerm = findByCountryInput.value.toLowerCase();
    const filteredUsers = [...arr].filter(user => user.location.country.toLowerCase().includes(countrySearchTerm));
    return filteredUsers;
}

function sortByName(arr) {
    return [...arr].sort((a, b) => a.name.first.localeCompare(b.name.first));
}

function sortByAge(arr) {
    return [...arr].sort((a, b) => a.dob.age - b.dob.age);
}

function sortByRegistrationDate(arr) {
    return [...arr].sort((a, b) => new Date(a.registered.date) - new Date(b.registered.date));
}

function sortAll(arr) {
    switch (currentSort) {
        case "name":
            return sortByName(arr);
        case "age":
            return sortByAge(arr);
        case "registrationDate":
            return sortByRegistrationDate(arr);
        default:
            return arr;
    }   
}

function getPaginatedUsers(users) {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return users.slice(start, end);
}

async function getUsers() {

    const response = await fetch("https://randomuser.me/api/?results=10");

    const data = await response.json();

    originalUserArray.push(...data.results);
    currentUserArray.push(...data.results);
}

function clearInputs() {
    findByNameInput.value = "";
    findByAgeFromInput.value = "";
    findByAgeToInput.value = "";
    findByCountryInput.value = "";
}

function renderUsers(users) {

    container.innerHTML = "";

    const paginated = getPaginatedUsers(users);

    for (const user of paginated) {
    const card = document.createElement("div");

        card.classList.add("card");

        card.innerHTML = `
            <img src="${user.picture.large}" alt="avatar">

            <h2>
                ${user.name.first} ${user.name.last}
            </h2>

            <p>Email: ${user.email}</p>

            <p>Phone: ${user.phone}</p>

            <p>Age: ${user.dob.age}</p>

            <p>Gender: ${user.gender}</p>

            <p>Country: ${user.location.country}</p>
            <p>Registered: ${new Date(user.registered.date).toLocaleDateString()}</p>
        `;

        const favoriteBtn = document.createElement("button");
        favoriteBtn.textContent = "Add to Favorites";
        favoriteBtn.classList.add("favorite-btn");

        card.appendChild(favoriteBtn);

        favoriteBtn.addEventListener("click", () => {
            localStorage.setItem(`favorite_${user.login.uuid}`, JSON.stringify(user));
            console.log(`User ${user.name.first} ${user.name.last} added to favorites.`);
            console.log(`User added: `, localStorage.getItem(`favorite_${user.login.uuid}`));
        });
        container.appendChild(card);
    }
}

function updateURL() {
    const params = new URLSearchParams();

    if (findByNameInput.value) {
        params.set("name", findByNameInput.value);
    }
    if (findByAgeFromInput.value) {
        params.set("ageFrom", findByAgeFromInput.value);
    }
    if (findByAgeToInput.value) {
        params.set("ageTo", findByAgeToInput.value);
    }
    if (findByCountryInput.value) {
        params.set("country", findByCountryInput.value);
    }
    if (currentSort) {
        params.set("sort", currentSort);
    }

    params.set("page", currentPage);

    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`);
}

function loadFromURL() {
    const params = new URLSearchParams(window.location.search);

    if (params.has("name")) {
        findByNameInput.value = params.get("name");
    }
    if (params.has("ageFrom")) {
        findByAgeFromInput.value = params.get("ageFrom");
    }
    if (params.has("ageTo")) {
        findByAgeToInput.value = params.get("ageTo");
    }
    if (params.has("country")) {
        findByCountryInput.value = params.get("country");
    }

    if (params.has("sort")) {
    currentSort = params.get("sort");
    }
    if (params.has("page")) {
    currentPage = parseInt(params.get("page"));
    }
}

async function init() {
await Promise.all([
        getUsers(),
        getUsers(),
        getUsers()
    ]);
    loadFromURL();
    currentUserArray = filterAll();
    renderUsers(currentUserArray);
}
init();
