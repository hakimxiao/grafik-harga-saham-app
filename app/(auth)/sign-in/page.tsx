"use client";

import {useForm} from "react-hook-form";
import InputField from "@/components/forms/InputField";
import {Button} from "@/components/ui/button";
import FooterLink from "@/components/forms/FooterLink";

const SignIn = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onBlur"
    });

    const onSubmit = async(data: SignInFormData) => {
        try {
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <h1 className="form-title">Sign In | Signalist</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="email"
                    label="Email"
                    placeholder="user@gmail.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: "Email harus di isi" }}
                />

                <InputField
                    name="password"
                    label="Password"
                    placeholder="Masukkan password anda"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: "Password harus di isi" }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? "Signing In" : "Sign In"}
                </Button>

                <FooterLink text="Tidak punya akun" linkText="Sign Up" href="/sign-up" />
            </form>
        </>
    )
}
export default SignIn
