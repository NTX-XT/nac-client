const express = require('express');
const path = require('path');
const multer = require('multer');
const port = process.env.PORT || 3000;

// Boot express
const app = express();
app.use(express.static("./public"));
app.use(express.json());

const upload = multer();
const router = express.Router();
const validateController = require('./controllers/validate.js');
router.post('/validate', upload.none(), validateController);

app.use('/', router)
// Application routing
app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(port, () => console.log(`Server is listening on port ${port}!`));