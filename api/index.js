const versosDeGoogle = require("../src");

module.exports = async (_, res) => {
  const results = await versosDeGoogle({
    q: "el nuevo método de los delincuentes",
    cr: "countryCL",
    num: 100,
  });
  res.send(results);
};
