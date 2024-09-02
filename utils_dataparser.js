
/******************************************************************************************
    UTILITY FUNCTIONS FOR PARSING AN ARRAY OF DEEPLY-NESTED JSON OBJECTS 
    AND RETURNS AN ARRAY OF JSON OBJECTS THAT IS READY FOR PLOTTING
/****************************************************************************************** */


/**
 * @param {Object} obj
 * @param {String} keyString 
 * @returns {any} element from obj
 * given an object and a keyString "key.subkey.subsubkey" specifying the path to 
 * a nested element in the object, return the element obj[key][subkey][subsubkey]
 * We require this helper function because our keys are hyphenated but, Javascript does
 * not support hyphenated keys when querying for key-values using the dot-based notation
 */
function GetNestedValue(obj, keyString) 
{
    const keys = keyString.split('.'); // Split the string into an array of keys
    return keys.reduce((acc, key) => acc[key], obj); // Iterate through the keys to access the nested value
}
/**
 * 
 * @param {Array} objArray
 * @param {String} keyString 
 * @returns {Array}
 * Given an Array of Objects and a KeyString "key.subkey.subsubkey" specifying the path 
 * to a nested array element in the object, gather all the unique values of the array
 * This is primarily used to populate a Dropdown selection
 */
function GetUnique(objArray, keyString)
{
    let uniqueVals = new Set();
    for (let i = 0; i < objArray.length; i++) 
    {
        const obj = objArray[i];
        const vals = GetNestedValue(obj,keyString);
        for(let j = 0; j < vals.length; j++)
            uniqueVals.add(vals[j]);
    }
    return Array.from(uniqueVals);
}



/**
 * ParseDataTD - A utility function that parses an array of JSON objects objArray 
 * and returns an array of JSON objects plotdata thats ready for plotting
 * @param {Array} objArray input data
 * @param {String} valueKeyString search key-string for the value
 * @returns {Array} plotdata - An array of records ready for plotting
each record of the input objArray looks like this 
{
    binding-potential-energy-per-atom : {
        source-value    : -4.188659832713416
    },
    meta: {
        runner : {
            version     : 2,
            shortcode   : "TE_316749760271",
            kimcode     : "EquilibriumCrystalStructure_A3B2_hP5_164_ad_d_AlNi__TE_316749760271_002"
        },
        subject : {
            extended-id : "EAM_Dynamo_MishinMehlPapaconstantopoulos_2002_NiAl__MO_109933561507_005",
            version     : 5,
            shortcode   : "MO_109933561507",
            kimcode     : "EAM_Dynamo_MishinMehlPapaconstantopoulos_2002_NiAl__MO_109933561507_005",
            description : "EAM potential developed by Mishin, Mehl and Papaconstantopoulos (2002) to accurately reproduce properties of the B2-NiAl phase of the Ni-Al system.",
            title       : "EAM potential (LAMMPS cubic hermite tabulation) for the B2-NiAl compound developed by Mishin, Mehl, and Papaconstantopoulos (2002) v005",
        }
    }
}

each record of the output plotdata looks like this 
{
    source_value        :   -4.1886, 

    runner_version      :   2,
    runner_shortcode    :   "TE_316749760271",
    runner_kimcode      :   "EquilibriumCrystalStructure_A3B2_hP5_164_ad_d_AlNi__TE_316749760271_002",

    subject_extended_id :   "EAM_Dynamo_MishinMehlPapaconstantopoulos_2002_NiAl__MO_109933561507_005",
    subject_version     :   5,
    subject_shortcode   :   "MO_109933561507",
    subject_kimcode     :   "EAM_Dynamo_MishinMehlPapaconstantopoulos_2002_NiAl__MO_109933561507_005",
    subject_description :   "EAM potential developed by Mishin, Mehl and Papaconstantopoulos (2002) to accurately reproduce properties of the B2-NiAl phase of the Ni-Al system.",
    subject_title       :   "EAM potential (LAMMPS cubic hermite tabulation) for the B2-NiAl compound developed by Mishin, Mehl, and Papaconstantopoulos (2002) v005",
}
*/

function ParseDataTD(objArray, valueKeyString)
{
    let plotdata = [];
    for (let i = 0; i < objArray.length; i++) 
    {
        const obj = objArray[i];
        let record = {};

        record["subject_extended_id"] = GetNestedValue(obj,__g_tdKeyStringID);
        record["source_value"       ] = GetNestedValue(obj,valueKeyString);

        record["subject_version"    ] = GetNestedValue(obj,"meta.subject.version");
        record["subject_shortcode"  ] = GetNestedValue(obj,"meta.subject.shortcode");
        record["subject_kimcode"    ] = GetNestedValue(obj,"meta.subject.kimcode");
        record["subject_description"] = GetNestedValue(obj,"meta.subject.description");
        record["subject_title"      ] = GetNestedValue(obj,"meta.subject.title");

        record["runner_version"     ] = GetNestedValue(obj,"meta.runner.version");
        record["runner_shortcode"   ] = GetNestedValue(obj,"meta.runner.shortcode");
        record["runner_kimcode"     ] = GetNestedValue(obj,"meta.runner.kimcode");

        plotdata.push(record);
    }
    return plotdata;
}

