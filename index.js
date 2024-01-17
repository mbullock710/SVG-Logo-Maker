const fs = require('fs');
const inquirer = require('inquirer');

const questions = [
    {
        type: 'input',
        name: 'text',
        message: 'Please enter up to three characters (Select SVG for this example)'
    },
    {
        type: 'input',
        name: 'textColor',
        message: 'Please enter a color keyword for the text (Select white for this example)'
    },
    {
        type: 'list',
        name: 'shape',
        message: 'Please select a shape (Select circle for this example)',
        choices: ['circle', 'triangle', 'square']
    },
    {
        type: 'input',
        name: 'shapeColor',
        message: 'Please enter a color keyword for the shape color (Select green for this example)'
    },
]

async function generateSVG({ text, textColor, shape, shapeColor }) {
    const { createSVGWindow } = await import('svgdom');
    const { SVG, registerWindow } = await import('@svgdotjs/svg.js');

    const window = createSVGWindow();
    const document = window.document;
    registerWindow(window, document);

    const svg = SVG().size(300, 200);

    if (text) {
        svg.text(text).fill(textColor);
    }

    if (shape) {
        switch (shape) {
            case 'circle':
                const circle = svg.circle(50).fill(shapeColor).center(150, 100);
                if (text) {
                    svg.text(text).fill(textColor).center(circle.cx(), circle.cy());
                }
                break;
            case 'triangle':
                svg.polygon('150,50 100,150 200,150').fill(shapeColor);
                break;
            case 'square':
                svg.rect(100, 100, { x: 100, y: 50, fill: shapeColor });
                break;
            default:
                console.log('Invalid shape for testing');
        }
    }
    return svg.svg();
}

function writeToFile(fileName, content) {
    fs.writeFile(fileName, content, (err) =>
        err ? console.log(err) : console.log('Generated logo.svg')

    )
};

async function init() {
    const res = await inquirer.prompt(questions);
    const contentPromise = generateSVG(res);

    contentPromise.then((content) => {
        writeToFile('logo.svg', content);
    })
}

init();