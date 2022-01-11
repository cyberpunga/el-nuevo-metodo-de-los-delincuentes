const versosDeGoogle = require("./src");

async function runLocally() {
  const results = await versosDeGoogle({
    q: "el nuevo método de los delincuentes",
    cr: "countryCL",
    num: 100,
  });
  console.log(results);
}

runLocally();