// this has a lot of code similar to the above ParseDataTD 
// the only difference is how we retrieve the "source_value". 
// retrieving the "source_value" is a two-step process 
function FilterAndParseDataTD(objArray, dropdownValue, matchKeyString, valueKeyString)
{
    let plotdata = [];
    for(let i = 0; i < objArray.length; i++)
    {
        const obj = objArray[i];
        let record = {};

        const matchArray            = GetNestedValue(obj,matchKeyString);
        const valueArray            = GetNestedValue(obj,valueKeyString);
        const dropDownIndex         = matchArray.indexOf(dropdownValue);
        const filteredValue         = valueArray[dropDownIndex];

        record["subject_extended_id"] = GetNestedValue(obj,__g_tdKeyStringID);
        record["source_value"       ] = filteredValue;

        record["subject_version"    ] = GetNestedValue(obj,"meta.subject.version");
        record["subject_shortcode"  ] = GetNestedValue(obj,"meta.subject.shortcode");
        record["subject_kimcode"    ] = GetNestedValue(obj,"meta.subject.kimcode");
        record["subject_description"] = GetNestedValue(obj,"meta.subject.description");
        record["subject_title"      ] = GetNestedValue(obj,"meta.subject.title");

        record["runner_version"     ] = GetNestedValue(obj,"meta.runner.version");
        record["runner_shortcode"   ] = GetNestedValue(obj,"meta.runner.shortcode");
        record["runner_kimcode"     ] = GetNestedValue(obj,"meta.runner.kimcode");

        plotdata.push(record);
    }
    return plotdata;
}

/**
 * @param {Array} objArray 
 * @param {String} valueKeyString 
 * @returns {Array} An array of records ready for plotting
each record of the plotdata looks like this 
{
    source_value    :   1.2120616
    description     :   "AlNi in AFLOW crystal prototype A3B2_hP5_164_ad_d (Al3Ni2). Result of a density functional theory relaxation from the aflow.org repository. This is a nominally zero-stress calculation under the AFLOW standard, meaning that the maximum absolute stress component < 10 kbar. Full details of the original computation can be found in the aflow.org repository by referencing the Aflowlib Unique IDentifier (auid) listed in the content-origin field. Selected computational parameters (as defined on aflow.org/documentation) follow. {'dft_type': ['PAW_PBE'], 'ldau_type': 2}"
    short_id        :   "RD_007001823795_000"
}
*/
function ParseDataRD(objArray, valueKeyString)
{
    let plotdata = [];
    for (let i = 0; i < objArray.length; i++) 
    {
        const obj = objArray[i];
        let record = {};
        
        record["short_id"]      = GetNestedValue(obj, __g_rdKeyStringID);
        record["source_value"]  = GetNestedValue(obj, valueKeyString);
        record["description"]   = GetNestedValue(obj,"meta.description");

        plotdata.push(record);
    }
    return plotdata;
}

/**
 * @param {Array}   objArray        input data, an Array of JSON objects
 * @param {String}  dropdownValue   filtering value as selected by dropdown
 * @param {String}  matchKeyString  dot-separated string pointing to path of matching array
 * @param {String}  valueKeyString  dot-separated string pointing to path of value array
 * @returns {Array} plotdata        output data, an Array of JSON objects, ready for plotting

each record of objArray inputdata might look something like this
{
    parameter-names     : {
        source-value    : [ "c/a", "z2", "z3" ]
    },
    parameter-values    : {
        source-value    : [ 1.2120616, 0.64811859, 0.14641052 ]
    },
    meta : {
        description     : "AlNi in AFLOW crystal prototype A3B2_hP5_164_ad_d (Al3Ni2). Result of a density functional theory relaxation from the aflow.org repository. This is a nominally zero-stress calculation under the AFLOW standard, meaning that the maximum absolute stress component < 10 kbar. Full details of the original computation can be found in the aflow.org repository by referencing the Aflowlib Unique IDentifier (auid) listed in the content-origin field. Selected computational parameters (as defined on aflow.org/documentation) follow. {'dft_type': ['PAW_PBE'], 'ldau_type': 2}",
        short-id        : "RD_007001823795_000"
    }
}

dropdownValue = "z2", 
matchKeyString = "parameter-names.source-value",
valueKeystring = "parameter-values.source-value"

each record of plotdata looks like this 
{
    source_value    : 0.64811859,
    description     : "AlNi in AFLOW crystal prototype A3B2_hP5_164_ad_d (Al3Ni2). Result of a density functional theory relaxation from the aflow.org repository. This is a nominally zero-stress calculation under the AFLOW standard, meaning that the maximum absolute stress component < 10 kbar. Full details of the original computation can be found in the aflow.org repository by referencing the Aflowlib Unique IDentifier (auid) listed in the content-origin field. Selected computational parameters (as defined on aflow.org/documentation) follow. {'dft_type': ['PAW_PBE'], 'ldau_type': 2}",
    short-id        : "RD_007001823795_000"
}
 */

function FilterAndParseDataRD(objArray, dropdownValue, matchKeyString, valueKeyString)
{
    console.log("FilterAndParseDataRD",objArray, dropdownValue, matchKeyString, valueKeyString)
    let plotdata = [];
    for(let i = 0; i < objArray.length; i++)
    {
        const obj = objArray[i];
        let record = {};

        const matchArray            = GetNestedValue(obj,matchKeyString);
        const valueArray            = GetNestedValue(obj,valueKeyString);
        const dropDownIndex         = matchArray.indexOf(dropdownValue);
        const filteredValue         = valueArray[dropDownIndex];

        record["short_id"]      = GetNestedValue(obj, __g_rdKeyStringID);
        record["source_value"]  = filteredValue;
        record["description"]   = GetNestedValue(obj,"meta.description");

        plotdata.push(record);
    }
    return plotdata;
}
