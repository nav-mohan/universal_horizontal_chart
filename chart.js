// Set the dimensions and margins of the chart
const margin = { top: 20, right: 20, bottom: 20, left: 120};

const width = window.innerWidth - margin.left - margin.right;
const height = 800- margin.top - margin.bottom;



const td_svg = d3.select("#tr-chart")
    .append("svg")
    .attr("class","chart-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);



const rd_svg = d3.select("#rd-chart")
    .append("svg")
    .attr("class","chart-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);



/**
 * UpdateBarPlotTD - a function for updating the Test-Results Chart
    * @param {Array} plotData an Array of Objects
    each record of the plotData might look like this 
    {
        subject_shortcode   :   "MO_109933561507",
        source_value        :   -4.1886, 
        
        subject_version     :   5,
        subject_extended_id :   "EAM_Dynamo_MishinMehlPapaconstantopoulos_2002_NiAl__MO_109933561507_005",
        subject_kimcode     :   "EAM_Dynamo_MishinMehlPapaconstantopoulos_2002_NiAl__MO_109933561507_005",
        subject_description :   "EAM potential developed by Mishin, Mehl and Papaconstantopoulos (2002) to accurately reproduce properties of the B2-NiAl phase of the Ni-Al system.",
        subject_title       :   "EAM potential (LAMMPS cubic hermite tabulation) for the B2-NiAl compound developed by Mishin, Mehl, and Papaconstantopoulos (2002) v005",

        runner_version      :   2,
        runner_shortcode    :   "TE_316749760271",
        runner_kimcode      :   "EquilibriumCrystalStructure_A3B2_hP5_164_ad_d_AlNi__TE_316749760271_002",

    }
*/
function UpdateBarPlotTD(plotData)
{
    console.log("LOADING BARPLOT TD",plotData)
    td_svg.selectAll("*").remove(); // remove the graph

    const minVal = d3.min(plotData, d => d.source_value);
    const maxVal = d3.max(plotData, d => d.source_value);
    const padding = 0.1*(maxVal-minVal); // so that the smallest bar is not "hugging" the axis

    // Create a scale for the X axis
    const xscale = d3.scaleLinear()
        .domain([minVal-padding, maxVal+padding])
        .range([0, width]);

    // Create a scale for the Y axis
    const yscale = d3.scaleBand()
        .domain(plotData.map(d => d.subject_shortcode))
        .range([0, height])
        .padding(0.1);

    // Add the X axis to the td_svg
    td_svg.append("g")
        .attr('class','horizontal-axis')
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xscale));

    // Add the Y axis to the td_svg
    td_svg.append("g")
        .attr('class','vertical-axis')
        // .attr("transform", `translate(${width+ xscale(maxVal)},0)`)
        .call(d3.axisLeft(yscale));

    // Create the bars
    td_svg.selectAll(".bar")
        .data(plotData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => yscale(d.subject_shortcode))
        .attr("width", d => xscale(d.source_value))
        .attr("height", yscale.bandwidth());
}

/**
 * UpdateBarPlotRD - a function for updating the Reference-Data Chart
    * @param {Array} plotData an Array of Objects
    each record of the plotdata looks like this 
    {
        short_id        :   "RD_007001823795_000",
        source_value    :   1.2120616,
        description     :   "AlNi in AFLOW crystal prototype A3B2_hP5_164_ad_d (Al3Ni2). Result of a density functional theory relaxation from the aflow.org repository. This is a nominally zero-stress calculation under the AFLOW standard, meaning that the maximum absolute stress component < 10 kbar. Full details of the original computation can be found in the aflow.org repository by referencing the Aflowlib Unique IDentifier (auid) listed in the content-origin field. Selected computational parameters (as defined on aflow.org/documentation) follow. {'dft_type': ['PAW_PBE'], 'ldau_type': 2}",
    }
*/
function UpdateBarPlotRD(plotData)
{
    console.log("LOADING BARPLOT RD",plotData)
    rd_svg.selectAll("*").remove(); // remove the graph

    const minVal = d3.min(plotData, d => d.source_value);
    const maxVal = d3.max(plotData, d => d.source_value);
    const padding = 0.1*(maxVal-minVal); // so that the smallest bar is not "hugging" the axis

    // Create a scale for the X axis
    const xscale = d3.scaleLinear()
        .domain([minVal-padding, maxVal+padding])
        .range([0, width]);

    // Create a scale for the Y axis
    const yscale = d3.scaleBand()
        .domain(plotData.map(d => d.short_id))
        .range([0, height])
        .padding(0.1);

    // Add the X axis to the rd_svg
    rd_svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xscale));

    // Add the Y axis to the rd_svg
    rd_svg.append("g")
        .attr("transform", `translate(${width+ xscale(maxVal)},0)`)
        .call(d3.axisLeft(yscale));

    // Create the bars
    rd_svg.selectAll(".bar")
        .data(plotData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", d => yscale(d.short_id))
        .attr("width", d => xscale(d.source_value))
        .attr("height", yscale.bandwidth());
}