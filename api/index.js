const { getResults } = require("../src/utils");

module.exports = async (_, res) => {
  const results = await getResults({
    q: "el nuevo método de los delincuentes",
    cr: "countryCL",
    num: 100,
  });
  res.send(results);
};
