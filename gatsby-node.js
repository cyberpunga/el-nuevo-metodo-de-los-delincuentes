const { getResults, downloadAudio } = require("./src/utils");
const slugify = require("slugify");
const fs = require("fs");

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;
  const searchResults = await getResults({
    q: "el nuevo método de los delincuentes",
    cr: "countryCL",
    num: 100,
  });
  const results = await Promise.all(
    searchResults.map(async (item) => {
      const fileName = `${slugify(item.title, { lower: true, strict: true })}.mp3`;
      const savePath = "./static/" + fileName;
      if (!fs.existsSync(savePath)) {
        const url = `https://serverless-tts.vercel.app/api/demo?voice=es-LA_SofiaV3Voice&text=${item.title}`;
        await downloadAudio(url, savePath);
        console.log(`✅ ${item.title} saved successfully`);
      }
      return { ...item, audio: fileName };
    })
  );
  createPage({
    path: "/",
    component: require.resolve(`./src/templates/index.js`),
    context: { results },
  });
};
