const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const puppeteer = require('puppeteer');

async function createSpellCardsPdf() {
    console.log('Starting the spell card generator...');

    // 1. Read the CSS file for styling
    const css = fs.readFileSync(path.join(__dirname, 'card_template.css'), 'utf-8');
    console.log('✅ CSS template loaded.');

    // 2. Read and parse the CSV data
    const spells = [];
    await new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, 'spells.csv'))
            .pipe(csv())
            .on('data', (data) => spells.push(data))
            .on('end', resolve)
            .on('error', reject);
    });
    console.log(`✅ Parsed ${spells.length} spells from CSV.`);

    console.log('Description length: ', spells[0].description.length);
    // 3. Generate an HTML block for each spell card
    const cardHtml = spells.map(spell => {

        const upcastHtml = spell.upcast
            ? `<div class="upcast"><strong>At Higher Levels:</strong> ${spell.upcast}</div>`
            : '';

const longThreshold = 250;  // Over this many characters, use the small font.
    const veryLongThreshold = 400; // Over this, use the extra-small font.
    
    let font_class = ''; // Default to no extra class
    
    if (spell.description && spell.description.length > veryLongThreshold) {
        font_class = 'font-xs'; // Extra-small
    } else if (spell.description && spell.description.length > longThreshold) {
        font_class = 'font-sm'; // Small
    }

        return `
            <div class="spell-card">
                <h2>${spell.name}</h2>
                <div class="details"><em>${spell.level}-level ${spell.school}</em></div>
                <div class="stats">
                    <strong>Casting Time:</strong> ${spell.casting_time}<br>
                    <strong>Range:</strong> ${spell.range}<br>
                    <strong>Duration:</strong> ${spell.duration}
                </div>
                <div class="desc-text ${font_class}">${spell.description}</div>
                ${upcastHtml}
                <div class="components">Components: ${spell.components}</div>
            </div>
        `;
    }).join('');

    // 4. Combine everything into a final HTML document
    const finalHtml = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Spell Cards</title>
                <style>${css}</style>
            </head>
            <body>
                ${cardHtml}
            </body>
        </html>
    `;
    console.log('✅ Generated HTML for all cards.');

    // 5. Use Puppeteer to create the PDF
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
    
    await page.pdf({
        path: 'spell-cards.pdf',
        format: 'Letter',
        printBackground: true,
        margin: { top: '0.5in', right: '0.5in', bottom: '0.5in', left: '0.5in' }
    });
    
    await browser.close();
    console.log('✨ PDF created successfully: spell-cards.pdf');
}

createSpellCardsPdf();