
const BASE_URL = "http://localhost:3000/monsters";
const PER_PAGE = 50;
let totalPages = 1;
let currentPage = 1;
let currentUrl = `${BASE_URL}/?_limit=${PER_PAGE}&_page=`;

document.addEventListener("DOMContentLoaded", () => {
  getAllMonsters() // determining page count
  loadMonsters(currentPage);
  paginateMonsters();
  loadMonsterForm(); // do this after 'loadMonsters()'
  listenForMonsterCreation();
});

function loadMonsters(page) {
  clearMonstersDisplay(); // get rid of old data...
  getData(currentUrl + page).then(monsters => {
    // setTotalPages(Math.ceil(monsters.length/PER_PAGE));
    displayMonsters(monsters);

    setupPageTracking(); // TODO: make it catch page 1
    console.log("Total page count: ", getTotalPages());
  });
}

function getData(url) {
  return fetch(url).then(response => response.json());
}

function getTotalPages() {
  return totalPages;
}

function setTotalPages(pageCount) {
  totalPages = pageCount;
  console.log("total pages set to: ", totalPages);
}

// determining total pages
function getAllMonsters() {
  getData(BASE_URL).then(allMonsters => {
    setTotalPages(Math.ceil(allMonsters.length/PER_PAGE));
  });
}

function displayMonsters(monsters) {
  monsters.forEach(monster => displayMonster(monster));
}

function displayMonster(monster) {

  // create elements
  let oneMonsterDiv = document.createElement("div");
  let nameAgeP = document.createElement("p");
  let nameSpan = document.createElement("span");
  let ageSpan = document.createElement("span");
  let descP = document.createElement("p");

  // spice elements up
  oneMonsterDiv.classList.add("monster");

  // add data
  nameSpan.innerHTML = `(${monster.id}) ${monster.name}`;
  ageSpan.innerHTML = ` &#9482; <span class="lbl">Age:</span> ${monster.age}`; // &#9482; == HTML dotted vertical pipe.
  descP.innerHTML = `<span class="lbl">Bio:</span> ${monster.description}`;

  // stitch things together
  nameAgeP.append(nameSpan, ageSpan);
  oneMonsterDiv.append(nameAgeP, descP);
  getMonstersContainer().appendChild(oneMonsterDiv);
}

function loadMonsterForm() {
  let createMonsterDiv = document.querySelector("#create-monster");
  let monsterForm = `
    <form name="create-monster">
      <label for="m-name">Name</label>
      <input id="m-name" name="monster-name" type="text" placeholder="Monster's name...">
      <label for="m-age">Age</label>
      <input id="m-age" name="age" type="text" placeholder="Monster's age...">
      <label for="m-desc">Description</label>
      <input id="m-desc" name="desc" type="text" placeholder="Monster's description...">
      <input type="submit" name="submit" value="Create Monster">
    </form>
    <hr>
  `;
  createMonsterDiv.innerHTML = monsterForm;
}

function getMonstersContainer() {
  // find the anchor point for rendering
  return document.querySelector('#monster-container');
}

function getMonsterForm() {
  return document.forms["create-monster"];
}

function isEmpty(stringValue) {
  return !stringValue;
} 

function listenForMonsterCreation() {
  const f = getMonsterForm();
  f.addEventListener("submit", (evt) => {
    evt.preventDefault();
    createMonster();
  });
}

function createMonster() {
  const TYPE_JSON = "application/json";
  let d = getFormData();
  console.log("form data: ", d);

  if (d != false) {
    let requestConfig = {
      method: "POST",
      headers: {
        "Content-Type": TYPE_JSON,
        "Accept": TYPE_JSON
      },
      body: JSON.stringify(d)
    }
  
    fetch(BASE_URL, requestConfig)
      .then(response => response.json())
      .then(monster => {
        console.log("Monster created successfully: ", monster);
        displayMonster(monster);
      })
      .catch(error => console.error(error));
  } else {
    let msg = "Something wrong with monster data..."
    console.error(msg);
  }
}

function getFormData() {
  const f = getMonsterForm();
  let name = f.querySelector("#m-name").value;
  let age = Number.parseFloat(f.querySelector("#m-age").value);
  let description = f.querySelector("#m-desc").value;
  if (isEmpty(name) || isEmpty(age) || isEmpty(description)) {
    let msg = "Please fill out all the form fields...";
    alert(msg);
    return false;
  } else {
    f.reset(); // Success: Clear form fields.
    return { name, age, description };
  }
}

function paginateMonsters() {
  const prevBtn = document.getElementById("back");
  const nextBtn = document.getElementById("forward");

  // page tracking
  let trackingSpan = document.createElement("span");
  trackingSpan.classList.add("spaced-out");
  trackingSpan.setAttribute("id", "page-number-tracking");
  trackingSpan.innerHTML = "unknown pages";
  document.body.insertBefore(trackingSpan, nextBtn);

  prevBtn.addEventListener("click", () => previousPage());
  nextBtn.addEventListener("click", () => nextPage());
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    loadMonsters(currentPage);
  } else {
    alert("You are on the FIRST page...");
    return false;
  }
}

function nextPage() {
  if (currentPage < getTotalPages()) {
    currentPage++;
    loadMonsters(currentPage);
  } else {
    alert("You are on the LAST page...");
    return false;
  }
}

function clearMonstersDisplay() {
  let c = getMonstersContainer();
  let last;
  if (c.hasChildNodes()) {
    while (last = c.lastChild) {
      c.removeChild(last);
    }
  }
}

function setupPageTracking() {
  let ts = document.getElementById("page-number-tracking");
  ts.innerHTML = `page ${currentPage} of ${getTotalPages()}`;
}


