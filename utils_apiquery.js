/************************************************************************************ */
/** FUNCTION FOR GETTING/SETTING THE URL QUERY-PARAMETERS AND QUERYING THE API */
/************************************************************************************ */

/**
 * Retrieve all the key-value pairs of parameters from the URL
 * For example, from the given URL
 * http://localhost:8000/?query={"prototype-label.source-value":"A3B2_hP5_164_ad_d","stoichiometric-species.source-value":["Al","Ni"],"property-id":"tag:staff@noreply.openkim.org,2023-02-21:property/binding-energy-crystal"}&fields={"binding-potential-energy-per-atom.source-value":1,"parameter-names.source-value":1,"parameter-values.source-value":1}&tr_value_keystring="parameter-values.source-value"&rd_value_keystring="parameter-values.source-value"&dropdown_keystring="parameter-names.source-value"&database="data"&limit="0"
 * GetallUrlParams() returns 
 * {
 *      "query":{
	        "prototype-label.source-value": "A3B2_hP5_164_ad_d",
	        "stoichiometric-species.source-value": ["Al","Ni"],
	        "property-id": "tag:staff@noreply.openkim.org,2023-02-21:property/binding-energy-crystal"
        },
 *      "fields":{
            "binding-potential-energy-per-atom.source-value": 1,
            "parameter-names.source-value": 1,
            "parameter-values.source-value": 1
        },
 *      "tr_value_keystring": ""parameter-values.source-value""
 *      "rd_value_keystring": ""parameter-values.source-value"",
 *      "dropdown_keystring": "parameter-names.source-value",
 *      "database":"data",
 *      "limit":0,
 * } 
 * @returns {null} It populates the key-value of the global variable __g_apiRequestParameters
 */
function GetAllUrlParams() 
{
    // FIRST, RESET ALL THE MEMBERS OF _g_apiRequestParameters;
    __g_apiRequestParameters["query"]                       = {};
    __g_apiRequestParameters["fields"]                      = {};
    __g_apiRequestParameters["tr_value_keystring"]          = "";
    __g_apiRequestParameters["rd_value_keystring"]          = "";
    __g_apiRequestParameters["dropdown_keystring"]          = "";
    __g_apiRequestParameters["database"]                    = "data";
    __g_apiRequestParameters["limit"]                       = "0";

    // NEXT, BEGIN PARSING THROUGH THE URL AND COLLECT THE QUERY-PARAMETERS
    const urlObj = new URL(window.location);
    let result = {};
    urlObj.searchParams.forEach((value, key) => 
    {
        const decodedValue = decodeURIComponent(value);
        try 
        {
            result[key] = JSON.parse(decodedValue);
        } 
        catch (e) 
        {
            result[key] = decodedValue;
        }
    });
    
    // WE'VE FINISHED PARSING THROUGH THE URL 
    // FINALLY, SET THE VALUES FOR THE GLOBAL VARIABLE __g_apiRequestParameters
    __g_apiRequestParameters["query"]                       = result["query"]                       || {};
    __g_apiRequestParameters["fields"]                      = result["fields"]                      || {};
    __g_apiRequestParameters["tr_value_keystring"]          = result["tr_value_keystring"]          || "";
    __g_apiRequestParameters["rd_value_keystring"]          = result["rd_value_keystring"]          || "";
    __g_apiRequestParameters["dropdown_keystring"]          = result["dropdown_keystring"]       || "";
    __g_apiRequestParameters["database"]                    = result["database"]                    || "data";
    __g_apiRequestParameters["limit"]                       = result["limit"]                       || "0";

}

function SetUrlParams()
{
    __g_apiRequestParameters["query"]                       = JSON5.parse(__g_HtmlElements["query_input"].value || '""');
    __g_apiRequestParameters["fields"]                      = JSON5.parse(__g_HtmlElements["fields_input"].value || '""');

    __g_apiRequestParameters["tr_value_keystring"]          = JSON5.parse(__g_HtmlElements["tr_value_keystring_input"].value || '""');
    __g_apiRequestParameters["dropdown_keystring"]          = JSON5.parse(__g_HtmlElements["dropdown_keystring_input"].value || '""');
    __g_apiRequestParameters["rd_value_keystring"]          = JSON5.parse(__g_HtmlElements["rd_value_keystring_input"].value || '""');
}



