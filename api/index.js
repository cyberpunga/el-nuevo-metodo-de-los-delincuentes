const { stringify } = require("querystring");
const { JSDOM } = require("jsdom");

async function versosDeGoogle(params) {
  const { window } = await JSDOM.fromURL(`https://www.google.com/search?${stringify(params)}`);
  const results = [...window.document.querySelectorAll("#main h3")];
  const textContents = results.map((x) => x.textContent);
  return textContents.map((a) =>
    a
      .toLowerCase()
      .replace(/\ \-.*/, "")
      .replace(/\ \|.*/, "")
      .replace(/\ \..*/, "")
  );
}

module.exports = async (_, res) => {
  const results = await versosDeGoogle({
    q: "el nuevo método de los delincuentes",
    cr: "countryCL",
    num: 100,
  });
  res.send(results);
};
