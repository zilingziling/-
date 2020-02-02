const {
  override,
  fixBabelImports,
  addLessLoader,
  addDecoratorsLegacy,
  disableEsLint
} = require("customize-cra");
const paths = require("react-scripts/config/paths");
const path = require("path");
process.env.GENERATE_SOURCEMAP = "false";
paths.appBuild = path.join(path.dirname(paths.appBuild), "item");

module.exports = override(
  disableEsLint(),
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true
    // modifyVars: { "@primary-color": "#2D57BE" }
  }),
  addDecoratorsLegacy()
);
