const PATH_TO_CSV = "./data/Table_Input.csv";

document.addEventListener("DOMContentLoaded", () => {
  init();
});

async function init() {
  // Load data and modify html
  try {
    const csvText = await fetchCSV(PATH_TO_CSV);
    const data = parseCSV(csvText);
    populateTables(data);
  } catch (e) {
    console.error("Failed to populate tables.");
    console.log(e);
  }
}

async function fetchCSV(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Response falls outside the 2xx range: ${res.status}`);
  }

  return await res.text();
}

function parseCSV(csvText) {
  const result = Papa.parse(csvText, {
    header: true,
    complete: (results, file) => {
      console.log("✅ Complete parsing. Results: ", results);
    },
    error: (error, file) => {
      throw error;
    },
  });

  return result.data;
}

// Expected data's shape:
// [{'Index #': value, 'Value': value}...]
function populateTables(data) {
  // Verify data's shape
  if (!data || !Array.isArray(data) || !data.length >= 1)
    throw new Error("Data is not an array.");

  if (!Object.hasOwn(data[0], "Index #") || !Object.hasOwn(data[0], "Value"))
    throw new Error("Objects do not have keys: 'Index #' and 'Value'.");

  const t1Body = document.getElementById("table-1-body");
  const t2Body = document.getElementById("table-2-body");

  // Populate table 1
  data.forEach((row) => {
    const tr = document.createElement("tr");
    const tdIndex = document.createElement("td");
    const tdValue = document.createElement("td");

    tdIndex.textContent = row["Index #"];
    tdValue.textContent = row["Value"];
    tr.appendChild(tdIndex);
    tr.appendChild(tdValue);
    t1Body.appendChild(tr);
  });

  // Populate table 2
  const t2Data = [
    { category: "Alpha", value: "A5 + A20" },
    { category: "Beta", value: "A15 / A7" },
    { category: "Charlie", value: "A13 * A12" },
  ];

  const operators = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
  };

  t2Data.forEach((row) => {
    const [operand1, operator, operand2] = row["value"].split(" ");
    const num1 = Number(
      data.find((dRow) => dRow["Index #"] === operand1)["Value"],
    );
    const num2 = Number(
      data.find((dRow) => dRow["Index #"] === operand2)["Value"],
    );

    const value = Math.round(operators[operator](num1, num2));

    const tr = document.createElement("tr");
    const tdCategory = document.createElement("td");
    const tdValue = document.createElement("td");

    tdCategory.textContent = row["category"];
    tdValue.textContent = value;
    tr.appendChild(tdCategory);
    tr.appendChild(tdValue);
    t2Body.appendChild(tr);
  });
}
