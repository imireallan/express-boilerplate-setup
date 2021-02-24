import express from "express";

import "express-async-errors";

import logger from "loglevel";

import { setUpMiddleware } from "./setup/middleware";
import { setUpRouter } from "./setup/router";

const PORT = process.env.PORT || 4200;

function startServer({ port = PORT } = {}) {
	const app = express();
	setUpMiddleware(app);

	setUpRouter(app);

	return new Promise((resolve) => {
		const server = app.listen(port, () => {
			logger.info(`Listening on port ${server.address().port}`);

			// turns 'server.close' into a Promise API
			const originalClose = server.close.bind(server);
			server.close = () => {
				return new Promise((resolveClose) => {
					originalClose(resolveClose);
				});
			};

			// ensures that we properly close the server when the program exits
			setUpCloseOnExit(server);

			// resolve the whole promise with the express server
			resolve(server);
		});
	});
}

function setUpCloseOnExit(server) {
	// https://stackoverflow.com/a/14032965/971592
	async function exitHandler(options = {}) {
		await server
			.close()
			.then(() => {
				logger.info("Server successfully closed");
			})
			.catch((e) => {
				logger.warn("Something went wrong closing the server", e.stack);
			});
		if (options.exit) process.exit();
	}
	//do something when the app is closing
	process.on("exit", exitHandler);

	// catches ctrl+c event
	process.on("SIGINT", exitHandler.bind(null, { exit: true }));
	// catches "kill pid" (for example: nodemon restart)
	process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
	process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
	// catches uncaught exceptions
	process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
}

export { startServer };
