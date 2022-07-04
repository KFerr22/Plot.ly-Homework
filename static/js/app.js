// Initial dashboard
function init(){
    var dropdownmenu = d3.select("#selDataset")
    d3.json("samples.json").then(data => {
        var subjectID = data.names;
        subjectID.forEach(name => dropdownmenu.append('option').text(name).property('value', name))    
    PlotCharts(subjectID[0]);
    DemographicPanel(subjectID[0]);
    });
};

// Create function to populate demographic panel
function DemographicPanel(sample){
    var panel = d3.select("#sample-metadata");
    // Clear any existing metadata
    panel.html("");
    d3.json("samples.json").then(data => { 
        var deminfo = data.metadata;
        deminfo = deminfo.filter(subjectinfo => subjectinfo.id == sample)[0];
        Object.entries(deminfo).forEach(([key,value]) => {
            panel.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    })
}

init();

// Create a function to create bar and bubble graph
function PlotCharts(id){
    d3.json("samples.json").then(data => {
        var sample = data.samples;
        var filteredsample = sample.filter(subject => subject.id ==id)[0]
        var x_values = filteredsample.sample_values.slice(0, 10).reverse();
        var y_values = filteredsample.otu_ids.slice(0,10).map(OTUID => 'OTU' + OTUID).reverse();
        var label = filteredsample.otu_labels.slice(0,10).reverse();

        var trace1 = {
            x: x_values,
            y: y_values,
            type: "bar",
            orientation: 'h',
            text: label
        };

        var databar = [trace1];
        var layoutbar = {
            title: "Top 10 Bacteria Cultures in Sample"
        };

        var trace2 = {
            x: filteredsample.otu_ids,
            y: filteredsample.sample_values,
            mode: 'markers',
            marker: {
                size: filteredsample.sample_values,
                color: filteredsample.otu_ids,
                colorscale: "Portland"
            },
            text: label
        };

        var databubble = [trace2];

        var layoutbubble = {
            title: "Bacteria Cultures Per Sample",
            xaxis: {title: 'OTU ID'},
        };

        Plotly.newPlot("bar", databar, layoutbar);
        Plotly.newPlot("bubble", databubble, layoutbubble);
    })
}

function optionChanged(id){
    PlotCharts(id);
    DemographicPanel(id);
};