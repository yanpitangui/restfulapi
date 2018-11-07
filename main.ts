import * as restify from 'restify';

const server = restify.createServer({
    "name": "meat-api",
    "version": "1.0.0"
});

server.use(restify.plugins.queryParser());

server.get("/info", [
    (req, resp, next) => {
        if(req.userAgent() && req.userAgent().includes('MSIE 7.0')){
            resp.status(400);
            resp.json({message: "Please, update your browser."})
            return next(false);
        }
        return next();
    },

    (req, resp, next) => {
        resp.json({
            browser: req.userAgent(),
            method: req.method,
            url: req.url,
            path: req.path(),
            query: req.query

        });
        return next();
    }
]);

server.listen(3000, () => {
    console.log("API is running on http://localhost:3000");
});