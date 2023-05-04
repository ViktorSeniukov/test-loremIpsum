export default function rangeValue() {
  const sliderEl = document.querySelector('#range')
  const sliderValue = document.querySelector('.range-value')

  sliderEl.addEventListener('input', (event) => {
    const tempSliderValue = event.target.value; 
    sliderValue.textContent = tempSliderValue;
  })
}