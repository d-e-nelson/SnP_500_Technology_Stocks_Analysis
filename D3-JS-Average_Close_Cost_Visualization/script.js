// For bundlers such as Vite and Webpack omit https://esm.sh/
import { csv, json } from 'https://esm.sh/d3-fetch';
import { select, selectAll } from 'https://esm.sh/d3-selection';

// Gets JSON Data from my Github
const data = await json("https://d-e-nelson.github.io/SnP_500_Technology_Stocks_Analysis/tech_data.json");

/*===========================================================================================================
PART 1: Create Smaller Data Array
=============================================================================================================
*/

/* Convert large JSON (data) into smaller array with 2 values: 
  1. The sub industy's name, 2. Its average closing value.

  This is done by first creating a Map 
      Key = Sub-Industry
      Values = total count of subInt entries, and count, running total of closing prices. 
*/

// Empty Map
const subIndustryMap = {}; // 

// Loop through all data rows to populate the Map.
data.forEach(d => {
  // Pul the subInd name and close value from a row
  const subInd = d["GICS.Sub.Industry"];
  const close = parseFloat(d.close);

  // If either value is missing in a row, skip that row
  if (!subInd || isNaN(close)) return;

  // If the subInd name has not been seen yet, add it as a key in the map and set both values to 0
  if (!subIndustryMap[subInd]) {
    subIndustryMap[subInd] = { total: 0, count: 0 };
  }

  // Increament the total sum of the closing cost for the sudInd
  subIndustryMap[subInd].total += close;
  // Increament the total number of rows for this subInd that have been looked at. 
  subIndustryMap[subInd].count += 1;
});


/* Now that we have a full Map, its time to turn it into a smaller array called miniData
    The values in the array will be objects that have 2 values in them
    1. The name of the sub industry
    2. The average closing price for that sub industry. 
*/
const miniData = Object.entries(subIndustryMap).map(([subInd, stats]) => ({
  subInd,
  avgClose: stats.total / stats.count
}));

// Print to console to verify
// console.log("Mini data summary:", miniData);



/*=================================================================================================
PART 2: Use Smaller Data Array to creat groups for texts and circle
===================================================================================================
*/

// Select the SVG element where the circle and text will go
const chart = select('.chart');

/* GROUPS are used because we do not know how many groups we will need so we can't set them up 
in the HTML and append text, we have to creat them dynmically. 
*/

// Bind data to groups (one per sub-industry)
const groups = chart
  .selectAll('g.item')
  .data(miniData)
  .join('g')
  .attr('class', 'item') //This is saying we will be adding items to the groups, no mention on what in the item yet.
  .attr('transform', (d, i) => `translate(0, ${i * 60 + 40})`); // Put some space between the groups and move the inital group a little down so its not cut off at the top.


/*===========================================================================================
PART 3: Populate the groups
=============================================================================================
*/

/* Note: the order these elements are added to the groups does not dictate the
order they are displayed in each group. Their display order is controlled 
by their X and Y attribustes. 
*/

// Add $##.## cost text to group
groups
  .append('text')
  .text(d => "$" + d.avgClose.toFixed(2)) // Set amount to 2 decimals
  .attr('x', 50)   
  .attr('y', 2);   


// Add one circle per group
groups
  .append('circle')
  .attr('cx', 150)
  .attr('r', d => d.avgClose / 5) //Scale the size of the circles down
  .style('fill', 'lightblue');

// Add text next to each circle
groups
  .append('text')
  .text(d => d.subInd)
  .attr('x', 200)
  .attr('y', 2); 


