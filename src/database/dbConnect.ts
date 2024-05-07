import mongoose from "mongoose";

type CheckConnection = {
	isConnected?: number;
};
const checkConnection: CheckConnection = {};

const dbConnect = async (): Promise<void> => {
	if (checkConnection.isConnected) {
		console.log("⚙️ Database already connected !!");
		return;
	}
	try {
		const { connections } = await mongoose.connect(
			process.env.MONGODB_URI || "",
			{
				dbName: "nextDB",
			}
		);
		checkConnection.isConnected = connections[0].readyState;
		console.log(`⚙️ Database connection established !!`);
		console.log(`Connection established on host :: ${connections[0].host}`);
	} catch (err: any) {
		console.log(`Error connecting to database: ${err.message}`);
		process.exit(1);
	}
};

export default dbConnect;
