import CommonForm from "@/components/common/form";
import PasswordStrengthMeter from "@/components/PasswordStrengthMeter/PasswordStrengthMeter";
import { registerFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { register } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

export default function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    setLoading(true); 

    dispatch(register(formData))
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
          navigate("/auth/login");
        } else {
          toast({
            title: "Error",
            description: data?.payload?.message, 
            status: "error",
            style: {
              backgroundColor: "red", 
              color: "white",
            },
          });
        }
      })
      .catch(() => {
        setLoading(false);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          status: "error",
          style: {
            backgroundColor: "red",
            color: "white",
          },
        });
      });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Account
        </h1>
        <p className="mt-2">
          Already Have An Account?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={loading ? "Signing Up..." : "Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
        isSubmitting={loading} 
      />
      <PasswordStrengthMeter password={formData.password} />
    </div>
  );
}
