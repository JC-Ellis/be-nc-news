const topicsRouter = require("express").Router();
const {
    getAllTopics, postNewTopic
} = require("../controllers/topics.controller");


topicsRouter
.route("/")
.get(getAllTopics)
.post(postNewTopic)



module.exports = topicsRouter;