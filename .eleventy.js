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

  eleventyConfig.addPassthroughCopy("src/assets/");

  eleventyConfig.addWatchTarget("src/assets/css/");

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