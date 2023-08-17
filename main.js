 const carCanvas=document.getElementById("carCanvas")   //reference to canvas
 carCanvas.width=200
 const networkCanvas=document.getElementById("networkCanvas")   //reference to canvas
 networkCanvas.width=300 //sets a bigger width here

 const carCtx = carCanvas.getContext("2d");  //ref to canvas context
 const networkCtx = networkCanvas.getContext("2d");  //ref to canvas context
 const road=new Road(carCanvas.width/2,carCanvas.width*0.9); //we make a road in the middle of our canvas or "width/2"
 N = 1;
 const cars=generateCars(N);    //dimension in pixels  (x location, y location, width ,length,key or dummy)
 let bestCar = cars[0];

 if(localStorage.getItem("bestBrain"))
 {
        for(let i = 0;i<cars.length;i++)
        {
                cars[i].brain = JSON.parse(localStorage.getItem("bestBrain"));
                if(i!=0)
                {
                        NeuralNetwork.mutate(cars[i].brain,0.05);
                }
        }
     
 }

 const traffic = [
new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
 new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
 new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
 new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
 new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
 new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2)
]; //first traffic car;

 animate();

function save()
{
        localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
}

function discard()
{
        localStorage.removeItem("bestBrain");
}

function generateCars(N)
{
        const cars=[];
        for(let i =1;i<=N;i++)
        {
                cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"))
        }
        return cars;

}

 function animate(time) //pass time to show movement which comes from a method request animate frame
 {
        for(let i = 0;i<traffic.length;i++)
        {
                traffic[i].update(road.borders,[]);
        }

        for(let i = 0;i<cars.length;i++)
        {
                cars[i].update(road.borders,traffic);
        }

        bestCar = cars.find(c=>c.y == Math.min(...cars.map(c=>c.y)));

    carCanvas.height=window.innerHeight;  //formating of canvas for correct dimentsion (look like a road)
    networkCanvas.height=window.innerHeight;  //formating of canvas for correct dimentsion (look like a road)

    carCtx.save();   //save context
    carCtx.translate(0, -bestCar.y + (carCanvas.height*0.7)); //if car moves in y direction we displace the context of the road, creating the illusion that the road is moving and not the car
            //(x coordinate, y coordinate)
    road.draw(carCtx); //draws new road constantly over moving translated position 
    for(let i = 0;i<traffic.length;i++)
    {
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.2;
    for(let i = 0;i<cars.length;i++)
    {
        cars[i].draw(carCtx,"blue");  //draws car with translated position
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);
    carCtx.restore(); //retore

    networkCtx.lineDashOffset = -time/50; //creates a dashing line to show a sort of movement in time
    Visualizer.drawNetwork(networkCtx,bestCar.brain); //borrowed this class to be a visualizer
    requestAnimationFrame(animate);  //calls animate function over and over to give the illusion of movement
 }