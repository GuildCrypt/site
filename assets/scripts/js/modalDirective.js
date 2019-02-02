import ModalController from './ModalController.js'

export default function modalDirective () {
  return {
    templateUrl: `/templates/modal.html`,
    controller: ModalController
  }
}
