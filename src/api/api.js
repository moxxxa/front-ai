import { Loading } from 'quasar';
class Api {
  loading(message, delay) {
    console.log('start le loading');
    Loading.show({
      message, messageColor: 'white', spinnerSize: 250, spinnerColor: 'blue', delay: delay || 400
    });
  }
  finishedLoading() {
    console.log('finish loading');
    Loading.hide();
  }
}

export default new Api();
