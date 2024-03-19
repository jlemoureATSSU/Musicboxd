const express = require('express');
const router = express.Router();
const Comment = require('../../models/listCommentsModel');

router.delete('/deleteListComment/:commentId', async (req, res) => {
    try {
        const { commentId } = req.params;

        const deletedComment = await Comment.findOneAndDelete({ _id: commentId, referenceType: 'list' });
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error('Error deleting list comment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
