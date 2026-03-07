const express = require("express");
const router = express.Router();
const jobs = require("../controllers/jobs");

router.get("/", jobs.listJobs);
router.get("/add", jobs.showAddForm);
router.post("/", jobs.createJob);

router.get("/edit/:id", jobs.showEditForm);
router.post("/update/:id", jobs.updateJob);
router.post("/delete/:id", jobs.deleteJob);

module.exports = router;
