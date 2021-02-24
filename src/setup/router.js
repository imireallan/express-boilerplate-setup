import express from "express";
import { helloHandler } from "../handlers/hello";

function setUpRouter(app) {
	// router for all routes
	const router = new express.Router();

	router.get("/hello", helloHandler);
	app.use("/api", router);
}

export { setUpRouter };
