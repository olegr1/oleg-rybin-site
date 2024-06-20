const { minify } = require("terser");
const CleanCSS = require("clean-css");
const htmlmin = require("html-minifier");

module.exports = function(eleventyConfig) {

  eleventyConfig.addFilter("formatMonthYear", function(partialDate) { 

      var [year, month] = partialDate.split('-');

      const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
      ];

      const date = new Date(year, parseInt(month) - 1);
      const formattedDate = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      return formattedDate;
  });

  eleventyConfig.addFilter("getNumberOfYearsBetween", function(dateOne, dateTwo) { 

    const date1 = new Date(dateOne);
    const date2 = new Date(dateTwo);

    const differenceMs = date2 - date1;
    const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;
    const years = differenceMs / millisecondsPerYear;
    const roundedYears = Math.round(years);
    const wording = roundedYears > 1 ? " years" : " year";
    const numberOfYearsFinal = roundedYears + wording;

    return numberOfYearsFinal;
  });

  eleventyConfig.addFilter('stringify', (data) => {
    return JSON.stringify(data, null, "\t")
  })

  eleventyConfig.addFilter("commaSeparatedToListItems", function(commaSeparatedString) { 

    const itemsArray = commaSeparatedString.split(",");
    const htmlList = itemsArray.map(item => `<li>${item}</li>`).join("");

    return htmlList;
  });

  eleventyConfig.addNunjucksAsyncFilter("jsmin", async function (code, callback) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.error("Terser error: ", err);
      callback(null, code);
    }
  });

  eleventyConfig.addFilter("cssmin", function (code) {
		return new CleanCSS({}).minify(code).styles;
	});

  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        collapseWhitespace: true,
        removeComments: true,  
        useShortDoctype: true,
      });
    }

    return content;
  });

  eleventyConfig.addPassthroughCopy("src/assets/docs");
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/scripts");
  eleventyConfig.addPassthroughCopy({ "src/assets/favicon": "/" });

  return {
    dir: {
      input: 'src',
      includes: '_includes',
      output: '_site',
    },
    templateFormats: ['md', 'njk', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
  };
}