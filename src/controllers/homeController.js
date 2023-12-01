const getHomePage = (req, res) => {
    res.render('sample.ejs');
}

const test = (req, res) => {
    res.send('test');
}

module.exports = {
    getHomePage,
    test
}