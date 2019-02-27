# Icon Water Dashboard
Dashboard creation using D3.JS, JavaScript and TypeScript

Dashboard will have details corresponding to Water usage and Total cost involved in using the service since 2015.

The data is ploted for five years since 2015. More data can be added by modifying the data.json input file.

Kindly refer the image for a dashboard view - dashboard.png

## Description
The Dashboard contains a PieChart, LineChart and BarChart.

PieChart indicates cities water usage since 2015. It is dynamic, animated and when cursor is moved along, it shows a text indicating the value. 

On clicking the arcs of PieChart corresponding to a city, BarChart and LineChart dynamically shows the water usage and total cost involved of the selected city since 2015. 

LineChart shows the minimum and the maximum cost with red and green dots respectively. Also moving along the LineChart pops the details as text.

## Implementation 1
First implementation is completed using D3.JS and JavaScript.

It can be found in the javaScript_d3 folder.

## Implementation 2
Second implementation is completed using D3.JS and TypeScript.

It can be found in the typeScript_d3 folder. 

## Steps to execute
1. Start a server pointing to the folder. I used python's http server to test the code

	cmd: "python -m http.server 8080"

2. Step 1 has to be followed, else there will be an error thrown while reading JSON data
