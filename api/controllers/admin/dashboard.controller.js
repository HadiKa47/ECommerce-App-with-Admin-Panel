import Address from "../../models/Address.js";
import Review from "../../models/Review.js";
import User from "../../models/User.js";
import Order from "../../models/Order.js";

export const getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An Error Occurred While Fetching Addresses" });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate("userId", "userName");
    res.status(200).json(reviews);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An Error Occurred While Fetching Reviews" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "An Error Occurred While Fetching Users" });
  }
};

export const changeUserRole = async (req, res) => {
  const { userId, newRole } = req.body;

  if (!userId || !newRole) {
    return res
      .status(400)
      .json({ message: "User ID And New Role Are Required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const validRoles = ["admin", "user"];
    if (!validRoles.includes(newRole)) {
      return res
        .status(400)
        .json({ message: "Role Can Only Be Changed To 'Admin' Or 'User'" });
    }

    user.role = newRole;
    await user.save();

    res.status(200).json({ message: "User Role Updated Successfully", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An Error Occurred While Updating User Role" });
  }
};

export const deleteUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID Is Required" });
  }

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: "An Error Occurred While Deleting User" });
  }
};

export const getSingleUser = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID Is Required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "An Error Occurred While Fetching User" });
  }
};

export const getSingleReview = async (req, res) => {
  const { reviewId } = req.params;

  if (!reviewId) {
    return res.status(400).json({ message: "Review ID Is Required" });
  }

  try {
    const review = await Review.findById(reviewId).populate(
      "userId",
      "userName"
    );
    if (!review) {
      return res.status(404).json({ message: "Review Not Found" });
    }

    res.status(200).json(review);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An Error Occurred While Fetching Review" });
  }
};

export const getSingleAddress = async (req, res) => {
  const { addressId } = req.params;

  if (!addressId) {
    return res.status(400).json({ message: "Address ID Is Required" });
  }

  try {
    const address = await Address.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address Not Found" });
    }

    res.status(200).json(address);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An Error Occurred While Fetching Address" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "An Error Occurred While Fetching Orders" });
  }
};

export const getMonthlySalesAndOrders = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$orderDate" },
          totalSales: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "An Error Occurred While Fetching Monthly Sales and Orders",
    });
  }
};

export const getAverageOrderValue = async (req, res) => {
  try {
    const result = await Order.aggregate([
      {
        $group: {
          _id: null,
          averageAOV: { $avg: "$totalAmount" },
        },
      },
    ]);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "An Error Occurred While Fetching Average Order Value",
    });
  }
};
