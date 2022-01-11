const { stringify } = require("querystring");
const { JSDOM } = require("jsdom");

async function versosDeGoogle(params) {
  const { window } = await JSDOM.fromURL(`https://www.google.com/search?${stringify(params)}`);
  const results = [...window.document.querySelectorAll("#main h3")].map((result) => ({
    title: result.textContent,
    description: result.closest("div").nextElementSibling?.textContent,
    href: result.closest("a")?.href,
  }));
  return results;
}

module.exports = versosDeGoogle;
