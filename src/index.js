const { stringify } = require("querystring");
const { JSDOM } = require("jsdom");

function cleanUp(text) {
  return text
    .toLowerCase()
    .replace(/^(\d{2}|\d{1})\ ([a-z]{4}|[a-z]{3})\ \d{4}\ ·\ /, "")
    .replace(/publicado:\ (\d{2}|\d{1})\ ([a-z]{4}|[a-z]{3})\ \d{4}$/, "")
    .replace(/\.\.\.$/, "")
    .replace(/^\.\.\./, "")
    .replace(/\ \-\ .*/, "")
    .replace(/^\[[a-z]{3}\]/, "")
    .trim();
}

async function versosDeGoogle(params) {
  const { window } = await JSDOM.fromURL(`https://www.google.com/search?${stringify(params)}`);
  const results = [...window.document.querySelectorAll("#main h3")].map((result) => {
    let url = new URL(result.closest("a")?.href);
    let href = new URLSearchParams(url.searchParams).get("q");
    let title = cleanUp(result.textContent);
    let description = cleanUp(result.parentElement.parentElement.nextElementSibling.nextElementSibling?.children[0].children[0].children[0].textContent);
    return { href, title, description };
  });
  return results;
}

module.exports = versosDeGoogle;
