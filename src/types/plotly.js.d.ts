declare module 'plotly.js' {
  namespace Plotly {
    type Data = Record<string, unknown>;
    interface Layout extends Record<string, unknown> {}
    interface Config extends Record<string, unknown> {}
  }

  export = Plotly;
}
