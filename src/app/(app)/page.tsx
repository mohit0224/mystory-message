"use client";
import React from "react";
import dummyMessages from "@/dummyMessages.json";
import Container from "@/components/Container";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";

import Autoplay from "embla-carousel-autoplay";
import { Mail } from "lucide-react";

const Page = () => {
	return (
		<>
			<Container>
				<div className="text-center">
					<h1 className="text-5xl sm:text-6xl font-semibold">
						Dive into the World of Anonymous Feedback
					</h1>
					<p className="text-xl sm:text-3xl font-medium mt-5">
						Where your identity remains a secret.
					</p>
				</div>

				<section className="flex justify-center mt-20">
					<Carousel
						plugins={[Autoplay({ delay: 2000 })]}
						className="w-full max-w-lg"
					>
						<CarouselContent>
							{dummyMessages.map((item, index) => (
								<CarouselItem key={index}>
									<div className="border p-5 rounded-lg">
										<h4 className="text-2xl font-semibold">{item.title}</h4>
										<div className="flex gap-2 items-center mt-3">
											<Mail />
											<ul>
												<li className="text-lg">{item.content}</li>
												<li className="text-sm">{item.received}</li>
											</ul>
										</div>
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
				</section>
			</Container>
		</>
	);
};

export default Page;
