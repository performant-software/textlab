TextLab.Vocabs = {
  place: [  
    { value: '#HM', text: "Inline" }, 
    { value: '#HM', text: "Superlinear (above)" }, 
    { value: '#HM', text: "Superlinear (below)" }, 
    { value: '#HM', text: "Right Margin" }, 
    { value: '#HM', text: "Left Margin" }, 
    { value: '#HM', text: "Top Margin" }, 
    { value: '#HM', text: "Bottom Margin" } 
  ],
  rendered: [  
    { value: '#HM', text: "Caret" }, 
    { value: '#HM', text: "No Caret" }, 
    { value: '#HM', text: "Bubble" }, 
    { value: '#HM', text: "Half Caret" }, 
    { value: '#HM', text: "Insertion Device" }, 
    { value: '#HM', text: "Clip" }, 
    { value: '#HM', text: "Mount" }, 
    { value: '#HM', text: "Patch" }
   ],
  renderType: [ 
    { value: '#HM', text: "Indeterminate ink color" }, 
    { value: '#HM', text: "Black ink" }, 
    { value: '#HM', text: "Blue ink" }, 
    { value: '#HM', text: "Brown ink" }, 
    { value: '#HM', text: "Blue-gray ink" }, 
    { value: '#HM', text: "Charcoal-gray ink" }, 
    { value: '#HM', text: "Pencil" }, 
    { value: '#HM', text: "Green crayon folio" }, 
    { value: '#HM', text: "Red crayon folio" }, 
    { value: '#HM', text: "Orange crayon folio" }, 
    { value: '#HM', text: "Green crayon folio" }, 
    { value: '#HM', text: "Blue crayon folio" }, 
    { value: '#HM', text: "Brown crayon folio" }
  ],
  hand: [
    { value: '#HM', text: 'Herman Melville' },
    { value: '#ESM', text: 'Elizabeth Shaw Melville' },
    { value: '#RW', text: 'Raymond Weaver' },
    { value: '#HT', text: ' Houghton Library' } 
  ],
  stage: [ 
    // TODO
  ],
  deletionRendered: [
    { value: '#HM', text: "Single Stroke" },
    { value: '#HM', text: "Multi-stroke" },
    { value: '#HM', text: "Hashmark" },
    { value: '#HM', text: "Erasure" }
  ],
  metamark: [
    { value: '#HM', text: "Folio" },
    { value: '#HM', text: "Caret" },
    { value: '#HM', text: "Section Divider" },
    { value: '#HM', text: "Insertion Device" },
    { value: '#HM', text: "Composition Information" }      
  ]
}

TextLab.Tags = {
  
  ab: {
    tag: 'ab',
    empty: false
  },
  
  add: {
    tag: 'add',
    empty: false,
    attributes: {
      place: { 
        displayName: 'Place',
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'place' 
      },
      rendered: { 
        displayName: 'Rendered', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'rendered' 
      },
      rendType: { 
        displayName: 'Render Type', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'renderType' 
      },
      hand: { 
        displayName: 'Hand', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'hand' 
      },
      stage: {
        displayName: 'Stage', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'stage' 
      },
      zone: {
        displayName: 'Zone',
        instructions: '',
        fieldType: 'zone'
      }
    }    
  },

  addSpan: {
    tag: 'addSpan',
    empty: false
  },

  anchor: {
    tag: 'anchor',
    empty: false
  },

  app: {
    tag: 'app',
    empty: false
  },

  choice: {
    tag: 'choice',
    empty: false
  },

  corr: {
    tag: 'corr',
    empty: false
  },

  del: {
    tag: 'del',
    empty: false,
    attributes: {
      rendered: { 
        displayName: 'Rendered', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'deletionRendered' 
      },
      rendType: { 
        displayName: 'Render Type', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'renderType' 
      },
      // delType: {
      //
      // },
      hand: { 
        displayName: 'Hand', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'hand' 
      },
      stage: {
        displayName: 'Stage', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'stage' 
      }
      // zone: {
      //   displayName: 'Zone',
        // instructions: '',
      //   fieldType: 'region'
      // }  
    }    
  },
 
  delSpan: {
    tag: 'delSpan',
    empty: false
  },

  ex: {
    tag: 'ex',
    empty: false
  },
  
  expan: {
    tag: 'expan',
    empty: false
  },

  // gap: {
  //
  // },

  handShift: {
    tag: 'handShift',
    empty: true,
    attributes: {
      new: { 
        displayName: 'New Hand', 
        fieldType: 'dropdown', 
        vocab: 'hand', 
        instructions: "Please select the new writer." 
      },
      medium: { 
        displayName: 'Medium', 
        fieldType: 'string', 
        instructions: "Please enter the medium used." 
      }
    }
  },

  hi: {
    tag: 'hi',
    empty: false,
    attributes: {
      rend: { 
        displayName: 'Rendered', 
        fieldType: 'dropdown', 
        vocab: [
          { value: 'bold', text: 'Bold' },
          { value: 'underline', text: 'Underline' },
          { value: 'italic', text: 'Italic' },
          { value: 'bubble', text: 'Bubble' },
        ], 
        instructions: "Please select the render style." 
      }
    }
  },

  l: {
    tag: 'l',
    empty: false
  },

  lb: {
    tag: 'lb',
    empty: true
  },

  metamark: {
    tag: 'metamark',
    empty: false,
    attributes: {
      place: { 
        displayName: 'Place',
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'place' 
      },
      fn: {
        displayName: 'Function of metamark', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'metamark' 
      },
      rendType: { 
        displayName: 'Render Type', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'renderType' 
      },
      hand: { 
        displayName: 'Hand', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'hand' 
      },
      stage: {
        displayName: 'Stage', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'stage' 
      }
      // zone: {
    //     displayName: 'Zone',
        // instructions: '',
    //     fieldType: 'region'
    //   }
    }    
  },
 
  milestone: {
    tag: 'milestone',
    empty: true,
    attributes: {
      n: { 
        displayName: 'Number', 
        fieldType: 'number', 
        instructions: "Please enter a cardinal number for this milestone." 
      },
      unit: { 
        displayName: 'Unit', 
        fieldType: 'dropdown', 
        vocab: [
          { value: 'chapter', text: 'Chapter' },
          { value: 'clip', text: 'Clip' },
          { value: 'mount', text: 'Mount' },
          { value: 'leaf', text: 'Leaf' }
        ], 
        instructions: "Please select the type of the cardinal value." 
      }
    }
  },

  // pb: {
  //
  // },

  rdg: {
    tag: 'rdg',
    empty: false,
    attributes: {
      resp: { 
        displayName: 'Responsible persons', 
        fieldType: 'string', 
        defaultValue: '#MEL',
        instructions: "Please enter the responsible person." 
      }
    }
  },

  restore: {
    tag: 'restore',
    empty: false,
    attributes: {
      stage: {
        displayName: 'Stage', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'stage' 
      },
      hand: { 
        displayName: 'Hand', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'hand' 
      }
      // zone: {
      //   displayName: 'Zone',
        // instructions: '',
      //   fieldType: 'region'
      // }  
    }    
  },

  sic: {
    tag: 'sic',
    empty: false
  },

  // subst: {
  //
  // },

  supplied: {
    tag: 'supplied',
    empty: false
  }

  // unclear: {
  //
  // }

};
  





