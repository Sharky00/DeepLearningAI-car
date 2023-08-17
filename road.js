class Road
{
    constructor(x,width,laneCount = 3)  //constructs our road
    {
        this.x = x;
        this.width=width;           //setting core parameters
        this.laneCount=laneCount;

        this.left=x-width/2;        //width of road
        this.right=x+width/2;

        const infinity=1000000;     //we want road to go on forever
        this.top=-infinity;         
        this.bottom=infinity;
                                
        const topLeft={x:this.left,y:this.top}      //coordinate for top left
        const bottomLeft={x:this.left,y:this.bottom}//coordinate for bottom left

        const topRight={x:this.right,y:this.top}    //coordinate for top right
        const bottomRight={x:this.right,y:this.bottom}//coordinate for bottom right

        this.borders=[[topLeft,bottomLeft],[topRight,bottomRight]];  //save boarder into a parameter as memory
    }

    getLaneCenter(laneIndex)
    {
        const laneWidth=this.width/this.laneCount;  

        return this.left+laneWidth/2+ //in the middle of the first lane plus the index of what lane we want
            Math.min(laneIndex,this.laneCount-1)*laneWidth; //makes sure we return in a existing lane
    }


    draw(ctx)
    {
        ctx.lineWidth = 5;      //width is 5 of linewidth
        ctx.strokeStyle="white";  //lines on road are white

        for(let i=1;i<=this.laneCount-1;i++) //creates vertical line for each lane
        {
            const x=lerp(this.left, this.right, i/this.laneCount); //this function gives the x coordinate to correctely place lane in the road

        
            ctx.setLineDash([20,20]) //our dash will be 20 pixels long with a 20 pixel break
            ctx.beginPath();    //starts path
            ctx.moveTo(x,this.top);
            ctx.lineTo(x,this.bottom);      //vertical line on left side of screen
            ctx.stroke();
        }
        
        ctx.setLineDash([]);
        this.borders.forEach(boarder=>
            {
            ctx.beginPath();
            ctx.moveTo(boarder[0].x,boarder[0].y);
            ctx.lineTo(boarder[1].x,boarder[1].y);
            ctx.stroke();
        });
    }

}
