{
  "name": "Crane",
  "description": "Project configuration for Red Badge of Courage Draft.",
  "version": "5",

  "vocabs": {
    "place": [  
      { "value": "inline", "text": "inline" }, 
      { "value": "above", "text": "Superlinear (above)" }, 
      { "value": "below", "text": "Sublinear (below)" }, 
      { "value": "margin-left", "text": "Left margin" },
      { "value": "margin-right", "text": "Right margin" },
      { "value": "margin-top", "text": "Top margin" },
      { "value": "margin-bottom", "text": "Bottom margin" }
    ],
    "rendered": [  
      { "value": "caret", "text": "Caret" }, 
      { "value": "no-caret", "text": "No caret" }
     ],
    "renderType": [ 
      { "value": "ink", "text": "Black ink" }, 
      { "value": "pencil", "text": "Pencil" }
    ],
    "hand": [
      { "value": "#SC", "text": "Stephen Crane" },
      { "value": "#unattributed", "text": "Unattributed" }
    ],
    "stage": [ 
      { "value": "dStA", "text":"Draft base inscription" },
      { "value": "dStB", "text":"Draft current alterations" },
      { "value": "dStC", "text":"Draft review alterations" },
      { "value": "dstX", "text":"Undetermined draft stage" }
    ],
    "deletionRendered": [
      { "value": "strikethrough", "text": "Strikethrough" },
      { "value": "doublestrikethrough", "text": "Doublestrikethrough" },
      { "value": "multistrikethrough", "text": "Multistrikethrough" },
      { "value": "overwrite", "text": "Overwrite" },
      { "value": "erasure", "text": "Erasure" }
    ],
    "metamark": [
      { "value": "foliation", "text": "foliation" },
      { "value": "caret", "text": "Caret" },
      { "value": "paraph", "text": "Paragraph symbol" },
      { "value": "placemark", "text": "Placemark" }
    ]
  },

  "tags": {
  
    "ab": {
      "tag": "ab",
      "empty": false
    },
    
    "add_subst": {
      "tag": "add",
      "empty": false,
      "omitFromMenu": true,
      "attributes": {
        "place": { 
          "displayName": "Place",
          "fieldType": "dropdown",
          "defaultValue": "inline",
          "instructions": "",
          "vocab": "place" 
        },
        "rend": { 
          "displayName": "Render Type", 
          "fieldType": "dropdown", 
          "instructions": "",
          "vocab": "renderType" 
        },
        "hand": { 
          "displayName": "Hand", 
          "fieldType": "dropdown", 
          "defaultValue": "#SC", 
          "instructions": "",
          "vocab": "hand" 
        },
        "change": {
          "displayName": "Stage", 
          "fieldType": "dropdown", 
          "instructions": "",
          "vocab": "stage" 
        },
        "facs": {
          "displayName": "Zone",
          "instructions": "",
          "fieldType": "zone"
        }
      }    
    },

    "add": {
      "tag": "add",
      "empty": false,
      "attributes": {
        "place": { 
          "displayName": "Place",
          "fieldType": "dropdown", 
          "defaultValue": "above",
          "instructions": "",
          "vocab": "place" 
        },
        "rend": { 
          "displayName": "Rendered", 
          "fieldType": "dropdown", 
          "defaultValue": "no-caret",
          "instructions": "",
          "vocab": "rendered" 
        },
        "rendType": { 
          "displayName": "Render Type", 
          "fieldType": "dropdown", 
          "instructions": "",
          "appendTo": "rend",
          "vocab": "renderType" 
        },
        "hand": { 
          "displayName": "Hand", 
          "fieldType": "dropdown", 
          "defaultValue": "#SC", 
          "instructions": "",
          "vocab": "hand" 
        },
        "change": {
          "displayName": "Stage", 
          "fieldType": "dropdown", 
          "instructions": "",
          "vocab": "stage" 
        },
        "facs": {
          "displayName": "Zone",
          "instructions": "",
          "fieldType": "zone"
        }
      }    
    },

    "addSpan": {
      "tag": "addSpan",
      "empty": false
    },

    "anchor": {
      "tag": "anchor",
      "empty": false
    },

    "app": {
      "tag": "app",
      "empty": false
    },

    "calculations": {
      "tag": "calculations",
      "empty": false,
      "attributes": {
        "place": { 
          "displayName": "Place",
          "fieldType": "dropdown", 
          "instructions": "",
          "vocab": "place" 
        },
        "rend": { 
          "displayName": "Rendered", 
          "fieldType": "dropdown", 
          "instructions": "",
          "vocab": "rendered" 
        },
        "rendType": { 
          "displayName": "Render Type", 
          "fieldType": "dropdown", 
          "instructions": "",
          "appendTo": "rend",
          "vocab": "renderType" 
        },
        "hand": { 
          "displayName": "Hand", 
          "fieldType": "dropdown", 
          "instructions": "",
          "defaultValue": "#SC", 
          "vocab": "hand" 
        },
        "change": {
          "displayName": "Stage", 
          "fieldType": "dropdown", 
          "instructions": "",
          "vocab": "stage" 
        },
        "facs": {
          "displayName": "Zone",
          "instructions": "",
          "fieldType": "zone"
        }
      }    
    },

    "choice": {
      "tag": "choice",
      "empty": false
    },

    "corr": {
      "tag": "corr",
      "empty": false
    },

    "del": {
      "tag": "del",
      "empty": false,
      "attributes": {
        "rend": { 
          "displayName": "Rendered", 
          "fieldType": "dropdown", 
          "instructions": "",
          "vocab": "deletionRendered" 
        },
        "rendType": { 
          "displayName": "Render Type", 
          "fieldType": "dropdown", 
          "instructions": "",
          "appendTo": "rend",
          "vocab": "renderType" 
        },
        "hand": { 
          "displayName": "Hand", 
          "fieldType": "dropdown", 
          "instructions": "",
          "defaultValue": "#SC", 
          "vocab": "hand" 
        },
        "change": {
          "displayName": "Stage", 
          "fieldType": "dropdown", 
          "instructions": "",
          "vocab": "stage" 
        },
        "facs": {
          "displayName": "Zone",
          "instructions": "",
          "fieldType": "zone"
        }
      }    
    },

    "del_subst": {
      "tag": "del",
      "empty": false,
      "omitFromMenu": true,
      "attributes": {
        "rend": { 
          "displayName": "Rendered", 
          "fieldType": "dropdown", 
          "instructions": "",
          "defaultValue": "overwrite",
          "vocab": "deletionRendered" 
        },
        "rend": { 
          "displayName": "Render Type", 
          "fieldType": "dropdown", 
          "instructions": "",
          "vocab": "renderType" 
        },
        "hand": { 
          "displayName": "Hand", 
          "fieldType": "dropdown", 
          "instructions": "",
          "defaultValue": "#SC", 
          "vocab": "hand" 
        },
        "change": {
          "displayName": "Stage", 
          "fieldType": "dropdown", 
          "instructions": "",
          "vocab": "stage" 
        },
        "facs": {
          "displayName": "Zone",
          "instructions": "",
          "fieldType": "zone"
        }
      }    
    },
   
    "delSpan": {
      "tag": "delSpan",
      "empty": false
    },

    "ex": {
      "tag": "ex",
      "empty": false
    },
    
    "expan": {
      "tag": "expan",
      "empty": false
    },

    "gap": {
      "tag": "gap",
      "empty": true,
      "attributes": {
        "reason": {
          "displayName": "Reason", 
          "fieldType": "string", 
          "defaultValue": "undeciphered",
          "instructions": "Select the reason for a gap." 
        }
      }
    },

    "handShift": {
      "tag": "handShift",
      "empty": true,
      "attributes": {
        "new": { 
          "displayName": "New Hand", 
          "fieldType": "dropdown", 
          "vocab": "hand", 
          "instructions": "Select the new writer." 
        },
        "medium": { 
          "displayName": "Medium", 
          "fieldType": "string", 
          "instructions": "Enter the medium used." 
        }
      }
    },

    "hi": {
      "tag": "hi",
      "empty": false,
      "attributes": {
        "rend": { 
          "displayName": "Rendered", 
          "fieldType": "dropdown", 
          "vocab": [
            { "value": "underline", "text": "Underline" },
            { "value": "italic", "text": "Italic" }
          ], 
          "instructions": "Select the render style." 
        }
      }
    },

    "l": {
      "tag": "l",
      "empty": false
    },

    "lb": {
      "tag": "lb",
      "empty": true
    },

    "metamark": {
      "tag": "metamark",
      "empty": false,
      "attributes": {
        "place": { 
          "displayName": "Place",
          "fieldType": "dropdown", 
          "instructions": "",
          "vocab": "place" 
        },
        "function": {
          "displayName": "Function of metamark", 
          "fieldType": "dropdown", 
          "instructions": "",
          "vocab": "metamark" 
        },
        "rendType": { 
          "displayName": "Render Type", 
          "fieldType": "dropdown", 
          "instructions": "",
          "appendTo": "rend",
          "vocab": "renderType" 
        },    
        "change": {
          "displayName": "Stage", 
          "fieldType": "dropdown", 
          "instructions": "",
          "vocab": "stage" 
        },
        "facs": {
          "displayName": "Zone",
          "instructions": "",
          "fieldType": "zone"
        }
      }    
    },
   
    "milestone": {
      "tag": "milestone",
      "empty": true,
      "attributes": {
        "n": { 
          "displayName": "Number", 
          "fieldType": "number", 
          "instructions": "Enter a number for this milestone." 
        },
        "unit": { 
          "displayName": "Unit", 
          "fieldType": "dropdown", 
          "vocab": [
            { "value": "chapter", "text": "Chapter" },
            { "value": "leaf", "text": "Leaf" }
          ], 
          "instructions": "Select the type of item being numbered." 
        }
      }
    },

    "pb": {
      "tag": "pb",
      "empty": true,
      "atttributes": {
        "facs": {
          "fieldType": "leaf"
        }
      }
    },

    "rdg": {
      "tag": "rdg",
      "empty": false,
      "attributes": {
        "resp": { 
          "displayName": "Responsible persons", 
          "fieldType": "string", 
          "defaultValue": "#SC",
          "instructions": "Enter the responsible person." 
        }
      }
    },

    "restore": {
      "tag": "restore",
      "empty": false,
      "attributes": {
        "change": {
          "displayName": "Stage", 
          "fieldType": "dropdown", 
          "instructions": "",
          "vocab": "stage" 
        },
        "hand": { 
          "displayName": "Hand", 
          "fieldType": "dropdown", 
          "defaultValue": "#SC",  
          "instructions": "",
          "vocab": "hand" 
        },
        "facs": {
          "displayName": "Zone",
          "instructions": "",
          "fieldType": "zone"
        }
      }    
    },

    "sic": {
      "tag": "sic",
      "empty": false
    },

    "subst": {
      "tag": "subst",
      "empty": false,
      "instructions": "",
      "elements": [ "del_subst", "add_subst" ],
      "attributes": {
        "facs": {
          "displayName": "Zone",
          "instructions": "",
          "fieldType": "zone"
        }      
      }
    },

    "supplied": {
      "tag": "supplied",
      "empty": false
    },

    "unclear": {
      "tag": "unclear",
      "empty": false,
      "attributes": {
        "resp": {
          "displayName": "Responsible persons",
          "fieldType": "string",
          "defaultvalue": "#SC",
          "instructions": "Please enter the responsible person."
        },
        "facs": {
          "displayName": "Zone",
          "instructions": "",
          "fieldType": "zone"
        }
      }
    }

  }
}