const app = angular.module('marketplace', [])
const contractAddressHex = 'a307b905140c82b37f2d7d806ef9d8858d30ac87'
const templatesDir = '../templates'
const assetsDir = '../assets'

function Tokenizer(data) {
  this.data = data
}

const pat = new Tokenizer({
  name: 'Pat Liu',
  info: 'Pat Liu is a L1 Judge based in central NJ, where he spends his time judging FNMs at his LGS.  His favorite format is EDH, where he has 17/32 color combinations complete.  He has recently been dabbling in Legacy and Modern as well.',
  imageUrl: './assets/pat.jpg',
  email: 'liupat1017@gmail.com'
})

function Token(data) {
  this.data = data
  this.images = [{
    thumbUrl: `${assetsDir}/tokens/${this.data.id}/images/front.thumb.png`,
    fullUrl: `${assetsDir}/tokens/${this.data.id}/images/front.png`
  }, {
    thumbUrl: `${assetsDir}/tokens/${this.data.id}/images/back.thumb.png`,
    fullUrl: `${assetsDir}/tokens/${this.data.id}/images/back.png`
  }]
  this.redeemUrl = `https://redeem.guildcrypt.com/#${this.data.id}`
  this.termsUrl = `${assetsDir}/tokens/${this.data.id}/terms.pdf`
  this.trackerUrl = `https://etherscan.io/token/0x${contractAddressHex}?a=${this.data.id}`
  this.buyUrl = `https://opensea.io/assets/0x${contractAddressHex}/${this.data.id}`
}

const tokens = [
  new Token({
    id: 0,
    name: 'Unlimited Black Lotus (BGS 6.0)',
    description: 'A BGS graded 6.0 (9/6/6/6) Unlimited Black Lotus. BGS #0010945396.',
    sunsetLength: '90 Days',
    thumbFileNames: ['front.thumb.png', 'back.thumb.png'],
    imageFileNames: ['front.png', 'back.png'],
    redemptionMethod: 'In store pickup; $10 Redemption Fee',
    watchUrl: 'http://eepurl.com/dOV-YD',
    tokenizer: pat
  }),
  new Token({
    id: 1,
    name: 'Beta Mox Jet (BGS 9.0)',
    description: 'A BGS graded 9.0 (9/9/9/8.5) Unlimited Mox Jet. BGS #0010945394.',
    sunsetLength: '90 Days',
    thumbFileNames: ['front.thumb.png', 'back.thumb.png'],
    imageFileNames: ['front.png', 'back.png'],
    redemptionMethod: 'In store pickup; $10 Redemption Fee',
    watchUrl: 'http://eepurl.com/dPaMPj',
    tokenizer: pat
  }),
  new Token({
    id: 2,
    name: 'Beta Mox Pearl (BGS 8.5)',
    description: 'A BGS graded 8.5 (8/9/9/9.5) Beta Mox Pearl. BGS #0010945395.',
    sunsetLength: '90 Days',
    thumbFileNames: ['front.thumb.png', 'back.thumb.png'],
    imageFileNames: ['front.png', 'back.png'],
    redemptionMethod: 'In store pickup; $10 Redemption Fee',
    watchUrl: 'http://eepurl.com/dPaNnz',
    tokenizer: pat
  })
]


app.directive('tokens', function () {
  return {
    templateUrl: `${templatesDir}/tokens.html`,
    link: ($scope) => {
      $scope.tokens = tokens
    }
  }
})


app.directive('images', function () {
  return {
    scope: {
      images: '=',
    },
    templateUrl: `${templatesDir}/images.html`,
    link: function ($scope) {
      $scope.index = 0
    }
  }
})
