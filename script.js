// variabelen om algemeen te gebruiken
const parentUL = document.getElementById("add-list");
const addToListButton = document.getElementById("add-Task");
const textbox = document.getElementById("textbox-id");
let madeItem = {};

// deze functie maakt li's waar de reeds gemaakte en nieuwe items in worden geplaatst
function makeLiItem(item) {
  const newListItem = document.createElement("li");
  const newInputItem = document.createElement("input");
  const newLabel = document.createElement("label");
  const newDelButton = document.createElement("button");
  newInputItem.type = "checkBox";
  newInputItem.id = "done-" + item._id;
  newLabel.type = "text";
  newLabel.setAttribute("for", newInputItem.id);
  newDelButton.className = "far fa-trash-alt";

  if (item.done == true) {
    newInputItem.checked = true;
    newListItem.classList.add("strikedtext");
  }

  newListItem.appendChild(newInputItem);
  newListItem.appendChild(newLabel);
  newListItem.appendChild(newDelButton);
  parentUL.appendChild(newListItem);

  // de eventlistener voor de button IN de maak functie
  newDelButton.addEventListener("click", function (e) {
    console.log("del button id", item._id);
    deleteData(`http://localhost:3000/${item._id}`);
    // maakt de parent UL leeg voordat de nieuwe lijst wordt geladen
    document.getElementById("add-list").innerHTML = "";
    getData("http://localhost:3000/").then((data) => makeList(data));
  });
  newInputItem.addEventListener("change", function (e) {
    console.log("new input item", e);
    const target = e.target;
    console.log("strike!");
    target.parentElement.classList.toggle("strikedtext");
    changeData(`http://localhost:3000/${item._id}`, {
      done: target.checked,
    });
  });
  // geeft de iD aan het gemaakte item
  newListItem.setAttribute("id", item._id);
  // zorgt dat de text uit de box eronder verschijnt.
  newLabel.innerText = item.description;
  console.log("made Item:", (madeItem = { newListItem }));
}

function makeList(data) {
  data.forEach((item) => makeLiItem(item));
}
// eerste keer de opgeslagen lijst van de DB ophalen:
getData("http://localhost:3000/").then((data) => makeList(data));

textbox.addEventListener("change", function (e) {
  postData("http://localhost:3000/", {
    description: textbox.value,
    done: false,
  }).then((data) => {
    console.log(data);
    makeLiItem(data); // JSON data parsed by `data.json()` call
    textbox.value = "";
  });
});

