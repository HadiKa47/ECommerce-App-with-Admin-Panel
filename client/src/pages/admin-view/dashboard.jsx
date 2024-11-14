import { Button } from "@/components/ui/button";
import {
  changeUserRole,
  deleteUser,
  getAllAddresses,
  getAllReviews,
  getAllUsers,
  getAllOrders,
} from "@/store/admin/dashboard-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Modal from "@/components/ui/modal";
import { CircleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { userList, isLoading, error, addressList, reviewList, orderList } =
    useSelector((state) => state.adminDashboard);

  const { toast } = useToast();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showRoleChangeConfirm, setShowRoleChangeConfirm] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [newRole, setNewRole] = useState("admin");

  useEffect(() => {
    dispatch(getAllUsers());
    dispatch(getAllAddresses());
    dispatch(getAllReviews());
    dispatch(getAllOrders());
  }, [dispatch]);

  const confirmDelete = async () => {
    try {
      await dispatch(deleteUser(currentUserId));
      setShowDeleteConfirm(false);
      toast({
        title: "User Deleted Successfully.",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Failed To Delete User:", error);
      toast({
        title: "Failed To Delete User.",
        description: error.message,
        className: "bg-red-500 text-white",
      });
    }
  };

  const confirmChangeRole = async () => {
    try {
      await dispatch(changeUserRole({ userId: currentUserId, newRole }));
      setShowRoleChangeConfirm(false);
      toast({
        title: `User Role Changed To ${newRole}.`,
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      console.error("Failed To Change User Role:", error);
      toast({
        title: "Failed To Change User Role.",
        description: error.message,
        className: "bg-red-500 text-white",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      <main className="flex-grow p-6">
        <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center">
                <CardTitle className="mr-2">Total Users:</CardTitle>
                <div className="flex items-center text-lg font-bold">
                  {isLoading ? (
                    <Skeleton className="w-12 h-6" />
                  ) : (
                    userList.length
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center">
                <CardTitle className="mr-2">Total Addresses:</CardTitle>
                <div className="flex items-center text-lg font-bold">
                  {isLoading ? (
                    <Skeleton className="w-12 h-6" />
                  ) : (
                    addressList.length
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center">
                <CardTitle className="mr-2">Total Reviews:</CardTitle>
                <div className="flex items-center text-lg font-bold">
                  {isLoading ? (
                    <Skeleton className="w-12 h-6" />
                  ) : (
                    reviewList.length
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div className="flex items-center">
                <CardTitle className="mr-2">Total Orders:</CardTitle>
                <div className="flex items-center text-lg font-bold">
                  {isLoading ? (
                    <Skeleton className="w-12 h-6" />
                  ) : (
                    orderList.length
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {isLoading && <div className="mt-4">Loading...</div>}
        {error && <div className="mt-4 text-red-500">{error}</div>}

        <div className="mt-6 overflow-x-auto bg-white rounded shadow">
          <h3 className="mt-1 mb-4 ml-2 text-lg font-bold">Users</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="w-32 h-6" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-48 h-6" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-20 h-6" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-32 h-6" />
                    </TableCell>
                  </TableRow>
                ))
              ) : userList && userList.length > 0 ? (
                userList.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.userName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === "admin" ? "admin" : "user"}
                        className={`py-1 px-3 text-white rounded-full ${
                          user.role === "admin" ? "bg-green-600" : "bg-primary"
                        }`}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => {
                          setCurrentUserId(user._id);
                          setShowDeleteConfirm(true);
                        }}
                        className="bg-red-600"
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => {
                          setCurrentUserId(user._id);
                          setShowRoleChangeConfirm(true);
                          setNewRole(user.role === "admin" ? "user" : "admin");
                        }}
                        className="ml-2"
                      >
                        Change Role
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="4" className="text-center">
                    No Users Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {showDeleteConfirm && (
          <Modal onClose={() => setShowDeleteConfirm(false)}>
            <div className="p-4">
              <h3 className="flex items-center justify-center mb-4 text-lg font-bold">
                Confirm Deletion
              </h3>
              <div className="flex flex-col items-center">
                <CircleAlert className="w-10 h-10 mb-2 text-red-600" />
                <p className="mb-6 text-center">
                  Are You Sure You Want To Delete This User?
                </p>
              </div>
              <div className="flex justify-between">
                <Button onClick={confirmDelete} className="bg-red-600">
                  Yes, Delete
                </Button>
                <Button onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {showRoleChangeConfirm && (
          <Modal onClose={() => setShowRoleChangeConfirm(false)}>
            <div className="p-4">
              <h3 className="flex items-center justify-center mb-4 text-lg font-bold">
                Confirm Role Change
              </h3>
              <div className="flex flex-col items-center">
                <CircleAlert className="w-10 h-10 mb-2 text-yellow-600" />
                <p className="mb-6 text-center">
                  Are You Sure You Want To Change This Users Role To
                  <span className="font-semibold"> {newRole}</span>?
                </p>
              </div>
              <div className="flex justify-between">
                <Button onClick={confirmChangeRole} className="bg-yellow-600">
                  Confirm
                </Button>
                <Button
                  onClick={() => setShowRoleChangeConfirm(false)}
                  className="ml-2"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}

        <div className="mt-6 overflow-x-auto bg-white rounded shadow">
          <h3 className="mt-1 mb-4 ml-2 text-lg font-bold">Reviews</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>userName</TableHead>
                <TableHead>Product ID</TableHead>
                <TableHead>Review</TableHead>
                <TableHead>Star</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="w-32 h-6" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-48 h-6" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-64 h-6" />
                    </TableCell>
                  </TableRow>
                ))
              ) : reviewList && reviewList.length > 0 ? (
                reviewList.map((review) => (
                  <TableRow key={review._id}>
                    <TableCell>{review.userName}</TableCell>
                    <TableCell>{review.productId}</TableCell>
                    <TableCell>{review.reviewMessage}</TableCell>
                    <TableCell className="font-bold">
                      {review.reviewValue}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3" className="text-center">
                    No Reviews Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 overflow-x-auto bg-white rounded shadow">
          <h3 className="mt-1 mb-4 ml-2 text-lg font-bold">Addresses</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>City</TableHead>
                <TableHead>PinCode</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="w-32 h-6" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-64 h-6" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-32 h-6" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-32 h-6" />
                    </TableCell>
                  </TableRow>
                ))
              ) : addressList && addressList.length > 0 ? (
                addressList.map((address) => (
                  <TableRow key={address._id}>
                    <TableCell>{address.userId}</TableCell>
                    <TableCell>{address.address}</TableCell>
                    <TableCell>{address.city}</TableCell>
                    <TableCell>{address.pincode}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="4" className="text-center">
                    No Addresses Found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
