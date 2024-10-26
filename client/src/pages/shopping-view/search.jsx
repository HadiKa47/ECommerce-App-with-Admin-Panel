import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton"; 
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

export default function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  useEffect(() => {
    const keywordFromParams = searchParams.get("keyword") || "";
    setKeyword(keywordFromParams);
    if (keywordFromParams) {
      setLoading(true);
      dispatch(getSearchResults(keywordFromParams))
        .catch((error) => {
          toast({
            title: "Error fetching results",
            description: error.message,
            variant: "destructive",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [searchParams, dispatch, toast]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const trimmedKeyword = keyword.trim();
      if (trimmedKeyword.length > 0) {
        setSearchParams(new URLSearchParams(`?keyword=${trimmedKeyword}`));
        setLoading(true);
        dispatch(getSearchResults(trimmedKeyword))
          .catch((error) => {
            toast({
              title: "Error fetching results",
              description: error.message,
              variant: "destructive",
            });
          })
          .finally(() => setLoading(false));
      } else {
        setSearchParams(new URLSearchParams(`?keyword=`));
        dispatch(resetSearchResults());
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [keyword, setSearchParams, dispatch, toast]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    const getCartItems = cartItems?.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getTotalStock} Quantity Can Be Added For This Item`,
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
          description: "You Have Added The Product To Cart Successfully.",
          className: "bg-green-500 text-white",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails) {
      setOpenDetailsDialog(true);
    } else {
      setOpenDetailsDialog(false);
    }
  }, [productDetails]);

  useEffect(() => {
    return () => {
      setOpenDetailsDialog(false);
    };
  }, []);

  return (
    <div className="container px-4 py-8 mx-auto md:px-6">
      <div className="flex justify-center mb-8">
        <Input
          value={keyword}
          aria-label="Search Products"
          onChange={(event) => setKeyword(event.target.value)}
          className="w-full max-w-md px-4 py-3 transition duration-300 border rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Search Products..."
        />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-5 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-60" /> 
          ))}
        </div>
      ) : !keyword ? (
        <h1 className="text-5xl font-extrabold text-center text-gray-500">
          Start Your Search For Amazing Products..!
          <br />
          Enter Keywords In The Search Bar Above To Find What You Are Looking
          For...!
        </h1>
      ) : searchResults.length === 0 ? (
        <h1 className="text-5xl font-extrabold text-center text-gray-500">
          Sorry, We Could Not Find Any Products Matching `{keyword}`.
          <br />
          Try Different Keywords Or Check Out Our Categories...!
        </h1>
      ) : (
        <div className="grid grid-cols-1 gap-5 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {searchResults.map((item) => (
            <div
              key={item._id || item.id}
              className="transition-transform transform bg-white rounded-lg shadow-lg hover:scale-105"
            >
              <ShoppingProductTile
                handleAddtoCart={handleAddtoCart}
                product={item}
                handleGetProductDetails={handleGetProductDetails}
              />
            </div>
          ))}
        </div>
      )}
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}
