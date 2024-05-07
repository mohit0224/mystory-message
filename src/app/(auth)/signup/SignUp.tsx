"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceCallback } from "usehooks-ts";
import { useRouter } from "next/navigation";
import signupValidationSchema from "@/validationSchema/signupValidationSchema";
import authServices from "@/services/authServices";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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

const SignUp = () => {
	const [username, setUsername] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const debounceUsername = useDebounceCallback(setUsername, 600);
	const router = useRouter();

	// zod implimentation --------------------------------

	const form = useForm({
		resolver: zodResolver(signupValidationSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const checkUsernameUnique = async () => {
			if (username !== "") {
				setUsernameMessage("");
				setIsCheckingUsername(true);
				try {
					const response = await authServices.checkUniqueUsername(username);
					setUsernameMessage(response?.data.message);
				} catch (err: any) {
					setUsernameMessage(
						err.response?.data.message ?? "Error checking username !!"
					);
				} finally {
					setIsCheckingUsername(false);
				}
			} else {
				setUsernameMessage("");
			}
		};
		checkUsernameUnique();
	}, [username]);

	const onSubmit = async (data: z.infer<typeof signupValidationSchema>) => {
		setIsSubmitting(true);
		try {
			const result = authServices.signup(data);
			toast.promise(result, {
				loading: "Signing up...",
				success: (res) => res.data.message,
				error: (err) => err.response.data.message,
			});

			const res = await result;
			if (res) router.replace(`/verify/${username}`);
		} catch (err: any) {
			console.log(err.response?.data.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			<Container>
				<section className="flex justify-center">
					<div className="w-full max-w-md rounded-md p-6 bg-white shadow-lg">
						<div className="space-y-2">
							<h1 className="text-3xl font-bold">Signup for new account</h1>
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
										name="username"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Username</FormLabel>
												<FormControl>
													<Input
														placeholder="username"
														autoComplete="off"
														{...field}
														onChange={(e) => {
															field.onChange(e);
															debounceUsername(e.target.value);
														}}
													/>
												</FormControl>
												{isCheckingUsername && (
													<Loader2 className="animate-spin" />
												)}
												<p
													className={`text-sm ${
														usernameMessage === "Username is unique !!"
															? "text-green-500"
															: "text-red-500"
													}`}
												>
													{usernameMessage}
												</p>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input placeholder="email" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>
												<FormControl>
													<Input
														type="password"
														placeholder="password"
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
												<Loader2 className="animate-spin" />
												Please wait
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

export default SignUp;
