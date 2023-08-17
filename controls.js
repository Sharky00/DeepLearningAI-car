class Controls
{
    constructor(type)
    {
        this.forward=false;
        this.left=false;
        this.right=false;
        this.reverse=false;

        switch(type){
            case "KEYS":
                this.#addkeyboardListeners();
                break;
            case "DUMMY":
                this.forward=true;
                break;
        }

    }

    #addkeyboardListeners()
    {
        document.onkeydown=(event)=>     //=> is basically writing function(event), altho with the => we can use this to still refer to our object instead of the function itself
        {
            switch(event.key)
            {
                case "ArrowLeft":
                    this.left=true;
                    break;
                case "ArrowRight":
                    this.right=true;
                    break;
                case "ArrowUp":
                    this.forward=true;
                    break;
                case "ArrowDown":
                    this.reverse=true;
                    break;
            }
           // console.table(this); //test to see the key inputs are working
        }
        document.onkeyup=(event)=>
        {
            switch(event.key)
            {
                case "ArrowLeft":
                    this.left=false;
                    break;
                case "ArrowRight":
                    this.right=false;
                    break;
                case "ArrowUp":
                    this.forward=false;
                    break;
                case "ArrowDown":
                    this.reverse=false;
                    break;
            }
           // console.table(this); //test to see the release key inputs are working
        }
    }
}