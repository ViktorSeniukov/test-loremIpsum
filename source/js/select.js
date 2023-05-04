
const bloop = document.querySelector('#select2-type-container');

export default function initSelect() {
  $(function() {
    $('.form__select').select2({
      width: '100%'
    });
  })
}