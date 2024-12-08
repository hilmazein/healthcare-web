let menu = document.querySelector('#menu-btn');
let navbar = document.querySelector('.navbar');

menu.onclick = () => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
}

window.onscroll = () => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
}


// Disease Diagnosis
// List of available symptoms
const symptoms = ['fever', 'cough', 'dizziness', 'headache', 'nausea', 'muscle pain', 'fatigue'];

// Creating a simple TensorFlow.js model
const model = tf.sequential();

// Adding layers
model.add(tf.layers.dense({ inputShape: [symptoms.length], units: 5, activation: 'relu' }));
model.add(tf.layers.dense({ units: 3, activation: 'softmax' }));

// Compiling the model
model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
});

// Training data (dummy)
const trainingData = tf.tensor2d([
    [1, 1, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1],
]);

const targetData = tf.tensor2d([
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
]);

// Training the model
async function trainModel() {
    await model.fit(trainingData, targetData, {
        epochs: 10,
        callbacks: {
            onEpochEnd: (epoch, logs) => {
                console.log(`Epoch ${epoch + 1}: Loss = ${logs.loss}`);
            },
        },
    });
    console.log('Model training is complete!');
}

// Function to convert input symptoms to One-Hot Encoding
function symptomsToOneHot(input) {
    const inputArray = input.toLowerCase().split(',').map(symptom => symptom.trim());
    return symptoms.map(symptom => (inputArray.includes(symptom) ? 1 : 0));
}

// Diagnosis function
async function diagnose() {
    const input = document.getElementById('symptoms').value;

    if (!input) {
        document.getElementById('result').innerText = 'Please enter symptoms.';
        return;
    }

    const symptomsArray = symptomsToOneHot(input);
    const prediction = model.predict(tf.tensor2d([symptomsArray]));
    const resultIndex = prediction.argMax(1).dataSync()[0];

    const diseases = ['Flu', 'Fever', 'Infection'];
    document.getElementById('result').innerText = `Diagnosis Result: ${diseases[resultIndex]}`;
}

// Train the model when the page loads
document.addEventListener('DOMContentLoaded', () => {
    trainModel();
});
