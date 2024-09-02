/************************************************************************************ */
/** FUNCTION FOR GETTING/SETTING THE URL QUERY-PARAMETERS AND QUERYING THE API */
/************************************************************************************ */

/**
 * Retrieve all the key-value pairs of parameters from the URL
 * For example, from the given URL
 * http://localhost:8000/?rd_query={%22meta.type%22%3A%22rd%22%2C%22prototype-label.source-value%22%3A%22A3B2_hP5_164_ad_d%22%2C%22stoichiometric-species.source-value%22%3A[%22Al%22%2C%22Ni%22]%2C%22property-id%22%3A%22tag%3Astaff%40noreply.openkim.org%2C2023-02-21%3Aproperty%2Fcrystal-structure-npt%22}&rd_fields={%22parameter-names.source-value%22%3A1%2C%22parameter-values.source-value%22%3A1%2C%22meta.short-id%22%3A1}&database=data&limit=0&dropdownKeyString=%22parameter-values.source-value%22
 * GetallUrlParams() returns 
 * {
 *      "rd_query":{
 *          "meta.type":"rd",
 *          "prototype-label.source-value":"A3B2_hP5_164_ad_d",
 *          "stoichiometric-species.source-value":["Al","Ni"],
 *          "property-id":"tag:staff@noreply.openkim.org,2023-02-21:property/crystal-structure-npt"
 *      },
 *      "rd_fields":{
 *          "parameter-names.source-value":1,
 *          "parameter-values.source-value":1,
 *          "meta.short-id":1
 *      },
 *      "database":"data",
 *      "limit":0,
 *      "dropdownKeyString":""
 * } 
 * @returns {null} It populates the key-value of the global variable __g_apiRequestParameters
 */
function GetAllUrlParams() 
{
    // FIRST, RESET ALL THE MEMBERS OF _g_apiRequestParameters;
    __g_apiRequestParameters["tr_query"]                    = {};
    __g_apiRequestParameters["tr_fields"]                   = {};
    __g_apiRequestParameters["tr_value_keystring"]          = "";
    __g_apiRequestParameters["tr_dropdown_keystring"]       = "";
    __g_apiRequestParameters["rd_query"]                    = {};
    __g_apiRequestParameters["rd_fields"]                   = {};
    __g_apiRequestParameters["rd_value_keystring"]          = "";
    __g_apiRequestParameters["rd_dropdown_keystring"]       = "";
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
    __g_apiRequestParameters["tr_query"]                    = result["tr_query"]                    || {};
    __g_apiRequestParameters["tr_fields"]                   = result["tr_fields"]                   || {};
    __g_apiRequestParameters["tr_value_keystring"]          = result["tr_value_keystring"]          || "";
    __g_apiRequestParameters["tr_dropdown_keystring"]       = result["tr_dropdown_keystring"]       || "";
    __g_apiRequestParameters["rd_query"]                    = result["rd_query"]                    || {};
    __g_apiRequestParameters["rd_fields"]                   = result["rd_fields"]                   || {};
    __g_apiRequestParameters["rd_value_keystring"]          = result["rd_value_keystring"]          || "";
    __g_apiRequestParameters["rd_dropdown_keystring"]       = result["rd_dropdown_keystring"]       || "";
    __g_apiRequestParameters["database"]                    = result["database"]                    || "data";
    __g_apiRequestParameters["limit"]                       = result["limit"]                       || "0";

}

