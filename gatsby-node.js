const { getResults, downloadAudio } = require("./src/utils");
const slugify = require("slugify");
const fs = require("fs");

exports.createPages = async ({ actions }) => {
  const { createPage } = actions;
  const results = await getResults({
    q: "el nuevo método de los delincuentes",
    cr: "countryCL",
    num: 100,
  });
  await Promise.all(
    results.map(async (item) => {
      const savePath = `./public/${slugify(item.title, { lower: true })}.mp3`;
      if (!fs.existsSync(savePath)) {
        const url = `https://serverless-tts.vercel.app/api/demo?voice=es-LA_SofiaV3Voice&text=${item.title}`;
        await downloadAudio(url, savePath);
        console.log(`✅ ${item.title} saved successfully`);
      }
    })
  );
  createPage({
    path: "/",
    component: require.resolve(`./src/templates/index.js`),
    context: { results },
  });
};
