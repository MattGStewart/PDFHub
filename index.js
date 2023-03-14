const express = require('express')
const app = express()

app.use(express.static('public'))

app.get('/search', (req, res) => {
    const fileType = req.query.filetype
    const regex = req.query.regex
    const keyword = req.query.keyword
    const source = req.query.source
    // Code to perform web scraping and return search results
    const results = [
        {
            title: 'PDF Title 1',
            author: 'PDF Author 1',
            url: 'https://example.com/pdf1.pdf'
        },
        {
            title: 'PDF Title 2',
            author: 'PDF Author 2',
            url: 'https://example.com/pdf2.pdf'
        }
    ]
    res.send(results)
})

app.listen(3000, () => {
    console.log('Server running on port 3000')
})
