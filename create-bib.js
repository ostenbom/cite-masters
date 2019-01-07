const Cite = require('citation-js')
const readline = require('readline')
const fs = require('fs')

function createBib(fullText, citations) {
  console.log(citations)
  console.log(report)
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var report = ''

if (process.argv.length < 3) {
  console.log('Don\'t forget to supply a bibtex and a report file for me!')
  process.exit()
}

var citations = fs.readFileSync(process.argv[2], 'utf8')
var report = fs.readFileSync(process.argv[3], 'utf8')

bib = createBib(report, citations)

