import { NextResponse } from "next/server";

const apiError = (message: string, success: boolean, status: number) => {
	return NextResponse.json(
		{
			message,
			success,
		},
		{ status }
	);
};

export default apiError;
