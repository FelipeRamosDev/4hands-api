const express = require('express');
const app = express();

app.use(express.static('docs'));

app.listen(80, () => {
    console.log('Documentation access: http://localhost/');
});
