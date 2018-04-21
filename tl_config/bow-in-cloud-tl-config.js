{
  "name": "BIC",
  "description": "Project configuration for the Bow in the Cloud texts.",
  "version": "4",

  "vocabs": {
    "place": [
      { "value": "inline", "text": "Inline" },
      { "value": "above", "text": "Superlinear (above)" },
      { "value": "below", "text": "Sublinear (below)" },
      { "value": "margin(right)", "text": "Right Margin" },
      { "value": "margin(left)", "text": "Left Margin" },
      { "value": "margin(top)", "text": "Top Margin" },
      { "value": "margin(bottom)", "text": "Bottom Margin" }
    ],
    "rendered": [
      { "value": "caret", "text": "Caret" },
      { "value": "no-caret", "text": "No Caret" },
      { "value": "bubble", "text": "Bubble" },
      { "value": "half-caret", "text": "Half Caret" },
      { "value": "insertion-device", "text": "Insertion Device" }
     ],
    "renderType": [
      { "value": "_inkG", "text": "Indeterminate ink color" },
      { "value": "_ink1", "text": "Black ink" },
      { "value": "_ink2", "text": "Blue ink" },
      { "value": "_ink3", "text": "Brown ink" },
      { "value": "_ink4", "text": "Blue-gray ink" },
      { "value": "_ink5", "text": "Charcoal-gray ink" },
      { "value": "_HMp", "text": "Pencil" }
    ],
    "hand": [
      { "value": "#MAR", "text": "Mary Anne Rawson (nee Read)" },
      { "value": "#JRL", "text": "John Rylands Library"}
    ],
    "stage": [
      { "value": "St1826a", "text": "St1826a: First 1826 submission" },
      { "value": "St1826b", "text": "St1828b: Second 1826 submission" },
      { "value": "St1826c", "text": "St1826c: Fair copy by MAR, 1826" },
      { "value": "St1826d", "text": "St1826d: Revisions to fair copy by MAR" },
      { "value": "St1833a", "text": "St1833a: First 1833 submission" },
      { "value": "St1833b", "text": "St1833b: Second 1833 submission" },
      { "value": "St1833c", "text": "St1833c: Fair copy by MAR, 1833" },
      { "value": "St1833d", "text": "St1833d: Revisions to 1833 fair copy by MAR" },
      { "value": "St1834a", "text": "St1834a: First 1834 submission" },
      { "value": "St1834b", "text": "St1834b: Second 1834 submission" },
      { "value": "St1834c", "text": "St1834c: Fair copy by MAR, 1834" },
      { "value": "St1834d", "text": "St1834d: Revisions to 1834 fair copy by MAR" }
    ],
    "deletionRendered": [
      { "value": "single-stroke", "text": "Single Stroke" },
      { "value": "multi-stroke", "text": "Multi-stroke" },
      { "value": "hashmark", "text": "Hashmark" },
      { "value": "erasure", "text": "Erasure" }
    ],
    "metamark": [
      { "value": "folio", "text": "Folio" },
      { "value": "caret", "text": "Caret" },
      { "value": "section-divider", "text": "Section Divider" },
      { "value": "insertion-device", "text": "Insertion Device" },
      { "value": "composition-information", "text": "Composition Information" }
    ],
    "type": [
      { "value": "poem", "text": "Poem" },
      { "value": "stanza", "text": "Stanza" },
      { "value": "letter", "text": "Letter" },
      { "value": "essay", "text": "Essay" }
    ]
  },

  "tags": {

    "ab": {
      "tag": "ab",
      "omitFromDiplo": true,
      "empty": false
    },

    "add": {
      "tag": "add",
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
          "defaultvalue": "illegible",
          "instructions": "Please specify the reason for a gap."
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
          "instructions": "Please select the new writer."
        },
        "medium": {
          "displayName": "Medium",
          "fieldType": "string",
          "instructions": "Please enter the medium used."
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
            { "value": "bold", "text": "Bold" },
            { "value": "underline", "text": "Underline" },
            { "value": "italic", "text": "Italic" },
            { "value": "bubble", "text": "Bubble" }
          ],
          "instructions": "Please select the render style."
        }
      }
    },

    "lg": {
      "tag": "lg",
      "omitFromDiplo": true,
      "empty": false,
      "attributes": {
        "type": {
          "displayName": "type",
          "fieldType": "dropdown",
          "instructions": "",
          "vocab": "type"
        }
      }
    },

    "l": {
      "tag": "l",
      "omitFromDiplo": true,
      "empty": false,
      "attributes": {
        "n": {
          "displayName": "n",
          "fieldType": "number",
          "instructions": ""
        }
      }
    },

    "dateline": {
      "tag": "dateline",
      "omitFromDiplo": true,
      "empty": false
    },

    "opener": {
      "tag": "opener",
      "omitFromDiplo": true,
      "empty": false
    },

    "salute": {
      "tag": "salute",
      "omitFromDiplo": true,
      "empty": false
    },

    "closer": {
      "tag": "salute",
      "omitFromDiplo": true,
      "empty": false
    },

    "signed": {
      "tag": "salute",
      "omitFromDiplo": true,
      "empty": false
    },

    "name": {
      "tag": "name",
      "omitFromDiplo": true,
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
          "instructions": "Please enter a number for this milestone."
        },
        "unit": {
          "displayName": "Unit",
          "fieldType": "dropdown",
          "vocab": [
            { "value": "chapter", "text": "Chapter" },
            { "value": "clip", "text": "Clip" },
            { "value": "mount", "text": "Mount" },
            { "value": "leaf", "text": "Leaf" }
          ],
          "instructions": "Please select the type of item being numbered."
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
          "defaultvalue": "#MEL",
          "instructions": "Please enter the responsible person."
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
      "elements": [ "del", "add" ],
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
