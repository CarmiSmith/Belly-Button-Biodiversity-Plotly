var dropdownMenu = d3.select('#selDataset');

d3.json("data/samples.json").then((sampleData) => {
    var filtData = sampleData.names;

    filtData.forEach((id) => {
        dropdownMenu.append('option')
        .property('value', id)
        .text(id);
    });

    // Use first sample to build metadata and initial plots
    buildMetadata(filtData[0]);

    buildCharts(filtData[0]);
    
});