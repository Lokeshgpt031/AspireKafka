module.exports = {
  "/api/Product": {
    target:
      process.env["services__webapi-product__http__0"] ||
      process.env["services__webapi-product__https__0"],
    secure: process.env["NODE_ENV"] !== "development",
    pathRewrite: {
      "^/api/Product": "/api/Product",
    },
  },
  "/api/Order": {
    target:
    process.env["services__webapi-order__http__0"] ||
    process.env["services__webapi-order__https__0"],
    secure: process.env["NODE_ENV"] !== "development",
    pathRewrite: {
      "^/api/Order": "/api/Order",
    },
  },
};