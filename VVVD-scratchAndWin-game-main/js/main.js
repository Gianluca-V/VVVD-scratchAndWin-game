let firstTime = true; // Flag to track if it's the first time playing the game
let cupNumber = 3; // Number of cups in the game
let probabilityOffset = 2; // Offset for the probability of adding a ball to a cup
const cupHTML = '<div class="cup-container" draggable="false"><div class="cup"><img src="resources/cup-img.png" alt="cup-img" draggable="false"></div></div>'; //cup html code
const resultDiv = document.getElementById("result-div")
let cupsContainer = document.getElementById("cups-container"); // Container element for the cups
let cupContainer; // Array to store the cup container elements

function shuffle() {
  const items = gsap.utils.toArray(".cup-container"); // Convert cup container elements into an array

  // Get the state of the cup containers
  const state = Flip.getState(items);
  
  // Do the actual shuffling of the cup containers
  for (let i = items.length; i >= 0; i--) {
    cupsContainer.appendChild(cupsContainer.children[Math.random() * i | 0]);
    playCupMoveSound();
  }
  
  // Animate the change using the Flip library
  Flip.from(state, {
    absolute: true
  });
}

function createCups() {
  // Create cup containers
  for (let index = 0; index < cupNumber; index++) {
    cupsContainer.innerHTML += cupHTML;
  }

  // Get cup elements and cup container elements
  const cups = document.getElementsByClassName("cup");
  cupContainer = document.getElementsByClassName("cup-container");

  let selected = false;

  let cupContainerArray = Array.from(cupContainer);

  if(!firstTime){
    // Add motion blur cups to existing cup containers
    const blurCupHTML = '<div class="motion-blur-cup cup" draggable="false"><img src="resources/cup-img.png" alt="cup-img" draggable="false"></div>';
    for (let index = 0; index < cupContainerArray.length; index++) {
      cupContainerArray[index].innerHTML += blurCupHTML;
      cupContainerArray[index].innerHTML += blurCupHTML;
    }

    // Create a timeline for cup shuffling animation
    const totalIterations = Math.floor(Math.random() * 7) + 5;
    const cupShuffle = gsap.timeline({
      repeat: totalIterations,
      repeatDelay: 0.2,
    });
    
    // Remove motion blur cups after shuffling animation is completed
    cupShuffle.eventCallback("onComplete", () => {
      Array.from(document.getElementsByClassName("motion-blur-cup")).forEach(cup => cup.remove());
    });
    
    cupShuffle.call(shuffle); // Call the shuffle function
  }
  
  firstTime = false;

  // Add click event listener to each cup container
  cupContainerArray.forEach((element) => {
    element.addEventListener('click', () => {
      if (!selected) {
        let cup = element.querySelector(".cup");
        cup.classList.add("cup-animation");
        selected = true;
        playCupSound();
        // Add ball randomly to a cup container
        if (Math.floor(Math.random() * (cupNumber + probabilityOffset)) == 1) {
          element.innerHTML += '<div class="ball"><img src="resources/ball-img.png" alt="ball-img" draggable="false"></div>';
          resultDiv.innerHTML += '<img src="resources/win-img.png" alt="" id="result-img">'
          playWinSound();
          
        }
        else {
            resultDiv.innerHTML += '<img src="resources/lose-img.png" alt="" id="result-img">'
            playLoseSound();
        }
        // Reset the game after 3 seconds
        setTimeout(() => {
          deleteCups();
          createCups();
          resultDiv.innerHTML = ""
        }, 3000);
      }
    });
  });
}

// Call the createCups function to start the game
createCups();


function deleteCups() {
  cupsContainer.innerHTML = '';
}

function playWinSound() {
    const winSound = document.getElementById('winSound');
    winSound.currentTime = 0; // Reinicia el audio a la posición inicial
    winSound.play();
  }
  
  function playLoseSound() {
    const loseSound = document.getElementById('loseSound');
    loseSound.currentTime = 0;
    loseSound.play();
  }
  
  function playCupSound() {
    const cupSound = document.getElementById('cupSound');
    cupSound.currentTime = 0;
    cupSound.play();
  }

  function playCupMoveSound() {
    const cupMoveSound = document.getElementById('cupMoveSound');
    cupMoveSound.currentTime = 0;
    cupMoveSound.play();
  }