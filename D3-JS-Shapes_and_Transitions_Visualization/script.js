import { csv, json } from 'https://esm.sh/d3-fetch';
import { select, selectAll } from 'https://esm.sh/d3-selection';
import 'https://esm.sh/d3-transition';

/*=======================================================================================
PART 1: Clickable Color Changing Circles
=========================================================================================
*/

// Create some data to use for circle radiues
let circleData = [35, 70, 65, 60, 30, 110, 90, 85]


select('.circle-group')
  .selectAll('circle')
  .data(circleData)
  .join('circle')
  .attr('cx', function(d, i) { // Space the circles out on the X-axis
    return i * 140;
  })
  .attr('cy', 70) // Move row of circles down a bit from section text
  .attr('r', function(d) { // Scale the circles down by their radius
    return 0.6 * d;
  })
  // Eventhandler for toggling the color of a circle when its clicked
  .on('click', function(e, d) {
    const circle = select(this); // Selects a circle when its clicked
  
    //Get the current state property of the circle: This is a falsy or truthy result 
    const isActive = circle.property('active');
    
    // Swap the state property of the circle
    circle.property('active', !isActive); 

    // set fill based on state property
    circle.style('fill', !isActive ? 'lightblue' : '#ddd');
  });



/*=======================================================================================
PART 2: Creating the Rectangles that will move
=========================================================================================
*/

// Initial rectangles
const numRects = 5;    // Designating number of rect rather than size so they are all the same size
const spacing = 60;    // Setting rect spacing on x-axis
const rectWidth = 40;

select('.rect-group')
  .selectAll('rect')
  .data(Array.from({ length: numRects })) // Turn numRects into an arrat with that number of elements
  .join('rect')
  .attr('x', (d, i) => i * spacing)  // initial evenly spaced x
  .attr('y', 200)
  .attr('width', rectWidth)
  .attr('height', 100)
  .attr('fill', 'lightgreen')
  .each(function(d, i) {
    // store the initial x position for when the rect move back to their original position
    select(this).property('origX', i * spacing);
  });


/*=======================================================================================
PART 3: Creating the Eventhandler that moves the Rectangles and changes the text
=========================================================================================
*/

// Get the text element that will be changed. This is not the text, just the element.
const rectText = select('#rect-text');

select('#move-btn').on('click', function() {
  /*=======================
  MOVE RECTANGLES
  =========================
  */
  selectAll('.rect-group rect')
    .each(function() {
      const rect = select(this);
      // Retrieve the 'moved' property from the rect. If it does not have the property return false.
      const moved = rect.property('moved') || false;
      // Flip the state of the moved property: So truthy -> falsy and vis versa 
      rect.property('moved', !moved);
      // Grabs the rect's original X position which was stored when the rects were created: See PART 2 above
      const origX = rect.property('origX');
      
      // Handles the transition animation
      rect.transition()     // Starts animation
          .duration(1000)   // Animation will last 1 second
          // Uses moved to set the new 'x' axis value for the rect: Either their orginal value or 100 to the right.
          .attr('x', !moved ? origX + 100 : origX); 
    });

  
  /*=======================
  TEXT TOGGLE
  =========================
  */
  const currentText = rectText.text(); // Get the current text value being held
  
  // Change the text based on the current text
  if (currentText === 'Button Will Move Rectangles to the Right') {
    rectText.text('Button Will Move Rectangles to the Left');
  } else {
    rectText.text('Button Will Move Rectangles to the Right');
  }
});

