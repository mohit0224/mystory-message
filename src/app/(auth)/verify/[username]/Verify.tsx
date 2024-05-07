"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import verifyValidationSchema from "@/validationSchema/verifyValidationSchema";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import authServices from "@/services/authServices";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Container from "@/components/Container";

const Verify = () => {
	const [isSubmitting, setIsSubmitting] = useState(false);

	const router = useRouter();
	const params = useParams<{ username: string }>();
	const { username } = params;

	const form = useForm({
		resolver: zodResolver(verifyValidationSchema),
		defaultValues: {
			verifyCode: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof verifyValidationSchema>) => {
		setIsSubmitting(true);
		try {
			const response = authServices.otpVerify({
				username: username,
				code: data.verifyCode,
			});
			toast.promise(response, {
				loading: "verifying",
				success: (res) => res.data.message,
				error: (err) => err.response.data.message,
			});
			const res = await response;
			if (res) router.replace("/signin");
		} catch (err: any) {
			console.log(err.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Container>
				<section className=" flex justify-center">
					<div className="w-full max-w-md rounded-md p-6 bg-white shadow-lg">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold">Verify your account</h1>
							<p className=" font-semibold tracking-tight">
								Have an account ? <Link href={"/signin"}>login</Link>
							</p>
						</div>
						<div className="mt-2">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-5"
								>
									<FormField
										control={form.control}
										name="verifyCode"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Verification OTP</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder="OTP"
														autoComplete="off"
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<Button type="submit">
										{isSubmitting ? (
											<>
												<Loader2 className="animate-spin mr-2" /> verifying
											</>
										) : (
											"verify"
										)}
									</Button>
								</form>
							</Form>
						</div>
					</div>
				</section>
			</Container>
		</>
	);
};

export default Verify;
