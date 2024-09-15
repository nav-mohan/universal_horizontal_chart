// Set the dimensions and margins of the chart
const margin = { top: 20, right: 80, bottom: 20, left: 150};

const chartHeightForRecords = function(nRecords){
    // do a linear-interpolation to estimate a "good" required chart-height for a given number of records
    // 0 records    --> window.innerHeight/4
    // 75 records   --> window.innerHeight
    return (nRecords * (window.innerHeight)/(75) + window.innerHeight/4);
}

const td_svg = d3.select("#tr-chart")
    .append("svg")
    .attr("class","chart-svg")
    .attr("id","tr-chart-svg")
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);



const rd_svg = d3.select("#rd-chart")
    .append("svg")
    .attr("class","chart-svg")
    .attr("id","rd-chart-svg")
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
function UpdateBarPlotTD()
{
    const plotData = __g_plotData["tr_data"];
    const chartHeight = chartHeightForRecords(plotData.length);
    const chartWidth = window.innerWidth - margin.left - margin.right;
    d3.select("#tr-chart-svg").attr("height",chartHeight + margin.top + margin.bottom).attr("width", chartWidth + margin.left + margin.right);
    td_svg.selectAll("*").remove(); // remove the graph

    const minValRD = Math.min(0,d3.min(__g_plotData["rd_data"], d => d.source_value));
    const minValTR = Math.min(0,d3.min(__g_plotData["tr_data"], d => d.source_value));
    const maxValRD = Math.max(0,d3.max(__g_plotData["rd_data"], d => d.source_value));
    const maxValTR = Math.max(0,d3.max(__g_plotData["tr_data"], d => d.source_value));
    const minVal = Math.min(minValRD,minValTR);
    const maxVal = Math.max(maxValRD,maxValTR);
    const padding = 0.1*(maxVal-minVal); // so that the smallest bar is not "hugging" the axis

    // Create a scale for the X axis
    const xscale = d3.scaleLinear()
        .domain([minVal-padding, maxVal+padding])
        .range([0, chartWidth]);

    // Create a scale for the Y axis
    const yscale = d3.scaleBand()
        .domain(plotData.map(d => d.subject_shortcode))
        .range([0, chartHeight])
        .padding(0.1);

    // Add the X axis to the td_svg
    td_svg.append("g")
        .attr('class','horizontal-axis')
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xscale));

    // Add the Y axis to the td_svg
    td_svg.append("g")
        .attr('class','vertical-axis')
        .call(d3.axisLeft(yscale));

    // Create the bars
    td_svg.selectAll(".bar")
        .data(plotData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => d.source_value < 0 ? xscale(d.source_value) : xscale(0))
        .attr("y", d => yscale(d.subject_shortcode))
        .attr("width", d => Math.abs(xscale(d.source_value) - xscale(0)))
        .attr("height", yscale.bandwidth());

    // line-plots for mean and standard-deviation of TR and RD
    const tr_mean = d3.mean(__g_plotData["tr_data"], d => d.source_value);
    const tr_std = d3.deviation(__g_plotData["tr_data"], d => d.source_value);
    const rd_mean = d3.mean(__g_plotData["rd_data"], d => d.source_value);
    const rd_std = d3.deviation(__g_plotData["rd_data"], d => d.source_value);
    const yscaleMeanTR = d3.scalePoint().domain(__g_plotData["tr_data"].map(d => d.subject_shortcode)).range([0,chartHeight]).padding(0.1);
    const yscaleMeanRD = d3.scalePoint().domain(__g_plotData["rd_data"].map(d => d.short_id)).range([0,chartHeight]).padding(0.1);
    const lineMeanTR = d3.line().y(d => yscaleMeanTR(d.subject_shortcode)).x(d => xscale(tr_mean));
    const lineMeanPlusStdTR = d3.line().y(d => yscaleMeanTR(d.subject_shortcode)).x(d => xscale(tr_mean + tr_std));
    const lineMeanMinusStdTR = d3.line().y(d => yscaleMeanTR(d.subject_shortcode)).x(d => xscale(tr_mean - tr_std));
    const lineMeanRD = d3.line().y(d => yscaleMeanRD(d.short_id)).x(d => xscale(rd_mean));
    const lineMeanPlusStdRD = d3.line().y(d => yscaleMeanRD(d.short_id)).x(d => xscale(rd_mean + rd_std));
    const lineMeanMinusStdRD = d3.line().y(d => yscaleMeanRD(d.short_id)).x(d => xscale(rd_mean - rd_std));

    // Create the line-plots of mean, mean ± std
    td_svg.append("path").datum(__g_plotData["tr_data"]).attr("class", "line tr").attr("d", lineMeanTR);
    td_svg.append("path").datum(__g_plotData["tr_data"]).attr("class", "line tr").attr("d", lineMeanPlusStdTR);
    td_svg.append("path").datum(__g_plotData["tr_data"]).attr("class", "line tr").attr("d", lineMeanMinusStdTR);
    td_svg.append("path").datum(__g_plotData["rd_data"]).attr("class", "line rd").attr("d", lineMeanRD);
    td_svg.append("path").datum(__g_plotData["rd_data"]).attr("class", "line rd").attr("d", lineMeanMinusStdRD);
    td_svg.append("path").datum(__g_plotData["rd_data"]).attr("class", "line rd").attr("d", lineMeanPlusStdRD);

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
function UpdateBarPlotRD()
{
    const plotData = __g_plotData["rd_data"];
    const chartHeight = chartHeightForRecords(plotData.length);
    const chartWidth = window.innerWidth - margin.left - margin.right;
    d3.select("#rd-chart-svg").attr("height",chartHeight + margin.top + margin.bottom).attr("width", chartWidth + margin.left + margin.right);
    rd_svg.selectAll("*").remove(); // remove the graph

    const minValRD = Math.min(0,d3.min(__g_plotData["rd_data"], d => d.source_value));
    const minValTR = Math.min(0,d3.min(__g_plotData["tr_data"], d => d.source_value));
    const maxValRD = Math.max(0,d3.max(__g_plotData["rd_data"], d => d.source_value));
    const maxValTR = Math.max(0,d3.max(__g_plotData["tr_data"], d => d.source_value));
    const minVal = Math.min(minValRD,minValTR);
    const maxVal = Math.max(maxValRD,maxValTR);
    const padding = 0.1*(maxVal-minVal); // so that the smallest bar is not "hugging" the axis

    // Create a scale for the X axis
    const xscale = d3.scaleLinear()
        .domain([minVal-padding, maxVal+padding])
        .range([0, chartWidth]);
    
    // Create a scale for the Y axis
    const yscale = d3.scaleBand()
        .domain(plotData.map(d => d.short_id))
        .range([0, chartHeight])
        .padding(0.1);

    // Add the X axis to the rd_svg
    rd_svg.append("g")
        .attr('class','horizontal-axis')
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(d3.axisBottom(xscale));

    // Add the Y axis to the rd_svg
    rd_svg.append("g")
        .attr('class','vertical-axis')
        .call(d3.axisLeft(yscale));

    // Create the bars
    rd_svg.selectAll(".bar")
        .data(plotData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => d.source_value < 0 ? xscale(d.source_value) : xscale(0))
        .attr("y", d => yscale(d.short_id))
        .attr("width", d => Math.abs(xscale(d.source_value) - xscale(0)))
        .attr("height", yscale.bandwidth());

        // line-plots for mean and standard-deviation of TR and RD
        const tr_mean = d3.mean(__g_plotData["tr_data"], d => d.source_value);
        const tr_std = d3.deviation(__g_plotData["tr_data"], d => d.source_value);
        const rd_mean = d3.mean(__g_plotData["rd_data"], d => d.source_value);
        const rd_std = d3.deviation(__g_plotData["rd_data"], d => d.source_value);
        const yscaleMeanTR = d3.scalePoint().domain(__g_plotData["tr_data"].map(d => d.subject_shortcode)).range([0,chartHeight]).padding(0.1);
        const yscaleMeanRD = d3.scalePoint().domain(__g_plotData["rd_data"].map(d => d.short_id)).range([0,chartHeight]).padding(0.1);
        const lineMeanTR = d3.line().y(d => yscaleMeanTR(d.subject_shortcode)).x(d => xscale(tr_mean));
        const lineMeanPlusStdTR = d3.line().y(d => yscaleMeanTR(d.subject_shortcode)).x(d => xscale(tr_mean + tr_std));
        const lineMeanMinusStdTR = d3.line().y(d => yscaleMeanTR(d.subject_shortcode)).x(d => xscale(tr_mean - tr_std));
        const lineMeanRD = d3.line().y(d => yscaleMeanRD(d.short_id)).x(d => xscale(rd_mean));
        const lineMeanPlusStdRD = d3.line().y(d => yscaleMeanRD(d.short_id)).x(d => xscale(rd_mean + rd_std));
        const lineMeanMinusStdRD = d3.line().y(d => yscaleMeanRD(d.short_id)).x(d => xscale(rd_mean - rd_std));
    
    // Create the line-plots of mean, mean ± std

    rd_svg.append("path").datum(__g_plotData["tr_data"]).attr("class", "line tr").attr("d", lineMeanTR);
    rd_svg.append("path").datum(__g_plotData["tr_data"]).attr("class", "line tr").attr("d", lineMeanPlusStdTR);
    rd_svg.append("path").datum(__g_plotData["tr_data"]).attr("class", "line tr").attr("d", lineMeanMinusStdTR);
    rd_svg.append("path").datum(__g_plotData["rd_data"]).attr("class", "line rd").attr("d", lineMeanRD);
    rd_svg.append("path").datum(__g_plotData["rd_data"]).attr("class", "line rd").attr("d", lineMeanMinusStdRD);
    rd_svg.append("path").datum(__g_plotData["rd_data"]).attr("class", "line rd").attr("d", lineMeanPlusStdRD);
}