import { fromAst } from '../src/parser/fromAst';
import { buildAst } from '../src/parser/toAst';

describe('test ast', () => {
  describe('smoke', () => {
    const CSS = `
      .a,
      .b .c {
        border:1px solid;
        margin: 6px 10px;
      }
      
      .d ~ .e:not(focused){ 
        display: block !important;
        position: relative;
        width: calc(100% - 10px);
      }
      
      @media only screen and (max-width: 600px) {
        .c { position: absolute; }
        .a { position: relative; }  
      }
      
      .a, .b, input { color: rightColor }
      
      .dou.ble {
        color: red
      }
    `;

    it('should map simple style', () => {
      const ast = buildAst(CSS);
      expect(ast).toMatchSnapshot();
    });

    it('should remap simple style', () => {
      const ast = buildAst(CSS);
      const css = fromAst(['e'], ast);
      expect(css).toMatchSnapshot();
    });

    it('dont map unused styles', () => {
      const ast = buildAst(CSS);
      const cssFalsePositive = fromAst(['d', 'b'], ast);
      expect(cssFalsePositive).toBe('.b { color: rightColor; }\n');
    });

    it('handles double classes', () => {
      const ast = buildAst(CSS);
      const single = fromAst(['ble'], ast);
      expect(single).toBe('');

      const double = fromAst(['ble', 'dou'], ast);
      expect(double).toBe('.dou.ble { color: red; }\n');
    });

    it('should remap complex style', () => {
      const ast = buildAst(CSS);
      const css = fromAst(['a', 'c'], ast);
      expect(css).toMatchSnapshot();
    });
  });

  it('should handle keyframes and media', () => {
    const CSS = `
    @-webkit-keyframes ANIMATION_NAME{
      0%{-webkit-transform:rotate(0deg);}
      to{-webkit-transform:rotate(359deg);}}
    @keyframes ANIMATION_NAME{
      0%{-webkit-transform:rotate(0deg);}
      to{-webkit-transform:rotate(359deg);}
    }`;

    const ast = buildAst(CSS);
    expect(ast).toMatchSnapshot();
  });
});
