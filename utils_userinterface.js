/******************************************************************************************
    UTILITY FUNCTIONS FOR HANDLING USER-INTERFACE STUFF 
/****************************************************************************************** */

function PopulateFormInput()
{
    __g_HtmlElements["query_input"].value                   = JSON.stringify(__g_apiRequestParameters["query"],null,"\t")              || "";
    __g_HtmlElements["fields_input"].value                  = JSON.stringify(__g_apiRequestParameters["fields"],null,"\t")             || "";

    __g_HtmlElements["tr_value_keystring_input"].value      = JSON.stringify(__g_apiRequestParameters["tr_value_keystring"],null,"\t")    || "";
    __g_HtmlElements["rd_value_keystring_input"].value      = JSON.stringify(__g_apiRequestParameters["rd_value_keystring"],null,"\t")    || "";
    __g_HtmlElements["dropdown_keystring_input"].value   = JSON.stringify(__g_apiRequestParameters["dropdown_keystring"],null,"\t") || "";
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
    const dropdownKeyString = __g_apiRequestParameters["dropdown_keystring"];
    __g_HtmlElements["dropdown"].style.display = "block";
    if(dropdownKeyString == "" || dropdownKeyString == null || dropdownKeyString == undefined)
    {
        console.log("DISPLAY NONE DROPDOWN");
        __g_HtmlElements["dropdown"].style.display = "None";
    }
}

function UpdateChartUrl()
{
    const url       =       new URL(window.location);
    
    var chart_url   =       url.origin; 
    chart_url       +=      url.pathname;
    chart_url       +=      "?query="                   +  JSON.stringify(__g_apiRequestParameters["query"]);
    chart_url       +=      "&fields="                  +  JSON.stringify(__g_apiRequestParameters["fields"]);
    chart_url       +=      "&tr_value_keystring="      +  JSON.stringify(__g_apiRequestParameters["tr_value_keystring"]);
    chart_url       +=      "&rd_value_keystring="      +  JSON.stringify(__g_apiRequestParameters["rd_value_keystring"]);
    chart_url       +=      "&dropdown_keystring="      +  JSON.stringify(__g_apiRequestParameters["dropdown_keystring"]);
    chart_url       +=      "&database="                +  JSON.stringify(__g_apiRequestParameters["database"]);
    chart_url       +=      "&limit="                   +  JSON.stringify(__g_apiRequestParameters["limit"]);

    __g_HtmlElements["chart_url"].innerText = chart_url;
    __g_HtmlElements["chart_url"].href = chart_url;
}

function SubmitApiQuery()
{
    SetUrlParams();
    ToggleDropdownOnOff();
    DoApiQueryAndUpdatePlots();
    UpdateChartUrl();
    PopulateFormInput();
}

function OnFirstLoad()
{
    GetAllUrlParams();
    PopulateFormInput();
    ToggleDropdownOnOff();
    DoApiQueryAndUpdatePlots();
    UpdateChartUrl()
}

