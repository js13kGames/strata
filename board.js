function pingpong(start,end,time,timestamp)
{
  var pos=timestamp%(time*2);
  if (pos>time) pos=2*time-pos;
  return start+(pos/time)*(end-start);
}

function slide(start,end,time,timestamp)
{
  var pos=timestamp%time;
  return start+(pos/time)*(end-start);
}

function drawMain()
{
	var c=document.getElementById('main');
	c.width = 500; c.height = 500;
	var ctx = c.getContext('2d');
	
	ctx.fillStyle="#005"
	var Layers=[];
	var layerStart=400;
	var lastTime=0;
	var addElement=-1;
	var addTime=0;
	var fullAddTime=1000;
	
	function step(timestamp) {
	  
      var yDie=200;
	  var layerDepth=50;
	  var layerSpeed=50;
      	  
	  var frameTime=(lastTime==0)?0:(timestamp-lastTime);
      lastTime=timestamp;	  
	  //load patterns
	  for (var i=0;i<Elements.length;i+=1)
	    if (!Elements[i].pattern)
		   Elements[i].pattern=ctx.createPattern(Elements[i],'repeat');

	  //clear old contents
	  ctx.fillStyle="#005"
	  ctx.globalAlpha=frameTime/250;
	  ctx.fillRect(0,0,500,500);
	  ctx.globalAlpha=1;
	  
	  //draw the current action
	  if (addElement>=0) {
	     var ratio=(addTime+0.001)/fullAddTime;
		 var yPos=ratio*(yDie+layerStart+layerDepth*2);
		 ctx.fillStyle=Elements[addElement].pattern;
		 ctx.moveTo(0,yPos);
		 ctx.bezierCurveTo(200,yPos-layerDepth,300,yPos+layerDepth,500,yPos);
		 ctx.lineTo(500,yPos+layerDepth);
		 ctx.bezierCurveTo(300,yPos+2*layerDepth,300,yPos,0,yPos+layerDepth);		 
		 ctx.fill();
         addTime+=frameTime;
         if (ratio>1) { addElement-=1;	addTime=0; }
	  } else addElement=4;
	  
	  
	  
	  var yStart=yDie+layerStart;	   
	  for (var i=0;i<Layers.length;i+=1) {
	    ctx.save();
	    ctx.beginPath();
		var xoff=(yStart+i*layerDepth)*Elements[Layers[i]].xflow;
		var yoff=(yStart+i*layerDepth)*Elements[Layers[i]].yflow;
		ctx.translate(-xoff,-yoff)
	    ctx.fillStyle=Elements[Layers[i]].pattern;
		ctx.moveTo(xoff,yoff+yStart+i*layerDepth);
		ctx.quadraticCurveTo(xoff+250,yoff+yDie,xoff+500,yoff+yStart+i*layerDepth);
		ctx.lineTo(xoff+500,yoff+yStart+i*layerDepth+layerDepth);
		ctx.lineTo(xoff,yoff+yStart+i*layerDepth+layerDepth);
		ctx.fill();
		ctx.restore();	  
	  }
	  
	  layerStart-=layerSpeed*frameTime/1000;
	  if (layerStart<0) {
	    layerStart+=layerDepth;
		Layers.splice(0,1);
	  }
	  
	  while (Layers.length<20)
	    Layers.push(Math.floor(Math.random()*Elements.length));
		
	  
	  window.requestAnimationFrame(step);
	}	
	step(-1);
	
}

drawMain();