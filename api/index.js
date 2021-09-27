const serp = require("serp");

module.exports = async (_, res) => {
  const results = await serp.search({
    host: "google.cl",
    qs: {
      q: "el nuevo método de los delincuentes",
      cr: "countryCL",
    },
    num: 100,
  });
  const verses = results
    .map(({ title }) =>
      title
        .toLowerCase()
        .replace(/\ \-.*/, "")
        .replace(/\ \|.*/, "")
        .replace(/\ \..*/, "")
    )
    .filter((x) => x.includes("nuevo"))
    .filter((x) => x.includes("método"));
  res.send(verses);
};
