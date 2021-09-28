const serp = require("../serp");

async function googleCL(q) {
  try {
    const results = await serp.search({
      host: "google.cl",
      qs: {
        q,
        cr: "countryCL",
      },
      num: 100,
    });
    return results;
  } catch (err) {
    throw err;
  }
}

module.exports = async (_, res) => {
  const results = await googleCL("el nuevo método de los delincuentes");
  // const verses = results
  //   .map(({ title }) =>
  //     title
  //       .toLowerCase()
  //       .replace(/\ \-.*/, "")
  //       .replace(/\ \|.*/, "")
  //       .replace(/\ \..*/, "")
  //   )
  //   .filter((x) => x.includes("nuevo"))
  //   .filter((x) => x.includes("método"));
  res.send(results.map((x) => JSON.stringify(x)));
};
