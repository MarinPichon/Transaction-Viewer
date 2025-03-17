const app = {
  tableGenerator(choiceValue) {
    for (let i = 0; i < choiceValue; i++) {
      const li = document.createElement("li");
      li.className = "li-generated";
      const textInDates = document.createElement("p");
      textInDates.className = "text-in-divs";
      const textInReasons = document.createElement("p");
      textInReasons.className = "text-in-divs";
      const textInAmounts = document.createElement("p");
      textInAmounts.className = "text-in-divs";
      const inputPaste = document.createElement("input");
      inputPaste.className = "input-paste";
      const textZonesDate = document.createElement("div");
      textZonesDate.className = "text-zones-date";
      const textZonesReason = document.createElement("div");
      textZonesReason.className = "text-zones-reason";
      const textZonesAmount = document.createElement("div");
      textZonesAmount.className = "text-zones-amount";
      const containerDeal = document.querySelector(".container-deal");

      li.appendChild(textZonesDate);
      li.appendChild(textZonesReason);
      li.appendChild(textZonesAmount);
      textZonesDate.append(textInDates);
      textZonesAmount.append(textInAmounts);
      textZonesReason.append(textInReasons);
      containerDeal.append(li);
      document.body.appendChild(li);
    }
  },

  validateChoice() {
    const buttonValidate = document.querySelector(".button-header");
    buttonValidate.addEventListener("click", (event) => {
      event.preventDefault();
      const inputValue = document.querySelector(".input-header");
      const choiceValue = inputValue.value;
      app.tableGenerator(choiceValue);
      inputValue.value = 0;
      app.inputValuesSplit();
    });
  },

  inputValuesSplit() {
    const inputPaste = document.querySelector(".input-paste");
    inputPaste.addEventListener("paste", (event) => {
      event.preventDefault();
      /*.trim() supprime les espaces, tabulations, et retours à la ligne au début
      et à la fin de la chaîne, ici pour la chaîne copiée*/
      const paste = event.clipboardData.getData("text").trim();
      // Divise la chaîne copiée en un tableau, chaque élément étant une ligne séparée par un "entrer" (\n)
      const pasteArray = paste.split("\n");
      inputPaste.value = pasteArray[0];

      const allTextZones = document.querySelectorAll(
        ".text-zones-date, .text-zones-reason, .text-zones-amount"
      );
      const textInDates = document.querySelectorAll(".text-in-divs");
      const textInAmounts = document.querySelectorAll(".text-in-divs");
      const textInReasons = document.querySelectorAll(".text-in-divs");

      let inputIndex = 0;

      for (let i = 0; i < pasteArray.length; i += 4) {
        const dates = textInDates[inputIndex];
        dates.textContent = pasteArray[i];
        const reasons = textInReasons[inputIndex + 1];
        reasons.textContent = pasteArray[i + 1] + " " + pasteArray[i + 2];
        const amounts = textInAmounts[inputIndex + 2];

        amounts.textContent = pasteArray[i + 3];
        if (amounts.textContent.charAt(0) === "+") {
          amounts.style.color = "#007461";
          amounts.style.fontWeight = "bold";
        }
        inputIndex += 3;
      }
      app.totalEarned();
      app.searchBar(pasteArray);
    });
  },

  totalEarned() {
    const allInputsAmount = document.querySelectorAll(".text-zones-amount");
    let totalEarned = 0;
    let totalSpent = 0;
    allInputsAmount.forEach((input) => {
      if (input.textContent.charAt(0) === "+") {
        const cleanedValue = input.textContent
          .replace(/\s/g, "")
          .replace("€", "")
          .replace(",", ".")
          .trim();
        const totalPlus = parseFloat(cleanedValue);
        totalEarned += totalPlus;
        const green = document.querySelector(".earned");
        green.innerText = "GAINS : " + totalEarned.toFixed(2) + " €";
      } else if (input.textContent.charAt(0) === "-") {
        const cleanedValue = input.textContent
          .replace(/\s/g, "")
          .replace("€", "")
          .replace(",", ".")
          .trim();
        const totalLess = parseFloat(cleanedValue);
        totalSpent += totalLess;
        const red = document.querySelector(".spent");
        red.innerText = "DEPENSES : " + totalSpent.toFixed(2) + " €";
      }
      app.count(totalEarned, totalSpent);
    });
  },

  count(totalEarned, totalSpent) {
    const countZone = document.querySelector(".count-total");

    const countCalculation = totalEarned + totalSpent;
    if (countCalculation >= 0) {
      countZone.innerText = countCalculation.toFixed(2) + " €";
      countZone.style.color = "#00FF7F";
    } else if (countCalculation <= 0) {
      countZone.innerText = countCalculation.toFixed(2) + " €";
      countZone.style.color = "#FF3B30 ";
    }
  },

  highlightPositiveAmount() {
    const textInAmountsAreas = document.querySelectorAll(".text-in-divs");
    if (textInAmountsAreas.textContent.charAt(0) === "+") {
      textInAmountsAreas.style.color = "#007461";
      textInAmountsAreas.style.fontWeight = "bold";
    }
  },

  searchBar() {
    const inputSearchBar = document.querySelector(".search-bar");
    inputSearchBar.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const allTextArea = document.querySelectorAll(".text-in-divs");
        allTextArea.forEach((element) => {
          const textContents = element.textContent.toLowerCase();

          const orignalText = element.textContent;
          const search = textContents.includes(
            inputSearchBar.value.toLowerCase()
          );

          if (inputSearchBar.value === "") {
            element.textContent = orignalText;
            element.style.color = "#000";
            if (element.textContent.charAt(0) === "+") {
              element.style.color = "#007461";
              element.style.fontWeight = "bold";
            }
          } else if (search === true) {
            element.textContent = orignalText;
            if (element.textContent.charAt(0) === "+") {
              element.style.color = "#007461";
              element.style.fontWeight = "bold";
            }

            const match = inputSearchBar.value;
            const regex = new RegExp(match, "gi");
            const test = (element.innerHTML = orignalText.replace(
              regex,
              (match) => {
                return `<span style='background-color: #00fff7;'>${match}</span>`;
              }
            ));
            element.innerHTML = test;
          } else {
            element.textContent = orignalText;
            element.style.color = "#000";
            if (element.textContent.charAt(0) === "+") {
              element.style.color = "#007461";
              element.style.fontWeight = "bold";
            }
          }
        });
      }
    });
  },
};

document.addEventListener("DOMContentLoaded", function () {
  app.validateChoice();
  app.searchBar();
  const resetAtStartSearchBar = document.querySelector(".search-bar");
  resetAtStartSearchBar.value = "";
  const resetAtStartInputPaste = document.querySelector(".input-paste");
  resetAtStartInputPaste.value = "";
});
