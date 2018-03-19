function generateTree (target, handler, etype) {
  return {
    1: {
      type: 'div',
      content: '1',
      parent: 'root',
      child: [{
        2: {type: 'div',
          content: '1-1',
          eventHandler: null,
          parent: '1',
          child: []}
      }, {
        3: {type: 'div',
          content: '1-2',
          parent: '1',
          eventHandler: null,
          // child: []}
          child: [{
            5: {type: 'div',
              content: '1-2-1',
              eventHandler: null,
              parent: '3',
              child: []}
          }]}
      }, {
        4: {type: 'div',
          content: '1-3',
          // eventHandler: click1,
          // eventType: 'click',
          parent: '1',
          child: []}
      }, {
        6: {
          type: 'button',
          parent: '1',
          eventHandler: handler,
          content: 'click me',
          eventType: etype,
          child: []
        }
      }]
    }
  }
}

export default generateTree
