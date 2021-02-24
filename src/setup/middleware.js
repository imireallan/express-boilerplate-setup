import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";

function setUpMiddleware(app) {
	app.use(cors());
	app.use(morgan("dev"));
	app.use(bodyParser.json());
	app.use(errorMiddleware);
}

// generic error handler for situations where we didn't handle
//  errors properly
function errorMiddleware(error, req, res, next) {
    console.log('headers', res.headersSent)
	if (res.headersSent) {
		next(error);
	} else {
		logger.error(error);
		res.status(500);
		res.json({
			message: error.message,
			// only add a stack property in non-prod environments
			...(process.env.NODE_ENV === "production"
				? null
				: { stack: error.stack }),
		});
	}
}

export { setUpMiddleware };
