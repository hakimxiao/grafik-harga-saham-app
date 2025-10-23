"use client";

import {useForm} from "react-hook-form";
import {Button} from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import {error} from "next/dist/build/output/log";

const SignUp = () => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            country: "US",
            investmentGoals: "Growth",
            riskTolerance: "Medium",
            preferredIndustry: "Technology"
        },
        mode: "onBlur"
    });

    const onSubmit = async(data: SignUpFormData) => {
        try {
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <h1 className="form-title">Sign Up & Personalize</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="fullName"
                    label="Nama Lengkap"
                    placeholder="Jaka Dantara"
                    register={register}
                    error={errors.fullName}
                    validation={{ required: "Nama lengkap harus di isi", minLength: 2 }}
                />
                <InputField
                    name="email"
                    label="Email"
                    placeholder="user@gmail.com"
                    register={register}
                    error={errors.email}
                    validation={{ required: "Email harus di isi", pattern: /^\w+@\w+\.\w+$/, message: "Alamat email harus di isi" }}
                />
                <InputField
                    name="password"
                    label="Password"
                    placeholder="Masukkan katasandi yang kuat"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: "Password harus di isi", minLength: 8 }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? "Membuat akun" : "Mulailah Perjalanan Investasi Anda"}
                </Button>
            </form>
        </>
    )
}
export default SignUp
