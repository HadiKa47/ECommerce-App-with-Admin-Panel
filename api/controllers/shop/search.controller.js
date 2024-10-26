import Product from "../../models/Product.js";

export const searchProducts = async (req, res) => {
  try {
    const { keyword } = req.params;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({
        success: false,
        message:
          "Invalid Input: 'Keyword' Parameter is Required And Must Be a String.",
      });
    }

    const regEx = new RegExp(keyword, "i");

    const createSearchQuery = {
      $or: [
        { title: regEx },
        { description: regEx },
        { category: regEx },
        { brand: regEx },
      ],
    };

    const searchResults = await Product.find(createSearchQuery);

    res.status(200).json({
      success: true,
      data: searchResults,
    });
  } catch (error) {
    console.error("An Error Occurred While Searching For Products:", error);
    res.status(500).json({
      success: false,
      message:
        "An Unexpected Error Occurred While Processing Your Request. Please Try Again Later.",
    });
  }
};
