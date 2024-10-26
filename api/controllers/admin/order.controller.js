import Order from "../../models/Order.js";

export const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No Orders Found In The System.",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
      message: "Orders Retrieved Successfully.",
    });
  } catch (e) {
    console.error("Error Fetching Orders:", e);
    res.status(500).json({
      success: false,
      message:
        "An Unexpected Error Occurred While Retrieving Orders. Please Try Again Later.",
    });
  }
};

export const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "The Requested Order Does Not Exist.",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
      message: "Order Details Fetched Successfully.",
    });
  } catch (e) {
    console.error("Error Fetching Order Details:", e);
    res.status(500).json({
      success: false,
      message: "Failed To Retrieve Order Details. Please Try Again Later.",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found. Unable To Update Status.",
      });
    }

    await Order.findByIdAndUpdate(id, { orderStatus });

    res.status(200).json({
      success: true,
      message: "Order Status Updated Successfully.",
    });
  } catch (e) {
    console.error("Error Updating Order Status:", e);
    res.status(500).json({
      success: false,
      message:
        "An Error Occurred While Updating The Order Status. Please Try Again Later.",
    });
  }
};
