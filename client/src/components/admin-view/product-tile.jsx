import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import Modal from "../ui/modal";
import { CircleAlert } from "lucide-react";

export default function AdminProductTile({
  product,
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await handleDelete(product?._id); // Call delete handler
      setShowDeleteConfirm(false); // Close the modal on success
    } catch (error) {
      console.error("Failed to delete product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <div>
        <div className="relative">
          <img
            src={product?.image}
            alt={product?.title}
            className="w-full h-[300px] object-cover rounded-t-lg"
          />
        </div>
        <CardContent>
          <h2 className="mt-2 mb-2 text-xl font-bold">{product?.title}</h2>
          <div className="flex items-center justify-between mb-2">
            <span
              className={`${
                product?.salePrice > 0 ? "line-through" : ""
              } text-lg font-semibold text-primary`}
            >
              ${product?.price}
            </span>
            {product?.salePrice > 0 && (
              <span className="text-lg font-bold">
                ${product?.salePrice}{" "}
                <span className="text-sm text-gray-500"> (After Discount)</span>
              </span>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <Button
            onClick={() => {
              setOpenCreateProductsDialog(true);
              setCurrentEditedId(product?._id);
              setFormData(product);
            }}
          >
            Edit
          </Button>
          <Button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-600"
          >
            Delete
          </Button>
        </CardFooter>
      </div>

      {/* Confirmation Modal */}
      {showDeleteConfirm && (
        <Modal onClose={() => setShowDeleteConfirm(false)}>
          <div className="p-4">
            <h3 className="flex items-center justify-center mb-4 text-lg font-bold">
              Confirm Deletion
            </h3>
            <div className="flex flex-col items-center">
              <CircleAlert className="w-10 h-10 mb-2 text-red-600" />{" "}
              {/* Larger Exclamation Icon */}
              <p className="mb-6 text-center">
                Are you sure you want to delete this post?
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
