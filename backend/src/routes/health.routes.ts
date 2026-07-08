import express from "express";

const router = express.Router();

router.get("/health", (_, res) => {
    res.status(200).json({
        success: true,
        message: "server is running",
        data:{},
        meta: null
    });
});

export default router;