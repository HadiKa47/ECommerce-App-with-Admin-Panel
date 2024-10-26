import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { useToast } from "@/hooks/use-toast";
import {
  addFeatureImage,
  deleteFeatureImage,
  getFeatureImages,
} from "@/store/common-slice";
import { CircleAlert } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function AdminFeatures() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentDeletingId, setCurrentDeletingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useDispatch();
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { toast } = useToast();

  function handleUploadFeatureImage() {
    dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setImageFile(null);
        setUploadedImageUrl("");
        toast({
          title: "Image Uploaded Successfully",
          description: "The feature image was uploaded.",
          className: "bg-green-500 text-white",
        });
      }
    });
  }

  function confirmDelete() {
    setIsDeleting(true);
    dispatch(deleteFeatureImage(currentDeletingId)).then((data) => {
      setIsDeleting(false);
      if (data?.payload?.success) {
        dispatch(getFeatureImages());
        setShowDeleteConfirm(false);
        toast({
          title: "Image Deleted Successfully",
          description: "The feature image was deleted.",
          className: "bg-green-500 text-white",
        });
      }
    });
  }

  function handleDeleteFeatureImage(id) {
    setCurrentDeletingId(id);
    setShowDeleteConfirm(true);
  }

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <Fragment>
      <div>
        <ProductImageUpload
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isCustomStyling={true}
        />
        <Button
          onClick={handleUploadFeatureImage}
          className="mt-5 w-full"
          disabled={!uploadedImageUrl}
        >
          Upload
        </Button>
        <div className="flex flex-col gap-4 mt-5">
          {featureImageList && featureImageList.length > 0
            ? featureImageList.map((featureImgItem) => (
                <div key={featureImgItem._id} className="relative">
                  <img
                    src={featureImgItem.image}
                    className="w-full h-[300px] object-fill rounded-t-lg"
                  />
                  <Button
                    onClick={() => handleDeleteFeatureImage(featureImgItem._id)}
                    className="absolute top-2 right-2 bg-red-600 text-white"
                  >
                    Delete
                  </Button>
                </div>
              ))
            : null}
        </div>
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
                Are you sure you want to delete this feature image?
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
    </Fragment>
  );
}
