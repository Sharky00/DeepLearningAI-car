class Car
{
    constructor(x,y,width,height,controlType,maxSpeed = 3) //dimension in pixels  (x location, y location, width ,length)
    {
        this.x=x;
        this.y=y;                //this block is for the dimensions of the car object
        this.width=width;
        this.height=height;
        
        this.speed=0;
        this.acceleration=0.2;      //this block is for the physics of the car object
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;
        this.damaged = false;

        this.useBrain = controlType == "AI"; // create a controltype attribute for a ai car

        if(controlType != "DUMMY")
        {
        this.sensor=new Sensor(this);
        this.brain = new NeuralNetwork([this.sensor.rayCount,6,4]); //give brain a neural network
        }
        this.control=new Controls(controlType);     //creates a new object for the controls of our car
        
    }

    update(roadBorders,traffic)
    {
        if(!this.damaged)
        {

        this.#move();
        this.polygon=this.#createPolygon();
        this.damaged = this.#assessDamage(roadBorders,traffic);
        
        }
        if(this.sensor)
        {
            this.sensor.update(roadBorders,traffic);
            const offsets = this.sensor.readings.map(s=>s==null?0:1-s.offset); //get offsets
            const outputs = NeuralNetwork.feedForward(offsets,this.brain); //feed forward the info using offsets and sensor stuff and get outputs
            //console.log(outputs)

            if(this.useBrain) //then if it is an ai car we output the controls gotten from outputs
            {
                this.control.forward = outputs[0];
                this.control.left = outputs[1];
                this.control.right = outputs[2];
                this.control.reverse = outputs[3];
            }
        }
    }

    #assessDamage(roadBorders,traffic)
    {
        for(let i=0;i<roadBorders.length;i++) //for all borders
        {
            if(polysIntersect(this.polygon,roadBorders[i]))   //if our polygon touches this boarder
            {
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++) //for all borders
        {
            if(polysIntersect(this.polygon,traffic[i].polygon))   //if our polygon touches this boarder
            {
                return true;
            }
        }
        return false;
    }

    #createPolygon() 
    {
        const points = []; //array of points, one per corner of the car
        const rad=Math.hypot(this.width,this.height)/2; //find the radius of the rectangle of this car
        const alpha=Math.atan2(this.width,this.height); //gets angle from corner to front of car from the center

        points.push({x:this.x-Math.sin(this.angle-alpha)*rad, y:this.y-Math.cos(this.angle-alpha)*rad});
        points.push({x:this.x-Math.sin(this.angle+alpha)*rad, y:this.y-Math.cos(this.angle+alpha)*rad});   //these lines are the corners of the car using math formulas to create a rectangle
        points.push({x:this.x-Math.sin(Math.PI + this.angle-alpha)*rad, y:this.y-Math.cos(Math.PI + this.angle-alpha)*rad});
        points.push({x:this.x-Math.sin(Math.PI + this.angle+alpha)*rad, y:this.y-Math.cos(Math.PI + this.angle+alpha)*rad});

        return points;
    }

    #move()
    {
        if(this.control.forward)     //reads forward movement
        {
            this.speed+=this.acceleration;
        }
        if(this.control.reverse)    //reads reverse movement
        {
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxSpeed)   //caps speed of the car
        {
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2) //caps reverse speed of the car
        {
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>0)   //adds friction to the car when moving forward
        {
            this.speed-=this.friction;
        }
        if(this.speed<0)   //adds friction to the car when reversing
        {
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction) //if the car speed has an absolute value less than friction we stop the car
        {
            this.speed=0;
        }
        if(this.speed!=0)
        {
            const flip=this.speed>0?1:-1;
            if(this.control.left)   //if left input it rotates car left by use of unit circle
            {
                this.angle+=0.03*flip;
            }
            if(this.control.right)  //if right input it rotates car right by use of unit circle
            {
                this.angle-=0.03*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;  //puts turn and speed together to simulate a real turning circle of a car
        this.y-=Math.cos(this.angle)*this.speed;
        

       // this.y-=this.speed;
    }

    draw(ctx,color,drawSensor=false)
    {
        if(this.damaged)
        {
            ctx.fillStyle="gray";
        }
        else
        {
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y)

        for(let i=1;i<this.polygon.length;i++)
        {
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y) //draws our polygon using the points we have used
        }
        ctx.fill();

        if(this.sensor && drawSensor == true)
        {
        this.sensor.draw(ctx);
        }
    }
}