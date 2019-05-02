export default function tokensDirective () {
  return {
    scope: {
      tokens: '='
    },
    templateUrl: `/templates/tokens.html`
  }
}
