class Sensor
{
    constructor(car)//takes car to know when car is
    {
        this.car = car; //car w all its properties
        this.rayCount=7;    //3 rays
        this.rayLength=300; //goes forever if it can, basically a range of 100 pixels
        this.raySpread=Math.PI/2;  //45deg angle of spread here

        this.rays=[]; //holds each ray
        this.readings = [];
    }

    update(roadBorders,traffic)
   {
        this.#castRays();
        this.readings=[]; //creates a reading array
        for(let i=0;i<this.rays.length;i++) //iterates thru readings to get readings
        {
            this.readings.push(this.#getReading(this.rays[i],roadBorders,traffic));
        }
   }

   #getReading(ray,roadBorders,traffic)
   {
        let touches = []; //empty array of our touches

        for(let i=0;i<roadBorders.length;i++)
        {
            
            const touch=getIntersection(ray[0],ray[1],roadBorders[i][0],roadBorders[i][1]);

            if(touch)
            {
                touches.push(touch); //if there is a touch we push a touch onto our array
            }
        }

        for(let i=0;i<traffic.length;i++)
        {
            const poly= traffic[i].polygon;
            for(let j=0;j<poly.length;j++)
            {
                const value = getIntersection(ray[0],ray[1],poly[j],poly[(j+1)%poly.length]);

                if(value)
                {
                    touches.push(value); //if there is a touch we push a touch onto our array
                }
            }

        }

        if(touches.length==0)
        {
            return null; //if no touches we return NULL
        }
        else
        {
            const offsets=touches.map(e=>e.offset); //offset is how far is the next nearest object,this function gets all offsets for all rays
            const minOffset=Math.min(...offsets);   //...operator makes splits values into single operators, then we find the min of all offsets to find closest offset
            return touches.find(e=>e.offset==minOffset);  //return touch that has the closest offset, or whatever is closest
        }
   }

   #castRays()
   {
    
        this.rays=[];
        for(let i=0;i<this.rayCount;i++)
        {
            const rayAngle = lerp(this.raySpread/2,-this.raySpread/2,this.rayCount==1?0.5: i/(this.rayCount-1))+this.car.angle; //using unit circle we can calculate the needed angle of the ray

            const start = {x:this.car.x, y:this.car.y}; //starts from cars x and y coordinates
            const end = {x:this.car.x-Math.sin(rayAngle)*this.rayLength, y:this.car.y-Math.cos(rayAngle)*this.rayLength}; //from where the car is we use the unit circle to find the end of where it will end up

            this.rays.push([start,end]); //put the start and end into our array, forms a segment
        }
    
   }

    draw(ctx)
    {
        for(let i=0;i<this.rayCount;i++)
        {
            let end=this.rays[i][1];
            if(this.readings[i])
            {
                end = this.readings[i]; //end is a x,y attribute
            }

            ctx.beginPath();    //starts draw
            ctx.lineWidth=2;    
            ctx.strokeStyle="yellow";   //what our line will look like

           ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y); //start our line from here, using start positions as our parameters
           ctx.lineTo(end.x, end.y); //draw line to this point, we feed our end points here as a parameter

           ctx.stroke();

           
           ctx.beginPath();    //starts draw
           ctx.lineWidth=2;    
           ctx.strokeStyle="black";   //what our line will look like

          ctx.moveTo(
             this.rays[i][1].x,
             this.rays[i][1].y
            ); //start our line from here, using start positions as our parameters
          ctx.lineTo(
            end.x, 
            end.y
            ); //draw line to this point, we feed our end points here as a parameter

           ctx.stroke();
        }
    }
}