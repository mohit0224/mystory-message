"use client";

import Container from "@/components/Container";
import { Button } from "@/components/ui/button";

import messageValidationSchema from "@/validationSchema/messageValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import messageServices from "@/services/messagesServices";
import { toast } from "sonner";
import Link from "next/link";

const Page = () => {
	const { username } = useParams<{ username: string }>();

	const form = useForm({
		resolver: zodResolver(messageValidationSchema),
		defaultValues: {
			content: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof messageValidationSchema>) => {
		const message = {
			username,
			content: data.content,
		};

		try {
			const response = messageServices.sendMessage(message);
			toast.promise(response, {
				loading: "Sending...",
				success: (res) => res.data.message,
				error: (err) => err.response.data.message,
			});

			const result = await response;
			if (result) form.reset({ content: "" });
		} catch (err: any) {
			// console.log(err.response?.data.message);
		}
	};

	return (
		<>
			<Container>
				<div>
					<h1 className="text-center text-5xl font-semibold">
						Send Anonymous Message
					</h1>
					<div className="mt-10 space-y-5">
						<h4>Send anonymous message to {username}</h4>
						<div>
							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-5"
								>
									<FormField
										control={form.control}
										name="content"
										render={({ field }) => (
											<FormItem>
												<FormControl>
													<Textarea
														placeholder="Write your annonymous message here..."
														className="resize-none"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<Button type="submit">Submit</Button>
								</form>
							</Form>
						</div>
					</div>
				</div>
				<div className="mt-10">
					<p>
						Want your own dashboard ? <Link href={"/signup"}>Click here</Link>{" "}
					</p>
				</div>
			</Container>
		</>
	);
};

export default Page;
