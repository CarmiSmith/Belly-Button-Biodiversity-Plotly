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
     
      var filtData = sampleData.samples;
      var sampleDict = filtData.filter(item => item.id == selection)[0];
      var sampleValues = sampleDict.sample_values; 
      var idValues = sampleDict.otu_ids;
      var barLabels = idValues.slice(0, 10).reverse();
      var reformattedLabels = [];
      barLabels.forEach((label) => {
          reformattedLabels.push("OTU " + label);
      });

      var hovertext = sampleDict.otu_labels;
      

      // Create bar chart in correct location

      var barTrace = {
          type: "bar",
          y: reformattedLabels,
          x: sampleValues.slice(0, 10).reverse(),
          text: hovertext.slice(0, 10).reverse(),
          orientation: 'h'
      };

      var barData = [barTrace];

      Plotly.newPlot("bar", barData);

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

      // Build the gauge indicator

      //var guageChart = d3.select("gauge");
      //guageChart.html(" ");

      //var IDs = sampleData.names;
      var wash_freq = data.WFREQ;
      console.log(wash_freq);

      var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: wash_freq,
        title: { text: "<b>Wash Frequency</b><br><i>Scrubs per week</i>"},
        type: "indicator",
        mode: "gauge+number+range",
        gauge: {
          axis: { range: [0, 10] },
          bar: {color: "darkblue"},
          steps: [
            { range: [0, 1], color: "rgb(204,214,204)" },
            { range: [1, 2], color: "rgb(186,206,186)" },
            { range: [2, 3], color: "rgb(168,199,168)" },
            { range: [3, 4], color: "rgb(150,191,150)" },
            { range: [4, 5], color: "rgb(132,184,132)" },
            { range: [5, 6], color: "rgb(114,176,114)" },
            { range: [6, 7], color: "rgb(96,168,96)" },
            { range: [7, 8], color: "rgb(78,161,78)" },
            { range: [8, 9], color: "rgb(60,153,60)" },
            { range: [9, 10], color: "rgb(42,146,42)" }
          ],
          }
      }
      ];
    
    var layout = { width: 400, height: 300, margin: { t: 1, b: 1 } };

    Plotly.newPlot('gauge', data, layout);
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