// Define a function that will create metadata for given sample
function buildMetadata(selection) {

    // Read the json data
    d3.json("samples.json").then((sampleData) => {

        // Filter the data to get the sample's metadata
        var filtData = sampleData.metadata;

        var sample = filtData.filter(item => item.id == selection);

        // Specify the location of the metadata and update it
        var metadata = d3.select("#sample-metadata");
        metadata.html("");

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
        // Pay attention to what data is required for each chart
        var filtData = sampleData.samples;
        var sampleDict = filtData.filter(item => item.id == selection)[0];
        var sampleValues = sampleDict.sample_values; 
        var barChartValues = sampleValues.slice(0, 10).reverse();
        var idValues = sampleDict.otu_ids;
        var barChartLabels = idValues.slice(0, 10).reverse();
        var reformattedLabels = [];
        barChartLabels.forEach((label) => {
            reformattedLabels.push("OTU " + label);
        });

        var hovertext = sampleDict.otu_labels;
        var barhovertext = hovertext.slice(0, 10).reverse();

        // Create bar chart in correct location

        var barChartTrace = {
            type: "bar",
            y: reformattedLabels,
            x: barChartValues,
            text: barhovertext,
            orientation: 'h'
        };

        var barChartData = [barChartTrace];

        Plotly.newPlot("bar", barChartData);

        // Create bubble chart in correct location

        var bubbleChartTrace = {
            x: idValues,
            y: sampleValues,
            text: hovertext,
            mode: "markers",
            marker: {
                color: idValues,
                size: sampleValues
            }
        };

        var bubbleChartData = [bubbleChartTrace];

        var layout = {
            showlegend: false,
            height: 600,
            width: 1000,
            xaxis: {
                title: "OTU ID"
            }
        };

        Plotly.newPlot("bubble", bubbleChartData, layout);
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