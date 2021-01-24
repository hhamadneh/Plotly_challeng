d3.json("samples.json").then( data => {
    // Set datasets
    var data_names = data.names;
    //console.log (data_names)
    var SelectMenu = d3.select("#selDataset");
    SelectMenu.html("");
    data_names.map(id => SelectMenu.append("option").attr("value",id).html(id));
    // Initalize graphs on homepage
    DrawGraph(data, data.names[0]);
});

var mainForm = d3.select("#selDataset");
mainForm.on("change", formChange)

function formChange () {
  d3.event.preventDefault ();
  var SelectMenu = d3.select(".svg-container");
  SelectMenu.html("");

  enter_otu_id = d3.select("#selDataset")
  filter_date_value = enter_otu_id.property("value");
  console.log(filter_date_value)

  d3.json("samples.json").then( data => {DrawGraph(data, filter_date_value);})
}

function DrawGraph(data,otu_id)
{
  var Data_Sample = data.samples ;
  var Data_metadata = data.metadata.filter (sample => sample.id == otu_id) ;
  var init_sample = Data_Sample.filter(sample => sample.id == otu_id);

  // Set values for graphs
  var samplevalue = init_sample[0].sample_values
  firstSampleSliced = samplevalue.slice(0,10)
  
  //console.log (firstSampleSliced)
  var otuids = init_sample[0].otu_ids
  //console.log (otuids.slice(0,10))

  var Grpah_y = otuids.map(sample => `OTU ${sample}`);
  var labels = Data_Sample.otu_labels;

  var graphDataBar = [{
    type: "bar",
    // Take top 10 OTU for the menu selection
    x: firstSampleSliced.reverse(),
    y: Grpah_y.slice(0,10).reverse(),
    text: otuids.slice(0,10),
    orientation: "h"
  }];

  var graphDataBubble = [{
    x: otuids,
    y: samplevalue,
    text:labels,
    mode: "markers",
    marker: {
      size: samplevalue,
      color: otuids,
      colorscale: "Earth"
    },
  }]

  var layoutBubble = {
    title: "OTU ID",
    showlegend: true,
    height: 600,
    width: 1000
  };

  graphDataGuage = [{
    domain: { x: [0, 1], y: [0, 1] },
    value: parseFloat(Data_metadata[0].wfreq),
    title: { text: "Belly Button Washing Frequency<br>Scrubs per Week" },
    type: "indicator",
    mode: "gauge+number",
    delta: { reference: 3 },
    gauge: {
      axis: { range: [null, 9] },
      steps: [
        { range: [0, 1], color: "rgb(247, 242, 235)" },
        { range: [1, 2], color: "rgb(243, 240, 228)" },
        { range: [2, 3], color: "rgb(232, 230, 200)" },
        { range: [3, 4], color: "rgb(228, 232, 175)" },
        { range: [4, 5], color: "rgb(212, 228, 148)" },
        { range: [5, 6], color: "rgb(182, 204, 138)" },
        { range: [6, 7], color: "rgb(134, 191, 127)" },
        { range: [7, 8], color: "rgb(132, 187, 138)" },
        { range: [8, 9], color: "rgb(127, 180, 133)" }
      ],
      labels: ["0-1", "1-2", "2-3", "3-4", "4-5", "5-6", "6-7","7-8","8-9"],
      threshold: {
        line: { color: "red", width: 4 },
        thickness: 0.75,
        value: 490
      }
    }
  }]

  layoutGuage = {
    width: 600, height: 450, margin: { t: 0, b: 0 }
  }

  Plotly.newPlot("bar",graphDataBar);
  Plotly.newPlot("bubble",graphDataBubble, layoutBubble);
  Plotly.newPlot("gauge", graphDataGuage, layoutGuage);

  var SelectDemographic = d3.select("#sample-metadata");
  SelectDemographic.html("")
  SelectDemographic.append("p").text("id: " + Data_metadata[0].id)
  SelectDemographic.append("p").text("ethnicity: " + Data_metadata[0].ethnicity) 
  SelectDemographic.append("p").text("gender: " + Data_metadata[0].gender)
  SelectDemographic.append("p").text("location: " + Data_metadata[0].location)
  SelectDemographic.append("p").text("bbtype: " + Data_metadata[0].bbtype)
  SelectDemographic.append("p").text("wfreq: " + Data_metadata[0].wfreq)

}
