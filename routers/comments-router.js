const commentsRouter = require("express").Router();
const {
    deleteCommentByCommentId, patchCommentVotes
} = require("../controllers/comments.controller");

commentsRouter.delete("/:comment_id", deleteCommentByCommentId);

commentsRouter.patch("/:comment_id", patchCommentVotes);

module.exports = commentsRouter;