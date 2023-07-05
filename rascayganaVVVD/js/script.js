let numbers = []
let ticketNumbers = Array.from(document.getElementsByClassName ("ticket-number"))
    ticketNumbers.forEach(element => {
        let randomNumber =  Math.floor (Math.random()*4)
        element.textContent = randomNumber
        numbers.push (randomNumber) //es una funcion por ende va con parentesis
        //playScratchSound();
    });

  let finished = false;

  let canvas = document.getElementById("canvas");
  let context = canvas.getContext("2d");
  let painting = new Image();
painting.src = "../resources/ticket-paint.png";
painting.onload = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    context.drawImage(painting, 0, 0);
};

let isPainting = false;
let prevX, prevY; // Previous mouse position

function scratchPaint(event) {
    if (isPainting && !finished) {
  
        let radius = 50;
        let rect = canvas.getBoundingClientRect();


        if (event.type === 'mousemove') {
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
        } else if (event.type === 'touchmove') {
            x = event.touches[0].clientX - rect.left;
            y = event.touches[0].clientY - rect.top;
        }
        context.save(); // Save the current context state

        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.clip();
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.closePath();

        context.restore(); // Restore the previous context state

        // Check if the previous position is available
        if (prevX !== undefined && prevY !== undefined) {
            // Calculate the distance between the current and previous position
            const dx = x - prevX;
            const dy = y - prevY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Calculate the number of steps for smoothing
            const steps = Math.ceil(distance / (radius / 2));

            // Perform line interpolation for smoother scratching
            for (let i = 0; i < steps; i++) {
                const interpX = prevX + (dx / steps) * i;
                const interpY = prevY + (dy / steps) * i;
                context.clearRect(interpX - radius / 2, interpY - radius / 2, radius, radius);
            }
        } else {
            // Clear the current position without interpolation for the first point
            context.clearRect(x - radius / 2, y - radius / 2, radius, radius);
        }

        // Update the previous position
        prevX = x;
        prevY = y;
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        const pixelCount = data.length / 4;
        let clearedPixelCount = 0;

        for (let i = 0; i < data.length; i += 4) {
            // Check if the pixel is fully transparent
            if (data[i + 3] === 0) {
                clearedPixelCount++;
            }
        }

        if((clearedPixelCount / pixelCount) * 100 < 99) return;

        finished = true;
        if(numbers.every((num)=>num==numbers[0])){
            resultDiv.innerHTML += '<img src="resources/win-img.png" alt="" id="result-img">'
        }
        else {
            resultDiv.innerHTML += '<img src="resources/lose-img.png" alt="" id="result-img">'
        }
}
}

canvas.addEventListener("mousedown", function (event) {
    isPainting = true;
    prevX = undefined; // Reset the previous position
    prevY = undefined;
});
canvas.addEventListener("mouseup", function (event) {
    isPainting = false;
});

canvas.addEventListener("mousemove", scratchPaint);


canvas.addEventListener("touchstart", function (event) {
    event.preventDefault(); // Prevent default touch behavior
    isPainting = true;
    prevX = undefined; // Reset the previous position
    prevY = undefined;
});

canvas.addEventListener("touchend", function (event) {
    event.preventDefault(); // Prevent default touch behavior
    isPainting = false;
});

canvas.addEventListener("touchmove", scratchPaint);