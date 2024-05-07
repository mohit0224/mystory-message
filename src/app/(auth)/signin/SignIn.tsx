"use client";
import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import loginValidationSchema from "@/validationSchema/loginValidationSchema";
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
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import Container from "@/components/Container";

const SignIn = () => {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// zod implimentation --------------------------------

	const form = useForm({
		resolver: zodResolver(loginValidationSchema),
		defaultValues: {
			identifier: "",
			password: "",
		},
	});
	const onSubmit = async (data: z.infer<typeof loginValidationSchema>) => {
		setIsSubmitting(true);

		const response = await signIn("credentials", {
			redirect: false,
			identifier: data.identifier,
			password: data.password,
		});

		if (response?.error) {
			toast.error(response.error);
			setIsSubmitting(false);
		}

		if (response?.url) {
			toast.success("LoggedIn successfully !!");
			setIsSubmitting(false);
			router.replace("/dashboard");
		}
	};

	return (
		<>
			<Container>
				<section className="flex justify-center">
					<div className="w-full max-w-md rounded-md p-6 bg-white shadow-lg">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold">Signin your account</h1>
							<p className="font-semibold tracking-tight">
								Don&apos;t have an account ?{" "}
								<Link href={"/signup"}>Signup</Link>
							</p>
						</div>
						<div className="mt-2">
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-5"
								>
									<FormField
										name="identifier"
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Username / Email</FormLabel>
												<FormControl>
													<Input placeholder="username / email" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="password"
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														placeholder="password"
														type="password"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button type="submit">
										{isSubmitting ? (
											<>
												<Loader2 className="animate-spin mr-2" /> Please wait
											</>
										) : (
											"Submit"
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

export default SignIn;
