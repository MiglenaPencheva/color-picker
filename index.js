const APP = {
    canvas: null,
    ctx: null,
    data: [],
    img: null,

    init() {
        APP.canvas = document.querySelector('main canvas');
        APP.ctx = APP.canvas.getContext('2d');

        APP.canvas.width = 900;
        APP.canvas.style.width = 900;
        APP.canvas.height = 600;
        APP.canvas.style.height = 600;

        APP.img = document.createElement('img');
        APP.img.src = APP.canvas.getAttribute('data-src');

        APP.img.onload = (e) => {
            APP.ctx.drawImage(APP.img, 0, 0);
            let imgDataObj = APP.ctx.getImageData(0, 0, APP.canvas.width, APP.canvas.height);
            APP.data = imgDataObj.data;

            APP.canvas.addEventListener('mousemove', APP.getPixel);
            APP.canvas.addEventListener('click', APP.addBox);
        }
    },

    getPixel(e) {
        // let canvas = e.target
        let cols = APP.canvas.width;
        // let rows = canvas.height;
        let { offsetX, offsetY } = e;

        let c = APP.getPixelColor(cols, offsetY, offsetX);
        // make it a string for css
        let clr = `rgb(${c.red}, ${c.green}, ${c.blue})`;  // rgba => + ${c.alpha / 255}

        document.getElementById('pixelColor').style.backgroundColor = clr;
        APP.pixel = clr;
        APP.getAverage(e);
    },

    getAverage(e) {
        // let canvas = e.target;
        let cols = APP.canvas.width;
        let rows = APP.canvas.height;

        APP.ctx.clearRect(0, 0, cols, rows);     // image is in memory, not reloading
        APP.ctx.drawImage(APP.img, 0, 0);

        let { offsetX, offsetY } = e;
        const inset = 20;

        offsetX = Math.min(offsetX, cols - inset);
        offsetX = Math.max(inset, offsetX);
        offsetY = Math.min(offsetY, rows - inset);
        offsetY = Math.max(offsetY, inset);

        let reds = 0;
        let greens = 0;
        let blues = 0;

        // for anything in the range (x-20, y-20) to (x+20, y+20)
        for (let x = -1 * inset; x <= inset; x++) {
            for (let y = -1 * inset; y <= inset; y++) {
                let c = APP.getPixelColor(cols, offsetY + y, offsetX + x);
                reds += c.red;
                greens += c.green;
                blues += c.blue;
            }
        }
        let numbs = 41 * 41;
        let red = Math.round(reds / numbs);
        let green = Math.round(greens / numbs);
        let blue = Math.round(blues / numbs);

        // string for average 
        let clr = `rgb(${red}, ${green}, ${blue})`;
        // save for later
        APP.average = clr;

        // make a square of the average color
        APP.ctx.fillStyle = clr;
        APP.ctx.strokeStyle = '#FFFFFF';
        APP.ctx.strokeWidth = 2;
        APP.ctx.strokeRect(offsetX - inset, offsetY - inset, 41, 41);
        APP.ctx.fillRect(offsetX - inset, offsetY - inset, 41, 41);
    },

    getPixelColor(cols, x, y) {     // method to get r,g,b,a values for current pixel
        let pixel = cols * x + y;   // total columns * current row + current column
        let arrayPos = pixel * 4;   // every pixel in arr has 4 values - r,g,b,a

        return {
            red: APP.data[arrayPos],
            green: APP.data[arrayPos + 1],
            blue: APP.data[arrayPos + 2],
            alpha: APP.data[arrayPos + 3],
        };
    },

    addBox(e) {      // when user click => boxes are added - one for current pixel and one for average color
        let colors = document.querySelector('.colors');

        let pixel = document.createElement('span');
        pixel.className = 'box';
        pixel.setAttribute('data-label', 'Exact pixel');
        pixel.setAttribute('data-color', APP.pixel);

        let average = document.createElement('span');
        average.className = 'box';
        average.setAttribute('data-label', 'Average');
        average.setAttribute('data-color', APP.average);

        pixel.style.backgroundColor = APP.pixel;
        average.style.backgroundColor = APP.average;
        colors.append(pixel, average);
        // colors.append(pixel);
        // colors.appendChild(average);
    },
};

document.addEventListener('DOMContentLoaded', APP.init);