// utils/wrapAsync.js   (or at top of app.js)
function wrapAsync(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
module.exports = wrapAsync;

//  use for error handling in routes