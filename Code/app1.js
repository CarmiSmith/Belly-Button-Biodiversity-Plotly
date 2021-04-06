
// Define a function that will create metadata for given sample
function buildMetadata(selection) {

    // Read the json data
    d3.json("samples.json").then((sampleData) => {

        // Filter the data to get the sample's metadata
        var filtData = sampleData.metadata;

        var sample = filtData.filter(item => item.id == selection);

        // Specify the location of the metadata and update it
        var metadata = d3.select("#sample-metadata").html("");
        //metadata.html("");

        Object.entries(sample).forEach(([key, value]) => {
            metadata.append("h5").text(`${key}: ${value}`);
        });
    });
}

// Define a function that will create charts for given sample
function buildCharts(selection) {

    // Read the json data
    d3.json("samples.json").then((sampleData) => {

        // Filter the data to get the sample's OTU data

        var filtData = sampleData.samples;
        var sampleDict = filtData.filter(item => item.id == selection);
        var sampleDict = sampleDict[0]; 
        var idValues = sampleDict[0].sample_values;
        var barLabels = sampleDict[0].otu_ids;
        var hoverText = sampleDict[0].otu_labels;
        var y_axis = barLabels.slice(0, 10).map(labels => 'OTU ${labels}').reverse()
        

        // Create bar chart in correct location

        var barTrace = {
            type: "bar",
            y: y_axis,
            x: sampleValues.slice(0, 10).reverse(),
            text: hoverText.slice(0, 10).reverse(),
            orientation: 'h'
        };

        var barData = [barTrace];

        Plotly.newPlot("bar", barData);

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
}

// Define function that will run on page load
function init() {

    // Read json data
    d3.json("samples.json").then((sampleData) => {

        // Filter data to get sample names
        var filtData = sampleData.names;

        // Add dropdown option for each sample
        var dropdownMenu = d3.select("#selDataset");

        filtData.forEach((name) => {
            dropdownMenu.append("option").property("value", name).text(name);
        })

        // Use first sample to build metadata and initial plots
        buildMetadata(filtData[0]);

        buildCharts(filtData[0]);

    });
}

function optionChanged(newSelection) {

    // Update metadata with newly selected sample
    buildMetadata(newSelection); 
    // Update charts with newly selected sample
    buildCharts(newSelection);
}

// Initialize dashboard on page load
init();