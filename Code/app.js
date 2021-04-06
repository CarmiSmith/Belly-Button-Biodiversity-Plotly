var dropdownMenu = d3.select('#selDataset');

d3.json("data/samples.json").then((sampleData) => {
    var filtData = sampleData.names;

    filtData.forEach((id) => {
        dropdownMenu.append('option')
        .property('value', id)
        .text(id);
    });

    // Use first sample to build metadata and initial plots
    builddData(filtData[0]);

    buildCharts(filtData[0]);
    
});

// Define a function that will create metadata for given sample
function buildData(selection) {

    // Read the json data
    d3.json("samples.json").then((sampleData) => {

        // Filter the data to get the sample
        var samples = sampleData.samples;
        var answer = samples.filter(people => people.id == selection);
        var answer = answer[0];
        var idValues = sampleDict[0].sample_values;
        var barLabels = sampleDict[0].otu_ids;
        var hoverText = sampleDict[0].otu_labels;
        var y_axis = barLabels.slice(0, 10).map(labels => 'OTU ${labels}').reverse();

    // Create bar chart in correct location
    var barTrace = {
        type: "bar",
        y: y_axis,
        x: sampleValues.slice(0, 10).reverse(),
        text: hoverText.slice(0, 10).reverse(),
        orientation: 'h'
    };

    var barData = [barTrace];
    var bar_layout = {
        title: "Top 10 OTUs",
        yaxis: {
          tickmode: "linear"
        },
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 30
        }
      };

    Plotly.newPlot("bar",barData, bar_layout);


       

// create individual's demographic information per ID

var demographics = sampleData.metadata;

var demoData = d3.select('#sample-metadata');

var detailsID = demographics.filter(person => person.id == selection);

// individual's demographics
var result = detailsID[0];
demoData.html('');
Object.entries(result).forEach(([key,value]) => {
  demoData.append('h5').text(`${key}: ${value}`);

})
// Create bubble chart in correct location

var bubbleTrace = {
    x: barLabels,
    y: idValues,
    text: hoverText,
    mode: "markers",
    marker: {
        color: barLabels,
        size: idValues,
        colorscale: "Earth"
    }
};

var bubbleData = [bubbleTrace];

var layout = {
    showlegend: false,
    height: 600,
    width: 1000,
    xaxis: {
        title: "OTU ID"
    }
};

Plotly.newPlot("bubble", bubbleData, layout);
});        
        
    
};
