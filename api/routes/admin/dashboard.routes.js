import express from "express";
import {
  changeUserRole,
  getAllAddresses,
  getAllReviews,
  getAllUsers,
  deleteUser,
  getSingleUser,
  getSingleReview,
  getSingleAddress,
  getAllOrders,
} from "../../controllers/admin/dashboard.controller.js";

const router = express.Router();

router.get("/addresses", getAllAddresses);
router.get("/reviews", getAllReviews);
router.get("/users", getAllUsers);
router.get("/users/:userId", getSingleUser);
router.get("/reviews/:reviewId", getSingleReview);
router.get("/addresses/:addressId", getSingleAddress);
router.put("/users/role", changeUserRole);
router.delete("/users/:userId", deleteUser);
router.get("/orders", getAllOrders);

export default router;
