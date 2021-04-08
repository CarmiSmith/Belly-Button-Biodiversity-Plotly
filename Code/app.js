// Define a function that will create metadata for given sample
function buildMetadata(selection) {

    // Read the json data
    d3.json("samples.json").then((sampleData) => {
  
        // Filter the data to get the sample's metadata
        var filtData = sampleData.metadata;
        
        var sample = filtData.filter(item => item.id.toString() == selection)[0];
  
        // Specify the location of the metadata and update it
        var metadata = d3.select('#sample-metadata');
        metadata.html('');
        
        // Add to html
        Object.entries(sample).forEach((key) => {
            metadata.append('h5').text(key[0].toUpperCase() + ": " +key[1]+ "\n");
        });
    });
}
  
  // Define a function that will create charts for given sample
  function buildCharts(selection) {
  
    // Read the json data
    d3.json("samples.json").then((sampleData) => {
  
        // Filter the data to get the sample's OTU data
        var filtData = sampleData.samples;
        var sampleDict = filtData.filter(item => item.id == selection)[0];
        var sampleValues = sampleDict.sample_values; 
        var idValues = sampleDict.otu_ids;
        var barLabels = idValues.slice(0, 10).reverse();
        var newLabels = [];
        barLabels.forEach((label) => {
            newLabels.push("OTU " + label);
        });
        var hovertext = sampleDict.otu_labels;
        
        // Create bar chart in correct location
        var barTrace = {
            type: "bar",
            y: newLabels,
            x: sampleValues.slice(0, 10).reverse(),
            text: hovertext.slice(0, 10).reverse(),
            orientation: 'h'
        };
  
        var barData = [barTrace];
  
    // create the layout variable
    var barLayout = {
      title: "Top 10 OTUs",
      yaxis: {
        tickmode: "linear"
      }
    };
  
        Plotly.newPlot("bar", barData, barLayout);
  
        // Create bubble chart in correct location
  
        var bubbleTrace = {
            x: idValues,
            y: sampleValues,
            text: hovertext,
            mode: "markers",
            marker: {
                color: idValues,
                size: sampleValues
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
  
        filtData.forEach((id) => {
            dropdownMenu.append("option").property("value", id).text(id);
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