/**
 * Performs a request to the Query site for Test-Data and Reference-Data
 * @param {Object} query the query submitted
 * @param {Object} fields the fields we expect 
 * @returns {Promise} a Promise is a Javascript thing that behaves asynchronously i.e it "promises" to return a value sometime in the future. 
 * This function promises to return an Array of JSON objects retrieved from the Query site.
 * In the case that query/fields are empty, we will return an empty Array but, that empty Array 
 * is wrapped within a Promise to maintain consistency with the type of the function's return value
 */
function DoApiQuery(query,fields)
{
    if(Object.keys(query).length == 0 || Object.keys(fields).length == 0) 
    {
        // this returns an empty Array but, it's wrapped within a "Promise" to maintain consistency with the type of return value of the function
        return new Promise((resolve, reject) => {
            resolve([]);
        }); 
    }

    var url  = __g_apiBaseURL;
    url      += '?query='    +   JSON.stringify(query);
    url      += '&fields='   +   JSON.stringify(fields);
    url      += '&database=' +   __g_apiRequestParameters["database"];
    url      += '&limit='    +   __g_apiRequestParameters["limit"];
    return fetch(url)
        .then((res) => {
            return res.json()
        })
}

function VerifyDataRD()
{
    const rd_value_keystring        = __g_apiRequestParameters["rd_value_keystring"];
    const dropdown_keystring        = __g_apiRequestParameters["dropdown_keystring"];
    
    if(rd_value_keystring == "" || rd_value_keystring == null || rd_value_keystring == undefined) return;

    if(dropdown_keystring != "" && dropdown_keystring != null && dropdown_keystring != undefined)
    {
        const dropdownOptions = GetUnique(__g_apiData["rd_data"],dropdown_keystring);
        PopulateDropdownOptions(dropdownOptions, __g_HtmlElements["dropdown"]);
        __g_HtmlElements["dropdown"].addEventListener("change",(e) => {
            const barplotdata = FilterAndParseDataRD(__g_apiData["rd_data"], e.target.value, dropdown_keystring,rd_value_keystring);
            UpdateBarPlotRD(barplotdata);
        })
        __g_HtmlElements["dropdown"].value = dropdownOptions[0];
        var event = new Event('change');
        __g_HtmlElements["dropdown"].dispatchEvent(event);
    }
    else
    {
        const barplotdata = ParseDataRD(__g_apiData["rd_data"],rd_value_keystring);
        UpdateBarPlotRD(barplotdata);
    }
}


function VerifyDataTR()
{
    const tr_value_keystring        = __g_apiRequestParameters["tr_value_keystring"];
    const dropdown_keystring        = __g_apiRequestParameters["dropdown_keystring"];
    
    if(tr_value_keystring == "" || tr_value_keystring == null || tr_value_keystring == undefined) return;

    if(dropdown_keystring != "" && dropdown_keystring != null && dropdown_keystring != undefined)
    {
        const dropdownOptions = GetUnique(__g_apiData["tr_data"],dropdown_keystring);
        PopulateDropdownOptions(dropdownOptions, __g_HtmlElements["dropdown"]);
        __g_HtmlElements["dropdown"].addEventListener("change",(e) => {
            const barplotdata = FilterAndParseDataTD(__g_apiData["tr_data"], e.target.value, dropdown_keystring,tr_value_keystring);
            UpdateBarPlotTD(barplotdata);
        })
        __g_HtmlElements["dropdown"].value = dropdownOptions[0];
        var event = new Event('change');
        __g_HtmlElements["dropdown"].dispatchEvent(event);
    }
    else
    {
        const barplotdata = ParseDataTD(__g_apiData["tr_data"],tr_value_keystring);
        UpdateBarPlotTD(barplotdata);
    }
}

function DoApiQueryAndUpdatePlots()
{
    const query     = {...__g_apiRequestParameters["query"], ...__g_defaultQuery};
    const fields    = {...__g_apiRequestParameters["fields"], ...__g_defaultFields};
    DoApiQuery(query,fields)
    .then(data=>{
        __g_apiData["tr_data"] = data.filter((d)=>d["meta"]["type"]=="tr");
        __g_apiData["rd_data"] = data.filter((d)=>d["meta"]["type"]=="rd");
    })
    .then(()=>{
        console.log(__g_apiData);
        VerifyDataTR();
    })
    .then(()=>{
        VerifyDataRD();
    })
}
