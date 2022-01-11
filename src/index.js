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

module.exports = versosDeGoogle;
