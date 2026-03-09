const Job = require("../models/Job");
const parseValidationErrors = require("../util/parseValidationErrs");

const setFlash = (req, type, msg) => {
  if (typeof req.flash === "function") {
    req.flash(type, msg);
  }
};

exports.listJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });
    res.render("jobs", { jobs });
  } catch (err) {
    setFlash(req, "error", "Unable to load jobs.");
    res.redirect("/jobs");
  }
};

exports.showAddForm = (req, res) => {
  res.render("job", { job: null });
};

exports.createJob = async (req, res) => {
  try {
    await Job.create({ ...req.body, createdBy: req.user._id });
    setFlash(req, "info", "Job created.");
    res.redirect("/jobs");
  } catch (err) {
    setFlash(req, "error", parseValidationErrors(err).join(", "));
    res.redirect("/jobs/add");
  }
};

exports.showEditForm = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!job) {
      setFlash(req, "error", "Job not found.");
      return res.redirect("/jobs");
    }
    res.render("job", { job });
  } catch (err) {
    setFlash(req, "error", "Unable to load job.");
    res.redirect("/jobs");
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      req.body,
      { runValidators: true, new: true },
    );
    if (!job) setFlash(req, "error", "Job not found.");
    else setFlash(req, "info", "Job updated.");
    res.redirect("/jobs");
  } catch (err) {
    setFlash(req, "error", parseValidationErrors(err).join(", "));
    res.redirect(`/jobs/edit/${req.params.id}`);
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!job) setFlash(req, "error", "Job not found.");
    else setFlash(req, "info", "Job deleted.");
    res.redirect("/jobs");
  } catch (err) {
    setFlash(req, "error", "Unable to delete job.");
    res.redirect("/jobs");
  }
};
