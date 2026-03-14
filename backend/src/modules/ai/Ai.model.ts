const brain = require("brain");

export const aiModel = new brain.NeuralNetwork({
    hiddenLayers: [4]
});
