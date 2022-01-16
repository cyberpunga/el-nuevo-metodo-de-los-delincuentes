const { JSDOM } = require("jsdom");
const { stringify } = require("querystring");
const fetch = require("node-fetch");
const fs = require("fs");

function cleanUp(text) {
  return text
    .toLowerCase()
    .replace(/^(\d{2}|\d{1})\ ([a-z]{4}|[a-z]{3})\ \d{4}\ ·\ /, "")
    .replace(/publicado:\ (\d{2}|\d{1})\ ([a-z]{4}|[a-z]{3})\ \d{4}$/, "")
    .replace(/^\.\.\./, "")
    .replace(/\ \-\ .*/, "")
    .replace(/\ \|\ .*/, "")
    .replace(/^\[[a-z]{3}\]/, "")
    .replace(/\.\.\.$/, "")
    .trim();
}

async function getResults(params) {
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

async function downloadAudio(url, dest) {
  const file = fs.createWriteStream(dest);
  const response = await fetch(url);
  response.body.pipe(file);
  return new Promise((resolve, reject) => {
    file.on("finish", () => {
      file.close(resolve);
    });
    file.on("error", (err) => {
      fs.unlink(dest);
      reject(err);
    });
  });
}

module.exports = { getResults, downloadAudio };
