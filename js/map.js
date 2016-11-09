class IoTMap
{

createSVGFoundation(divSelector){

    $(divSelector).html('');
    // $(divSelector).append("<ul id='thingslist' aria-hidden=false aria-label='Help Info'/>");
    // var ul = $(divSelector).find('ul');
    // ul.hide();

    var foundation = d3.select(divSelector);

    var svgWidth = $(window).width();
    
    var ratio=(svgWidth/Math.max(this.room.width,this.room.height))*0.8
   

    var width = svgWidth,
        height = this.room.height*ratio*1.2,
	thingradius = Math.round(width/16),
	position ={x:0,y:0};


    var svg = foundation.append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width/10 + "," +  height/10  + ")");
    return { svg: svg, thingradius: thingradius, width: width, height: height};
}

draw() {
    var thingradius = this.foundation.thingradius;
    var svg = this.foundation.svg;

    var center = svg.append("g")
        .append("svg:a")
        .attr("aria-live","polite")
        .attr("id", "mapButton")
        .attr("xlink:href", "#pagecontentMap")

    var w = this.foundation.width/30;

    var centerimage = center.append("svg:image")
        .attr('aria-hidden',true)
        .attr("id", "mapTargetImage")
        .attr("x", -w/2)
        .attr("y", -w/2)
        .attr("width", w)
        .attr("height", w);

    this.generateBlock(svg,this.room.width*this.ratio,this.room.height*this.ratio);
}

generateCircle(svgparent, radius) {
    svgparent.append("circle")
        .attr("r", radius)
        .attr('aria-hidden',true)
        .style("fill", "none")
        .style("stroke", "#ff6f00")
        .attr("class", "svgshadow");
}

generateBlock(svgparent, height, width ){
    svgparent.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", width)
        .attr("width", height)
        .attr('aria-hidden',true)
        .style("fill", "none")
        .style("stroke", "#ff6f00")
        .attr("class", "svgshadow");
}

populate(things){
    var svg=this.foundation.svg
    var thingradius=this.foundation.thingradius
    var scope=this;

    $.each(things, function(key, val){
        var color = "black";
        if(val.status != undefined && !val.status) {
            color = "red";
        }
        if(val.status == "danger")
            color = "red";
        if(val.status == "warning")
            color = "yellow";
        if(val.status == "ok")
            color = "green";

        var thing = svg.append("svg:a")
            .attr("xlink:href", "#" + key)
            .attr("id", key+"map");

        thing.append("svg:image")
            .attr("xlink:href", val.img)
            .attr('x', -thingradius)
            .attr('y', -thingradius)
            .attr('width', thingradius*2)
            .attr('height', thingradius*2)
            .attr('clip-path','url(#clipCircleMap)');

        thing.append("circle")
            .attr("fill", "none")
            .attr("r", thingradius)
            .style("stroke-width", 2)
            .style("stroke", color)


        var clippedCoords=scope.clipCoordsToBorder(val.location.x,val.location.y);

        thing.attr("transform", "translate("+ clippedCoords.x+", "+clippedCoords.y+")")
        thing.append("title").html(key)

    });
}


update(things, me) {
    var clippedCoords;
    var scope=this;

    $.each(things, function(key, val){
        clippedCoords=scope.clipCoordsToBorder(val.location.x,val.location.y);
        d3.select("#"+key+"map")
            .attr("transform", "translate("+clippedCoords.x+", "+clippedCoords.y+")")
    });

    clippedCoords=this.clipCoordsToBorder(me.x,me.y);
    d3.select('#mapTargetImage')
        .attr('xlink:href', 'img/' + "arrow2" + '.png')
        .attr("transform", "translate("+clippedCoords.x+", "+clippedCoords.y+")"+" rotate("+(me.dir)+") ");
}

clipCoordsToBorder(x,y) {
    var x= x* this.ratio;
    var y = y* this.ratio;

    return {x:x , y:y}
}

constructor(div,things,room={width:1000,height:600})
	{
	  this.room=room
	  this.foundation=this.createSVGFoundation(div)
	  this.ratio=(this.foundation.width/Math.max(this.room.width,this.room.height))*0.8
	  this.draw()
	  this.populate(things)
	}
}
