class NeuralNetwork
{
    constructor(neuronCounts) //number of neurons in each layer
    {
        this.levels=[]; //neural network in a aray of levels
        for(let i = 0;i<neuronCounts.length-1;i++)// for each level
        {
            this.levels.push(new Level(neuronCounts[i],neuronCounts[i+1])); //add new level w ceuron count of this index and neuron counts from next index
        }
        
        
    }

    static feedForward(givenInputs,network) //feed forward for neural network
    {
        let outputs = Level.feedForward(givenInputs,network.levels[0]);//calls feed forward from level and gives inputs and the intital floor level, then makes outputs

        for(let i = 1;i<network.levels.length;i++)
        {
            outputs=Level.feedForward(outputs,network.levels[i]); // then for remaining levels we update outputs with feed forward result
        }

        return outputs; //return final outputs
    }


    static mutate(network,amount = 1)
    {
        network.levels.forEach(level=>
            {
                for(let i = 0;i<level.biases.length;i++)// for each level
                {
                    level.biases[i]=lerp(level.biases[i], Math.random()*2-1,amount)
                }
                for(let i = 0;i<level.weights.length;i++)// for each level
                {
                    for(let j = 0;j<level.weights[i].length;j++)// for each level
                    {
                        level.weights[i][j] = lerp(level.weights[i][j], Math.random()*2-1,amount)
                    }
                }
            }
        );
    }
}

class Level
{
    constructor(inputCount,outputCount) //input of (floor), output(ceiling)
    {
        this.inputs = new Array(inputCount); //array of inputs, value we get from car sensor
        this.outputs = new Array(outputCount);    //array of outputs, get this from weights and biases
        this.biases = new Array(outputCount);   // a bias for every output

        this.weights=[]; //this holds the weight for every input

        for(let i = 0;i<inputCount;i++) //for however many inputs
        {
            this.weights[i] = new Array(outputCount); //we add an array of outputs, bc we are connecting every input node to every output node
        }

        Level.#randomize(this);

    }

    static #randomize(level) //static method for serializing
    {
        for(let i = 0;i<level.inputs.length;i++) //givin a level, go thru inputs
        {
            for(let j = 0;j<level.outputs.length;j++) //and for each input go thru output
            {
                level.weights[i][j] = Math.random()*2-1; //gives random value between -1 and 1, and puts that as the weight for our sensor
            }
        }

        for(let i = 0;i<level.biases.length;i++)
        {
            level.biases[i] = Math.random()*2-1; //gives random value between -1 and 1,
        }
    }

    static feedForward(givenInputs,level) //given inputs and level, input comes from a sensor at first floor
    {
              for(let i = 0;i<level.inputs.length;i++)  //go through all levels, for output
                {//set them to given inputs
                    level.inputs[i] = givenInputs[i]; //we set that to our level const
                }

                for(let i = 0; i< level.outputs.length;i++)//loop thru every output
                {//calculate a sum, using weights and biases
                    let sum = 0;
                    for(let j = 0;j<level.inputs.length;j++)//loop thru inputs
                    {
                        sum += level.inputs[j]*level.weights[j][i]; //every input  *  weight from this output the current input we are on
                    }

                    if(sum>level.biases[i]) 
                    {
                        level.outputs[i]=1; //set output to 1 or turn it on
                    }
                    else
                    {
                        level.outputs[i] = 0; //set output to 0 or turn it off
                    }
                }

                return level.outputs;
    }
}