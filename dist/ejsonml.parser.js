/**
 * ejsonml-parser --- By longhao <longhaohe@gmail.com> (http://longhaohe.com/)
 * Github: https://github.com/longhaohe/ejsonml-parser
 * MIT Licensed.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('htmlparser2')) :
  typeof define === 'function' && define.amd ? define('ejsonml_parser', ['htmlparser2'], factory) :
  (global.ejsonml_parser = factory(global.htmlparser));
}(this, function (htmlparser) { 'use strict';

  htmlparser = 'default' in htmlparser ? htmlparser['default'] : htmlparser;

  var stack = void 0;
  var v = void 0;
  var parser = new htmlparser.Parser({
    onopentag: function onopentag(name, attribs) {
      v = [name, attribs, [], stack];
      stack[2].push(v);
      stack = v;
    },
    ontext: function ontext(text) {
      stack[2].push(text);
    },
    onclosetag: function onclosetag(tagname) {
      stack = stack.pop();
    },
    oncomment: function oncomment(text) {
      stack[2].push('<!--' + text + '-->');
    }
  }, {
    decodeEntities: true
  });

  function parse(template) {
    stack = [undefined, undefined, []];
    template = template.trim();
    parser.write(template);
    parser.end();
    return stack[2][0];
  }

  return parse;

}));
//# sourceMappingURL=ejsonml.parser.js.map