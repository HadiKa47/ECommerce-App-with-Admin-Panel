import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { login } from "@/store/auth-slice"; 
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const initialState = {
  email: "",
  password: "",
};

export default function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false); 
  const dispatch = useDispatch();
  const { toast } = useToast(); 

  function onSubmit(event) {
    event.preventDefault();
    setLoading(true); 

    dispatch(login(formData))
      .then((data) => {
        setLoading(false);

        if (data?.payload?.success) {
          toast({
            title: "Success",
            description: data?.payload?.message,
            status: "success",
            style: {
              backgroundColor: "green", 
              color: "white",
            },
          });
        } else {
          toast({
            title: "Error",
            description: data?.payload?.message,
            status: "error",
            style: {
              backgroundColor: "red", // Make the toast red for errors
              color: "white",
            },
          });
        }
      })
      .catch(() => {
        setLoading(false); // Stop loading in case of an error
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.", // Fallback error message
          status: "error",
          style: {
            backgroundColor: "red", // Make the toast red for errors
            color: "white",
          },
        });
      });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Login to Your Account
        </h1>
        <p className="mt-2">
          Do Not Have An Account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Sign Up
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={loading ? "Logging In..." : "Login"} // Change button text during loading
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isSubmitting={loading} // Optionally disable the button while loading
      />
    </div>
  );
}
