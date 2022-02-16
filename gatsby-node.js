const { JSDOM } = require("jsdom");
const fetch = require("node-fetch");
const fs = require("fs");
const slugify = require("slugify");

async function getResults(params) {
  const qs = new URLSearchParams(params);
  const { window } = await JSDOM.fromURL(`https://www.google.cl/search?${qs}`);
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

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;
  const searchResults = await getResults({
    q: "el nuevo método de los delincuentes",
    cr: "countryCL",
    num: 100,
  });

  // Download all the audio files sequentially
  let results = [];
  for (let item of searchResults) {
    const fileName = `${slugify(item.title, { lower: true, strict: true })}.mp3`;
    const savePath = "./static/" + fileName;
    if (!fs.existsSync(savePath)) {
      const url = `https://serverless-tts.vercel.app/api/demo?voice=es-LA_SofiaV3Voice&text=${item.title}`;
      await downloadAudio(url, savePath);
      console.log(`✅ ${item.title} saved successfully`);
    }
    results.push({ ...item, audio: fileName });
  }

  // Download all the audio files in parallel
  // const results = await Promise.all(
  //   searchResults.map(async (item) => {
  //     const fileName = `${slugify(item.title, { lower: true, strict: true })}.mp3`;
  //     const savePath = "./static/" + fileName;
  //     if (!fs.existsSync(savePath)) {
  //       const url = `https://serverless-tts.vercel.app/api/demo?voice=es-LA_SofiaV3Voice&text=${item.title}`;
  //       await downloadAudio(url, savePath);
  //       console.log(`✅ ${item.title} saved successfully`);
  //     }
  //     return { ...item, audio: fileName };
  //   })
  // );

  createPage({
    path: "/",
    component: require.resolve(`./src/templates/index.js`),
    context: { results },
  });
};
