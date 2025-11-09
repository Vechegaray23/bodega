const PAGE_WIDTH = 595.28
const PAGE_HEIGHT = 841.89
const MARGIN_X = 56
const MARGIN_Y = 72
const FONT_SIZE = 12
const LINE_HEIGHT = FONT_SIZE * 1.5
const MAX_CHARACTERS_PER_LINE = 90

function escapePdfText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function wrapParagraph(text: string): string[] {
  if (!text) {
    return ['']
  }

  const indentMatch = text.match(/^(\s+)/)
  const indent = indentMatch ? indentMatch[1] : ''
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let currentLine = indent

  words.forEach((word) => {
    const separator = currentLine.trim().length === 0 ? '' : ' '
    const nextCandidate = currentLine + separator + word
    if (nextCandidate.length <= MAX_CHARACTERS_PER_LINE) {
      currentLine = nextCandidate
    } else {
      if (currentLine.trim().length === 0) {
        lines.push(nextCandidate)
        currentLine = indent
      } else {
        lines.push(currentLine)
        currentLine = indent + word
      }
    }
  })

  if (currentLine.trim().length > 0 || indent.length > 0) {
    lines.push(currentLine)
  }

  return lines
}

function buildPageStreams(text: string): string[] {
  const paragraphs = text.split('\n')
  const pages: string[] = []
  let cursorY = PAGE_HEIGHT - MARGIN_Y
  let currentPageLines: string[] = ['BT', `/F1 ${FONT_SIZE} Tf`]

  const commitPage = () => {
    if (currentPageLines.length <= 2) {
      return
    }

    currentPageLines.push('ET')
    pages.push(currentPageLines.join('\n'))
    currentPageLines = ['BT', `/F1 ${FONT_SIZE} Tf`]
    cursorY = PAGE_HEIGHT - MARGIN_Y
  }

  paragraphs.forEach((paragraph) => {
    if (!paragraph.trim()) {
      cursorY -= LINE_HEIGHT
      if (cursorY < MARGIN_Y) {
        commitPage()
      }
      return
    }

    wrapParagraph(paragraph).forEach((line) => {
      if (cursorY < MARGIN_Y) {
        commitPage()
      }

      currentPageLines.push(`1 0 0 1 ${MARGIN_X.toFixed(2)} ${cursorY.toFixed(2)} Tm`)
      currentPageLines.push(`(${escapePdfText(line)}) Tj`)
      cursorY -= LINE_HEIGHT
    })

    cursorY -= LINE_HEIGHT / 2
    if (cursorY < MARGIN_Y) {
      commitPage()
    }
  })

  commitPage()

  if (pages.length === 0) {
    currentPageLines.push(`1 0 0 1 ${MARGIN_X.toFixed(2)} ${(PAGE_HEIGHT - MARGIN_Y).toFixed(2)} Tm`)
    currentPageLines.push('(Documento sin contenido disponible) Tj')
    currentPageLines.push('ET')
    pages.push(currentPageLines.join('\n'))
  }

  return pages
}

export function createPdfBlobFromText(text: string): Blob {
  const pageContents = buildPageStreams(text)
  const objects: string[] = []

  const addObject = (body: string): number => {
    objects.push(body)
    return objects.length
  }

  const fontId = addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>')
  const pagesObjId = addObject('')
  const contentObjectIds = pageContents.map((content) =>
    addObject(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`),
  )
  const pageObjectIds = pageContents.map((_, index) =>
    addObject(
      `<< /Type /Page /Parent ${pagesObjId} 0 R /MediaBox [0 0 ${PAGE_WIDTH.toFixed(
        2,
      )} ${PAGE_HEIGHT.toFixed(2)}] /Resources << /Font << /F1 ${fontId} 0 R >> >> /Contents ${
        contentObjectIds[index]
      } 0 R >>`,
    ),
  )

  objects[pagesObjId - 1] = `<< /Type /Pages /Kids [${pageObjectIds
    .map((id) => `${id} 0 R`)
    .join(' ')}] /Count ${pageObjectIds.length} >>`

  const catalogId = addObject(`<< /Type /Catalog /Pages ${pagesObjId} 0 R >>`)

  let pdf = '%PDF-1.4\n'
  const offsets: number[] = []

  objects.forEach((body, index) => {
    offsets[index] = pdf.length
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`
  })

  const xrefPosition = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n`
  pdf += '0000000000 65535 f \n'
  offsets.forEach((offset) => {
    pdf += `${offset.toString().padStart(10, '0')} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\n`
  pdf += `startxref\n${xrefPosition}\n%%EOF`

  return new Blob([pdf], { type: 'application/pdf' })
}
