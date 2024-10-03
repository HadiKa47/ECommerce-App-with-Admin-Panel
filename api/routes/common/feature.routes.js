import express from "express"; // Import using ES modules
import {
  addFeatureImage,
  getFeatureImages,
} from "../../controllers/common/feature.controller.js";

const router = express.Router();

router.post("/add", addFeatureImage);
router.get("/get", getFeatureImages);

export default router;
