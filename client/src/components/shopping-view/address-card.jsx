import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import Modal from "../ui/modal";
import { CircleAlert } from "lucide-react";

export default function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  setCurrentSelectedAddress,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await handleDeleteAddress(addressInfo);
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to delete address:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card
      onClick={
        setCurrentSelectedAddress
          ? () => setCurrentSelectedAddress(addressInfo)
          : null
      }
    >
      <CardContent className="grid gap-4 p-4">
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>PinCode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="flex justify-between p-3">
        <Button
          className="bg-black text-ellipsis"
          onClick={() => handleEditAddress(addressInfo)}
        >
          Edit
        </Button>
        <Button
          className="bg-red-500 text-ellipsis"
          onClick={() => setShowDeleteConfirm(true)} // Show confirmation modal
        >
          Delete
        </Button>
      </CardFooter>

      {/* Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(false)}>
          <div className="p-4">
            <h3 className="flex items-center justify-center mb-4 text-lg font-bold">
              Confirm Deletion
            </h3>
            <div className="flex flex-col items-center">
              <CircleAlert className="w-10 h-10 mb-2 text-red-600" />
              <p className="mb-6 text-center">
                Are You Sure You Want To Delete This Address..!
              </p>
            </div>
            <div className="flex justify-between">
              <Button
                onClick={confirmDelete}
                className={`bg-red-600 ${
                  isDeleting ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Yes, Delete"}
              </Button>
              <Button onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </Card>
  );
}
