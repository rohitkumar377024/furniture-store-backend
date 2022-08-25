const sendResponse = (
    responseCallback = () => { },
    statusCode = 400,
    message = "",
    data = {},
    meta
) => {
    if (responseCallback) {
        responseCallback
            .status(statusCode)
            .json({ status: statusCode, message, data, ...(meta && { meta }) });
    }
};

module.exports = { sendResponse };
