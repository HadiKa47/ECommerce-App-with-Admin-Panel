import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { StarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";

const VisuallyHidden = ({ children }) => (
  <div
    style={{
      position: "absolute",
      width: "1px",
      height: "1px",
      margin: "-1px",
      padding: "0",
      overflow: "hidden",
      clip: "rect(0 0 0 0)",
      border: "0",
    }}
  >
    {children}
  </div>
);

export default function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
}) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} Quantity Can Be Added For This Item`,
            variant: "destructive",
          });

          return;
        }
      }
    }
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product Is Added To Cart",
          description: "You Have Added The Product To Cart Successfully.!",
          className: "bg-green-500 text-white",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <VisuallyHidden>
          <DialogTitle>Product Details</DialogTitle>
        </VisuallyHidden>

        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="object-cover w-full aspect-square"
          />
        </div>
        <div>
          <div>
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="mt-4 mb-5 text-2xl text-muted-foreground">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-gray-500 ${
                productDetails?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails?.price}{" "}
            </p>
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-red-500">
                ${productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
              <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
              <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
              <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
              <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
            </div>
            <span className="text-muted-foreground">(4.50)</span>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full cursor-not-allowed opacity-60">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto scrollbar-hide">
            <h2 className="mb-4 text-xl font-bold">Reviews</h2>
            <div className="grid gap-6">
              <div className="flex gap-4">
                <Avatar className="w-10 h-10 border">
                  <AvatarFallback className="font-extrabold text-white bg-black">
                    {user?.userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold">{user?.userName}</h3>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
                    <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
                    <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
                    <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
                    <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-10">
                <Label>Write a review</Label>
                <div className="flex items-center gap-0.5">
                  <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
                  <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
                  <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
                  <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
                  <StarIcon className="w-5 h-5 fill-primary"></StarIcon>
                </div>
                <p className="text-muted-foreground">Great Product</p>
                <Input placeholder="Write a review..." />
                <Button>Submit</Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
