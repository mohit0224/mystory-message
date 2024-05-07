import { NextResponse } from "next/server";

const apiResponse = (
	message: string,
	success: boolean,
	status: number,
	data?: any
) => {
	return NextResponse.json(
		{
			message,
			success,
			data,
		},
		{ status }
	);
};

export default apiResponse;
