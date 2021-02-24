const helloHandler = (req, res) => {
	res.status(200).json({ success: "Hello from the handler" });
};

export { helloHandler };
