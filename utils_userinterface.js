/******************************************************************************************
    UTILITY FUNCTIONS FOR HANDLING USER-INTERFACE STUFF 
/****************************************************************************************** */

function PopulateFormInput()
{
    __g_HtmlElements["tr_query_input"].value                = JSON.stringify(__g_apiRequestParameters["tr_query"],null,"\t")              || "";
    __g_HtmlElements["tr_fields_input"].value               = JSON.stringify(__g_apiRequestParameters["tr_fields"],null,"\t")             || "";
    __g_HtmlElements["tr_value_keystring_input"].value      = JSON.stringify(__g_apiRequestParameters["tr_value_keystring"],null,"\t")    || "";
    __g_HtmlElements["tr_dropdown_keystring_input"].value    = JSON.stringify(__g_apiRequestParameters["tr_dropdown_keystring"],null,"\t") || "";

    __g_HtmlElements["rd_query_input"].value                = JSON.stringify(__g_apiRequestParameters["rd_query"],null,"\t")              || "";
    __g_HtmlElements["rd_fields_input"].value               = JSON.stringify(__g_apiRequestParameters["rd_fields"],null,"\t")             || "";
    __g_HtmlElements["rd_value_keystring_input"].value      = JSON.stringify(__g_apiRequestParameters["rd_value_keystring"],null,"\t")    || "";
    __g_HtmlElements["rd_dropdown_keystring_input"].value    = JSON.stringify(__g_apiRequestParameters["rd_dropdown_keystring"],null,"\t") || "";
}

/**
 * @param {Array} optionsArray 
 * @param {HTMLElement} dropdownElement
 * Given an array, populate the dropdown with these options
 */
function PopulateDropdownOptions(optionsArray,dropdownElement)
{
    if(optionsArray == null || optionsArray == undefined || optionsArray.length == 0) return;

    dropdownElement.innerHTML = '';
    for(var i = 0; i < optionsArray.length; i++) 
    {
        var opt             = optionsArray[i];
        var el              = document.createElement("option");
        el.textContent      = opt;
        el.value            = opt;
        dropdownElement.appendChild(el);
    }
}

function ToggleDropdownOnOff()
{
    const dropdownKeyStringTD = __g_apiRequestParameters["tr_dropdown_keystring"];
    const dropdownKeyStringRD = __g_apiRequestParameters["rd_dropdown_keystring"];
    __g_HtmlElements["tr_dropdown"].style.display = "block";
    __g_HtmlElements["rd_dropdown"].style.display = "block";
    if(dropdownKeyStringTD == "" || dropdownKeyStringTD == null || dropdownKeyStringTD == undefined)
    {
        console.log("DISPLAY NONE TD");
        __g_HtmlElements["tr_dropdown"].style.display = "None";
    }
    if(dropdownKeyStringRD == "" || dropdownKeyStringRD  == null || dropdownKeyStringRD  == undefined)
    {
        console.log("DISPLAY NONE RD");
        __g_HtmlElements["rd_dropdown"].style.display = "None";
    }
}

function UpdateChartUrl()
{
    const url       =       new URL(window.location);
    
    var chart_url   =       url.origin; 
    chart_url       +=      url.pathname;
    chart_url       +=      "?tr_query="                +  JSON.stringify(__g_apiRequestParameters["tr_query"]);
    chart_url       +=      "&tr_fields="               +  JSON.stringify(__g_apiRequestParameters["tr_fields"]);
    chart_url       +=      "&tr_value_keystring="      +  JSON.stringify(__g_apiRequestParameters["tr_value_keystring"]);
    chart_url       +=      "&tr_dropdown_keystring="   +  JSON.stringify(__g_apiRequestParameters["tr_dropdown_keystring"]);
    chart_url       +=      "&rd_query="                +  JSON.stringify(__g_apiRequestParameters["rd_query"]);
    chart_url       +=      "&rd_fields="               +  JSON.stringify(__g_apiRequestParameters["rd_fields"]);
    chart_url       +=      "&rd_value_keystring="      +  JSON.stringify(__g_apiRequestParameters["rd_value_keystring"]);
    chart_url       +=      "&rd_dropdown_keystring="   +  JSON.stringify(__g_apiRequestParameters["rd_dropdown_keystring"]);
    chart_url       +=      "&database="                +  JSON.stringify(__g_apiRequestParameters["database"]);
    chart_url       +=      "&limit="                   +  JSON.stringify(__g_apiRequestParameters["limit"]);

    __g_HtmlElements["chart_url"].innerText = chart_url;
    __g_HtmlElements["chart_url"].href = chart_url;
}

function SubmitApiQuery()
{
    SetUrlParams();
    ToggleDropdownOnOff();
    DoApiQueryAndUpdatePlotsTR();
    DoApiQueryAndUpdatePlotsRD();
    UpdateChartUrl();
    PopulateFormInput();
}

function OnFirstLoad()
{
    GetAllUrlParams();
    PopulateFormInput();
    ToggleDropdownOnOff();
    DoApiQueryAndUpdatePlotsTR();
    DoApiQueryAndUpdatePlotsRD();
    UpdateChartUrl()
}

