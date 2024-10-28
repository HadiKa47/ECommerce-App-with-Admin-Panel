import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  addressList: [],
  reviewList: [],
  userList: [],
  orderList: [],
  currentAddress: null,
  currentReview: null,
  currentUser: null,
  isLoading: false,
  error: null,
};

export const getAllAddresses = createAsyncThunk(
  "adminDashboard/getAllAddresses",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/dashboard/addresses"
    );
    return response.data;
  }
);

export const getAllReviews = createAsyncThunk(
  "adminDashboard/getAllReviews",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/dashboard/reviews"
    );
    return response.data;
  }
);

export const getAllUsers = createAsyncThunk(
  "adminDashboard/getAllUsers",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/dashboard/users"
    );
    return response.data;
  }
);

export const getSingleAddress = createAsyncThunk(
  "adminDashboard/getSingleAddress",
  async (addressId) => {
    const response = await axios.get(
      `http://localhost:5000/api/dashboard/addresses/${addressId}`
    );
    return response.data;
  }
);

export const getSingleReview = createAsyncThunk(
  "adminDashboard/getSingleReview",
  async (reviewId) => {
    const response = await axios.get(
      `http://localhost:5000/api/dashboard/reviews/${reviewId}`
    );
    return response.data;
  }
);

export const getSingleUser = createAsyncThunk(
  "adminDashboard/getSingleUser",
  async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/api/dashboard/users/${userId}`
    );
    return response.data;
  }
);

export const getAllOrders = createAsyncThunk(
  "adminDashboard/getAllOrders",
  async () => {
    const response = await axios.get(
      "http://localhost:5000/api/dashboard/orders"
    );
    return response.data;
  }
);

export const changeUserRole = createAsyncThunk(
  "adminDashboard/changeUserRole",
  async ({ userId, newRole }) => {
    const response = await axios.put(
      "http://localhost:5000/api/dashboard/users/role",
      { userId, newRole }
    );
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  "adminDashboard/deleteUser",
  async (userId) => {
    const response = await axios.delete(
      `http://localhost:5000/api/dashboard/users/${userId}`
    );
    return response.data;
  }
);

const adminDashboardSlice = createSlice({
  name: "adminDashboardSlice",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addressList = action.payload;
      })
      .addCase(getAllAddresses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getAllReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviewList = action.payload;
      })
      .addCase(getAllReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getSingleAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAddress = action.payload;
      })
      .addCase(getSingleAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getSingleReview.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReview = action.payload;
      })
      .addCase(getSingleReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getSingleUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSingleUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload;
      })
      .addCase(getSingleUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(getAllOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload;
      })
      .addCase(getAllOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(changeUserRole.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changeUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        const updatedUser = action.payload;
        const index = state.userList.findIndex(
          (user) => user._id === updatedUser._id
        );
        if (index !== -1) {
          state.userList[index].role = updatedUser.role;
        }
      })
      .addCase(changeUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        const userId = action.meta.arg;
        state.userList = state.userList.filter((user) => user._id !== userId);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

export const { resetError } = adminDashboardSlice.actions;

export default adminDashboardSlice.reducer;
