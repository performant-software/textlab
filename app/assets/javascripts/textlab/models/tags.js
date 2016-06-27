TextLab.Tags = {
  
  ab: {
    tag: 'ab',
    empty: false
  },
  
  // add: {
    // attributes: [
    //   { displayName: 'Place', name: 'place', fieldType: 'vocab', vocab: [] },
    //   { displayName: 'Place', name: 'inline', fieldType: 'vocab', vocab: [] },
    //   { displayName: 'Place', name: 'rendered', fieldType: 'vocab', vocab: [] },
    //   { displayName: 'Place', name: 'renderType', fieldType: 'vocab', vocab: [] },
    //   { displayName: 'Place', name: 'hand', fieldType: 'vocab', vocab: [] },
    //   { displayName: 'Place', name: 'stage', fieldType: 'vocab', vocab: [] },
    //   { displayName: 'Place', name: 'facs', fieldType: 'region' }
    // ],
    // template: _.template('place="<%= place %>"> facs="<%= facs %>"')
  // },

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

  // del: {
  //
  // },
 
  delSpan: {
    tag: 'delSpan',
    empty: false
  },

  // ex: {
  //
  // },
  
  expan: {
    tag: 'expan',
    empty: false
  },

  // gap: {
  //
  // },
  //
  // handShift: {
  //
  // },
  //
  // hi: {
  //
  // },

  l: {
    tag: 'l',
    empty: false
  },

  // lb: {
  //
  // },
  //
  // metamark: {
  //
  // },
 
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
  //
  // rdg: {
  //
  // },
  //
  // restore: {
  //
  // },

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
  





