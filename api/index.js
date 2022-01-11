const { JSDOM } = require("jsdom");

const url =
  "https://www.google.com/search?q=el+nuevo+método+de+los+delincuentes&cr=countryCL";

async function googlea(url) {
  const { window } = await JSDOM.fromURL(url);
  const results = [...window.document.querySelectorAll("#main h3")];
  const arr = results.map((x) => x.textContent);
  return arr;
}

async function usingPromiseAll(times) {
  const arr = Array.from({ length: times }, (_, i) => i * 10);
  const results = (
    await Promise.all(arr.map((page) => googlea(url + `&start=${page}`)))
  ).flat();
  console.log(results, results.length);
  return results;
}

module.exports = async (_, res) => {
  const results = await usingPromiseAll(10);
  const verses = results.map((a) =>
    a
      .toLowerCase()
      .replace(/\ \-.*/, "")
      .replace(/\ \|.*/, "")
      .replace(/\ \..*/, "")
  );
  res.send(verses);
};
