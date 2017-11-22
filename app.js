const express = require('express');
const app = express();
var battleRouter = require('./routes/battleRouter');
//set port, set view folder, set render engine, use ejs
app.set('port', (process.env.PORT || 3000));
app.use(express.static(__dirname + '/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
//keep this here and never touch it

app.get('/', (req, res) => res.render('index'));
app.use('/battle', function(req, res) {
	console.log(req.query.key);
	res.render('battle');
});
app.listen(3000, () => console.log('Listening on port 3000!'));