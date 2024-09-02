/**
 * This file contains all the global variables we would need for state-management of the app
 */

/** GLOBAL VARIABLES FOR HTML ELEMENTS OF THE UI */
const __g_HtmlElements = {
    "tr_query_input"                : document.getElementById("tr-query-input"),
    "tr_fields_input"               : document.getElementById("tr-fields-input"),
    "tr_dropdown"                   : document.getElementById("tr-dropdown"),
    "tr_value_keystring_input"      : document.getElementById("tr-value-keystring-input"),
    "tr_dropdown_keystring_input"   : document.getElementById("tr-dropdown-keystring-input"),

    "rd_query_input"                : document.getElementById("rd-query-input"),
    "rd_fields_input"               : document.getElementById("rd-fields-input"),
    "rd_dropdown"                   : document.getElementById("rd-dropdown"),
    "rd_value_keystring_input"      : document.getElementById("rd-value-keystring-input"),
    "rd_dropdown_keystring_input"   : document.getElementById("rd-dropdown-keystring-input"),

    "form_submit_button"            : document.getElementById("form-submit-button"),

    "chart_td"                      : document.getElementById("tr-chart"),
    "chart_rd"                      : document.getElementById("rd-chart"),

    "chart_url"                     : document.getElementById("chart-url"),
};

/** GLOBAL VARIABLES FOR QUERYING THE Query-Site https://query.openkim.org/api*/
const __g_apiBaseURL        = "https://query.openkim.org/api";
const __g_tdKeyStringID     = "meta.subject.extended-id";
const __g_rdKeyStringID     = "meta.short-id";
const __g_tdDefaultFields   = {
    "meta.subject.extended-id"  :1,
    "meta.subject.description"  :1,
    "meta.subject.title"        :1,
    "meta.subject.kimcode"      :1,
    "meta.subject.shortcode"    :1,
    "meta.subject.version"      :1,
    "meta.runner.shortcode"     :1,
    "meta.runner.version"       :1,
    "meta.runner.kimcode"       :1,
};
const __g_rdDefaultFields = {
    "meta.short-id"             :1,
    "meta.description"          :1,
    "species.source-value"      :1,
};

const __g_apiRequestParameters = {
    "tr_query"                  : {},
    "tr_fields"                 : {},
    "tr_value_keystring"        : "",
    "tr_dropdown_keystring"     : "",

    "rd_query"                  : {},
    "rd_fields"                 : {},
    "rd_value_keystring"        : "",
    "rd_dropdown_keystring"     : "",

    "database"                  : "data",
    "limit"                     : "0",
};

const __g_apiData = {
    "tr_data" : [],
    "rd_data" : [],
};
