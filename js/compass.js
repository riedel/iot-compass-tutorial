class IoTCompass
{

createSVGFoundation(divSelector){
  $(divSelector).html('');
  // $(divSelector).append("<ul id='thingslist' aria-hidden=false aria-label='Help Info'/>");
  // var ul = $(divSelector).find('ul');
  // ul.hide();

  var foundation = d3.select(divSelector);

  var svgWidth = $(window).width();
  var svgHeight = $(window).height();

  var width = svgWidth,
      height = svgHeight,
      radius = Math.min(width, height),
      radarradius = Math.round(radius/2.5),
      thingradius = Math.round(radarradius/8);

    // .attr('aria-hidden',true)
  var svg = foundation.append("svg")
    .attr("width", radius)
    .attr("height", radius)
    .append("g")
    .attr("transform", "translate(" + radius / 2 + "," + radius / 2 + ")");
  return {radius: radius, svg: svg, thingradius: thingradius, radarradius: radarradius};
}

draw() {
  var radius = this.foundation.radius;
  var svg = this.foundation.svg;

  var w = radius/7;

  var center = svg.append("g")
      .append("svg:a")
      .attr("aria-live","polite")
      .attr("id", "radarButton")
      .attr("xlink:href", "#pagecontent")
      // .attr('aria-hidden',true)
      // .attr('role', 'Nothing is in front of you.');
  center.append("title").html("Nothing")
  center.append("desc").html("is in front of you.")
  center.append("svg:image")
      .attr('aria-hidden',true)
      .attr("xlink:href", "img/arrow.png")
      .attr("x", -w/2)
      .attr("y", -w/2)
      .attr("width", w)
      .attr("height", w);
  w = radius/5
  var centerimage = center.append("svg:image")
      .attr('aria-hidden',true)
      .attr("id", "radarTargetImage")
      .attr("x", -w/2)
      .attr("y", -w/2)
      .attr("width", w)
      .attr("height", w);

  this.generateCircle(svg, this.foundation.radarradius);
  this.generateCircle(svg, this.foundation.radarradius*5/6);
  this.generateCircle(svg, this.foundation.radarradius*2/3);
  this.generateCircle(svg, this.foundation.radarradius/2);

  svg.append("circle")
    .attr("r", this.foundation.radarradius/3)
    .attr('aria-hidden',true)
    .attr("id", "selectionCircle")
    .style("stroke", "#ff6f00")
    .attr("fill","none");

  svg.append('clipPath')
  .attr('id', 'clipCircle')
  .append('circle')
    .attr('r', this.foundation.thingradius)
    .attr('cx','0')
    .attr('cy','0');

  svg.append('clipPath')
  .attr('id', 'clipCenterCircle')
  .append('circle')
    .attr('r', this.foundation.thingradius*2)
    .attr('cx','0')
    .attr('cy','0');
}

generateCircle(svgparent, radius) {
  svgparent.append("circle")
    .attr("r", radius)
    .attr('aria-hidden',true)
    .style("fill", "none")
    .style("stroke", "#ff6f00")
    .attr("class", "svgshadow");
}

// var things = JSON.parse(txt2);
// var txt = '{\
// "laptop": {\
//   location: {dir: 120},\
//   label: "laptop",\
//   img: "img/laptop.jpg"\
// },\
// "lamp1": {\
//   location: {dir: 0},\
//   label: "office lamp",\
//   img: "img/lamp.png",\
//   hueid: "1",\
//   restAPI: bridgeip + "/api/" + hueuser + "/lights/"\
// }}';

// var things = JSON.parse(txt);

populate(things){

  var svg = this.foundation.svg;
  var radarradius=this.foundation.radarradius
  var thingradius=this.foundation.thingradius
  $.each(things, function(key, val){
    // ul.append('<li>'+key+' blub blub</li>')
    var x = -radarradius*Math.sin((val.location.dir)*Math.PI/180);
    var y = -radarradius*Math.cos((val.location.dir)*Math.PI/180);
    // console.log(x,y)
      // .attr("onclick", "$('#"+key+"')[0].scrollIntoView()")
      // .attr("cursor", "pointer")
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
    /* better performance (in chrome usable), no image borders, images not round */
    // var w = thingradius*2;
    // svg.append("svg:a")
    //   .attr("xlink:href", "#"+key)
    //   .append("svg:image")
    //   .attr("id", key+"radar")
    //   .attr("xlink:href", val.img)
    //   .attr("x", -w/2)
    //   .attr("y", -w/2)
    //   .attr("width", w)
    //   .attr("height", w)
    //   .attr("transform", "translate("+x+"," + y + ")")

    /* worse performance (in chrome almost unusable), icons in circles */
    if(val.img) {
      // generatePattern(svg, thingradius*2, val.img, key+'pattern');
      // generatePattern(svg, 100, val.img, key+'patternFull');
    } else {
      // var img = "img/" + key + ".png"
      // generatePattern(svg, thingradius*2, img, key+'pattern');
      // generatePattern(svg, 100, img, key+'patternFull');
    }
    var thing = svg.append("svg:a")
      .attr("xlink:href", "#" + key)
        .attr("id", key+"radar");

        thing.append("svg:image")
        .attr("xlink:href", val.img)
        .attr('x', -thingradius)
        .attr('y', -thingradius)
        // .attr("transform", "translate("+x+"," + y + ")")
        .attr('width', thingradius*2)
        .attr('height', thingradius*2)
        .attr('clip-path','url(#clipCircle)');

      thing.append("circle")
        .attr("fill", "none")      
      .attr("r", thingradius)
      .style("stroke-width", 2)
      .style("stroke", color)

      // .attr('aria-hidden',true)

      // thing.append("circle")
      // .attr("r", thingradius)
      // .style("stroke-width", 3)
      // .style("stroke", "green")
      // // // .attr("id", key+"radar")
      // .attr("transform", "translate("+x+"," + y + ")")

      // .attr('clip-path','url(#clipCircle)');
      // .attr("fill","url(#"+key+"pattern)")
    thing.append("title").html(key)
  });
}

update(things, me) {
  var direction=me.dir;
  var radarradius=this.foundation.radarradius

  $.each(things, function(key, val){
    var degree = val.location.dir;
    var actualDirection = degree-direction;
    // console.log(getLocation().dir,actualDirection)
    // $('#radartarget1').html(Math.round(getLocation().dir) + " " + Math.round(actualDirection));
    // var color = "black";
    // if(val.status != undefined && !val.status) {
    //   color = "red";
    //   .attr("stroke", color)
    // }
    var x = -radarradius*Math.sin(actualDirection*Math.PI/180);
    var y = -radarradius*Math.cos(actualDirection*Math.PI/180);
    var thing = d3.select("#"+key+"radar")
      .attr("transform", "translate("+x+", "+y+")")

    
  });
}

select(thing){
  var centerimage = d3.select('#radarTargetImage')
  if(thing.value.img) {
    // button.select('image')
    //   .attr('xlink:href', thing.value.img)
    centerimage.attr('xlink:href', thing.value.img)
  } else {
    // button.select('image')
    //   .attr('xlink:href', 'img/' + thing.key + '.png')
    //I believe this falls back to an image if there is no semantic data about the image
    centerimage.attr('xlink:href', 'img/' + thing.key + '.png')
  }

  centerimage.attr('clip-path','url(#clipCenterCircle)');

  $('#radarTargetImage').show();

  //update radar button link
  var button = d3.select('#radarButton');
  button.attr("xlink:href", "#"+thing.key);
  button.select("title").html(thing.key);
}

unselect(){
  var button = d3.select('#radarButton')
  button.attr("xlink:href", "#pagecontent")

  $('#radarTargetImage').hide();
  button.select("title").html("Nothing")
}

constructor(div,things)
	{
	  this.foundation=this.createSVGFoundation(div)
	  this.draw()
	  this.populate(things)
	}
}
