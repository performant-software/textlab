TextLab.Vocabs = {
  place: [  
    { value: 'inline', text: "Inline" }, 
    { value: 'above', text: "Superlinear (above)" }, 
    { value: 'below', text: "Superlinear (below)" }, 
    { value: 'margin(right)', text: "Right Margin" }, 
    { value: 'margin(left)', text: "Left Margin" }, 
    { value: 'margin(top)', text: "Top Margin" }, 
    { value: 'margin(bottom)', text: "Bottom Margin" } 
  ],
  rendered: [  
    { value: 'caret', text: "Caret" }, 
    { value: 'no-caret', text: "No Caret" }, 
    { value: 'bubble', text: "Bubble" }, 
    { value: 'half-caret', text: "Half Caret" }, 
    { value: 'insertion-device', text: "Insertion Device" }, 
    { value: 'clip', text: "Clip" }, 
    { value: 'mount', text: "Mount" }, 
    { value: 'patch', text: "Patch" }
   ],
  renderType: [ 
    { value: 'inkG', text: "Indeterminate ink color" }, 
    { value: 'ink1', text: "Black ink" }, 
    { value: 'ink2', text: "Blue ink" }, 
    { value: 'ink3', text: "Brown ink" }, 
    { value: 'ink4', text: "Blue-gray ink" }, 
    { value: 'ink5', text: "Charcoal-gray ink" }, 
    { value: 'HMp', text: "Pencil" }, 
    { value: 'Cg', text: "Green crayon folio" }, 
    { value: 'Cr', text: "Red crayon folio" }, 
    { value: 'Co', text: "Orange crayon folio" }, 
    { value: 'Cbl', text: "Blue crayon folio" }, 
    { value: 'Cbr', text: "Brown crayon folio" }
  ],
  hand: [
    { value: '#HM', text: 'Herman Melville' },
    { value: '#ESM', text: 'Elizabeth Shaw Melville' },
    { value: '#RW', text: 'Raymond Weaver' },
    { value: '#HT', text: ' Houghton Library' } 
  ],
  stage: [ 
    { value: 'StA', text:'Earliest draftings before stage B, with only four pencil leaves extant' },
    { value: 'StB', text:'Fair-copy leaves designated by the MG (top margin green crayon) number set' },
    { value: 'StBa', text:'Sub-stage of B designated by inscription with heavy black ink' },
    { value: 'StBb', text:'Sub-stage of B designated by inscription with fine nib and black ink ' },
    { value: 'StBba', text:'Sub-stage of sub-stage Bb, with further local distinctions' },
    { value: 'StBbb', text:'Sub-stage of sub-stage Bb, with further local distinctions' },
    { value: 'StBc', text:'Sub-stage of B designated by inscription with dark black ink; also indicated as Stage Bc[C] and Stage BcCa' },
    { value: 'StBca', text:'Sub-stage of sub-stage Bc, with further local distinctions' },
    { value: 'StBcb', text:'Sub-stage of sub-stage Bc, with further local distinctions' },
    { value: 'StBcC', text:'Indicates that sub-stage Bc leaves share the same dark black ink as Stage Ca' },
    { value: 'StC', text:'Fair-copy leaves designated by the LCP (left margin pencil) number set' },
    { value: 'StCa', text:'Sub-stage of C designated by added numbers; basic inscription in dark black ink of Stage Bc; also indicated as Stage Bc[C] and Stage BcCa' },
    { value: 'StBcCa', text:'Indicates that sub-stage Ca leaves share the same dark black ink as Stage Bc' },
    { value: 'StCaa', text:'Sub-stage of sub-stage Ca designated by contextual features<' },
    { value: 'StCab', text:'Sub-stage of sub-stage Ca designated by contextual features' },
    { value: 'StCb', text:'Sub-stage of C designated by added numbers' },
    { value: 'StCba', text:'Sub-stage of sub-stage Cb designated by contextual features' },
    { value: 'StCbb', text:'Sub-stage of sub-stage Cb designated by contextual features' },
    { value: 'StCc', text:'Sub-stage of C designated by added numbers' },
    { value: 'StCca', text:'Sub-stage of sub-stage Cc designated by contextual features' },
    { value: 'StD', text:'Fair-copy leaves, in pale black, almost gray ink, designated by the LG (top left corner) number set' },
    { value: 'StDa', text:'Sub-stage of D designated by unmodified numbers' },
    { value: 'StDaa', text:'Sub-stage of sub-stage Da designated by local features' },
    { value: 'StDab', text:'Sub-stage of sub-stage Da designated by local features' },
    { value: 'StDb', text:'Sub-stage of D designated by modified numbers and contextual features' },
    { value: 'StX', text:'Pencil draft composition of material later developed in stages F and G; only several leaves survive' },
    { value: 'StE', text:'Fair-copy leaves designated by the Red (top right corner, red crayon) number set, with sub-stages distinguishable by added numbers, crayon color variation, inks, pen nibs, and contextual features' },
    { value: 'StEa', text:'Sub-stage of E in gray-black ink (chs. 1-2)' },
    { value: 'StEab', text:' Sub-stage of sub-stage Ea, designated by added numbers and contextual features' },
    { value: 'StEb', text:'Sub-stage of E in gray-black ink, fine nib (chs. 3-12)' },
    { value: 'StEc', text:'Sub-stage of E with added numbers, brownish crayon for foliation, and coarse nib (ch. 9)' },
    { value: 'StEd', text:'Sub-stage of E (ch. 11)' },
    { value: 'StEeF', text:'Sub-stage of E revising parts of sub-stage Eb (chs. 11-12) in the brown ink of stage F' },
    { value: 'StEG', text:'Sub-stage of E revising parts of sub-stage Eb (chs. 11-12) in the blue ink of stage G' },
    { value: 'StF', text:'Fair-copy leaves, in brown ink, with coarse nib, designated by the MLP (left margin pencil) number set' },
    { value: 'StFa', text:'Sub-stage of F in same ink, with unmodified numbers' },
    { value: 'StFb', text:'Sub-stage of F in same ink, with modified numbers' },
    { value: 'StG', text:' Fair-copy leaves, in blue ink, designated by the MRP (right margin pencil) number set ' },
    { value: 'StGa', text:'Sub-stage of G in same ink, with unmodified numbers' },
    { value: 'StGb', text:'Sub-stage of F in same ink, with modified numbers' },
    { value: 'Stp', text:'Late stage pencil revisions appearing on all leaves, sometimes preceding ink inscription, sometimes following' }
  ],
  deletionRendered: [
    { value: 'single-stroke', text: "Single Stroke" },
    { value: 'multi-stroke', text: "Multi-stroke" },
    { value: 'hashmark', text: "Hashmark" },
    { value: 'erasure', text: "Erasure" }
  ],
  metamark: [
    { value: 'folio', text: "Folio" },
    { value: 'caret', text: "Caret" },
    { value: 'section-divider', text: "Section Divider" },
    { value: 'insertion-device', text: "Insertion Device" },
    { value: 'composition-information', text: "Composition Information" }      
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
      rend: { 
        displayName: 'Rendered', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'rendered' 
      },
      rendType: { 
        displayName: 'Render Type', 
        fieldType: 'dropdown', 
        instructions: '',
        appendTo: 'rend',
        vocab: 'renderType' 
      },
      hand: { 
        displayName: 'Hand', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'hand' 
      },
      change: {
        displayName: 'Stage', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'stage' 
      },
      facs: {
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
      rend: { 
        displayName: 'Rendered', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'deletionRendered' 
      },
      rendType: { 
        displayName: 'Render Type', 
        fieldType: 'dropdown', 
        instructions: '',
        appendTo: 'rend',
        vocab: 'renderType' 
      },
      hand: { 
        displayName: 'Hand', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'hand' 
      },
      change: {
        displayName: 'Stage', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'stage' 
      },
      facs: {
        displayName: 'Zone',
        instructions: '',
        fieldType: 'zone'
      }
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

  gap: {
    tag: 'gap',
    empty: true,
    attributes: {
      reason: {
        displayName: 'Reason', 
        fieldType: 'string', 
        defaultValue: 'illegible',
        instructions: "Please specify the reason for a gap." 
      }
    }
  },

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
      function: {
        displayName: 'Function of metamark', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'metamark' 
      },
      rend: { 
        displayName: 'Hand', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'hand' 
      },
      rendType: { 
        displayName: 'Render Type', 
        fieldType: 'dropdown', 
        instructions: '',
        appendTo: 'rend',
        vocab: 'renderType' 
      },
      change: {
        displayName: 'Stage', 
        fieldType: 'dropdown', 
        instructions: '',
        vocab: 'stage' 
      },
      facs: {
        displayName: 'Zone',
        instructions: '',
        fieldType: 'zone'
      }
    }    
  },
 
  milestone: {
    tag: 'milestone',
    empty: true,
    attributes: {
      n: { 
        displayName: 'Number', 
        fieldType: 'number', 
        instructions: "Please enter a number for this milestone." 
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
        instructions: "Please select the type of item being numbered." 
      }
    }
  },

  pb: {
    tag: 'pb',
    empty: true,
    atttributes: {
      facs: {
        fieldType: 'leaf'
      }
    }
  },

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
      change: {
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
      },
      facs: {
        displayName: 'Zone',
        instructions: '',
        fieldType: 'zone'
      }
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

  // also encloses <app><rdg>lorem</rdg></app>
  // unclear: {
 //    tag: 'unclear',
 //    empty: false,
 //    attributes: {
 //      resp: {
 //        displayName: 'Responsible persons',
 //        fieldType: 'string',
 //        defaultValue: '#MEL',
 //        instructions: "Please enter the responsible person."
 //      },
 //      zone: {
 //        displayName: 'Zone',
 //        instructions: '',
 //        fieldType: 'zone'
 //      }
 //    }
 //  }

};
  





