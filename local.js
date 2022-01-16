const { getResults } = require("./src/utils");

async function runLocally() {
  const results = await getResults({
    q: "el nuevo método de los delincuentes",
    cr: "countryCL",
    num: 100,
  });
  console.log(JSON.stringify(results, null, 2));
}

runLocally();
