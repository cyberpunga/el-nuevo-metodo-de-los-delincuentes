const { JSDOM } = require("jsdom");
const { stringify } = require("querystring");
const fetch = require("node-fetch");
const fs = require("fs");

async function getResults(params) {
  const { window } = await JSDOM.fromURL(`https://www.google.cl/search?${stringify(params)}`);
  const results = [...window.document.querySelectorAll("#main h3")].map((result) => {
    let url = new URL(result.closest("a")?.href);
    let href = new URLSearchParams(url.searchParams).get("q");
    let title = result.textContent;
    return { href, title };
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
