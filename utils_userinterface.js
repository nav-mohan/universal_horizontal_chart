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

function UpdateTooltip(event, title, description, value, trMean, trStd1, trStd2, rdMean, rdStd1, rdStd2)
{
    __g_HtmlElements["tooltip-title"].innerText = title;
    __g_HtmlElements["tooltip-description"].innerText = description;

    __g_HtmlElements["tooltip-value"].innerText = value;

    __g_HtmlElements["test-result-mean"].innerText = trMean;
    __g_HtmlElements["test-result-std1"].innerText = trStd1;
    __g_HtmlElements["test-result-std2"].innerText = trStd2;

    __g_HtmlElements["reference-data-mean"].innerText = rdMean;
    __g_HtmlElements["reference-data-std1"].innerText = rdStd1;
    __g_HtmlElements["reference-data-std2"].innerText = rdStd2;

    __g_HtmlElements["tooltip"].style.left = event.layerX + 5 + 'px';
    __g_HtmlElements["tooltip"].style.top = event.layerY + 'px';
    __g_HtmlElements["tooltip"].style.display = "block";
}

function HideTooltip()
{
    __g_HtmlElements["tooltip"].style.display = "none";
}

function UpdatePopup(event, title, href, citation, description)
{
    __g_HtmlElements['popup-title'].innerText = title;
    __g_HtmlElements['popup-citation'].innerText = citation;
    __g_HtmlElements['popup-citation'].href = "https://openkim.org/id/"+href;;
    __g_HtmlElements['popup-description'].innerText = description;

    __g_HtmlElements["popup-screen"].style.display = "block";
}
__g_HtmlElements['popup-screen'].addEventListener('click',(e)=>{
        if(e.target.getAttribute('id') == 'popup-screen') __g_HtmlElements["popup-screen"].style.display = "none";
    ;});

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