function SetUrlParams()
{
    __g_apiRequestParameters["tr_query"]                    = JSON5.parse(__g_HtmlElements["tr_query_input"].value || '""');
    __g_apiRequestParameters["tr_fields"]                   = JSON5.parse(__g_HtmlElements["tr_fields_input"].value || '""');
    __g_apiRequestParameters["tr_dropdown_keystring"]       = JSON5.parse(__g_HtmlElements["tr_dropdown_keystring_input"].value || '""');
    __g_apiRequestParameters["tr_value_keystring"]          = JSON5.parse(__g_HtmlElements["tr_value_keystring_input"].value || '""');
    
    __g_apiRequestParameters["rd_query"]                    = JSON5.parse(__g_HtmlElements["rd_query_input"].value || '""');
    __g_apiRequestParameters["rd_fields"]                   = JSON5.parse(__g_HtmlElements["rd_fields_input"].value || '""');
    __g_apiRequestParameters["rd_dropdown_keystring"]       = JSON5.parse(__g_HtmlElements["rd_dropdown_keystring_input"].value || '""');
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

function DoApiQueryAndUpdatePlotsRD()
{
    DoApiQuery(__g_apiRequestParameters["rd_query"], {...__g_apiRequestParameters["rd_fields"],...__g_rdDefaultFields})
    .then((data) => {
        __g_apiData["rd_data"] = data;
    })
    .then(()=>{
        const rd_value_keystring        = __g_apiRequestParameters["rd_value_keystring"];
        const rd_dropdown_keystring     = __g_apiRequestParameters["rd_dropdown_keystring"];
        
        if(rd_value_keystring == "" || rd_value_keystring == null || rd_value_keystring == undefined) return;

        if(rd_dropdown_keystring != "" && rd_dropdown_keystring != null && rd_dropdown_keystring != undefined)
        {
            const dropdownOptions = GetUnique(__g_apiData["rd_data"],rd_dropdown_keystring);
            PopulateDropdownOptions(dropdownOptions, __g_HtmlElements["rd_dropdown"]);
            __g_HtmlElements["rd_dropdown"].addEventListener("change",(e) => {
                const barplotdata = FilterAndParseDataRD(__g_apiData["rd_data"], e.target.value, rd_dropdown_keystring,rd_value_keystring);
                UpdateBarPlotRD(barplotdata);
            })
            __g_HtmlElements["rd_dropdown"].value = dropdownOptions[0];
            var event = new Event('change');
            __g_HtmlElements["rd_dropdown"].dispatchEvent(event);
        }
        else
        {
            const barplotdata = ParseDataRD(__g_apiData["rd_data"],rd_value_keystring);
            UpdateBarPlotRD(barplotdata);
        }
    })
}


function DoApiQueryAndUpdatePlotsTR()
{
    DoApiQuery(__g_apiRequestParameters["tr_query"], {...__g_apiRequestParameters["tr_fields"],...__g_tdDefaultFields})
    .then((data) => {
        __g_apiData["tr_data"] = data;
    })
    .then(()=>{
        const tr_value_keystring        = __g_apiRequestParameters["tr_value_keystring"];
        const tr_dropdown_keystring     = __g_apiRequestParameters["tr_dropdown_keystring"];
        
        if(tr_value_keystring == "" || tr_value_keystring == null || tr_value_keystring == undefined) return;

        if(tr_dropdown_keystring != "" && tr_dropdown_keystring != null && tr_dropdown_keystring != undefined)
        {
            const dropdownOptions = GetUnique(__g_apiData["tr_data"],tr_dropdown_keystring);
            PopulateDropdownOptions(dropdownOptions, __g_HtmlElements["tr_dropdown"]);
            __g_HtmlElements["tr_dropdown"].addEventListener("change",(e) => {
                const barplotdata = FilterAndParseDataTD(__g_apiData["tr_data"], e.target.value, tr_dropdown_keystring,tr_value_keystring);
                UpdateBarPlotTD(barplotdata);
            })
            __g_HtmlElements["tr_dropdown"].value = dropdownOptions[0];
            var event = new Event('change');
            __g_HtmlElements["tr_dropdown"].dispatchEvent(event);
        }
        else
        {
            const barplotdata = ParseDataTD(__g_apiData["tr_data"],tr_value_keystring);
            UpdateBarPlotTD(barplotdata);
        }
    })
}