module.exports = function parseValidationErrs(err) {
  if (!err) return ["Unknown error"];

  if (err.name === "ValidationError" && err.errors) {
    return Object.values(err.errors).map((e) => e.message);
  }

  if (err.code === 11000) {
    return ["Duplicate value error"];
  }

  return [err.message || "Something went wrong"];
};
