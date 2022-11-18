export function checkParams(req, res, next) {

    let params = req.query;
    let errorFound = false;

    let i = 0;
    while (i < Object.keys(params).length && !errorFound) {
        let param = Object.keys(params)[i];
        let value = params[param];
        switch (param) {
            case "orderBy":
                let order = params['order'];
                if (!order) {
                    req.query["order"] = "asc";
                }
                if (value !== "text" && value !== "category") {
                    errorFound = true;
                    res.status(400).send({ message: "Invalid value on filter orderBy." });
                }
                break;
            case "order":
                if (value !== "asc" && value !== "desc") {
                    errorFound = true;
                    res.status(400).send({ message: "Invalid value on filter order." });
                }
                break;
            case "limit":
            case "startAt":
            case "endAt":
                if (!isInteger(value)) {
                    errorFound = true;
                    res.status(400).send({ message: "Integer value expected." });
                } else {
                    req.query[param] = parseInt(value);
                }
                break;
        }
        i++;
    }

    if (!errorFound) {
        next();
    }

}

function isInteger(num) {
    return num % 1 === 0 && isFinite(num);
}
