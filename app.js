 const canvas = document.getElementById('animationCanvas');
    const ctx = canvas.getContext('2d');

    // Resize the canvas to fit the container
    const resizeCanvas = () => {
      canvas.width = document.getElementById('animationContainer').offsetWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Person object with improved appearance
    n = {
      x: canvas.width / 2, // Center the person horizontally
      y: 200,
      width: 50,
      height: 100,
      bodyColor: '#87CEEB',
      head: { const persox: 15, y: -40, width: 40, height: 40, color: '#FFD700' }, // Made head rounder
      arms: [
      { x: -10, y: 20, width: 10, height: 40, color: '#000000' }, // Left arm with black sleeve
      { x: 50, y: 20, width: 10, height: 40, color: '#000000' } // Right arm with black sleeve
    ],
      legs: { y: 80, width: 10, height: 40, color: '#8B4513' }
    };

    const poop = [];

    // Draw the person
    function drawPerson() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the person (simplified version)
      ctx.fillStyle = '#FFC0CB'; // Skin color
      ctx.beginPath();
      ctx.arc(person.x, person.y, 50, 0, Math.PI * 2); // Head
      ctx.fill();

      ctx.fillStyle = '#000000'; // Eyes
      ctx.beginPath();
      ctx.arc(person.x - 20, person.y - 15, 5, 0, Math.PI * 2); // Left eye
      ctx.arc(person.x + 20, person.y - 15, 5, 0, Math.PI * 2); // Right eye
      ctx.fill();

      ctx.strokeStyle = '#000000'; // Mouth
      ctx.beginPath();
      ctx.arc(person.x, person.y + 15, 20, 0, Math.PI); // Smile
      ctx.stroke();

      ctx.fillStyle = '#000000'; // Body
      ctx.fillRect(person.x - 25, person.y + 50, 50, 100); // Body

      ctx.fillStyle = '#0000FF'; // Legs
      ctx.fillRect(person.x - 25, person.y + 150, 20, 50); // Left leg
      ctx.fillRect(person.x + 5, person.y + 150, 20, 50); // Right leg

      ctx.fillStyle = '#FF0000'; // Pants
      ctx.fillRect(person.x - 25, person.y + 100, 50, 10); // Pants

      ctx.fillStyle = '#FFFF00'; // Shoes
      ctx.fillRect(person.x - 25, person.y + 200, 20, 10); // Left shoe
      ctx.fillRect(person.x + 5, person.y + 200, 20, 10); // Right shoe
    }

    // Draw the poop
    const drawPoop = () => {
      poop.forEach(p => {
        ctx.fillStyle = 'brown';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.quadraticCurveTo(p.x + 15, p.y - 15, p.x + 30, p.y);
        ctx.quadraticCurveTo(p.x + 45, p.y - 15, p.x + 60, p.y);
        ctx.quadraticCurveTo(p.x + 30, p.y + 30, p.x, p.y);
        ctx.fill();

        // Draw the text inside the poop
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(p.text, p.x + 30, p.y + 15);
      });
    };

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPerson();
      drawPoop();
      requestAnimationFrame(animate);
    };

    // Animate the poop coming out of the person
    const poopItOut = (text) => {
      let poopPiece = { x: person.x - 20, y: person.y + 200, width: 20, height: 20, text: text };
      poop.push(poopPiece);

      anime({
        targets: poopPiece,
        y: poopPiece.y + 50,
        duration: 1000,
        easing: 'easeInOutQuad',
        complete: () => {
          if (poop.length < 5) {
            poopItOut(text);
          }
        }
      });
    };

    // Animate the task moving towards the person's head
    const eatTask = (taskElement) => {
      const taskRect = taskElement.getBoundingClientRect();
      const floatingTask = document.createElement('div');
      floatingTask.classList.add('floatingTask');
      floatingTask.style.left = `${taskRect.left}px`;
      floatingTask.style.top = `${taskRect.top}px`;
      floatingTask.style.width = `${taskRect.width}px`;
      floatingTask.style.height = `${taskRect.height}px`;
      floatingTask.textContent = taskElement.textContent.trim();

      document.body.appendChild(floatingTask);

      anime({
        targets: floatingTask,
        left: `${canvas.getBoundingClientRect().left + person.x}px`,
        top: `${canvas.getBoundingClientRect().top + person.y - 20}px`,
        width: '20px',
        height: '20px',
        borderRadius: ['0%', '50%'],
        duration: 2000,
        easing: 'easeInOutQuad',
        complete: () => {
          const text = taskElement.textContent.trim();
          floatingTask.remove();
          taskElement.remove();
          poopItOut(text);
        }
      });
    };

    // Add new task to the list
    document.getElementById('toDoForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const toDoInput = document.getElementById('toDoInput');
      const taskText = toDoInput.value.trim();
      if (taskText) {
        addTask(taskText);
        toDoInput.value = '';
      }
    });

    // Add task item to the list with finish button
    const addTask = (taskText) => {
      const toDoList = document.getElementById('toDoList');
      const li = document.createElement('li');
      li.className = 'toDoItem';
      li.textContent = taskText;

      const finishButton = document.createElement('button');
      finishButton.className = 'finishButton';
      finishButton.textContent = 'Finish';
      finishButton.addEventListener('click', () => eatTask(li));

      li.appendChild(finishButton);
      toDoList.appendChild(li);
    };

    // Initialize the animation loop
    document.addEventListener('DOMContentLoaded', () => {
      animate();
    });