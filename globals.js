/**
 * This file contains all the global variables we would need for state-management of the app
 */

/** GLOBAL VARIABLES FOR HTML ELEMENTS OF THE UI */
const __g_HtmlElements = {
    "query_input"                   : document.getElementById("query-input"),
    "fields_input"                  : document.getElementById("fields-input"),

    "tr_value_keystring_input"      : document.getElementById("tr-value-keystring-input"),
    "rd_value_keystring_input"      : document.getElementById("rd-value-keystring-input"),
    "dropdown_keystring_input"      : document.getElementById("dropdown-keystring-input"),

    "form_submit_button"            : document.getElementById("form-submit-button"),

    "dropdown"                      : document.getElementById("dropdown"),

    "chart_td"                      : document.getElementById("tr-chart"),
    "chart_rd"                      : document.getElementById("rd-chart"),

    "chart_url"                     : document.getElementById("chart-url"),
};

/** GLOBAL VARIABLES FOR QUERYING THE Query-Site https://query.openkim.org/api*/
const __g_apiBaseURL        = "https://query.openkim.org/api";
const __g_tdKeyStringID     = "meta.subject.extended-id";
const __g_rdKeyStringID     = "meta.short-id";
const __g_defaultQuery = {
    // default query for test-results and reference-data
    "meta.type":{"$in":["tr","rd"]},
    "meta.subject.shortcode":{"$ne":"MO_959249795837"}, // Exclude LJ_ElliottAkerson_2015_Universal__MO_959249795837_003 from all queries
};
const __g_defaultFields = {
    "meta.type":1,
    
    // default fields for Test-Results
    "meta.subject.extended-id"  :1,
    "meta.subject.description"  :1,
    "meta.subject.title"        :1,
    "meta.subject.kimcode"      :1,
    "meta.subject.shortcode"    :1,
    "meta.subject.version"      :1,
    "meta.runner.shortcode"     :1,
    "meta.runner.version"       :1,
    "meta.runner.kimcode"       :1,

    // default fields for Reference-Data
    "meta.short-id"             :1,
    "meta.description"          :1,
    "species.source-value"      :1,
};

const __g_apiRequestParameters = {
    "query"                     : {},
    "fields"                    : {},

    "tr_value_keystring"        : "",
    "rd_value_keystring"        : "",
    "dropdown_keystring"        : "",

    "database"                  : "data",
    "limit"                     : "0",
};

const __g_apiData = {
    "tr_data" : [],
    "rd_data" : [],
};
