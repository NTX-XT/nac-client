const express = require('express');
const path = require('path');
const multer = require('multer');
const sdk = require('@nwc-sdk/client');

const port = process.env.PORT || 3000;

// Boot express
const app = express();
app.use(express.json());

const upload = multer();
const router = express.Router();
const validateController = require('./controllers/validate.js');
const postmanController = require('./controllers/postman.js');
const swaggerController = require('./controllers/swagger.js');

router.post('/validate', upload.none(), validateController);
router.get('/postman', upload.none(), postmanController);
router.get('/swagger', upload.none(), swaggerController);

app.use('/', router)
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`));