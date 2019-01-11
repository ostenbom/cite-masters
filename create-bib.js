const Cite = require('citation-js')
const fs = require('fs')

function blankEntry() {
  return {
    name: '',
    bibtex: '',
    ieee: '',
  }
}

function createCitationDict(citations) {
  lines = citations.split('\n')
  var entries = [];
  var currentEntry = blankEntry()
  for (var line = 0; line < lines.length; line++) {
    let currentLine = lines[line]
    if (currentLine == "}") {
      currentEntry.bibtex += currentLine + '\n'
      // console.log(currentEntry)
      entries.push(currentEntry)
      currentEntry = blankEntry()
    } else {
      if (currentLine.includes('note=')) {
        let noteIdRegex = /.*note=\{ID: ([-\w]+?)\}.*/
        let found = currentLine.match(noteIdRegex)
        currentEntry.name = found[1]
      }
      currentEntry.bibtex += currentLine + '\n'
    }
  }

  return entries
}

function createIeeeCitations(citations) {
  citations.forEach((citation) => {
    cite = new Cite(citation.bibtex);
    // console.log(citation.bibtex)
    output = cite.get({type: 'string', style: 'citation-ieee'})
    // console.log(output)
    citation.ieee = output
  })

  return citations
}

function getReferenceOrder(text) {
  let lines = text.split('\n')
  let references = []

  for (var lineNo = 0; lineNo < lines.length; lineNo++) {
    let line = lines[lineNo]
    if (line.includes('[')) {
      let refRegex = /\[[-\w]+\]/g
      let found = line.match(refRegex)
      found.forEach((find) => {
        let trimmed = find.substring(1, find.length - 1)
        if (!references.includes(trimmed)) {
          references.push(trimmed)
        }
      })

    }
  }

  return references
}

function findCitation(citations, name) {
  for (let citationNo in citations) {
    let citation = citations[citationNo]
    if (citation.name === name) {
      return citation
    }
  }

  return null
}

function orderCitationsByReferences(citations, references) {
  orderedCitations = []

  for (let referenceNo in references) {
    let reference = references[referenceNo]
    citation = findCitation(citations, reference)
    if (citation === null) {
      console.log('Could not find: ' + reference)
    } else {
      orderedCitations.push(citation)
    }
  }

  return orderedCitations
}

function createBib(fullText, bibtexCitations) {
  citations = createCitationDict(bibtexCitations)
  citations = createIeeeCitations(citations)

  referenceOrder = getReferenceOrder(fullText)

  citations = orderCitationsByReferences(citations, referenceOrder)
}

var report = ''

if (process.argv.length < 3) {
  console.log('Don\'t forget to supply a bibtex and a report file for me!')
  process.exit()
}

var citations = fs.readFileSync(process.argv[2], 'utf8')
var report = fs.readFileSync(process.argv[3], 'utf8')

bib = createBib(report, citations)

